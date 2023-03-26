// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from "rollup-plugin-terser";

export default [{
    input: 'scripts/profile/readme.rewrite.js',
    output: {
        file: 'bundle/write.js',
        format: 'cjs'
    },
    plugins: [commonjs(),resolve(),json(),terser()]
},{
    input: 'scripts/profile/waka.save.js',
    output: {
        file: 'bundle/waka_save.js',
        format: 'cjs'
    },
    plugins: [resolve(),terser()]
}];
