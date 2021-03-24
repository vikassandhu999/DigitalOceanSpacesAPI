import { BaseError } from "./BaseError";
import { HttpErrors } from "../infra/http/errorCode";

export class NotEnoughInformationProvidedError extends BaseError {
    constructor() {
        super("Missing auth tokens or User information", HttpErrors.UNAUTHENTICATED);
    }
}