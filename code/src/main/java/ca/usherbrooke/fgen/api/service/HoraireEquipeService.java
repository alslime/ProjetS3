package ca.usherbrooke.fgen.api.service;

import ca.usherbrooke.fgen.api.business.*;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeConvert;
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

    //HoraireEquipeConvert horaireEquipeConvert = new HoraireEquipeConvert();
    private static final Logger LOG = Logger.getLogger(String.valueOf(HoraireEquipeService.class));

    @GET
    @Path("getAllHorairesEquipe")
    public List<HoraireEquipe> getAllHorairesEquipe(
    ) {
        LOG.info("Hello");
        List<HoraireEquipe> listeHE = new ArrayList<HoraireEquipe>();

        List<DBmodelHoraireEquipe> listeHEM = this.horaireEquipeMapper.allHorairesEquipe();

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
            HE.validation = valid;
            HE.equipe = eq;
            listeHE.add(HE);
        }
        return listeHE;

        //horaireEquipeConvert.getAllHorairesEquipe();
        //return null;

        //return horaireEquipeConvert.getAllHorairesEquipe();
    }

//    @PUT
//    @Path("insertHoraireEquipe")
//    public void insertHoraireEquipe(HoraireEquipe HE) {
//        horaireEquipeMapper.insertHoraireEquipe(HE);
//    }
//
//    @PUT
//    @Path("finirHoraireEquipe")
//    public void finirHoraireEquipe(HoraireEquipe HE) {
//        horaireEquipeMapper.finirHoraireEquipe(HE);
//    }
}
