const path = require("path");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  
  const fileLoaderNameOptions = (file) => {
    if (argv.mode === "development") {
      return "assets/[name].[ext]"; // [path][name].[ext]
    }
    return "assets/[hash].[ext]";
  }

  return {
    // stats: "verbose", // https://webpack.js.org/configuration/stats/
    entry: {
      main: "./src/index.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js" // [name].[chunkhash].js
    },
    // See: https://webpack.js.org/configuration/resolve
    resolve: {
      // modules: ["node_modules/tgam-patterns"],
      alias: {
        // "~": path.resolve(__dirname, "node_modules/tgam-patterns/")
        "./tgam": path.resolve(__dirname, "node_modules/tgam-patterns/assets")
      }
    },
    module: {
      // devtool: "source-map",
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
            // {
            //   loader: MiniCssExtractPlugin.loader,
            //   // options: {
            //   //   publicPath: "./node_modules/tgam-patterns/"
            //   // }
            // },
            {
              loader: "css-loader",
              options: {
                sourceMap: true
                // url: false
                // importLoaders: 3
              }
            },
            "postcss-loader",
            {
              loader: "string-replace-loader",
              options: {
                search: "~assets", 
                // replace: path.resolve(__dirname, "node_modules/tgam-patterns/assets"),
                replace: "tgam",
                flags: "g",
                // strict: true
              }
            },
            // {
            //   loader: "resolve-url-loader",
            //   options: {
            //     debug: true,
            //     // root: "",
            //     // join: new Function("require", process.env.LOADER_JOIN)(require)
            //     // join: function(uri, base) {
            //     //   // console.log(uri);
            //     //   // console.log(base);
            //     //   // console.log("--------------");
            //     //   return uri.replace("~assets", "foobar");
            //     // }
            //   }
            // },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/,
          use: [{
            loader: "file-loader",
            options: {
              // context: path.resolve(__dirname, "node_modules/tgam-patterns")
              name: fileLoaderNameOptions
            }
          }]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [{
            loader: "file-loader",
            options: {
              name: fileLoaderNameOptions
            }
          }]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin("dist", {}),
      new MiniCssExtractPlugin({
        filename: "style.css", // style.[contenthash].css
      }),
      // new HtmlWebpackPlugin({
      //   inject: false,
      //   hash: true,
      //   template: "./src/index.html",
      //   filename: "index.html"
      // }),
      // new WebpackMd5Hash()
    ]
  }
};
