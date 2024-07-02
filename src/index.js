import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "jquery";
import "popper.js/dist/umd/popper";
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./index.css";
import App from "./app";
import New from "./newcomponent";

//ReactDOM.render(<App />, document.getElementById("root"));
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
//root.render(<New />)
root.render(<App />)