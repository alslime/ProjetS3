package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.DBmodelHoraireEquipe;
import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import org.apache.ibatis.annotations.Mapper;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Mapper
public interface HoraireEquipeMapper {
    List<DBmodelHoraireEquipe> allHorairesEquipe();
    //void insertHoraireEquipe(HoraireEquipe HE);
    //void finirHoraireEquipe(HoraireEquipe HE);

}

