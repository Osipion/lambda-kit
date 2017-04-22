
import {Response, Headers} from "../AWS";

export default class LambdaKitResponse implements Response {

    public get statusCode(): number {
        return this._statusCode;
    }

    public get body(): string {
        return this._body;
    }

    public get headers(): Headers {
        return this._headers;
    }

    constructor(private _statusCode = 200, private _headers: Headers = {}, private _body?: string) {

    }

    public get raw(): Response {
        return {
            headers: this.headers,
            body: this.body,
            statusCode: this.statusCode
        };
    }
}