package ca.usherbrooke.fgen.api.persistence;

//import ca.usherbrooke.fgen.api.business.DBmodelHoraireEquipe;
//import ca.usherbrooke.fgen.api.business.HoraireEquipe;
//import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;
//
//import javax.inject.Inject;
//import javax.ws.rs.*;
import java.util.ArrayList;
import java.util.List;

import ca.usherbrooke.fgen.api.business.DBmodelHoraireEquipe;
import ca.usherbrooke.fgen.api.business.HoraireEquipe;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeConvert;
import ca.usherbrooke.fgen.api.persistence.HoraireEquipeMapper;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.logging.Logger;

public class HoraireEquipeConvert {

    @Inject
    private HoraireEquipeMapper horaireEquipeMapper;

    public List<HoraireEquipe> getAllHorairesEquipe() {
        List<HoraireEquipe> listeHE = new ArrayList<HoraireEquipe>();

        List<DBmodelHoraireEquipe> listeHEM = this.horaireEquipeMapper.allHorairesEquipe();

        for (DBmodelHoraireEquipe obj : listeHEM) {
            HoraireEquipe HE = new HoraireEquipe();
            HE.hpassageprevue = obj.hpassageprevue;
            listeHE.add(HE);
        }
        return listeHE;
    }
}
