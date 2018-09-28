import "../scss/bundle1.scss";

// When we include assets directly inside our HTML via constructs like
// <img src=""> and <use xlink:href="">, we first need to import those files
// into our JavaScript entry point file, otherwise these assets won't get
// bundled by Webpack. This isn't necessary for background images inside
// external CSS files because, unlike HTML files, these assets get processed
// by Webpack's various loaders.

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