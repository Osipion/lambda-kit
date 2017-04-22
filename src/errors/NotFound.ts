import LambdaKitError from "./LambdaKitError";

export default class NotFound extends LambdaKitError {
    public static get errorType(): string {
        return 'notFound';
    }

    public get resourceIndicator(): string {
        return this._resourceIndicator;
    }

    constructor(private _resourceIndicator?: string, message: string = 'The requested resource could not be found') {
        super(NotFound.errorType, message);
    }
}
