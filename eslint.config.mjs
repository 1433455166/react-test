import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import"; // 导入 eslint-plugin-import

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,jsx}"] },
    {
        languageOptions: {
            globals: globals.browser
        }
    },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            import: pluginImport,
            react: pluginReact
        }, // 添加 import 插件
        settings: {
            react: {
                version: 'detect' // 自动检测 React 版本
                // 或者指定具体版本，例如
                // version: '18.2.0'
            }
        },
        rules: {
            "import/no-unresolved": "error" // 启用检查未解析导入的规则
        }
    }
];