import Keycloak from "keycloak-js";
import {Component} from "react";
import App from "./App";
import {BrowserRouter} from "react-router-dom";

class Secured extends Component {
	constructor(props) {
		super(props);
		this.state = { keycloak: null,
			authenticated:false,
			isLoading:true,
			name: "",
			email: "",
			id: ""};
	}

	componentDidMount() {
		const keycloak = Keycloak('/keycloak.json');
		keycloak.init({onLoad: 'login-required'}).then(authenticated => {
			this.setState({keycloak: keycloak, authenticated: authenticated});
			if (authenticated) {
				// Construire trimester_id String
				var year = new Date();
				year = year.getFullYear().toString().substring(2,4);
				window.trimester_id = '';
				var month = new Date();
				month = month.getMonth()+1;
				if (month+1 < 5){
					window.trimester_id = 'H'
				}else if (month+1 < 9){
					window.trimester_id = 'E'
				}else{
					window.trimester_id = 'A'
				}
				window.trimester_id = window.trimester_id.concat(year.toString());

				// Charger profile
				window.accessToken = keycloak.token;
				keycloak.loadUserProfile()
					.then(function(profile) {
						window.username = profile.username;
					}).catch(function() {
					alert('Erreur de chargement du profile.');
				});
			}
		})
	}

	render() {
		if (this.state.keycloak) {
			if (this.state.authenticated) return (
				<BrowserRouter>
					<App />
				</BrowserRouter>
			); else return (<div>Impossible de s'authentifier.</div>)
		}
		return (
			<div>Chargement.</div>
		);
	}
}
export default Secured;