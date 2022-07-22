import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "./Pages.css"
import {wait} from "@testing-library/user-event/dist/utils";

function StudentPage(){
	const [isLoading, setLoading] = useState(true);
	const [validationCreated, setValidationCreated] = useState(false);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);

	// Aller chercher les horaires pour les afficher
	useEffect(() => {
		setLoading(true);
		wait(1000).then(async () => {

			if (window.department_id === undefined || window.unit_id === undefined) {
				// Aller chercher departement_id et unit_id en cours
				await fetch(
					"http://localhost:8089/api/findValidEtudiant/" +
					window.username + "/" +
					window.trimester_id,
					{
						method: "GET",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
							Authorization: "Bearer " + window.accessToken,
						}
					}
				).then(response => {
					return response.json();
				}).then(data => {
					if (Object.keys(data).length !== 0) {
						// *** PAS EXTENSIBLE*** Si l'etudiant est inscrit a plusieurs app cela prend seulement le premier
						window.department_id = data[0].department_id;
						window.unit_id = data[0].unit_id;
						window.cip_prof = data[0].cip_prof;
					}
				});
			}

			// Connaitre le nombre d'equipe et combien ont passe
			window.numberOfEquipe = 0;
			window.currentEquipe = 1;

			// Aller chercher les horaires pour les afficher avec les infos precedentes
			await fetch(
				"http://localhost:8089/api/getAllHorairesEquipe/" +
				window.unit_id + "/" +
				window.department_id + "/" +
				window.trimester_id + "/" +
				window.cip_prof,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: "Bearer " + window.accessToken,
					}
				}
			).then(response => {
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
	}, []);

	// To render s'il a une validation creee
	const toReturnIfValidation = (
		<div>
			<h1 className={"title"}>Page des étudiants</h1>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
		</div>
	);

	// To render si il n'y a pas de validation creee
	const toReturnBasic = (
		<div>
			<h1 className={"title"}>Page des étudiants</h1>
			<div>Présentement aucune validation pour l'unité en cours</div>
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

export default StudentPage;