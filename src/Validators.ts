import {Event} from "./AWS";
import {PreProcessor, Predicate} from "./Types";
import InvalidRequest from "./errors/InvalidRequest";;

export type Validator = (event: Event) => Promise<void>
export type HeaderMatcher = (name: string, value: string) => boolean

export class MediaType {
    static get json(): string {
        return 'application/json';
    }
    static get html(): string {
        return 'text/html';
    }
    static get text(): string {
        return 'text';
    }
}

export class Matching {

    static predicates(name: Predicate<string>, value?: Predicate<string>): HeaderMatcher {
        return (n, v) => {
            if(value) {
                return value(v) && name(n);
            } else {
                return name(n);
            }
        }
    }

    static butIgnoringCase(name: string, value?: string): HeaderMatcher {
        let n0 = (name || '').toUpperCase();
        let v0 = (value || '').toUpperCase();
        return Matching.predicates(
            n => (n || '').toUpperCase() === n0,
            value ? v => (v || '').toUpperCase() === v0 : null);
    }

    static patterns(name: RegExp, value?: RegExp): HeaderMatcher {
        return Matching.predicates(
            n => !!(n || '').match(name),
            value ? v => !!(v || '').match(value) : null);
    }
}

export function hasHeader(matcher: HeaderMatcher): Validator {
    return e => new Promise<void>((resolve, reject) => {
        let h = Object.keys(e.headers).find(h => matcher(h, e.headers[h]));
        if(h !== undefined) {
            resolve();
        } else {
            reject(new InvalidRequest('headers'));
        }
    });
}

export function hasMediaType(mediaType: string): Validator {
    return hasHeader(Matching.predicates(
        n => n.toLowerCase() === 'content-type',
        v => v.indexOf(mediaType) > -1));
}

export function hasJsonContent(): Validator {
    return hasMediaType(MediaType.json)
}

// export function matchesSchema(schema: Object): Validator {
//     throw new Error('not implemented');
// }

export function checkIt(validators: Validator[]): PreProcessor {
    return s => {
        return Promise.all(validators.map(v => v(s.aws.event)))
            .then(() => s);
    }
}