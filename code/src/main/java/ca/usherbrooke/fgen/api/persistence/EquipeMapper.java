package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.Equipe;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EquipeMapper {
    List<Equipe> allEquipes();
}
