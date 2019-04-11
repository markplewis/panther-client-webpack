module.exports = {
  plugins: [
    require("autoprefixer"),
    
    // Replace the first part of the asset file path so that it can be resolved
    // (see the "resolve" config in "webpack.config.js"). Alternatively, this
    // can be done via the "string-replace-loader" Webpack loader.
    require("postcss-url")({
      url: asset => {
        let url = asset.url;
        if (url.startsWith("~patterns")) {
          url = url.replace("~patterns", "panther");
        }
        return url;
      }
    })
  ]
}
