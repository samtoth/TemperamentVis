import * as React from "react";
import * as ReactDOM from "react-dom";
import './style.scss'
import App from "./components/app";

var Module = require("./MTKWeb.js");
Module().then(function(mtkMod) {
    // this is reached when everything is ready, and you can call methods on

    console.log("MTK version " +mtkMod.getVersion() +" has been loaded");

    ReactDOM.render(
        <App/>,
        document.getElementById("app-container")
    )
});