package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.Equipe;
import ca.usherbrooke.fgen.api.business.Message;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface EquipeMapper {
    List<Equipe> allEquipes();
}
