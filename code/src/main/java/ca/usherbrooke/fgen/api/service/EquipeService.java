package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.Equipe;
import ca.usherbrooke.fgen.api.business.Message;
import ca.usherbrooke.fgen.api.persistence.EquipeMapper;
import ca.usherbrooke.fgen.api.persistence.MessageMapper;
import org.jsoup.parser.Parser;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.stream.Collectors;


@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EquipeService {


	@Inject
	EquipeMapper equipeMapper;


	@Path("getallequipes")
	public List<Equipe> getAllEquipes(
	) {
		List<Equipe> equipes = equipeMapper.allEquipes();
		return this.unescapeEntities(equipes);
	}

	public static Equipe unescapeEntities(Equipe equipe) {
		equipe.description = Parser.unescapeEntities(equipe.description, true);
		return equipe;
	}

	public List<Equipe> unescapeEntities(List<Equipe> equipes) {
		return equipes
				.stream()
				.map(EquipeService::unescapeEntities)
				.collect(Collectors.toList());
	}
}
