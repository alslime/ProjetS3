import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter } from "webix-jet";
import Swagger from "swagger-client";

export default class MyApp extends JetApp{
	constructor(config){
		//new SwaggerClient("/q/openapi").then(client => console.log(client));
		const defaults = {
			id 		: APPNAME,
			version : VERSION,
			router 	: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug 	: !PRODUCTION,
			start 	: "/top/start",
		/*	routes: {
				"/messager"    : "/mai"
			}*/
		};

		super({ ...defaults, ...config });
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => new MyApp().render() );
}