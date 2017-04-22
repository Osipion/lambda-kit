///<reference path="../lib/lib.d.ts"/>

import {Lambda} from "lambda-kit/Types";
import {lambdaKit, defaultErrorHandler, lambda} from "lambda-kit/LambdaKit";
import {checkIt, hasJsonContent, hasHeader, Matching} from "lambda-kit/Validators";
import {deserializeItWith, jsonBodyDeserializer} from "lambda-kit/Serializers";
import {addHeader} from "lambda-kit/PostProcessors";


const helloWorld: Lambda = s => new Promise((resolve) => {
    console.log(JSON.stringify(s));
    resolve('Hello from LambdaKit');
});


lambdaKit.beforeHandlingRequest = [
    checkIt([
        hasJsonContent(),
        hasHeader(Matching.butIgnoringCase('key')),
        hasHeader(Matching.patterns(/key/, /value/)),
        hasHeader(Matching.predicates(name => name === 'key', value => value === 'value'))
    ]),
    deserializeItWith(jsonBodyDeserializer)
];

lambdaKit.afterCreatingResponse = [
    addHeader('key', 'value')
];

lambdaKit.whenAnErrorOccursCall = defaultErrorHandler();


export const handler = lambda(helloWorld);
