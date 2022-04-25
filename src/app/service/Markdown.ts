
import * as Koa from "koa";
import webConf from "../../config/webConf";
import path from 'path';
import fs from 'fs-extra';
import marked from 'marked';
import hljs from 'highlight.js';
import { SearchService, DataType } from '../service/SearchService';
import TarsLog from "@tars/logs";
import calculate from 'etag';
import url from "url";
class Markdown {

    protected _id: number = 0;
    protected _treeData = [];
    protected _summary = null;
    protected _content = new Map();
    protected _git = "";

    protected _markdown: DataType[];
    protected _searchService = new SearchService();

    protected _dayLogger = new TarsLog("TarsRemote");
    protected _logger = new TarsLog("TarsRotate");

    public initialize(git: string) {

        this._git = git;
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: function (code: string, language: string) {
                const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
                return hljs.highlight(validLanguage, code).value;
            },
            langPrefix: "hljs language-",
            pedantic: false,
            gfm: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });

    }

    protected reset() {
        this._id = 0;
        this._treeData = [];
        this._content = new Map();
        this._markdown = [] as DataType[];
    }

    protected getToken(i) {
        const token = i.tokens[0];

        if (token.tokens && token.tokens[0].type == 'link') {
            return token.tokens[0];
        }
        return token;
    }

    protected parseText(i) {

        const token = this.getToken(i);

        const data = {
            name: token.text,
            href: token.type == 'link' ? token.href : null,
            id: '' + this._id++,
            children: [],
        }

        if (data.href) {
            this._markdown.push({ name: data.name, href: '#/' + data.href });
        }

        return data;
    }

    public loadTree() {

        this.reset();

        this._summary = path.join(this._git, 'SUMMARY.md');

        if (fs.existsSync(this._summary)) {
            const Summary = fs.readFileSync(this._summary).toString();

            const tokens = marked.lexer(Summary);

            tokens.forEach(i => {

                if (i.type == 'heading') {
                    const item = this.parseText(i);

                    this._treeData.push(item);
                }
                else if (i.type == 'list') {
                    this.parseItem(this._treeData[this._treeData.length - 1], i.items);
                }
            })
        }

        this._searchService.load(this._markdown, (page) => { return this.load(page); });
    }

    protected parseItem(data: any, items: any[]) {

        items.forEach(i => {

            const item = this.parseText(i);

            if (data) {
                if (!data.children) {
                    data.children = [];
                }
                data.children.push(item);
            } else {
                this._treeData.push(item);
            }

            if (i.type == 'list_item') {
                i.tokens.forEach(j => {
                    if (j.type == 'list') {
                        this.parseItem(item, j.items);
                    }
                })
            }
        });
    }

    public pagePath(page: string, defaultPage: string) {
        const prefix = '#';

        let subpath: string;

        const pos: number = page.indexOf(prefix);
        if (pos != 0) {
            subpath = defaultPage;
        } else {
            subpath = page.substring(pos + prefix.length);
        }

        const anchor: number = subpath.indexOf(prefix);
        if (anchor != -1) {
            subpath = subpath.substring(0, anchor);
        }
        // console.log('pagePath:', subpath);

        try {
            const f = fs.lstatSync(path.join(this._git, subpath));
            if (!f.isFile()) {
                subpath = defaultPage;
            }
        } catch (e) {
            this._logger.error("load file error:", e);
            subpath = "README.md";
        }


        return subpath;
    }

    public load(page: string) {

        const defaultPage = 'README.md';

        const subpath = this.pagePath(page, defaultPage);
        let hrefPath = '/';
        const pos = subpath.lastIndexOf('/');
        if (pos != -1) {
            hrefPath = subpath.substring(0, pos);
        }

        const content = fs.readFileSync(path.join(this._git, subpath)).toString();

        return { content, hrefPath };
    }


    public async sendfile(ctx: Koa.Context, filePath: string) {
        try {
            const stats = await fs.statSync(filePath);

            if (!stats) return null
            if (!stats.isFile()) return stats

            ctx.response.status = 200
            ctx.response.lastModified = stats.mtime
            ctx.response.length = stats.size

            ctx.set("Content-Type", "application/octet-stream");
            ctx.set("Content-Disposition", "attachment;filename=" + encodeURIComponent(path.basename(filePath)));

            if (!ctx.response.etag) {
                ctx.response.etag = calculate(stats, {
                    weak: true
                })
            }

            // fresh based solely on last-modified
            switch (ctx.request.method) {
                case 'HEAD':
                    ctx.status = ctx.request.fresh ? 304 : 200
                    break
                case 'GET':
                    if (ctx.request.fresh) {
                        ctx.status = 304
                    } else {
                        ctx.body = fs.createReadStream(filePath)
                    }
                    break
            }

            // return stats
        } catch (err) {

            err.status = 500
            throw err
        }
    }

    public async view(ctx: Koa.Context) {

        let html = '';

        let page: string = decodeURIComponent(ctx.paramsObj.page);
        // console.log('view:', ctx.paramsObj);

        const pos = page.indexOf('?');
        if (pos != -1) {
            page = page.substring(0, pos - 1);
        }

        this._dayLogger.debug(`view|${ctx.uid}|${ctx.cookies.get('uuid')}|${page}`);
        this._logger.debug(`view|${ctx.uid}|${ctx.cookies.get('uuid')}|${page}`);

        if (page.endsWith("pptx") || page.endsWith("pdf") || page.endsWith("ppt")) {

            const subpath = this.pagePath(page, '');
            let filePath = path.join(this._git, subpath);

            if (!path.isAbsolute(filePath)) {
                filePath = path.join(__dirname, "..", "..", "..", filePath);
            }
            this.sendfile(ctx, filePath);
        } else {

            if (this._content.has(page)) {

                html = this._content.get(page);

            } else {

                const { content, hrefPath } = this.load(page);

                // Override function
                const renderer = {
                    link(href, title, text) {

                        let out = '';

                        if (href.indexOf('#') == 0) {
                            //锚点
                            out = '<a href="javascript:document.getElementById(\'' + href.substring(1) + '\').scrollIntoView();"';
                        }
                        else if (href.indexOf('http://') == 0 || href.indexOf('https://') == 0) {

                            let locale = "";
                            if (href.indexOf("tarscloud.github.io/TarsDocs") != -1) {

                                if (href.startsWith("https://tarscloud.github.io/TarsDocs_en")) {
                                    href = href.replace("https://tarscloud.github.io/TarsDocs_en", "");
                                    if (href == "/" || href == "") {
                                        href = "/#/README.md";
                                    } else {
                                        href = "/#" + href.replace("/blob/master/");
                                    }
                                    locale = "en";

                                } else if (href.startsWith("https://tarscloud.github.io/TarsDocs/")) {
                                    href = href.replace("https://tarscloud.github.io/TarsDocs", "");
                                    if (href == "/" || href == "") {
                                        href = "/#/README.md";
                                    } else {
                                        href = "/#" + href.replace("/blob/master/");
                                    }
                                    locale = "cn";
                                }

                            } else if (href.indexOf("github.com/TarsCloud/TarsDocs") != -1) {

                                if (href.startsWith("https://github.com/TarsCloud/TarsDocs_en")) {
                                    href = href.replace("https://github.com/TarsCloud/TarsDocs_en", "");
                                    if (href == "/" || href == "") {
                                        href = "/#/README.md";
                                    } else {
                                        href = "/#" + href.replace("/blob/master/");
                                    }
                                    locale = "en";

                                } else if (href.startsWith("https://github.com/TarsCloud/TarsDocs")) {

                                    href = href.replace("https://github.com/TarsCloud/TarsDocs", "");
                                    if (href == "/" || href == "") {
                                        href = "/#/README.md";
                                    } else {
                                        href = "/#" + href.replace("/blob/master/", "");
                                    }
                                    locale = "cn";
                                }
                            }

                            if (locale != '') {
                                out =
                                    `<a javascript=':;' href='#' onclick="doFetchData('${href}', '${locale}')"`;
                            } else {
                                out = '<a target="_blank" href="' + href + '"';
                            }

                        }

                        else {

                            href = '/#/' + path.join(hrefPath, href);

                            out = `<a href="${href}"`;
                        }

                        if (title) {
                            out += ' title="' + title + '"';
                        }
                        out += '>' + text + '</a>';
                        return out;
                    },

                    image(href, title, text) {

                        if (href.indexOf('/') != 0) {
                            href = path.join(hrefPath, href);
                        }

                        let out = '<div class="images" v-viewer><img src="' + href + '" alt="' + text + '"';

                        out += '> </div>';

                        return out;
                    }

                };

                marked.use({ renderer });

                html = marked(content);

                this._content.set(page, html);
            }

            ctx.makeResObj(200, "succ", { data: html });

        }
    }

    public async tree(ctx: Koa.Context) {
        this._logger.debug(`tree|${ctx.uid}|${ctx.cookies.get('uuid')}`);

        //每次clone的时候解析一次，如果需要本地目录文件每次访问的时候，实时解析，去掉该注释
        ctx.makeResObj(200, "succ", { tree: this._treeData, title: webConf.config.webConf.title });
    }

    public async search(ctx: Koa.Context) {

        const query = ctx.paramsObj.query;

        const { queryWords, result } = this._searchService.search(query);

        const page = [];

        result.forEach(d => {
            page.push(this._searchService.idToFile(d));
        })

        ctx.makeResObj(200, "succ", { page, queryWords });
    }
}

export default Markdown;
