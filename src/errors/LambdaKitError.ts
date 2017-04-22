export default class LambdaKitError extends Error {

    public get errorType(): string {
        return this._type;
    }

    private static get testKey(): string {
        return "isLambdaKitError";
    }

    public static isLambdaKitError(error: Error): boolean {
        return !!(error||{})[LambdaKitError.testKey];
    }

    constructor(private _type: string, message?: string) {
        super(message);
        this[LambdaKitError.testKey] = true;
    }
}