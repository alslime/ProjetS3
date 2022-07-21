import Validation from "../components/Validation";
import {useState, useEffect, useReducer} from "react";
import "../index.css"
import {wait} from "@testing-library/user-event/dist/utils";

function TeacherPage(){
	const [isLoading, setLoading] = useState(true);
	const [validationCreated, setValidationCreated] = useState(false);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);
	const [reducerValue, forceUpdate] = useReducer(x => x + 1, 1);
	const [currentTeam, setCurrent] = useState(1)


	useEffect(() => {
		setLoading(true);
		wait(1000).then(()=> {

			if (window.department_id === undefined || window.unit_id === undefined){
				//Aller chercher departement et App en cours
				fetch(
					"http://localhost:8089/api/findValidProf/" +
					window.username + "/" +
					window.trimester_id,
					{
						method: "GET",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							Authorization: "Bearer " + window.accessToken
						}
					}).then(response => {
					return response.json();
				}).then(data => {
					if (Object.keys(data).length !== 0) {
						// *** PAS EXTENSIBLE*** Si le prof est inscrit a plusieurs app cela prend seulement le premier
						window.department_id = data[0].department_id;
						window.unit_id = data[0].unit_id;
						window.debut = data[0].debut;
						window.fin = data[0].fin;
						window.datevalid = data[0].datevalid;
						window.heure_debut = data[0].heure_debut;
						window.temps = data[0].temps;
					}
				});
			}

			//tenir compte de ou on est rendu avec l'equipe a passer
			window.numberOfEquipe = 0;
			window.currentEquipe = 1;
			fetch(
				"http://localhost:8089/api/getAllHorairesEquipe/" +
				's6eapp1' + "/" +
				'1808' + "/" +
				window.trimester_id + "/" +
				window.username,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + window.accessToken
					}
				}).then(response => {
				return response.json();
			}).then(data => {
				if (Object.keys(data).length !== 0) {
					const validation = [];
					for (const key in data) {
						const MyArray = data[key].hpassageprevue.split(":");
						const  d = new Date();
						d.setHours(parseInt(MyArray[0]));
						d.setMinutes(parseInt(MyArray[1]));
						d.setSeconds(parseInt(MyArray[2]));
						const srt = d.getHours()+':'+d.getMinutes();
						const MyArrayRetard = data[0].validation.retard.split(":");
						const  d2 = new Date();
						d2.toLocaleString('en-US', { timeZone: 'America/New_York' });
						d2.setHours(parseInt(MyArrayRetard[0]));
						d2.setMinutes(parseInt(MyArrayRetard[1]));
						d2.setSeconds(parseInt(MyArrayRetard[2]));
						const d1 = new Date();
						d1.setTime(d.getTime()+d2.getTime());
						d1.toLocaleString("en-US", {timeZone: "America/New_York"});
						const srt1 = d1.getHours()-3+':'+d1.getMinutes();

						window.numberOfEquipe += 1;
						const HoraireEquipes = {
							numero: data[key].equipe.no,
							equipiers: data[key].equipe.membres,
							horaire: srt,
							heureAjustee: srt1,
							fini: data[key].estterminee,
							grpng: data[key].equipe.grouping
						};
						if (HoraireEquipes.fini) {
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
		})
	}, [reducerValue]);

	function createValid(time) {
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
			dureeplagehoraire:"0 years 0 mons 0 days 0 hours " + time + " mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/insertValidation',{
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {
					Accept: "application/json",
					"Content-type": "application/json; charset=UTF-8",
					Authorization: "Bearer " + window.accessToken
				}
			}).then(response => {
				return response.json();
			})
		setValidationCreated(true);
		//Ajouter equipes a la validation selon les equipes inscrites a l'app
		fetch(
			"http://localhost:8089/api/remplirValidation/" +
			window.unit_id + "/" +
			window.department_id + "/" +
			window.trimester_id + "/" +
			window.username, {
				method: "PUT",
				headers: {
				Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: "Bearer " + window.accessToken
			}
			}).then(response => {
			return response.json();
		})
		forceUpdate();
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
			dureeplagehoraire:"0 years 0 mons 0 days 0 hours " + time + " mins 0.0 secs"
		}
		fetch(
			'http://localhost:8089/api/updateValidation', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {
				Accept: "application/json",
					"Content-type": "application/json; charset=UTF-8",
				Authorization: "Bearer " + window.accessToken
				}
			}).then(response => {
			return response.json();
		})
		setValidationCreated(true);
		forceUpdate();
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
					method: "PUT",
					headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: "Bearer " + window.accessToken
					}
				}).then(response => {
				return response.json();
			})
			if (window.currentEquipe < window.numberOfEquipe) {
				setCurrent(currentTeam + 1);
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
					headers: {
					Accept: "application/json",
						"Content-type": "application/json; charset=UTF-8",
					Authorization: "Bearer " + window.accessToken
					}
				}).then(response => {
				return response.json();
			})
		}
		forceUpdate();
		setLoading(false);
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
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + window.accessToken
						}
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
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json; charset=UTF-8",
						Authorization: "Bearer " + window.accessToken
					}
				}).then(response => {
				return response.json();
			})
		}
		forceUpdate();
		setLoading(false);
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