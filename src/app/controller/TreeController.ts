
import * as Koa from "koa";
import webConf from "../../config/webConf";
import Markdown from "../service/Markdown";
import TarsLog from "@tars/logs";
const { v4 } = require('uuid');

class TreeController {

    protected static _cn: Markdown = new Markdown();
    protected static _en: Markdown = new Markdown();
    protected static _logger = new TarsLog("TarsRotate");

    public static initialize() {
        this._cn.initialize(webConf.config.cn_git);
        this._en.initialize(webConf.config.en_git);
    }

    protected static getMarkdown(ctx: Koa.Context) {

        let uuid = ctx.cookies.get("uuid");
        if (!uuid) {
            uuid = v4();
        }
        ctx.cookies.set("uuid", uuid, {
            maxAge: 86400 * 365 * 1000,
        });

        if (ctx.cookies.get("locale") == "en") {
            return this._en;
        }
        return this._cn;
    }

    public static loadTree() {

        this._cn.loadTree();
        this._logger.debug("loadTree cn succ");
        this._en.loadTree();
        this._logger.debug("loadTree en succ");
    }

    public static async view(ctx: Koa.Context) {

        this.getMarkdown(ctx).view(ctx);
    }

    public static async tree(ctx: Koa.Context) {
        this.getMarkdown(ctx).tree(ctx);
    }

    public static async search(ctx: Koa.Context) {
        this.getMarkdown(ctx).search(ctx);
    }
}

export default TreeController;
