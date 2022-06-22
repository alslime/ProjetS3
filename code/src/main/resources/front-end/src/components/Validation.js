import HoraireEquipe from "./HoraireEquipe";
import InfoValidation from "./InfoValidation";

function Validation(props){
	return(
		<div>
			<table>
				<tr>
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