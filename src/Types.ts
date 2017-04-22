import {Response, Event, Context} from "./AWS";

export type Chainable<T> = (t: T) => T;

export type Predicate<T> = (t: T) => boolean;

export type Processor<In, Out> = (i: In) => Promise<Out>

export type Serializer<In, Out> = Processor<In, Out>

export type Deserializer<In, Out> = Processor<In, Out>

export type BodyDeserializer<Out> = Deserializer<Event, Out>

export type ErrorSerializer = Serializer<Error, Response>

export type PreProcessor = Processor<LambdaState, LambdaState>

export type ErrorHandler = Processor<Error, Response>

export type PostProcessor = Processor<Response, Response>

export interface LambdaState {
    aws: {event: Event, context: Context}
    data: any;
}

export type Lambda = (state: LambdaState) => Promise<Response>