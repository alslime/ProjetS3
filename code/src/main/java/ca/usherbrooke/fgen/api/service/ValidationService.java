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

    private static final Logger LOG = Logger.getLogger(String.valueOf(DBmodelValidation.class));
    @Inject
    ValidationMapper ValidationMapper;

    @PUT
    @Path("insertValidation")
    public void insertValidation(DBmodelValidation validation) {
        LOG.info(validation.trimester_id);
        LOG.info(validation.department_id);
        LOG.info(validation.unit_id);
        LOG.info(validation.cipvalideur);
        LOG.info(validation.local);
        LOG.info(validation.dureeplagehoraire.toString());
        ValidationMapper.insertValidation(validation);
    }
}
