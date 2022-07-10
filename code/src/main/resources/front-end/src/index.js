import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Secured from "./Secured";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

const toRender = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
)


ReactDOM.render(toRender, document.getElementById('root'));


