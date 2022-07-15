package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.DBmodelValidation;
import ca.usherbrooke.fgen.api.persistence.ValidationMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ValidationService {
    @Inject
    ValidationMapper ValidationMapper;

    @PUT
    @Path("insertValidation")
    public void insertValidation(DBmodelValidation validation) {
        ValidationMapper.insertValidation(validation);
    }

    @PUT
    @Path("updateValidation")
    public void updateValidation(DBmodelValidation validation) {
        ValidationMapper.updateValidation(validation);
    }

    @PUT
    @Path("updateRetard")
    public void updateRetard(DBmodelValidation validation) {
        ValidationMapper.updateRetard(validation);
    }
}
