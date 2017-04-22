import LambdaKitError from "./LambdaKitError";

export default class Unauthorized extends LambdaKitError {

    public static get errorType(): string {
        return 'unauthorized';
    }

    constructor(message: string = 'The request lacked valid credentials.') {
        super(Unauthorized.errorType, message);
    }
}
