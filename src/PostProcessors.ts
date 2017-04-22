
import {PostProcessor} from "./Types";

export function addHeader(name: string, value: string): PostProcessor {
    return r => new Promise((resolve) => {
       r.headers[name] = value;
       resolve(r);
    });
}
