import LambdaKitError from "./LambdaKitError";

export default class CannotModifyAlteredObject extends LambdaKitError {
    public static get errorType(): string {
        return 'cannotModifyAlteredObject';
    }

    constructor(public modifiedObjectIndicator: string, message: string = 'Another update to the object has occured and your update cannot be applied') {
        super(CannotModifyAlteredObject.errorType, message);
    }
}