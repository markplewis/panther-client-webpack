import "../scss/bundle1.scss";

// When we reference assets inside our HTML via elements like <img src="">
// and <use xlink:href="">, we need to import those assets into our JavaScript
// entry point file, otherwise they won't get bundled by Webpack. Because
// Webpack isn't aware of our HTML files, it isn't able to add the assets that
// they reference to its dependency graph. CSS files don't have this problem
// because they (and the assets they reference) get processed by Webpack's
// various loaders.

import "tgam/images/search-icon-dark.svg";
import "tgam/images/play-button.svg";
import "tgam/images/twitter.svg";
import "tgam/images/plus-icon.svg";

import "../images/icon-anchor.svg";
import "../images/icon-code.svg";
import "../images/loader.svg";

import nav from "./nav";

nav.init();

console.log("Hello, I'm bundle 1");

const arrowFunction = () => {
  console.log("Arrow function called");
};
arrowFunction();