import ResponseWithBody from "./ResponseWithBody";
import {MediaType} from "../Validators";

export default class TextResponse extends ResponseWithBody {
    constructor(statusCode: number, data: string, encoding = 'utf8') {
        super(statusCode, data, MediaType.text, encoding);
    }
}