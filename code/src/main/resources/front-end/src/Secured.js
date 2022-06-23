import Keycloak from "keycloak-js";
import {Component} from "react";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

class Secured extends Component {

	constructor(props) {
		super(props);
		this.state = { keycloak: null, authenticated: false};
	}

	componentDidMount() {
		const keycloak = Keycloak('/keycloak.json');
		keycloak.init({onLoad: 'login-required'}).then(authenticated => {
			this.setState({keycloak: keycloak, authenticated: authenticated})
			if (authenticated) {
				window.accessToken = keycloak.token;
			}
		})
	}

	render() {
		if (this.state.keycloak) {
			if (this.state.authenticated) return (
				<BrowserRouter>
					<App />
				</BrowserRouter>
			); else return (<div>Impossible de s'authentifier!</div>)
		}
		return (
			<div>Initialisation du serveur d'authentification...</div>
		);
	}
}
export default Secured;