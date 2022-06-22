import Validation from "../components/Validation";
import {useState, useEffect} from "react";

function TeacherPage(){
	const [isLoading, setLoading] = useState(true);
	const [loadedValidation, setLoadedValidation] = useState([]);

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
			setLoading(false);
			setLoadedValidation(validation);
		});
	}, []);

	if (isLoading){
		return(
			<div>Chargement...</div>
		);
	}

	return(
		<div>
			<h1>Page des professeurs</h1>
			<Validation validation={loadedValidation}/>
		</div>
	);
}

export default TeacherPage;