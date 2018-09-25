const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const SvgStorePlugin = require("external-svg-sprite-loader/lib/SvgStorePlugin");

module.exports = (env, argv) => {

  // Rewrite the resolved asset file path and tell Webpack where to save the files
  const fileLoaderConfig = {
    loader: "file-loader",
    options: {
      name: file => {
        let pieces;
        let trimmed;
        if (file.includes("/node_modules/tgam-patterns/assets/patterns/")) {
          pieces = file.replace(path.join(__dirname, "node_modules/tgam-patterns/assets/patterns/"), "").split(".");
          pieces.pop();
          trimmed = pieces.join(".");
          return argv.mode === "development" ? `tgam-patterns/${trimmed}.[ext]` : `tgam-patterns/${trimmed}-[hash].[ext]`;
        } else {
          pieces = file.replace(path.join(__dirname, "src/"), "").split(".");
          pieces.pop();
          trimmed = pieces.join(".");
          return argv.mode === "development" ? `${trimmed}.[ext]` : `${trimmed}-[hash].[ext]`;
        }
      }
    }
  };

  return {
    // See: https://webpack.js.org/configuration/stats/
    // stats: "verbose",
    entry: {
      "bundle1": path.join(__dirname, "src/js/bundle1.js"),
      "bundle2": path.join(__dirname, "src/js/bundle2.js"),
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      filename: argv.mode === "development" ? "js/[name].js" : "js/[name]-[chunkhash].js"
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
          test: /\.(png|jpe?g|gif|webp)$/,
          use: fileLoaderConfig
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: fileLoaderConfig
        },
        {
          test: /\.svg$/,
          include: path.resolve(__dirname, "node_modules/tgam-patterns/assets/patterns/images"),
          use: {
            loader: "external-svg-sprite-loader",
            options: {
              name: "tgam-patterns/svgs/sprite.svg",
              iconName: argv.mode === "development" ? "[name]" : "[name]-[hash:5]"
            }
          }
        },
        {
          test: /\.svg$/,
          include: path.resolve(__dirname, "src/images"),
          // In order to include these files below, they must be excluded here
          exclude: [
            path.resolve(__dirname, "src/images/icon-anchor.svg"),
            path.resolve(__dirname, "src/images/icon-code.svg"),
            path.resolve(__dirname, "src/images/icon-gear.svg"),
          ],
          use: {
            loader: "external-svg-sprite-loader",
            options: {
              name: "svgs/sprite.svg",
              iconName: argv.mode === "development" ? "[name]" : "[name]-[hash:5]"
            }
          }
        },
        {
          test: /\.svg$/,
          // In order to include these files here, they must be excluded above
          include: [
            path.resolve(__dirname, "src/images/icon-anchor.svg"),
            path.resolve(__dirname, "src/images/icon-code.svg"),
            path.resolve(__dirname, "src/images/icon-gear.svg"),
          ],
          use: {
            loader: "external-svg-sprite-loader",
            options: {
              name: "svgs/custon-sprite.svg",
              iconName: argv.mode === "development" ? "[name]" : "[name]-[hash:5]"
            }
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin("dist", {}),
      new MiniCssExtractPlugin({
        filename: argv.mode === "development" ? "css/[name].css" : "css/[name]-[contenthash].css"
      }),
      // Could use this to make things more dynamic:
      // https://github.com/mutualofomaha/multipage-webpack-plugin
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/templates/bundle1.html",
        filename: "bundle1.html"
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/templates/bundle2.html",
        filename: "bundle2.html"
      }),
      new SvgStorePlugin()
    ]
  }
};
