
import {ErrorHandler, ErrorSerializer} from "../Types";
import CannotModifyAlteredObject from "./CannotModifyAlteredObject";
import JsonResponse from "../responses/JsonResponse";
import {jsonSerializer, cast} from "../Serializers";
import InvalidJson from "./InvalidJson";
import MalformedRequestBody from "./MalformedRequestBody";
import NotFound from "./NotFound";
import ServerError from "./ServerError";
import Unauthorized from "./Unauthorized";
import TextResponse from "../responses/TextResponse";


function jsonMapper<T extends Error>(e: Error, status: number, f: (i: T) => Object): Promise<JsonResponse> {
    return cast<T>(e)
        .then(ce => jsonSerializer(f(ce)))
        .then(s => new JsonResponse(status, s))
}

export function errorLookup(): {[errorType: string]: ErrorHandler} {

    let map: {[k: string]: ErrorHandler} = {};

    map[CannotModifyAlteredObject.errorType] = e =>
        jsonMapper<CannotModifyAlteredObject>(e, 412, ce => ({message: ce.message, target: ce.modifiedObjectIndicator}));

    map[InvalidJson.errorType] = e =>
        jsonMapper<InvalidJson>(e, 400, ce => ({message: ce.message, trace: ce.trace}));

    map[MalformedRequestBody.errorType] = e =>
        jsonMapper<MalformedRequestBody>(e, 400, ce => ({message: ce.message, failures: ce.failures}));

    map[NotFound.errorType] = e =>
        jsonMapper<NotFound>(e, 404, ce => ({message: ce.message, target: ce.resourceIndicator}));

    map[ServerError.errorType] = e =>
        jsonMapper<ServerError>(e, 500, ce => ({message: ce.message, source: ce.source}));

    map[Unauthorized.errorType] = e =>
        jsonMapper<Unauthorized>(e, 401, ce => ({message: ce.message}));

    return map;
}

export function defaultErrorSerializer(): ErrorSerializer {
    return err => jsonSerializer({
        message: err.message
    })
        .then(s => new JsonResponse(400, s))
        .catch(e => new TextResponse(400, err.message));
}