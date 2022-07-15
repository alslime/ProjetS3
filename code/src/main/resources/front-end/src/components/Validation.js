import HoraireEquipe from "./HoraireEquipe";
import InfoValidation from "./InfoValidation";
import "./Components.css"

function Validation(props){
	return(
		<div>
			<table className={"table"}>
				<tr className={"entete"}>
					<th>Numero</th>
					<th>Equipiers</th>
					<th>Horaire</th>
					<th>Heure Ajustee</th>
				</tr>
				{props.validation.map(horaireEquipe => (
					<HoraireEquipe
						numero={horaireEquipe.numero}
						equipiers={horaireEquipe.equipiers}
						horaire={horaireEquipe.horaire}
						heureAjustee={horaireEquipe.heureAjustee}
						fini={horaireEquipe.fini}
					/>
				))}
			</table>
			<InfoValidation
				local={props.infoValidation.local}
				duree={props.infoValidation.duree}
				retard={props.infoValidation.retard}
			/>
		</div>
	);
}

export default Validation;