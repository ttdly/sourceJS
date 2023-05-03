// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "scripts/profile/profile.js",
    output: {
      file: "bundle/profile.js",
      format: "cjs",
    },
    plugins: [commonjs(), resolve(), json(), terser()],
  },
  {
    input: "scripts/profile/waka.save.js",
    output: {
      file: "bundle/waka_save.js",
      format: "cjs",
    },
    plugins: [resolve(), terser()],
  },
];
