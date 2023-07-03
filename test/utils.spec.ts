import { expect } from 'chai';

import { constant, identity, pipe } from '../src/utils/utils';


const increment = (n: number) => n + 1;
const asyncIncrement = async (n: number) => n + 1;

process.on('unhandledRejection', (reason) => {
  console.log(`Uncaught error: ${reason}`);
});

describe('Utilities', () => {
  describe('The pipe function', () => {
    it('should process a value through a series of functions', () => {
      const result = pipe(increment, increment, increment, increment, increment)(0);
      expect(result).to.equal(5);
    });
  });
});
