import {expect} from "chai";
import {MediaType, hasHeader, hasMediaType, hasJsonContent, Validator, checkIt, Matching} from "../src/Validators";
import {fail} from "assert";
import InvalidRequest from "../src/errors/InvalidRequest";
import {Event} from "../src/AWS";

describe('Validators', () => {
    describe('checkIt', () => {
        it('takes an array of validators, executing each one before returning', () => {
            let callings: string[] = [];
            let P = (s: string) => new Promise<void>((r) => {
               callings.push(s);
               r();
            });
            let validators: Validator[] = [e => P('a'), e => P('b'), e => P('c')];

            return checkIt(validators)({aws:{event: null, context: null}, data: null})
                .then(() => {
                    expect(callings).to.be.length(3);
                    expect(callings).to.deep.equal(['a', 'b', 'c']);
                });
        });
        it('rejects if any of the validators reject', (done) => {
            let P = (shouldReject: boolean) => new Promise<void>((resolve, reject) => {
                if(shouldReject) {
                    reject();
                } else {
                    resolve();
                }
            });
            let validators: Validator[] = [e => P(false), e => P(true), e => P(false)];
            checkIt(validators)({aws:{event: null, context: null}, data: null})
                .then(() => fail(null, null, null, null))
                .catch(_ => done());
        })
    });
    describe('MediaType', () => {
        describe('json', () => {
            it('returns "application/json"', () => {
                expect(MediaType.json).to.equal('application/json');
            });
        });
        describe('text', () => {
            it('returns "text"', () => {
                expect(MediaType.text).to.equal('text');
            });
        });
        describe('html', () => {
            it('returns "text/html"', () => {
                expect(MediaType.html).to.equal('text/html');
            });
        });
    });
    describe('Matching', () => {
       describe('predicates', () => {
           it('creates a header matcher which returns true if the name and value predicates return true', () => {
                let m = Matching.predicates(
                    n => n === 'bob',
                    v => v === 'bill'
                );
                expect(m('bob', 'bill')).to.be.true;
                expect(m('bob', 'baz')).to.be.false;
                expect(m('bib', 'bill')).to.be.false;
           });
           it('does not test the value predicate if none is supplied', () => {
              let m = Matching.predicates(n => n === 'bob');
              expect(m('bob', 'bill')).to.be.true;
              expect(m('bob', null)).to.be.true;
              expect(m('baz', 'bill')).to.be.false;
           });
       });
       describe('butIgnoringCase', () => {
          it('returns a header matcher which returns true if the name and value match the inputs, regardless of case', () => {
             let m = Matching.butIgnoringCase('bob', 'BILL');
             expect(m('BOB', 'bill')).to.be.true;
             expect(m('bOb', 'biLL')).to.be.true;
          });
       });
        describe('patterns', () => {
            it('returns a header matcher which returns true if the name and value match the input regular expressions', () => {
                let m = Matching.patterns(/B[o0]B/, /b.ll/);
                expect(m('B0B', 'bill')).to.be.true;
            });
        });
    });
    describe('hasHeader', () => {
        let v = hasHeader((name, value) => name === 'target');
        it('creates a validator that checks whether an event has a header matching a predicate', () => {
            let event = {
                httpMethod: 'GET',
                headers: {
                    a: 'a',
                    b: 'b',
                    target: 'c',
                    d: 'd'
                }
            };
            return v(event);
        });
        it('creates a validator that rejects events which do not match the predicate', (done) => {
            let event = {
                httpMethod: 'GET',
                headers: {
                    a: 'a',
                    b: 'b',
                    d: 'd'
                }
            };
            v(event)
                .then(() => fail(null, null, null, null))
                .catch(err => {
                    expect(err).to.be.an.instanceof(InvalidRequest);
                    expect((<InvalidRequest>err).target).to.equal('headers');
                    done();
                });
        });
    });
    describe('hasMediaType', () => {
        let event = {
            httpMethod: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        it('creates a validator which checks that a content type header has been correctly set', () => {
            let v = hasMediaType(MediaType.json);
            return v(event);
        });
        it('creates a validator that rejects events that do not match the expected content type', (done) => {
            let v = hasMediaType(MediaType.text);
            v(event).then(() => fail(null, null, null, null))
                .catch(err => {
                    expect(err).to.be.an.instanceof(InvalidRequest);
                    expect((<InvalidRequest>err).target).to.equal('headers');
                    done();
                })
        });
    });
    describe('hasJsonContent', () => {
        it('creates a validator that checks that the event has a content type of application/json', (done) => {
            let v = hasJsonContent();
            let event: Event = {
                httpMethod: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            v(event).then(() => done());
        });
        it('creates a validator that rejects events that do not have a content type of application/json', (done) => {
            let v = hasJsonContent();
            let event: Event = {
                httpMethod: 'GET',
                headers: {
                    'Content-Type': 'application/vndi+json',
                }
            };
            v(event).then(() => fail(null, null, null, null))
                .catch(err => {
                    expect(err).to.be.an.instanceof(InvalidRequest);
                    expect((<InvalidRequest>err).target).to.equal('headers');
                    done();
                })
        });
    });
});