package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;

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
    HoraireEquipeMapper horaireEquipeMapper;

    @GET
    @Path("getallHorairesEquipe")
    public List<HoraireEquipe> getAllHorairesEquipe(
    ) {
        List<HoraireEquipe> HE = horaireEquipeMapper.allHorairesEquipe();
        return this.unescapeEntities(HE);
    }

    public static HoraireEquipe unescapeEntities(HoraireEquipe HE) {
        //HE.local = Parser.unescapeEntities(HE.local, true);
        return HE;
    }

    public List<HoraireEquipe> unescapeEntities(List<HoraireEquipe> HEs) {
        return HEs
                .stream()
                .map(HoraireEquipeService::unescapeEntities)
                .collect(Collectors.toList());
    }
}
