// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'scripts/markdown/main.js',
    output: {
        file: 'bundle/markdown.js',
        format: 'cjs'
    },
    plugins: [commonjs(),resolve(),json(),terser()]
};
