///<reference path="../typings/index.d.ts"/>

import {lambdaKit, chainPromise, lambda, chain} from "../src/LambdaKit";
import {Callback} from "../src/AWS";
import {Lambda, Chainable} from "../src/Types";
import {expect} from "chai"

describe('lambda-kit', () => {
   describe('the lambdaKit object', () => {
       it('initializes the pre and post-processor builders with empty arrays', () => {

           expect(lambdaKit.beforeHandlingRequest).to.be.ok;
           expect(lambdaKit.afterCreatingResponse).to.be.ok;
           expect(Array.isArray(lambdaKit.beforeHandlingRequest)).to.be.true;
           expect(Array.isArray(lambdaKit.afterCreatingResponse)).to.be.true;
           expect(lambdaKit.beforeHandlingRequest).to.be.empty;
           expect(lambdaKit.afterCreatingResponse.length).to.be.empty;
       });
       it('initializes a null error handler', () => {
           expect(lambdaKit.whenAnErrorOccursCall).to.be.null;
       });
   });
   describe('chainPromises', () => {
       it('builds a single function from an array of functions that return promises', () => {
          type F = (i: string) => Promise<string>;

          let p = (i: string) => new Promise<string>((r) => r(i));

          let f0: F = i => p(i + "f0");
          let f1: F = i => p(i + "f1");
          let f2: F = i => p(i + "f2");

          let fn = chainPromise([f0, f1, f2, f1]);

          return fn('')
              .then(result => {
                  expect(result).to.equal('f0f1f2f1');
              });
       });
       it('returns a pass-through promise if the array is null or empty', () => {
           let fn = chainPromise<string>([]);
           expect(fn).to.be.ok;

           return fn('')
               .then(r => {
                  expect(r).to.equal('');
               });
       });
   });
   describe('chain', () => {
      it('chains together an array of functions into a single function calling each consecutively', () => {
         let funcs: Chainable<string>[] = [
             s => s + 'a',
             s => s + 'b',
             s => s + 'c'
         ];
         let chained = chain<string>(funcs);
         let result = chained('');
         expect(result).to.equal('abc');
      });
      it('returns a pass-through function if the array is null or empty', () => {
         let chained = chain<string>([]);
         let result = chained('');
         expect(result).to.equal('');
      });
   });
   describe('lambda', () => {
      it('runs the supplied lambda and calls the AWS callback when done', () => {
          return new Promise(resolve => {
              let mockLambda: Lambda = (s) => new Promise((r) => r({headers: {}, statusCode: 418}));
              let callback: Callback = (e, r) => {
                  expect(r.statusCode).to.equal(418);
                  resolve();
              };
              let handler = lambda(mockLambda);

              handler(null, null, callback);
          });
      });
   });
});
