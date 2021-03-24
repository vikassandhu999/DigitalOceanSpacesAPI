import multer from "multer";
import path from "path";
import express from "express";
import { v4 as uuid } from "uuid";
import multerS3 from "multer-s3";
import { SpacesBucketName, spacesClient, spacesEndpoint, SPACES_ACL } from "../storage/DigitalOcean";
import { BaseError } from "../../../XShared/core/BaseError";
import { HttpErrors } from "../../../XShared/infra/http/errorCode";
import validate from "validate.js";
import { InvalidParamsError } from "../../../XShared/core/InvalidParamsError";

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_UPLOAD_SIZE as string);

const objectDataValidationSchema = {
    collegeName: {
        presence: true,
    },
    year: {
        presence: true,
    },
    category: {
        presence: true,
    }
};

export class ExtensionIsNotAllowedError extends BaseError {
    name: string = "INVALID_ARGUMENT";
    constructor() {
        super("Allow files only of extensions pdf!", HttpErrors.INVALID_ARGUMENT, { extension: "INVALID" });
    }
}

const spacesMiddleware = multer({
    storage: multerS3({
        s3: spacesClient,
        bucket: SpacesBucketName,
        acl: SPACES_ACL.PUBLIC_READ,
        key: function (request: express.Request, file, cb) {
            const objectData = request.query;
            const validation = validate(objectData, objectDataValidationSchema);
            if (!!validation) {
                const error = new InvalidParamsError(validation);
                return cb(error)
            }

            const fileName = `${uuid()}${path.extname(file.originalname).toLowerCase()}`;
            const keyName = `${objectData.collegeName}/${objectData.year}/${objectData.category}/${fileName}`;

            request.body.fileDownloadLink = `${spacesEndpoint.href}${SpacesBucketName}/${keyName}`;

            cb(null, keyName);
        }
    }),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: function (req, file, cb) {
        const filetypes = /pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new ExtensionIsNotAllowedError());
        }
    }
}).array('file', 1);

export {
    spacesMiddleware
}