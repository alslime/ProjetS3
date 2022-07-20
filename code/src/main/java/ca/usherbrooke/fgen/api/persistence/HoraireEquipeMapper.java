package ca.usherbrooke.fgen.api.persistence;

import ca.usherbrooke.fgen.api.business.DBmodelHoraireEquipe;
import ca.usherbrooke.fgen.api.business.DBmodelInfoEtudiant;
import ca.usherbrooke.fgen.api.business.DBmodelInfoProf;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface HoraireEquipeMapper {
    List<DBmodelHoraireEquipe> allHorairesEquipe(@Param("unit_id") String unit_id,
                                                 @Param("department_id") String department_id,
                                                 @Param("trimester_id") String trimester_id,
                                                 @Param("cipvalideur") String cipvalideur);

    List<DBmodelInfoEtudiant> findValidEtudiant(@Param("cipetudiant") String cipetudiant,
                                                @Param("trimester_id") String trimester_id);

    List<DBmodelInfoProf> findValidProf(@Param("cip_prof") String cip_prof,
                                        @Param("trimester_id") String trimester_id);

    void finirHoraireEquipe(@Param("no") Integer no,
                            @Param("unit_id") String unit_id,
                            @Param("department_id") String department_id,
                            @Param("trimester_id") String trimester_id,
                            @Param("cipvalideur") String cipvalideur,
                            @Param("grouping") Integer grouping,
                            @Param("estterminee") Boolean estterminee);
    void remplirValidation(@Param("unit_id") String unit_id,
                           @Param("department_id") String department_id,
                           @Param("trimester_id") String trimester_id,
                           @Param("cipvalideur") String cipvalideur);
}

