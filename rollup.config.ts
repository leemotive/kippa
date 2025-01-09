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
        file: 'es/ritt.mjs',
      },
      {
        format: 'cjs',
        file: 'lib/ritt.js',
      },
    ],
    plugins: [typescript()],
  },
  {
    input: './index.ts',
    external: ['yatter'],
    output: {
      format: 'umd',
      file: './dist/ritt.js',
      exports: 'named',
      name: 'ritt',
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
