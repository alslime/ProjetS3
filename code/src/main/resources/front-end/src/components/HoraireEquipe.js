function HoraireEquipe(props){
	return(
		// eslint-disable-next-line no-template-curly-in-string
		<tr className={props.fini ? "finished" : "notFinished"}>
			<td>{props.numero}</td>
			<td>{props.equipiers}</td>
			<td>{props.horaire}</td>
			<td>{props.heureAjustee}</td>
		</tr>
	);
}

export default HoraireEquipe;