import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "./Pages.css"

function StudentPage(){
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

	const toReturnIfValidation = (
		<div>
			<h1 className={"title"}>Page des étudiants</h1>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
		</div>
	);

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