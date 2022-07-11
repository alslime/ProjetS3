package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.DBmodelValidation;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ValidationMapper {
    void insertValidation(DBmodelValidation validation);
}