import {BodyDeserializer, PreProcessor, LambdaState} from "./Types";
import InvalidJson from "./errors/InvalidJson";
import {Event} from "./AWS";

export function jsonSerializer(json: Object): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.stringify(json));

        } catch (err) {
            reject(err);
        }
    })
}

export function cast<T>(a: any): Promise<T> {
    return new Promise<T>((r) => r(<T>a));
}

export function jsonDeserializer<T>(data: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
       try {
           resolve(JSON.parse(data));
       } catch (err) {
           reject(new InvalidJson());
       }
    });
}

export function jsonBodyDeserializer<T>(event: Event): Promise<T> {
    return new Promise<T>((resolve, reject) => {
       if(!event.body) {
           resolve(null);
       } else {
           jsonDeserializer<T>(event.body)
               .then(r => resolve(r))
               .catch(e => reject(e));
       }
    });
}


export function deserializeItWith(deserializer: BodyDeserializer<any>): PreProcessor {
    return s => deserializer(s.aws.event)
        .then(d => {
            s.data = d;
            return s;
        });
}