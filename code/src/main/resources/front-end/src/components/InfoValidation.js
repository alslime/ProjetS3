function InfoValidation(props){
	return(
		<div>
			<div>Local : {props.local}</div>
			<div>Duree : {props.duree}</div>
			<div>Retard actuel : {props.retard}</div>
		</div>
	);
}

export default InfoValidation;