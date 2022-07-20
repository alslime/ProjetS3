import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "./Pages.css"

function StudentPage(){
	const [isLoading, setLoading] = useState(true);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetch(
			"http://localhost:8089/api/getAllHorairesEquipe/" +
		's6eapp1' + "/" +
		'1808' + "/" +
		'E22' + "/" +
		'houj1308',
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
			const validation = [];
			for (const key in data){
				const HoraireEquipes = {
					numero: data[key].equipe.no,
					equipiers: data[key].equipe.membres,
					horaire: data[key].hpassageprevue,
					heureAjustee: data[key].hpassageprevue
				};
				validation.push(HoraireEquipes);
			}
			const validInfo = {
				local: data[0].validation.local,
				duree: data[0].validation.dureeplagehoraire,
				retard: data[0].validation.retard
			}
			setLoadedValidation(validation);
			setLoadedInfoValidation(validInfo);
			setLoading(false);
		});
	}, []);

	if (isLoading){
		return(
			<div>Chargement...</div>
		);
	}

	return(
		<div>
			<h1 className={"title"}>Page des etudiants</h1>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
		</div>
	);
}

export default StudentPage;