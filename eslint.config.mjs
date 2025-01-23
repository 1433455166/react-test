import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import"; // 导入 eslint-plugin-import

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { import: pluginImport }, // 添加 import 插件
    rules: {
      "import/no-unresolved": "error" // 启用检查未解析导入的规则
    }
  }
];