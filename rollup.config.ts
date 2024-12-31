import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: './index.ts',
    external: ['yatter'],
    output: [
      {
        dir: 'es',
        format: 'es',
        file: 'spiv.mjs',
      },
      {
        dir: 'lib',
        format: 'cjs',
        file: 'spiv.js',
      },
    ],
    plugins: [typescript()],
  },
  {
    input: './index.ts',
    external: ['yatter'],
    output: {
      format: 'umd',
      file: './dist/spiv.js',
      exports: 'named',
      name: 'spiv',
      globals: {
        yatter: 'yatter',
      },
    },
    plugins: [typescript()],
  },
  {
    input: './index.ts',
    output: {
      file: './typings/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
] as RollupOptions[];
