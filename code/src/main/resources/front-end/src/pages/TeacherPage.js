import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "../index.css"

function TeacherPage(){
	const [isLoading, setLoading] = useState(true);
	const [validationCreated, setValidationCreated] = useState(false);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);

	useEffect(() => {
		setLoading(true);
		//tenir compte de ou on est rendu avec l'equipe a passer
		window.numberOfEquipe = 0;
		window.currentEquipe = 0;
		fetch(
			"http://localhost:8089/api/getAllHorairesEquipe/" +
			window.unit_id + "/" +
			window.department_id + "/" +
			window.trimester_id + "/" +
			window.username
		).then(response => {
			return response.json();
		}).then(data => {
			const validation = [];
			for (const key in data){
				window.numberOfEquipe += 1;
				const HoraireEquipes = {
					numero: data[key].equipe.no,
					equipiers: data[key].equipe.membres,
					horaire: data[key].hpassageprevue,
					heureAjustee: data[key].validation.retard,
					fini: data[key].estterminee,
					grpng: data[key].equipe.grouping
				};
				if (HoraireEquipes.fini){
					window.currentEquipe += 1;
				}
				validation.push(HoraireEquipes);
			}
			const validInfo = {
				local: data[0].validation.local,
				duree: data[0].validation.dureeplagehoraire,
				retard: data[0].validation.retard
			}
			setLoadedValidation(validation);
			setLoadedInfoValidation(validInfo);
		});
		setLoading(false);
	}, []);

	if (isLoading){
		return(
			<div>Chargement...</div>
		);
	}

	function createValid() {
		let _data = {
			trimester_id:window.trimester_id,
			department_id:window.department_id,
			unit_id:window.unit_id,
			cipvalideur:window.username,
			local:"C1-1234",
			dureeplagehoraire:"0 years 0 mons 0 days 0 hours 45 mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/insertValidation', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			}).then(response => {
				return response.json();
			}).then(json => {
				return console.log(json);
			}
		)
		setValidationCreated(true);
		//Ajouter equipes a la validation selon les equipes inscrites a l'app
		fetch(
			"http://localhost:8089/api/remplirValidation/" +
			window.unit_id + "/" +
			window.department_id + "/" +
			window.trimester_id, {
				method: "PUT"
			}).then(response => {
			return response.json();
		})
	}

	function updateValid() {
		let _data = {
			trimester_id:window.trimester_id,
			department_id:window.department_id,
			unit_id:window.unit_id,
			cipvalideur:window.username,
			local:"C1-1234",
			dureeplagehoraire:"0 years 0 mons 0 days 0 hours 15 mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/updateValidation', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			}).then(response => {
			return response.json();
		})
		setValidationCreated(true);
	}

	function prochaineEquipe() {
		fetch(
			"http://localhost:8089/api/finirHoraireEquipe/" +
			loadedValidation.at(window.currentEquipe-1).numero + "/" +
			window.unit_id + "/" +
			window.department_id + "/" +
			window.trimester_id + "/" +
			window.username + "/" +
			loadedValidation.at(window.currentEquipe-1).grpng +
			"/true", {
				method: "PUT"
			}).then(response => {
			return response.json();
		})
		if (window.currentEquipe < window.numberOfEquipe){
			window.currentEquipe += 1;
		}
		//updateRetard
		let _data = {
			trimester_id:window.trimester_id,
			department_id:window.department_id,
			unit_id:window.unit_id,
			cipvalideur:window.username,
			retard: "0 years 0 mons 0 days 0 hours 15 mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/updateRetard', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			}).then(response => {
			return response.json();
		})
	}

	function equipePrecedente() {
		fetch(
			"http://localhost:8089/api/finirHoraireEquipe/" +
			loadedValidation.at(window.currentEquipe-1).numero + "/" +
			window.unit_id + "/" +
			window.department_id + "/" +
			window.trimester_id + "/" +
			window.username + "/" +
			loadedValidation.at(window.currentEquipe-1).grpng +
			"/false", {
				method: "PUT"
			}).then(response => {
			return response.json();
		})
		if (window.currentEquipe > 1){
			window.currentEquipe -= 1;
		}

		//updateRetard
		let _data = {
			trimester_id:window.trimester_id,
			department_id:window.department_id,
			unit_id:window.unit_id,
			cipvalideur:window.username,
			retard: "0 years 0 mons 0 days 0 hours 2 mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/updateRetard', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			}).then(response => {
			return response.json();
		})
	}

	const toReturnIfValidation = (
		<div>
			<h1 className={"title"}>Page des professeurs</h1>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
			<button className={"bouton"} onClick={updateValid}>Update Validation</button>
			<button className={"bouton"} onClick={prochaineEquipe}>Prochaine Equipe</button>
			<button className={"bouton"} onClick={equipePrecedente}>Equipe Precedente</button>
		</div>
	);

	const toReturnBasic = (
		<div>
			<h1 className={"title"}>Page des professeurs</h1>
			<button className={"bouton"} onClick={createValid}>Create Validation</button>
		</div>
	);

	if (validationCreated) {
		return toReturnIfValidation;
	} else {return toReturnBasic;}
}

export default TeacherPage;