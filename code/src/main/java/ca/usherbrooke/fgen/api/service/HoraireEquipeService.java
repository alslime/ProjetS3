package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.*;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class HoraireEquipeService {
    @Inject
    HoraireEquipeMapper horaireEquipeMapper;
    private static final Logger LOG = Logger.getLogger(String.valueOf(HoraireEquipeService.class));

    @GET
    @Path("getAllHorairesEquipe/{unit_id}/{department_id}/{trimester_id}/{cipvalideur}")
    public List<HoraireEquipe> getAllHorairesEquipe(
            @PathParam("unit_id") String unit_id,
            @PathParam("department_id") String department_id,
            @PathParam("trimester_id") String trimester_id,
            @PathParam("cipvalideur") String cipvalideur
    ) {
        LOG.info("getAllHorairesEquipe");
        List<HoraireEquipe> listeHE = new ArrayList<HoraireEquipe>();
        List<DBmodelHoraireEquipe> listeHEM = this.horaireEquipeMapper.allHorairesEquipe(unit_id,department_id,trimester_id,cipvalideur);

        //map HoraireEquipe from DBmodelHoraireEquipe
        for (DBmodelHoraireEquipe obj : listeHEM) {
            Unit unit = new Unit();
            unit.unit_id = obj.unit_id;
            unit.department_id = obj.department_id;
            unit.trimester_id = obj.trimester_id;

            Validation valid = new Validation();
            valid.unit = unit;
            valid.cipvalideur = obj.cipvalideur;
            valid.dureeplagehoraire = obj.dureeplagehoraire;
            valid.local = obj.local;
            valid.retard = obj.retard;

            Equipe eq = new Equipe();
            eq.grouping = obj.grouping;
            eq.no = obj.no;
            eq.membres = obj.array_agg;

            HoraireEquipe HE = new HoraireEquipe();
            HE.hpassageprevue = obj.hpassageprevue;
            HE.estterminee = obj.estterminee;
            HE.validation = valid;
            HE.equipe = eq;
            listeHE.add(HE);
        }
        return listeHE;
    }

    @GET
    @Path("findValidEtudiant/{cipetudiant}/{trimester_id}")
    public List<DBmodelInfoEtudiant> findValidEtudiant(
            @PathParam("cipetudiant") String cipetudiant,
            @PathParam("trimester_id") String trimester_id
    ) {
        LOG.info("findValidEtudiant");
        return this.horaireEquipeMapper.findValidEtudiant(cipetudiant,trimester_id);
    }

    @GET
    @Path("findValidProf/{cip_prof}/{trimester_id}")
    public List<DBmodelInfoProf> findValidProf(
            @PathParam("cip_prof") String cip_prof,
            @PathParam("trimester_id") String trimester_id
    ) {
        LOG.info("findValidProf");
        return this.horaireEquipeMapper.findValidProf(cip_prof,trimester_id);
    }

    @PUT
    @Path("finirHoraireEquipe/{no}/{unit_id}/{department_id}/{trimester_id}/{cipvalideur}/{grouping}/{estterminee}")
    public void finirHoraireEquipe(
            @PathParam("no") Integer no,
            @PathParam("unit_id") String unit_id,
            @PathParam("department_id") String department_id,
            @PathParam("trimester_id") String trimester_id,
            @PathParam("cipvalideur") String cipvalideur,
            @PathParam("grouping") Integer grouping,
            @PathParam("estterminee") Boolean estterminee
    ) {
        LOG.info("finirHoraireEquipe");
        horaireEquipeMapper.finirHoraireEquipe(no,unit_id,department_id,trimester_id,cipvalideur,grouping,estterminee);
    }

    @PUT
    @Path("remplirValidation/{unit_id}/{department_id}/{trimester_id}/{cipvalideur}")
    public void remplirValidation(
            @PathParam("unit_id") String unit_id,
            @PathParam("department_id") String department_id,
            @PathParam("trimester_id") String trimester_id,
            @PathParam("cipvalideur") String cipvalideur
    ) {
        horaireEquipeMapper.remplirValidation(unit_id,department_id,trimester_id,cipvalideur);
    }
}
