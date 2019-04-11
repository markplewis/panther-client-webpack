import "../scss/bundle2.scss";

import dialog from "panther/javascripts/modal-dialog.js";

import nav from "./nav";

console.log("Modal dialog:", dialog);

nav.init();

console.log("Hello, I'm bundle 2");

const arrowFunction = () => {
  console.log("Arrow function called");
};
arrowFunction();