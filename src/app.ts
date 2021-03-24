require("dotenv").config()

import {app} from "./XShared/infra/http";

const port = process.env.PORT;

async function main() {
    app.listen(port);
}

main()
    .then(r => console.log("Service has been started successfully"))
    .catch(error => console.log(error));