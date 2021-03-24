import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";
import {userRouter} from "../../../User/infra/http/router";
import {handleExpressErrors} from "./utils";
import {storageRouter} from "../../../Storage/infra/http/router";

const upload = multer();

const app = express();

app.use(cors({
    origin: [`http://localhost:3000`, `https://localhost:5000`],
    credentials: true
}));

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.none());
app.use(cookieParser());

if(process.env.NODE_ENV!="production") {
    app.use(morgan("dev"));
}

// app.use("/v1/forum0" , forumRouter);
app.use("/v1" , userRouter);
app.use("/v1" , storageRouter);


app.use(handleExpressErrors);

export {
    app
}