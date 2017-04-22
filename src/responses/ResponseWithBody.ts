import LambdaKitResponse from "./LambdaKitResponse";

export default class ResponseWithBody extends LambdaKitResponse {
    constructor(statusCode: number, data: string, mediaType: string, encoding = 'utf8') {
        super(statusCode, {}, data);
        if(data && typeof data === 'string') {
            super.headers['Content-Type'] = mediaType;
            super.headers['Content-Length'] = Buffer.byteLength(data, encoding).toString();
        }
    }
}