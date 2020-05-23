import * as React from "react";
import * as ReactDOM from "react-dom";

var Module = require("./MTKWeb.js");
Module().then(function(mtkMod) {
    // this is reached when everything is ready, and you can call methods on Module
    console.log("MTK version " +mtkMod.getVersion() +" has been loaded");
    mtkMod.initAudio();
});

import { Hello } from "./components/Hello"

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("app-container")
)
