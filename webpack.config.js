const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = (env, argv) => {
  
  const fileLoaderConfig = {
    loader: "file-loader",
    options: {
      // Rewrite the resolved asset file path and tell Webpack where to save the files
      // regExp: /\/node_modules\/tgam-patterns\/assets\/patterns\/([^.]+)/,
      name: file => {
        // return argv.mode === "development" ? "resources/[1].[ext]" : "resources/[1]-[hash].[ext]";
        const pieces = file.replace(__dirname, "").replace("/node_modules/tgam-patterns/assets/patterns", "/tgam-patterns").split(".");
        pieces.pop();
        const trimmed = pieces.join(".");
        // let trimmed = pieces.join(".");
        // if (trimmed.startsWith("/")) {
        //   trimmed = trimmed.substr(1, trimmed.length); // Remove leading slash
        // }
        // return argv.mode === "development" ? `resources/${trimmed}.[ext]` : `resources/${trimmed}-[hash].[ext]`;
        return argv.mode === "development" ? `resources${trimmed}.[ext]` : `resources${trimmed}-[hash].[ext]`;
      }
      // name: "[path][name].[ext]"
      // context: path.resolve(__dirname, "node_modules/tgam-patterns")
    }
  };

  return {
    // See: https://webpack.js.org/configuration/stats/
    // stats: "verbose",
    entry: {
      main: "./src/main.js",
      bundle2: "./src/bundle2.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: argv.mode === "development" ? "[name].js" : "[name]-[chunkhash].js"
    },
    // See: https://webpack.js.org/configuration/resolve
    resolve: {
      alias: {
        // Make it easier to @import tgam-patterns styles into this project's SASS files
        "panther": "tgam-patterns/assets/patterns",
        // Once "string-replace-loader" has run, the asset paths will start
        // with "./tgam" instead of "~assets/patterns", so we'll need to make
        // them resolve properly
        "./tgam": path.resolve(__dirname, "node_modules/tgam-patterns/assets/patterns")
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.scss$/,
          use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { sourceMap: true }
            },
            "postcss-loader",
            {
              // Replace the first part of the asset file path so that
              // it can be resolved (see the "resolve" config above)
              loader: "string-replace-loader",
              options: {
                search: "~assets/patterns", 
                replace: "tgam",
                flags: "g"
              }
            },
            {
              loader: "sass-loader",
              options: { sourceMap: true }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/,
          use: fileLoaderConfig
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: fileLoaderConfig
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin("dist", {}),
      new MiniCssExtractPlugin({
        filename: argv.mode === "development" ? "[name].css" : "[name]-[contenthash].css"
      }),
      // Could use this to make things more dynamic:
      // https://github.com/mutualofomaha/multipage-webpack-plugin
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/index.html",
        filename: "index.html"
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/bundle2.html",
        filename: "bundle2.html"
      })
    ]
  }
};
