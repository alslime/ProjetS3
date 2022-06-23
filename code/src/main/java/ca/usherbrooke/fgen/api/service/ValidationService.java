package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.Validation;
import ca.usherbrooke.fgen.api.persistence.ValidationMapper;
import org.apache.ibatis.annotations.Update;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.Authenticated;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class ValidationService {


    @Inject
    ValidationMapper validationMapperMapper;

    @PUT
    @Path("insertValidation")
    public void insertValidation(Validation validation) {
        validationMapperMapper.insertValidation(validation);
    }

}
