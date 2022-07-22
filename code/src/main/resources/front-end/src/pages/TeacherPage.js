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

	// Aller chercher les horaires pour les afficher
	useEffect(() => {
		setLoading(true);
		wait(1000).then(async () => {

			if (window.department_id === undefined || window.unit_id === undefined) {
				// Aller chercher departement_id et unit_id en cours
				await fetch(
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

			// Connaitre le nombre d'equipe et combien ont passe
			window.numberOfEquipe = 0;
			window.currentEquipe = 1;

			// Aller chercher les horaires pour les afficher avec les infos precedentes
			await fetch(
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
						const d = new Date();
						d.setHours(parseInt(MyArray[0]));
						d.setMinutes(parseInt(MyArray[1]));
						d.setSeconds(parseInt(MyArray[2]));
						const srt = d.getHours() + ':' + d.getMinutes();
						const MyArrayRetard = data[0].validation.retard.split(":");
						const d2 = new Date();
						d2.toLocaleString('en-US', {timeZone: 'America/New_York'});
						d2.setHours(parseInt(MyArrayRetard[0]));
						d2.setMinutes(parseInt(MyArrayRetard[1]));
						d2.setSeconds(parseInt(MyArrayRetard[2]));
						const d1 = new Date();
						d1.setTime(d.getTime() + d2.getTime());
						d1.toLocaleString("en-US", {timeZone: "America/New_York"});
						const srt1 = d1.getHours() - 3 + ':' + d1.getMinutes();

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

	async function createValid(time) {
		//verification validite de la duree
		if (verifTime(time) === false) {
			return;
		}

		setLoading(true);
		let _data = {
			trimester_id: window.trimester_id,
			department_id: window.department_id,
			unit_id: window.unit_id,
			cipvalideur: window.username,
			dureeplagehoraire: "0 years 0 mons 0 days 0 hours " + time + " mins 0.0 secs"
		}
		await fetch(
			'http://localhost:8089/api/insertValidation', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {
					Accept: "application/json",
					"Content-type": "application/json; charset=UTF-8",
					Authorization: "Bearer " + window.accessToken
				}
			}).then(async () => {
			//Ajouter equipes a la validation selon les equipes inscrites a l'app
			await fetch(
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
				}).then(() => {
				setValidationCreated(true);
				forceUpdate();
			})
		})
	}

	// Verification si la duree est valide
	function verifTime(time){
		let a = false;
		const arr = window.temps.split(':');
		const minutes = parseInt(arr[0])*60 + parseInt(arr[1]);

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
		} else if ((parseInt(time)*window.numberOfEquipe) > minutes)
		{
			alert('Durée invalide : Le temps de chaque équipe additionné est supérieur à la durée de la validation (' +
				window.temps + ').');
		}else {
			a = true;
		}
		return a;
	}

	// Update la duree de la plage horaire des equipes selon le temps
	async function updateValid(time) {
		if (verifTime(time) === false) {
			return;
		}

		setLoading(true);
		let _data = {
			trimester_id: window.trimester_id,
			department_id: window.department_id,
			unit_id: window.unit_id,
			cipvalideur: window.username,
			dureeplagehoraire: "0 years 0 mons 0 days 0 hours " + time + " mins 0.0 secs"
		}
		await fetch(
			'http://localhost:8089/api/updateValidation', {
				method: "PUT",
				body: JSON.stringify(_data),
				headers: {
					Accept: "application/json",
					"Content-type": "application/json; charset=UTF-8",
					Authorization: "Bearer " + window.accessToken
				}
			}).then(() => {
			forceUpdate();
		})
	}

	async function prochaineEquipe() {
		if (window.currentEquipe <= window.numberOfEquipe) {
			setLoading(true);
			// Passe a la prochaine equipe
			await fetch(
				"http://localhost:8089/api/finirHoraireEquipe/" +
				loadedValidation.at(window.currentEquipe - 1).numero + "/" +
				window.unit_id + "/" +
				window.department_id + "/" +
				window.trimester_id + "/" +
				window.username + "/" +
				loadedValidation.at(window.currentEquipe - 1).grpng +
				"/true", {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + window.accessToken
					}
				}).then(async () => {
				if (window.currentEquipe < window.numberOfEquipe) {
					window.currentEquipe += 1;
				}
				// Update le retard de la validation
				let _data = {
					trimester_id: window.trimester_id,
					department_id: window.department_id,
					unit_id: window.unit_id,
					cipvalideur: window.username,
					retard: "0 years 0 mons 0 days 0 hours 15 mins 0.0 secs"
				}
				await fetch(
					'http://localhost:8089/api/updateRetard', {
						method: "PUT",
						body: JSON.stringify(_data),
						headers: {
							Accept: "application/json",
							"Content-type": "application/json; charset=UTF-8",
							Authorization: "Bearer " + window.accessToken
						}
					}).then(() => {
					forceUpdate();
				})
			})
		} else {
			alert("Toutes les équipes ont été passées.");
		}
	}

	async function equipePrecedente() {
		if (window.currentEquipe > 1) {
			setLoading(true);
			// Reviens a l'equipe precedente
			await fetch(
				"http://localhost:8089/api/finirHoraireEquipe/" +
				loadedValidation.at(window.currentEquipe - 2).numero + "/" +
				window.unit_id + "/" +
				window.department_id + "/" +
				window.trimester_id + "/" +
				window.username + "/" +
				loadedValidation.at(window.currentEquipe - 2).grpng +
				"/false", {
					method: "PUT",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + window.accessToken
					}
				}).then(async () => {
				window.currentEquipe -= 1;
				// Update le retard de la validation
				let _data = {
					trimester_id: window.trimester_id,
					department_id: window.department_id,
					unit_id: window.unit_id,
					cipvalideur: window.username,
					retard: "0 years 0 mons 0 days 0 hours 2 mins 0.0 secs"
				}
				await fetch(
					'http://localhost:8089/api/updateRetard', {
						method: "PUT",
						body: JSON.stringify(_data),
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json; charset=UTF-8",
							Authorization: "Bearer " + window.accessToken
						}
					}).then(() => {
					forceUpdate();
				})
			})
		} else {
			alert("Aucune équipe n'a encore été passée.")
		}
	}

	// To render s'il a une validation creee
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

	// To render si il n'y a pas de validation creee
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