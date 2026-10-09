import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: 'app/main.ts',
  output: {file: 'dist/terra.js', format: 'umd', name: 'terra'},
  plugins: [typescript(), nodeResolve({browser: true, extensions: ['.mjs', '.js', '.json', '.node', '.ts']}), commonjs()]
};
