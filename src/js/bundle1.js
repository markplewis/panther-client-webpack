import "../scss/bundle1.scss";

// When we reference assets directly inside our HTML via elements like
// <img src=""> and <use xlink:href="">, we first need to import those assets
// into our JavaScript entry point file, otherwise they won't get bundled by
// Webpack. Because Webpack isn't aware of the HTML file, it isn't able to add
// the referenced assets to its dependency graph. CSS files don't have this
// problem because they (and the assets they reference) get processed by
// Webpack's various loaders.

import "tgam/images/icon-facebook.svg";
import "tgam/images/icon-snapchat.svg";
import "tgam/images/icon-twitter.svg";
import "tgam/images/nav-arrow-down.svg";

import "../images/icon-anchor.svg";
import "../images/icon-code.svg";
import "../images/loader.svg";

import nav from "./nav";

nav.init();

console.log("Hello, I'm bundle 1");