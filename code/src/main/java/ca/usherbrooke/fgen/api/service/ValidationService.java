package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.DBmodelValidation;
import ca.usherbrooke.fgen.api.persistence.ValidationMapper;
import io.quarkus.security.Authenticated;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.logging.Logger;

@Path("/api")
@Authenticated
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ValidationService {
    @Inject
    ValidationMapper ValidationMapper;

    private static final Logger LOG = Logger.getLogger(String.valueOf(HoraireEquipeService.class));

    @PUT
    @Path("insertValidation")
    @RolesAllowed("teacher")
    public void insertValidation(DBmodelValidation validation) {
        LOG.info("insertValidation");
        ValidationMapper.insertValidation(validation);
    }

    @PUT
    @Path("updateValidation")
    @RolesAllowed("teacher")
    public void updateValidation(DBmodelValidation validation) {
        LOG.info("updateValidation");
        ValidationMapper.updateValidation(validation);
    }

    @PUT
    @Path("updateRetard")
    @RolesAllowed("teacher")
    public void updateRetard(DBmodelValidation validation) {
        LOG.info("updateRetard");
        LOG.info(validation.retard);
        ValidationMapper.updateRetard(validation);
    }
}
