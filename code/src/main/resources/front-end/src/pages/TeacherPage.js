import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "../index.css"

function TeacherPage(){
	const [isLoading, setLoading] = useState(true);
	const [validationCreated, setValidationCreated] = useState(false);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);

	useEffect(() => {
		alert(window.username);
		setLoading(true);
		//tenir compte de ou on est rendu avec l'equipe a passer
		window.numberOfEquipe = 0;
		window.currentEquipe = 1;
		fetch(
			"http://localhost:8089/api/getAllHorairesEquipe/" +
			window.unit_id + "/" +
			window.department_id + "/" +
			window.trimester_id + "/" +
			window.username
		).then(response => {
			return response.json();
		}).then(data => {
			if (Object.keys(data).length !== 0)
			{
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
				setValidationCreated(true);
			}
			setLoading(false);
		});
	}, []);

	function createValid(time) {
		setLoading(true);
		//verification validite de la duree
		if (verifTime(time) === false)
		{
			return;
		}

		let _data = {
			trimester_id:window.trimester_id,
			department_id:window.department_id,
			unit_id:window.unit_id,
			cipvalideur:window.username,
			local:"C1-1234",
			dureeplagehoraire:"0 years 0 mons 0 days 0 hours " + time + " mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/insertValidation', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {"Content-type": "application/json; charset=UTF-8"}
			}).then(response => {
				return response.json();
			})
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
		setLoading(false);
	}

	function verifTime(time){
		var a = false;
		//verifier si temps est valide
		if (time === "")
		{
			alert("Spécifier la durée pour une équipe");
		} else if (parseInt(time) > 60)
		{
			alert("Durée maximale d'une heure dépassée");
		} else if (parseInt(time) < 1)
		{
			alert("Durée nulle ou négative invalide");
		}else {
			a = true;
		}
		return a;
	}

	function updateValid(time) {
		//verification validite de la duree
		if (verifTime(time) === false)
		{
			return;
		}

		setLoading(true);
		let _data = {
			trimester_id:window.trimester_id,
			department_id:window.department_id,
			unit_id:window.unit_id,
			cipvalideur:window.username,
			local:"C1-1234",
			dureeplagehoraire:"0 years 0 mons 0 days 0 hours " + time + " mins 0.0 secs"
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
		setLoading(false);
	}

	function prochaineEquipe() {
		if (window.currentEquipe <= window.numberOfEquipe){
			setLoading(true);
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
			if (window.currentEquipe < window.numberOfEquipe) {
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
			setLoading(false);
		}
	}

	function equipePrecedente() {
		if (window.currentEquipe > 1){
			setLoading(true);
			fetch(
				"http://localhost:8089/api/finirHoraireEquipe/" +
				loadedValidation.at(window.currentEquipe-2).numero + "/" +
				window.unit_id + "/" +
				window.department_id + "/" +
				window.trimester_id + "/" +
				window.username + "/" +
				loadedValidation.at(window.currentEquipe-2).grpng +
				"/false", {
					method: "PUT"
				}).then(response => {
				return response.json();
			})
			window.currentEquipe -= 1;
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
	}

	const toReturnIfValidation = (
		<div>
			<h1 className={"title"}>Page des professeurs</h1>
			<th>Durée : <input className={"duree"} type={"number"} min={"1"} max={"60"} placeholder={"minutes"} id={"dureeInput"}/></th>
			<button className={"bouton"} onClick={() => updateValid(document.getElementById("dureeInput").value)}>Update Validation</button>
			<button className={"bouton"} onClick={prochaineEquipe}>Prochaine Equipe</button>
			<button className={"bouton"} onClick={equipePrecedente}>Equipe Precedente</button>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
		</div>
	);

	const toReturnBasic = (
		<div>
			<h1 className={"title"}>Page des professeurs</h1>
			<th>Durée : <input className={"duree"} type={"number"} min={"1"} max={"60"} placeholder={"minutes"} id={"dureeInput"}/></th>
			<button className={"bouton"} onClick={() => createValid(document.getElementById("dureeInput").value)}>Create Validation</button>
		</div>
	);

	if (isLoading){
		return(
			<div>Chargement</div>
		);
	} else if (validationCreated) {
		return toReturnIfValidation;
	} else {return toReturnBasic;}
}

export default TeacherPage;