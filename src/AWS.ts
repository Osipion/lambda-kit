export type StringMap = {[key: string]: string}

export type Headers = StringMap

export interface Response {
    statusCode: number,
    headers: Headers,
    body?: string
}

export interface Event {
    resource?: string
    path?: string
    httpMethod: string
    headers: Headers
    queryStringParameters?: StringMap
    pathParameters?: StringMap
    body?: string
}

export interface Context {
    callbackWaitsForEmptyEventLoop?: boolean,
    logGroupName?: string,
    logStreamName?: string,
    functionName: string,
    memoryLimitInMB?: string,
    functionVersion?: string,
    invokeid?: string,
    awsRequestId?: string,
    invokedFunctionArn?: string
}

export type Callback = (error: Error, response?: Response) => void

export type Handler = (event: Event, context: Context, callback: Callback) => void

