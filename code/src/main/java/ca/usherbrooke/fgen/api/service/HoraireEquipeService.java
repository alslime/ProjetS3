package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import ca.usherbrooke.fgen.api.business.Message;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;
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
public class HoraireEquipeService {


    @Inject
    HoraireEquipeMapper horaireEquipeMapperMapper;

    @GET
    @Path("getallHorairesEquipe")
    public List<HoraireEquipe> getAllHorairesEquipe(
    ) {
        List<HoraireEquipe> HE = horaireEquipeMapperMapper.allHorairesEquipe();
        return this.unescapeEntities(HE);
    }

    public static HoraireEquipe unescapeEntities(HoraireEquipe HE) {
        HE.description = Parser.unescapeEntities(HE.description, true);
        return HE;
    }

    public List<HoraireEquipe> unescapeEntities(List<HoraireEquipe> HEs) {
        return HEs
                .stream()
                .map(HoraireEquipeService::unescapeEntities)
                .collect(Collectors.toList());
    }
}
