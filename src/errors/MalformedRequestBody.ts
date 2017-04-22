import LambdaKitError from "./LambdaKitError";

export default class MalformedRequestBody extends LambdaKitError {

    public static get errorType(): string {
        return 'malformedRequestBody';
    }

    constructor(public failures?: string[], message: string = 'The request body did not match the schema for requests') {
        super(MalformedRequestBody.errorType, message);
    }
}
