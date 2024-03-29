
import { app, initialize } from "../app";

const hostname = process.env.HTTP_IP || "0.0.0.0";
const port = process.env.HTTP_PORT || 4000;

initialize().then(() => {
    app.listen(port as number, hostname, () => {
        console.log(`server listening at ${hostname}:${port}`);
    });
});

