const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = (env, argv) => {
  
  const fileLoaderConfig = {
    loader: "file-loader",
    options: {
      // Transform the resolved asset file path
      // regExp: /\/node_modules\/tgam-patterns\/assets\/patterns\/([^.]+)/,
      name: (file) => {
        // return argv.mode === "development" ? "resources/[1].[ext]" : "resources/[1]-[hash].[ext]";
        const pieces = file.replace(__dirname, "").replace("/node_modules/tgam-patterns/assets/patterns", "/tgam-patterns").split(".");
        pieces.pop();
        let trimmed = pieces.join(".");
        if (trimmed.startsWith("/")) {
          // Remove leading slash
          trimmed = trimmed.substr(1, trimmed.length);
        }
        return argv.mode === "development" ? `resources/${trimmed}.[ext]` : `resources/${trimmed}-[hash].[ext]`;
      }
      // name: "[path][name].[ext]"
      // context: path.resolve(__dirname, "node_modules/tgam-patterns")
    }
  };

  return {
    entry: {
      main: "./src/index.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: argv.mode === "development" ? "[name].js" : "[name]-[chunkhash].js"
    },
    resolve: {
      alias: {
        "panther": "tgam-patterns/assets/patterns",
        // Once "string-replace-loader" has run, the asset paths will start
        // with "./tgam" instead of "~assets", so we'll need to make them
        // resolve properly. See: https://webpack.js.org/configuration/resolve
        "./tgam": path.resolve(__dirname, "node_modules/tgam-patterns/assets")
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
              loader: "string-replace-loader",
              options: {
                search: "~assets", 
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
        filename: argv.mode === "development" ? "style.css" : "style-[contenthash].css"
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/index.html",
        filename: "index.html"
      })
    ]
  }
};
