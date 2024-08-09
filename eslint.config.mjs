import globals from "globals";
import pluginJs from "@eslint/js";
import userscripts from "eslint-plugin-userscripts";


export default [
    {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
    {languageOptions: { globals: globals.browser }},
    {
        languageOptions: { globals: {GM: 'readonly'}, }, 
        rules: {
            semi: ['error', 'always']
        }
    },
    pluginJs.configs.recommended, 
    {
        files: ['*.user.js'],
        plugins: {
            userscripts: {
                rules: userscripts.rules
            }
        },
        rules: {
            ...userscripts.configs.recommended.rules
        },
        settings: {
            userscriptVersions: {
                violentmonkey: '*'
            }
        }
    }
];