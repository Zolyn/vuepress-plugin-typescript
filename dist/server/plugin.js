"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const Plugin = ({ enhanceAppFiles: eAppFiles, loaderOptions }, ctx) => ({
    name: '@zolyn/vuepress-plugin-typescript',
    /**
     * 检测enhanceApp.ts，仅检测.vuepress目录下以及主题目录下的enhanceApp.ts文件
     * 检测方法与vuepress相似，详见@vuepress/core中的 '@vuepress/internal-enhance-app'(lib/node/internal-plugins/enhanceApp.js)
     */
    enhanceAppFiles() {
        const { sourceDir, themeAPI } = ctx;
        const enhanceAppPath = path_1.resolve(sourceDir, '.vuepress/enhanceApp.ts');
        let files = [enhanceAppPath];
        const parentThemePath = themeAPI.parentTheme.path;
        if (themeAPI.existsParentTheme && parentThemePath) {
            files.push(path_1.resolve(parentThemePath, 'enhanceApp.ts'));
        }
        const themePath = themeAPI.theme.path;
        if (themePath) {
            files.push(path_1.resolve(themePath, 'enhanceApp.ts'));
        }
        /**
         * 添加自定义的enhanceApp.ts
         */
        if (eAppFiles) {
            files = files.concat(eAppFiles);
        }
        return files;
    },
    /**
     * 修改webpack配置，方法与vuepress相似，详见@vuepress/core(lib/node/webpack/createBaseConfig.js)
     * 支持在 .ts .vue .md文件中使用typescript，暂时无法支持tsx
     */
    chainWebpack(config, isServer) {
        const { cacheDirectory, cacheIdentifier } = ctx;
        const finalCacheIdentifier = cacheIdentifier + `isServer:${isServer}`;
        /**
         * 添加.ts文件后缀名解析
         */
        config.resolve.extensions.add('.ts');
        /**
         * 使用cache-loader缓存，为.vue .md文件添加ts支持
         */
        config.module
            .rule('ts')
            .test(/\.ts$/)
            .use('cache-loader')
            .loader('cache-loader')
            .options({
            cacheDirectory,
            cacheIdentifier: finalCacheIdentifier,
        })
            .end()
            .use('ts-loader')
            .loader('ts-loader')
            .options(Object.assign({ appendTsSuffixTo: [/\.vue$/, /\.md$/], allowTsInNodeModules: true, compilerOptions: {
                declaration: false,
            } }, loaderOptions))
            .end();
    },
});
module.exports = Plugin;
//# sourceMappingURL=plugin.js.map