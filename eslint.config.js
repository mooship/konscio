import css from "@eslint/css";
import markdown from "@eslint/markdown";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

const jsLikeFiles = ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx,astro}"];

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  { ...eslintPluginUnicorn.configs.recommended, files: jsLikeFiles },
  eslintConfigPrettier,
  {
    files: jsLikeFiles,
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-top-level-await": "off",
    },
  },
  {
    ...markdown.configs.recommended[0],
    language: "markdown/gfm",
    rules: {
      ...markdown.configs.recommended[0].rules,
      "markdown/no-missing-label-refs": "off",
    },
  },
  {
    ...css.configs.recommended,
    files: ["**/*.css"],
    language: "css/css",
    rules: {
      "css/no-invalid-properties": "off",
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];
