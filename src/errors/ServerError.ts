import LambdaKitError from "./LambdaKitError";

export default class ServerError extends LambdaKitError {

    public static get errorType(): string {
        return 'serverError';
    }

    public get source(): Error {
        return this._source;
    }

    constructor(private _source?: Error, message: string = 'An internal error occured') {
        super(ServerError.errorType, message);
    }
}
