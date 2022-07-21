package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.DBmodelValidation;
import ca.usherbrooke.fgen.api.persistence.ValidationMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.logging.Logger;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ValidationService {
    @Inject
    ValidationMapper ValidationMapper;

    private static final Logger LOG = Logger.getLogger(String.valueOf(HoraireEquipeService.class));

    @PUT
    @Path("insertValidation")
    public void insertValidation(DBmodelValidation validation) {
        LOG.info("insertValidation");
        ValidationMapper.insertValidation(validation);
    }

    @PUT
    @Path("updateValidation")
    public void updateValidation(DBmodelValidation validation) {
        LOG.info("updateValidation");
        ValidationMapper.updateValidation(validation);
    }

    @PUT
    @Path("updateRetard")
    public void updateRetard(DBmodelValidation validation) {
        LOG.info("updateRetard");
        LOG.info(validation.retard);
        ValidationMapper.updateRetard(validation);
    }
}
