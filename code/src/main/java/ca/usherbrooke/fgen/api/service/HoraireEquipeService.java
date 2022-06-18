package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HoraireEquipeService {
    @Inject
    HoraireEquipeMapper horaireEquipeMapper;

    @GET
    @Path("getAllHorairesEquipe")
    public List<HoraireEquipe> getAllHorairesEquipe(
    ) {
        List<HoraireEquipe> HE = horaireEquipeMapper.allHorairesEquipe();
        return HE;
    }

    @PUT
    @Path("insertHoraireEquipe")
    public void insertHoraireEquipe(HoraireEquipe HE) {
        horaireEquipeMapper.insertHoraireEquipe(HE);
    }

    @PUT
    @Path("finirHoraireEquipe")
    public void finirHoraireEquipe(HoraireEquipe HE) {
        horaireEquipeMapper.finirHoraireEquipe(HE);
    }
}
