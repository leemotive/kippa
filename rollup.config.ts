import typescript from '@rollup/plugin-typescript';
import type { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: './index.ts',
    external: ['yatter'],
    output: [
      {
        format: 'es',
        file: 'es/kippa.mjs',
      },
      {
        format: 'cjs',
        file: 'lib/kippa.js',
      },
    ],
    plugins: [typescript()],
  },
  {
    input: './index.ts',
    external: ['yatter'],
    output: {
      format: 'umd',
      file: './dist/kippa.js',
      exports: 'named',
      name: 'kippa',
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
