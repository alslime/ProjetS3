package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface HoraireEquipeMapper {
    List<HoraireEquipe> allHorairesEquipe();
    void insertHoraireEquipe(HoraireEquipe HE);
    void finirHoraireEquipe(HoraireEquipe HE);
}