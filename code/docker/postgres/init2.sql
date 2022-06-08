--Create tables
CREATE SCHEMA schema_groupe;

CREATE TABLE schema_groupe.validation
(
    cipValideur varchar(8) NOT NULL,
    department_id TEXT NOT NULL,
    trimester_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    local TEXT,
    dureePlageHoraire INTERVAL NOT NULL,
    --FOREIGN KEY (cipValideur) REFERENCES extern_equipe.teachers(cip),
    --FOREIGN KEY (department_id) REFERENCES extern_equipe.teachers(department_id),
    --FOREIGN KEY (trimester_id) REFERENCES extern_equipe.teachers(trimester_id),
    --FOREIGN KEY (unit_id) REFERENCES extern_equipe.teachers(unit_id),
    CONSTRAINT pk_validation PRIMARY KEY (cipValideur,department_id,trimester_id,unit_id)
);

CREATE TABLE schema_groupe.horaireEquipe
(
    department_id TEXT NOT NULL,
    trimester_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    grouping INT NOT NULL,
    no INT NOT NULL,
    --PRIMARY KEY (department_id), FOREIGN KEY (department_id) REFERENCES extern_equipe.etudiants_equipe_unite(department_id),
    --PRIMARY KEY (trimester_id), FOREIGN KEY (trimester_id) REFERENCES extern_equipe.etudiants_equipe_unite(trimester_id),
    --PRIMARY KEY (unit_id), FOREIGN KEY (unit_id) REFERENCES extern_equipe.etudiants_equipe_unite(unit_id),
    --PRIMARY KEY (grouping), FOREIGN KEY (grouping) REFERENCES extern_equipe.etudiants_equipe_unite(grouping),
    --PRIMARY KEY (no), FOREIGN KEY (no) REFERENCES extern_equipe.etudiants_equipe_unite(no),
    cipValideur varchar(8) NOT NULL,
    --FOREIGN KEY (cipValideur) REFERENCES extern_equipe.teachers(cip),
    CONSTRAINT pk_horaireEquipe PRIMARY KEY (cipValideur,department_id,trimester_id,unit_id,grouping,no),
    HPassagePrevue TIME NOT NULL,
    HPassageReelle TIME NOT NULL
);

--Fill tables
INSERT INTO schema_groupe.validation(cipValideur, department_id, trimester_id, unit_id, local, dureePlageHoraire)
values ('boua1007','a','b','c','C1-5028','0:30');

INSERT INTO schema_groupe.horaireEquipe(cipValideur,department_id,trimester_id,unit_id,grouping,no,HPassagePrevue,HPassageReelle)
values ('laus1801','1808','A21','s1geiapp1sngegi',1,1,'0:30:0','0:30:0');

--Create views
CREATE SCHEMA extern_validation;

CREATE OR REPLACE VIEW extern_validation.horaireEquipe AS
    SELECT schema_groupe.horaireEquipe.no, array_agg(prenom_nom), hpassageprevue, hpassagereelle
    from extern_equipe.etudiants_equipe_unite, schema_groupe.horaireEquipe
    where horaireequipe.trimester_id = etudiants_equipe_unite.trimester_id and horaireequipe.department_id = etudiants_equipe_unite.department_id
        and horaireequipe.unit_id = etudiants_equipe_unite.unit_id and horaireequipe.grouping = etudiants_equipe_unite.grouping
        and horaireequipe.no = etudiants_equipe_unite.no
    group by schema_groupe.horaireEquipe.no, hpassageprevue, hpassagereelle;

--Create triggers
CREATE OR REPLACE FUNCTION heures()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO log (cip, description, usagerid, localid, debut, fin, inscription)
    VALUES (new.usager_cip, 'A rerver un local', new.usager_cip, new.local_id, new.reserve_debut, new.reserve_fin, now());
    RETURN NULL;
END
$$
;
