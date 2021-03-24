import { UseCase } from "../../../XShared/core/Usecase";
import { SpacesBucketName, SpacesClient } from "../../infra/storage/DigitalOcean";
import { DeleteFileDTO, DeleteFileResponse } from "./types";

export class DeleteFileUseCase extends UseCase<DeleteFileDTO, DeleteFileResponse> {
    protected inputConstraints = {
        fileUrl : {
            presence : true,
            url : true

        }
    };
    protected spacesClient: SpacesClient;
    constructor(spacesClient: SpacesClient) {
        super();
        this.spacesClient = spacesClient;
    }


    private getKeyFromUrl(url: string): string {
        const startIndex = url.indexOf(SpacesBucketName);
        const startIndexForKey = startIndex + SpacesBucketName.length + 1;
        return url.substring(startIndexForKey);
    }

    private deleteFromFileSpaces(keyName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            return this.spacesClient.
                deleteObject({ Bucket: SpacesBucketName, Key: keyName },
                    (err, data) => {
                            if(!!err)
                                return reject(err);

                            resolve(data);
                });
        });
    }

    protected async runImpl(params: DeleteFileDTO, context: any): Promise<DeleteFileResponse> {

        const keyName = this.getKeyFromUrl(params.fileUrl);

        await this.deleteFromFileSpaces(keyName);

        return new DeleteFileResponse();
    }

}