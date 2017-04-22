# lambda-kit

## Incomplete/Under Development

#### A nodejs library for writing HTTP triggered AWS lambdas

The aim of this library is to be lightweight, focused codebase that can be included in a single file AWS lambda with relative ease.
Following the style of lambda, lambda-kit takes a largely functional approach to responding to web requests.

The [example](example/HelloWorld.ts) shows how the library can be used. 

lambda-kit handles requests in the following way:

1. it passes the AWS event though any pre-processors
2. it passes the AWS and context through to the user-defined lambda
3. if either of the above steps fail, it executes the user supplied error handler
4. It passes the resulting response object through any post-processors
5. If the error handler or post-processors fail, a generic error is returned.

## Pre-Processors:

Before a request is processed, you may configure handlers to validate and transform it:

```typescript
lambdaKit.beforeHandlingRequest = [
    checkIt([
        hasJsonContent(),
        hasHeader(Matching.butIgnoringCase('key')),
        hasHeader(Matching.patterns(/key/, /value/)),
        hasHeader(Matching.predicates(name => name === 'key', value => value === 'value'))
    ]),
    deserializeItWith(jsonBodyDeserializer)
]
```

## Post-Processors

After a request has been returned by your lambda, but before the AWS response is sent, post-processors may be executed:

```typescript
lambdaKit.afterCreatingResponse = [
    addHeader('key', 'value')
];
```


## Errors

Error handling can be overridden entirely by setting the `errorHandler` to a user-defined function. By default,
lambda-kit throws [LambdaKitErrors](./src/errors/LambdaKitError.ts). It maps these errors to responses using an [error lookup](src/errors/ErrorLookup.ts)


```typescript
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
```

## Using webpack to generate a single output file

The recommended way to bundle this library along with your code into a single file is to use webpack. 