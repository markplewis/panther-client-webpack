const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const SvgStorePlugin = require("external-svg-sprite-loader");

module.exports = (env, argv) => {
  const isDev = argv.mode === "development";

  return {
    // See: https://webpack.js.org/configuration/stats/
    // stats: "verbose",
    entry: {
      "bundle1": path.join(__dirname, "src/js/bundle1.js"),
      "bundle2": path.join(__dirname, "src/js/bundle2.js")
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      filename: isDev ? "js/[name].js" : "js/[name].[contenthash].js"
    },
    // See: https://webpack.js.org/configuration/resolve
    resolve: {
      alias: {
        // Make it easier to import Panther styles into our SASS and JS files
        "./panther": path.resolve(__dirname, "node_modules/tgam-patterns/patterns"),
      }
    },
    module: {
      rules: [
        {
          // JavaScript files
          test: /\.js$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        },
        {
          // SASS files
          test: /\.scss$/,
          use: [
            "style-loader",
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { sourceMap: true }
            },
            // Because the "~" character has special meaning for Webpack,
            // we must replace "~patterns" with a different unique identifier
            // (i.e. "panther") in order for the Panther SASS file asset paths
            // to resolve (i.e. fonts, images and SVGs). This can be done via
            // "string-replace-loader" or "postcss-url" (see "postcss.config.js")
            "postcss-loader",
            // {
            //   loader: "string-replace-loader",
            //   options: {
            //     search: "~patterns", 
            //     replace: "panther",
            //     flags: "g"
            //   }
            // },
            {
              loader: "sass-loader",
              options: { sourceMap: true }
            }
          ]
        },
        {
          // Image files within the "src" directory
          test: /\.(png|jpe?g|gif|webp)$/,
          include: path.resolve(__dirname, "src"),
          loader: "file-loader",
          options: {
            name: isDev ? "[path][name].[ext]" : "[path][name].[hash].[ext]",
            context: "src"
          }
        },
        {
          // Image files within the "tgam-patterns" package
          test: /\.(png|jpe?g|gif|webp)$/,
          include: path.resolve(__dirname, "node_modules/tgam-patterns/patterns"),
          loader: "file-loader",
          options: {
            name: isDev ? "panther/[path][name].[ext]" : "panther/[path][name].[hash].[ext]",
            context: "node_modules/tgam-patterns/patterns"
          }
        },
        {
          // Font files within the "src" directory
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          include: path.resolve(__dirname, "src"),
          loader: "file-loader",
          options: {
            name: isDev ? "[path][name].[ext]" : "[path][name].[hash].[ext]",
            context: "src"
          }
        },
        {
          // Font files within the "tgam-patterns" package
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          include: path.resolve(__dirname, "node_modules/tgam-patterns/patterns"),
          loader: "file-loader",
          options: {
            name: isDev ? "panther/[path][name].[ext]" : "panther/[path][name].[hash].[ext]",
            context: "node_modules/tgam-patterns/patterns"
          }
        },
        {
          // SVG files within the "src" directory
          test: /\.svg$/,
          include: path.resolve(__dirname, "src"),
          loader: SvgStorePlugin.loader,
          options: {
            name: "sprites/main.svg",
            iconName: isDev ? "[name]" : "[name]-[hash:5]"
          }
        },
        {
          // SVG files within the "tgam-patterns" package
          test: /\.svg$/,
          include: path.resolve(__dirname, "node_modules/tgam-patterns/patterns"),
          loader: SvgStorePlugin.loader,
          options: {
            name: "panther/sprites/tgam.svg",
            iconName: isDev ? "[name]" : "[name]-[hash:5]"
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: isDev ? "css/[name].css" : "css/[name].[contenthash].css"
      }),
      // Duplicate this whole "new HtmlWebpackPlugin" block to configure a 2nd page
      new HtmlWebpackPlugin({
        inject: false,
        hash: false,
        template: "./src/templates/page2.html",
        filename: "page2.html"
      }),
      new SvgStorePlugin(),
      new CopyWebpackPlugin([{
        from: "src/*.html",
        to: "[name].html",
        force: true
      }]),
      new CopyWebpackPlugin([{
        from: "src/favicon.ico",
        to: "[name].ico",
        force: true
      }])
    ]
  }
};
