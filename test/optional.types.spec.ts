/* global describe, it */

import { expect } from 'chai';

import tsd from 'tsd'
import path from 'path';

const weirdTSD = (tsd as any).default


process.on('unhandledRejection', (reason) => {
  console.log(`Uncaught error: ${reason}`);
});

const dirname = path.resolve();


describe('The Optional type (typings)', () => {
  it('should be able to pass all type checks', async () => {

    const result = await weirdTSD({
      cwd: '.',
      typingsFile: './lib/index.d.ts',
      testFiles: ['./test/types/optional.test-d.ts']
    })
    
    // eslint-disable-next-line no-unused-expressions
    expect(result, result
      .map((err: any) => `[${err.line}:${err.column}] ${err.message}`)
      .join('\n')
    ).to.be.empty;

  }).timeout(Number.MAX_SAFE_INTEGER)
});
