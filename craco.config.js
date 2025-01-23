module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            const loaders = webpackConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
            const sassLoader = loaders.find(loader => loader.test instanceof RegExp && loader.test.test('.scss'));
            if (sassLoader) {
                sassLoader.use.forEach(use => {
                    // 检查 use.loader 是否存在
                    if (use && use.loader) { 
                        if (use.loader.includes('sass-loader')) {
                            use.options.sourceMap = true;
                        }
                        if (use.loader.includes('postcss-loader')) {
                            use.options.sourceMap = true;
                        }
                    }
                });
            }
            return webpackConfig;
        }
    }
};