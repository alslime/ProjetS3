import Validation from "../components/Validation";
import {useState, useEffect} from "react";
import "../index.css"

function TeacherPage(){
	const [isLoading, setLoading] = useState(true);
	const [loadedValidation, setLoadedValidation] = useState([]);
	const [loadedInfoValidation, setLoadedInfoValidation] = useState(null);
	//let time = TeacherPage.getElementById('dureeInput').value;

	useEffect(() => {
		setLoading(true);
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
			const validation = [];
			for (const key in data){
				window.numberOfEquipe += 1;
				const HoraireEquipes = {
					numero: data[key].equipe.no,
					equipiers: data[key].equipe.membres,
					horaire: data[key].hpassageprevue,
					heureAjustee: data[key].hpassageprevue,
					fini: data[key].estterminee,
					grpng: data[key].equipe.grouping
				};
				if (HoraireEquipes.fini === true){
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
			setLoading(false);
		});
	}, []);

	if (isLoading){
		return(
			<div>Chargement...</div>
		);
	}

	function createValid(time) {
		window.alert(time);
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
			}).then(json => {
				return console.log(json);
			}
		)
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
		if (window.currentEquipe < window.numberOfEquipe-1){
			window.currentEquipe += 1;
		}
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
		if (window.currentEquipe > 2){
			window.currentEquipe -= 1;
		}
	}

	return(
		<div>
			<h1 className={"title"}>Page des professeurs</h1>
			<Validation validation={loadedValidation} infoValidation={loadedInfoValidation}/>
			<button className={"bouton"} onClick={prochaineEquipe}>Prochaine Equipe</button>

			<table>
				<tr>
					<th>Durée : <input className={"duree"} type={"number"} placeholder={"minutes"} id={"dureeInput"}/></th>
					<th><button className={"bouton"}  onClick={() => createValid(document.getElementById("dureeInput").value)}> Create Validation </button></th>
					<th><button className={"bouton"} onClick={finirEquipe}> Finir Equipe </button></th>
				</tr>

			</table>
		</div>
	);
}

export default TeacherPage;