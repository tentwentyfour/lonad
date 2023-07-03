import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const outDir = './bundle';
const outName = 'lonad-bundle';
const outExt = '.js';
const bundleName = 'lonad';

function createOutputConfig(format, sourceMap = false, formatName = format) {
  return {
    file: `${outDir}/${outName}${formatName && formatName.length > 0 ? `.${formatName}` : ''}${outExt}`,
    format,
    name: bundleName,
    sourcemap: sourceMap,
  };
}

const config = [
  {
    input: 'src/index.ts',
    output: [
      createOutputConfig('es', true),
      createOutputConfig('cjs', true),
    ],
    plugins: [
      typescript({ declaration: false, sourceMap: true, inlineSources: true })
    ],
    external: ['lodash.flow'],
  },
  {
    input: 'src/index.ts',
    output: [
      createOutputConfig('iife', true, ''),
      {
        ...createOutputConfig('iife', false, 'min'),
        plugins: [terser()]
      }
    ],
    plugins: [
      resolve({
        browser: true,
        resolveOnly: ['lodash.flow'],
      }),
      commonjs(),
      typescript({ declaration: false }),
    ],
  }
];

export default config;
