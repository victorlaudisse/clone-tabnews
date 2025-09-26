import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginNext from "@next/eslint-plugin-next";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReact from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([".next/"]),
  {
    extends: compat.config({
      extends: [
        "eslint:recommended",
        "plugin:jest/recommended",
        "next/core-web-vitals",
        "prettier",
      ],
    }),
    plugins: {
      "@next/next": eslintPluginNext,
      eslintPluginReactHooks,
      eslintPluginReact,
    },
  },
]);
