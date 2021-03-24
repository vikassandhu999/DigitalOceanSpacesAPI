import { spacesClient } from "../../infra/storage/DigitalOcean";
import { DeleteFileUseCase } from "./usecase";

const deleteFileUseCase = new DeleteFileUseCase(spacesClient);

export {
    deleteFileUseCase
}