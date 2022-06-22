import React from 'react';
import {createRoot} from 'react-dom/client';

import './index.css';
import App from './App.js';
import {BrowserRouter} from "react-router-dom";

const app = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(app)

