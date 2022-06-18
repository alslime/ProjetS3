package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.Validation;
import ca.usherbrooke.fgen.api.persistence.ValidationMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ValidationService {
    @Inject
    ValidationMapper validationMapperMapper;

    @PUT
    @Path("insertValidation")
    public void insertValidation(Validation validation) {
        validationMapperMapper.insertValidation(validation);
    }
}
