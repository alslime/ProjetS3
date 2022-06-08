--Create tables
CREATE SCHEMA schema_groupe;

CREATE TABLE schema_groupe.roles
(
    role_id SERIAL PRIMARY KEY,
    nom TEXT NOT NULL
);

CREATE TABLE schema_groupe.usagers
(
    cip VARCHAR(8) NOT NULL,
    prenon_nom TEXT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT pk_usagers PRIMARY KEY cip
);


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
    --FOREIGN KEY (grouping) REFERENCES extern_equipe.etudiants_equipe_unite(grouping),
    --FOREIGN KEY (no) REFERENCES extern_equipe.etudiants_equipe_unite(no),
    cipValideur varchar(8) NOT NULL,
    FOREIGN KEY (cipValideur,department_id,trimester_id,unit_id) REFERENCES schema_groupe.validation(cipValideur,department_id,trimester_id,unit_id),
    CONSTRAINT pk_horaireEquipe PRIMARY KEY (cipValideur,department_id,trimester_id,unit_id,grouping,no),
    HPassagePrevue TIME NOT NULL,
    HPassageReelle TIME NOT NULL
);

--Fill tables tests
INSERT INTO extern_validation.validation(cipValideur, department_id, trimester_id, unit_id, local, dureePlageHoraire)
values ('boua1007','1808','A21','s1geiapp4tito','C1-3014','0:30:0');

INSERT INTO extern_validation.horaireEquipe(cipValideur,department_id,trimester_id,unit_id,grouping,no,HPassagePrevue,HPassageReelle)
values ('boua1007','1808','A21','s1geiapp4tito',1,1,'0:30:0','0:30:0');

--Create views
CREATE SCHEMA extern_validation;

CREATE OR REPLACE VIEW extern_validation.simpleHoraireEquipe AS
    SELECT schema_groupe.horaireEquipe.no, array_agg(prenom_nom), hpassageprevue, hpassagereelle
    from extern_equipe.etudiants_equipe_unite, schema_groupe.horaireEquipe
    where horaireequipe.trimester_id = etudiants_equipe_unite.trimester_id and horaireequipe.department_id = etudiants_equipe_unite.department_id
        and horaireequipe.unit_id = etudiants_equipe_unite.unit_id and horaireequipe.grouping = etudiants_equipe_unite.grouping
        and horaireequipe.no = etudiants_equipe_unite.no
    group by schema_groupe.horaireEquipe.no, hpassageprevue, hpassagereelle;

CREATE OR REPLACE VIEW extern_validation.horaireEquipe AS
    SELECT * from schema_groupe.horaireEquipe;

CREATE OR REPLACE VIEW extern_validation.validation AS
    SELECT * from schema_groupe.validation;

--Create triggers
CREATE OR REPLACE FUNCTION extern_validation.insert_horaireEquipe()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO schema_groupe.horaireEquipe(cipValideur,department_id,trimester_id,unit_id,grouping,no,HPassagePrevue,HPassageReelle)
    VALUES (new.cipvalideur, new.department_id, new.trimester_id, new.unit_id, new.grouping, new.no, new.hpassageprevue, new.hpassagereelle);
    RETURN NULL;
END
$$
;

CREATE TRIGGER insert_horaireEquipe
    INSTEAD OF INSERT on extern_validation.horaireEquipe
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.insert_horaireEquipe();

CREATE OR REPLACE FUNCTION extern_validation.insert_validation()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    INSERT INTO schema_groupe.validation(cipValideur, department_id, trimester_id, unit_id, local, dureePlageHoraire)
    VALUES (new.cipvalideur, new.department_id, new.trimester_id, new.unit_id, new.local, new.dureePlageHoraire);
    RETURN NULL;
END
$$
;

CREATE TRIGGER insert_validation
    INSTEAD OF INSERT on extern_validation.validation
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.insert_validation();
