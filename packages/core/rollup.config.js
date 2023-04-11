import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import { visualizer } from 'rollup-plugin-visualizer';

const packageJson = require('./package.json');

const baseConfig = {
  input: 'src/index.ts',
  external: [...Object.keys(packageJson.dependencies), /^lodash\/.*/]
};

export default [
  {
    ...baseConfig,
    output: {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      typescript(),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx'] }),
      visualizer({ open: false })
    ]
  },
  {
    ...baseConfig,
    output: {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    plugins: [
      typescript({
        compilerOptions: {
          target: 'ES5'
        }
      }),
      cleanup({ extensions: ['js', 'ts', 'jsx', 'tsx'] })
    ]
  }
];
