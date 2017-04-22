
import LambdaKitError from "./LambdaKitError";

export default class InvalidJson extends LambdaKitError {

    public static get errorType(): string {
        return 'invalidJson';
    }

    constructor(message: string = 'The provided json was invalid', public trace?: string) {
        super(InvalidJson.errorType, message);
    }
}
