import ResponseWithBody from "./ResponseWithBody";
import {MediaType} from "../Validators";

export default class JsonResponse extends ResponseWithBody {
    constructor(statusCode: number, data: string) {
        super(statusCode, data, MediaType.json);
    }
}
