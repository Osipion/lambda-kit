import {Handler, Event, Response} from "./AWS";
import {PostProcessor, PreProcessor, ErrorHandler, Chainable, Processor, Lambda, LambdaState} from "./Types";
import {errorLookup, defaultErrorSerializer} from "./errors/ErrorLookup";
import LambdaKitError from "./errors/LambdaKitError";

export interface LambdaKit {
    beforeHandlingRequest: PreProcessor[]
    afterCreatingResponse: PostProcessor[]
    whenAnErrorOccursCall: ErrorHandler,
    mapErrorsToResponsesInThisWay: {[errorType: string]: ErrorHandler}
}

export const lambdaKit: LambdaKit = {
    beforeHandlingRequest: [],
    afterCreatingResponse: [],
    whenAnErrorOccursCall: null,
    mapErrorsToResponsesInThisWay: errorLookup()
};

export function chain<T>(funcs: Chainable<T>[]): Chainable<T> {
    if(!funcs || funcs.length < 1) {
        return t => t;
    }
    return funcs.reduce((acc, v) => i => v(acc(i)));
}

export function chainPromise<T>(promises: Processor<T, T>[]): Processor<T, T> {
    if(!promises || promises.length < 1) {
        return t => new Promise((resolve) => resolve(t));
    }
    return promises.reduce((acc, v) => i => acc(i).then(v));
}

export function defaultErrorHandler(): ErrorHandler {
    return err => new Promise((resolve) => {
        if(LambdaKitError.isLambdaKitError(err)) {
            let h = lambdaKit.mapErrorsToResponsesInThisWay[(<LambdaKitError>err).errorType];
            if(h) {
                resolve(h);
                return;
            }
        }
        resolve(defaultErrorSerializer);
    })
}


export function lambda(l: Lambda): Handler {

    let preProc = chainPromise(lambdaKit.beforeHandlingRequest);
    let postProc = chainPromise(lambdaKit.afterCreatingResponse);
    let errorHandler = lambdaKit.whenAnErrorOccursCall || defaultErrorHandler();

    return (event, context, callback) => {
        let state: LambdaState = {
            aws: {
                event: event,
                context: context
            },
            data: (event||{})['body']
        };
        preProc(state)
            .then(s => l(s))
            .then(r => postProc(r))
            .then(r => callback(null, r))
            //try to handle the error using the handler and post processor
            .catch(err => errorHandler(err)
                .then(r => postProc(r))
                .then(r => callback(null, r)))
            //either errorHandler or postProc threw an error, so user's bad.
            .catch(err => callback(null, {headers:{}, statusCode: 500}));
    }
}