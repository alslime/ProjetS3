package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.DBmodelHoraireEquipe;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HoraireEquipeMapper {
    List<DBmodelHoraireEquipe> allHorairesEquipe(@Param("unit_id") String unit_id,
                                                 @Param("department_id") String department_id,
                                                 @Param("trimester_id") String trimester_id,
                                                 @Param("cipvalideur") String cipvalideur);
    //void insertHoraireEquipe(HoraireEquipe HE);
    void finirHoraireEquipe(@Param("no") Integer no,
                            @Param("unit_id") String unit_id,
                            @Param("department_id") String department_id,
                            @Param("trimester_id") String trimester_id,
                            @Param("cipvalideur") String cipvalideur,
                            @Param("grouping") Integer grouping,
                            @Param("estterminee") Boolean estterminee);
}

