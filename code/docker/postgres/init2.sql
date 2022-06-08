--Create tables
CREATE SCHEMA schema_groupe;

CREATE TABLE schema_groupe.roles
(
    role TEXT NOT NULL PRIMARY KEY
);
INSERT INTO schema_groupe.roles(role) VALUES ('STUDENT');
INSERT INTO schema_groupe.roles(role) VALUES ('TEACHER');

CREATE TABLE schema_groupe.usagers
(
    cip VARCHAR(8) NOT NULL PRIMARY KEY,
    prenon_nom TEXT NOT NULL,
    role_id TEXT NOT NULL,
        FOREIGN KEY (role_id) REFERENCES schema_groupe.roles(role)
);
INSERT INTO schema_groupe.usagers (cip, prenon_nom, role_id)
    SELECT DISTINCT ON (cip) cip, prenom_nom, role FROM extern_equipe.students order by cip;
INSERT INTO schema_groupe.usagers (cip, prenon_nom, role_id)
    SELECT DISTINCT ON (cip) cip, prenom_nom, role FROM extern_equipe.teachers
    where cip not in (select cip from schema_groupe.usagers);

CREATE TABLE schema_groupe.unit
(
    serial_unit_id SERIAL PRIMARY KEY,
    department_id TEXT NOT NULL,
    trimester_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    CONSTRAINT u_unit UNIQUE (department_id,trimester_id,unit_id)
);
INSERT INTO schema_groupe.unit (department_id, trimester_id, unit_id)
    SELECT DISTINCT department_id, trimester_id, unit_id
    FROM  extern_equipe.etudiants_equipe_unite;

CREATE TABLE schema_groupe.equipe
(
    equipe_id SERIAL PRIMARY KEY,
    trimester_id TEXT NOT NULL,
    department_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    grouping INT NOT NULL,
    no INT NOT NULL,
    nom TEXT,
    inscriptor TEXT,
    CONSTRAINT u_equipe UNIQUE (department_id,trimester_id,unit_id,grouping,no)
);
INSERT INTO schema_groupe.equipe (department_id, trimester_id, unit_id,grouping,no,nom,inscriptor)
    SELECT DISTINCT department_id, trimester_id, unit_id,grouping,no,nom,inscriptor
    FROM  extern_equipe.equipes;

CREATE TABLE schema_groupe.equipe_etudiants
(
    equipe_id INT NOT NULL,
    cipEtudiant VARCHAR(8) NOT NULL,
    CONSTRAINT pk_equipe_etudiants PRIMARY KEY (equipe_id,cipEtudiant)
);


CREATE TABLE schema_groupe.validation
(
    serial_unit_id INT NOT NULL,
        FOREIGN KEY (serial_unit_id) REFERENCES schema_groupe.unit(serial_unit_id),
    cipValideur varchar(8) NOT NULL,
        FOREIGN KEY (cipValideur) REFERENCES schema_groupe.usagers(cip),
    local TEXT,
    dureePlageHoraire INTERVAL NOT NULL,
    CONSTRAINT pk_validation PRIMARY KEY (serial_unit_id,cipValideur)
);

CREATE TABLE schema_groupe.horaireEquipe
(
    serial_unit_id INT NOT NULL,
    cipValideur varchar(8) NOT NULL,
        FOREIGN KEY (serial_unit_id,cipValideur) REFERENCES schema_groupe.validation(serial_unit_id,cipValideur),
    equipe_id INT NOT NULL,
        FOREIGN KEY (equipe_id) REFERENCES schema_groupe.equipe(equipe_id),
    CONSTRAINT pk_horaireEquipe PRIMARY KEY (serial_unit_id,cipValideur,equipe_id),
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
