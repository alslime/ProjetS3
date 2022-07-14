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
			'http://localhost:8089/api/getAllHorairesEquipe'
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
			var validInfo = {
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