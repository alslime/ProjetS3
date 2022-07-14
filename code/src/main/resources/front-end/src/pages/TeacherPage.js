import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "../index.css"

function TeacherPage(){
	const [isLoading, setLoading] = useState(true);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);

	useEffect(() => {
		setLoading(true);
		fetch(
			'http://localhost:8089/api/getAllHorairesEquipe/s6eapp1/1808/E22/houj1308'
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

	function createValid() {
		let _data = {
			trimester_id:"E22",
			department_id:"1808",
			unit_id:"s6eapp1",
			cipvalideur:"abia2601",
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
	}

	function finirEquipe() {
		fetch(
			'http://localhost:8089/api/finirHoraireEquipe/2/s6eapp1/1808/E22/houj1308/1', {
				method: "PUT"
			}).then(response => {
			return response.json();
		})
	}

	return(
		<div>
			<h1 className={"title"}>Page des professeurs</h1>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
			<button className={"bouton"} onClick={createValid}> Create Validation </button>
			<button className={"bouton"} onClick={finirEquipe}> Finir Equipe </button>
		</div>
	);
}

export default TeacherPage;