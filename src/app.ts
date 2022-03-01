import Koa from "koa";
import * as path from "path";
import fs from 'fs-extra';
import bodyparser from "koa-bodyparser";
import staticRouter from "koa-static";
import helmet from "koa-helmet";
import TreeController from './app/controller/TreeController';
import { pageRouter, apiRouter } from "./midware";

import TarsConfig from "@tars/config";
import webConf from './config/webConf'
import sendFile from 'koa-sendfile';
import v4 from 'uuid';
import TarsLogs from "@tars/logs";

import localeMidware from "./midware/localeMidware";

const app = new Koa();

//信任proxy头部，支持 X-Forwarded-Host
app.proxy = true;

// error handler
// onerror(app);

const appInitialize = (conf: any) => {

    //安全防护
    app.use(helmet());

    app.use(bodyparser());

    //国际化多语言中间件
    app.use(localeMidware);

    app.use(staticRouter(path.join(__dirname, "../client/dist"), { maxage: 7 * 24 * 60 * 60 * 1000 }));

    console.log(conf);
    app.use(staticRouter(conf.config.cn_git, { maxage: 7 * 24 * 60 * 60 * 1000 }));
    app.use(staticRouter(conf.config.en_git, { maxage: 7 * 24 * 60 * 60 * 1000 }));

    app.use(pageRouter.routes());
    app.use(apiRouter.routes());

    const _logger = new TarsLogs("TarsRemote");

    app.use(async (ctx: Koa.Context, next) => {
        await next();
        if (ctx.status == 404) {

            let uid = ctx.cookies.get("uid");
            if (!uid) {
                uid = v4();
            }
            ctx.cookies.set("uid", uid, {
                maxAge: 86400 * 365 * 1000,
            });

            _logger.debug(uid + "|" + ctx.request.url);

            const file = path.join(__dirname, 'dist', 'index.html');
            await sendFile(ctx, file);
        }
    });
    console.log("initialize markdown");

    TreeController.initialize();

    TreeController.loadTree();

}

const initialize = async () => {

    if (process.env.TARS_CONFIG) {
        const tarsConfig = new TarsConfig();

        webConf.config = await tarsConfig.loadConfig(`config.json`, { format: tarsConfig.FORMAT.JSON });

        console.log("initialize, in tars", webConf);

    } else {
        webConf.config = JSON.parse(fs.readFileSync(path.join(__dirname, "./config/config.json"), "utf8"));
        console.log("initialize, not in tars", webConf);
    }

    console.log(webConf);

    appInitialize(webConf);
}

export { app, initialize };