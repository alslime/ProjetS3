import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Secured from "./Secured";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(<BrowserRouter className={"container"}><App /></BrowserRouter>, document.getElementById('root'));


