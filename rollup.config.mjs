import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: 'app/main.js',
  output: {file: 'dist/terra.js', format: 'umd', name: 'terra'},
  plugins: [nodeResolve({browser: true}), commonjs()]
};
