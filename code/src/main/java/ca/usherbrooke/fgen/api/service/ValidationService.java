package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;
import ca.usherbrooke.fgen.api.persistence.ValidationMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.stream.Collectors;




@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ValidationService {
    @Inject
    ValidationMapper validationMapperMapper;

    @PUT
    @Path("insertValidation")
    public List<HoraireEquipe> insertValidation(
            @PathParam("cipvalideur") String cipValideur,
            @PathParam("local") String profileId,
            @PathParam("unit") String unit
    ) {
        List<HoraireEquipe> HE = validationMapperMapper.insertValidation();
        return HE;
    }


}
