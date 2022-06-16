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
    public List<HoraireEquipe> getAllHorairesEquipe() {
        List<HoraireEquipe> HE = horaireEquipeMapper.allHorairesEquipe();
        return HE;
    }


}
