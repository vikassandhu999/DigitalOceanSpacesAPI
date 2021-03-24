import awsSdk from "aws-sdk";

const SpacesBucketName = process.env.SPACES_BUCKET_NAME as string;

type SpacesClient = awsSdk.S3;

enum SPACES_ACL {
    PUBLIC_READ='public-read'
}

const spacesEndpoint = new awsSdk.Endpoint(process.env.SPACES_ENDPOINT as string);
const spacesClient = new awsSdk.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
    secretAccessKey: process.env.SPACES_ACCESS_SECRET
});

export {
    SpacesClient,
    spacesClient,
    SpacesBucketName,
    SPACES_ACL,
    spacesEndpoint
}