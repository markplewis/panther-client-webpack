const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
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
      "bundle-1": path.join(__dirname, "src/js/entry-point-1.js"),
      "bundle-2": path.join(__dirname, "src/js/entry-point-2.js")
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
        "tgam": "tgam-patterns/assets/patterns",
        // Once "string-replace-loader" has run, the asset paths will start
        // with "./tgam-replaced" instead of "~assets/patterns", so we'll need
        // to make them resolve properly
        "./tgam-replaced": path.resolve(__dirname, "node_modules/tgam-patterns/assets/patterns")
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
                replace: "tgam-replaced",
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
              name: "tgam-patterns/svgs/tgam-sprite.svg",
              iconName: argv.mode === "development" ? "[name]" : "[name]-[hash:5]"
            }
          }
        },
        {
          test: /\.svg$/,
          include: path.resolve(__dirname, "src/images"),
          use: {
            loader: "external-svg-sprite-loader",
            options: {
              name: "svgs/sprite.svg",
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
      // Duplicate this whole "new HtmlWebpackPlugin" block to configure a 2nd page
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/templates/page-2.html",
        filename: "page-2.html"
      }),
      new SvgStorePlugin(),
      new CopyWebpackPlugin([{
        from: "src/*.html",
        to: "[name].html",
        force: true
      }])
    ]
  }
};
