import LambdaKitResponse from "./LambdaKitResponse";

export default class EmptyResponse extends LambdaKitResponse {
    constructor(statusCode: number) {
        super(statusCode);
    }
}