
import {jsonSerializer, cast, jsonBodyDeserializer, deserializeItWith} from "../src/Serializers";
import {Event} from "../src/AWS"
import {expect} from 'chai'
import {fail} from "assert";
import InvalidJson from "../src/errors/InvalidJson";
import {BodyDeserializer} from "../src/Types";

describe('Serializers', () => {
   describe('jsonSerializer', () => {
       it('takes an object and converts it to a json string', () => {
          return jsonSerializer({key: 'value'})
              .then(s => {
                 expect(s).to.be.a('string');
                 let r = JSON.parse(s);
                 expect(r).to.have.key('key');
                 expect(r['key']).to.equal('value');
                 expect(Object.keys(r)).to.be.length(1);
              });
       });
       it('rejects invalid objects (e.g. cyclic ones)', (done) => {
           let a: any = {me: null};
           a.me = a;
           jsonSerializer(a)
               .then(j => fail(null, null, 'Whoa - serialized cyclic object?', null))
               .catch(e => done());
       });
   });
   describe('cast', () => {
      it('returns a promise that resolves to the desired type (at compile time)', () => {
         return cast<{body: string}>({a:'b'})
             .then(c => expect(c.body).to.be.undefined);
      });
   });
   describe('jsonBodyDeserializer', () => {
      it('deserializes the body of an event to a javascript object', () => {
          let event: Event = {
              httpMethod: 'POST',
              headers: {},
              body: '{"a": "b"}'
          };
          return jsonBodyDeserializer<{a: string}>(event)
              .then(r => {
                 expect(r).to.be.an('object');
                 expect(r.a).to.equal('b');
              });
      });
      it('rejects invalid json', (done) => {
          let event: Event = {
              httpMethod: 'POST',
              headers: {},
              body: '{"a": "'
          };
          jsonBodyDeserializer<{a: string}>(event)
              .then(r => fail(null, null, null, null))
              .catch(err => {
                  expect(err).to.be.an.instanceof(InvalidJson);
                  done();
              })
      });
      it('resolves to null when the event has a falsey body', () => {
          let event: Event = {
              httpMethod: 'POST',
              headers: {},
              body: ''
          };
          return jsonBodyDeserializer<{a: string}>(event)
              .then(r => {
                  expect(r).to.be.null;
              });
      });
   });
   describe('deserializeItWith', () => {
        it('creates an event pre-processor from the supplied deserializer', () => {
            let called = false;
            let s: BodyDeserializer<{a: string}> = s => new Promise((resolve) => {
                called = true;
                resolve(s);
            });
            let p = deserializeItWith(s);
            return p({aws: {event: null, context: null}, data: null})
                .then(s => {
                    expect(called).to.be.true;
                    expect(s).not.to.be.null;
                })
        });
   })
});