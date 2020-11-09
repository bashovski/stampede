module.exports = {
    publicPath: '/',
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "@/style/_variables.scss";`
            }
        }
    }
};
