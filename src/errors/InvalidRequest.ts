import LambdaKitError from "./LambdaKitError";

export default class InvalidRequest extends LambdaKitError {

    public static get errorType(): string {
        return 'invalidRequest';
    }

    constructor(public target?: string, message = 'The request did not conform to the expected request protocol') {
        super(InvalidRequest.errorType, message);
    }
}
