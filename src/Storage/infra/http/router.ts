import express from "express";
import { deleteFileUseCase } from "../../usecase/DeleteFile";
import {spacesMiddleware} from "./spacesMiddleware";

const storageRouter = express.Router();

storageRouter.post("/file/single" ,
    (req,res,next) => {
    spacesMiddleware(req, res, function(err?: any) {
        if(!!err) {
            next(err);
            return;
        }
        res.status(200).json({status : "success" , data : {fileDownloadLink : req.body.fileDownloadLink}});
    });
});

storageRouter.delete("/file/single" ,
async (req, res, next) => {
    try {
        const fileUrl = req.query.fileUrl as string;

        const response = await deleteFileUseCase.run({fileUrl}, {});
        res.status(200).json(response);
    } catch (e) {
        next(e);
    }
});

export {
    storageRouter
}