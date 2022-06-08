package ca.usherbrooke.fgen.api.persistence;


import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import ca.usherbrooke.fgen.api.business.Message;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HoraireEquipeMapper {
    List<HoraireEquipe> allHorairesEquipe();
}