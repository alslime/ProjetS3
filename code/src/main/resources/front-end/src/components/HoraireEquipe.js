function HoraireEquipe(props){
	return(
		<tr>
			<td>{props.numero}</td>
			<td>{props.equipiers}</td>
			<td>{props.horaire}</td>
			<td>{props.heureAjustee}</td>
		</tr>
	);
}

export default HoraireEquipe;