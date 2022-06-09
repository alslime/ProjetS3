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
INSERT INTO schema_groupe.equipe_etudiants
SELECT DISTINCT equipe_id,schema_groupe.usagers.cip from schema_groupe.equipe,schema_groupe.usagers,extern_equipe.etudiants_equipe_unite where
    extern_equipe.etudiants_equipe_unite.department_id = schema_groupe.equipe.department_id and extern_equipe.etudiants_equipe_unite.trimester_id = schema_groupe.equipe.trimester_id
    and extern_equipe.etudiants_equipe_unite.unit_id = schema_groupe.equipe.unit_id and extern_equipe.etudiants_equipe_unite.no = schema_groupe.equipe.no
    and extern_equipe.etudiants_equipe_unite.grouping = schema_groupe.equipe.grouping
    and extern_equipe.etudiants_equipe_unite.cip = schema_groupe.usagers.cip;

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

--fill validation and horaireEquipe
-- INSERT INTO schema_groupe.validation values(7,'boua1007','C1-3021','0:45:0');
-- INSERT INTO schema_groupe.horaireEquipe values(7,'boua1007',15,'4:30:0','4:30:0');
-- INSERT INTO schema_groupe.horaireEquipe values(7,'boua1007',16,'5:00:0','5:30:0');

--Create views
CREATE SCHEMA extern_validation;

CREATE OR REPLACE VIEW extern_validation.horaireEquipe AS
SELECT schema_groupe.equipe.no, array_agg(schema_groupe.equipe_etudiants.cipetudiant),
       schema_groupe.equipe.department_id, schema_groupe.equipe.trimester_id, schema_groupe.equipe.unit_id,
       schema_groupe.equipe.grouping, schema_groupe.validation.dureePlageHoraire, schema_groupe.validation.local,
       schema_groupe.horaireequipe.hpassageprevue, schema_groupe.horaireEquipe.hpassagereelle, schema_groupe.validation.cipvalideur
FROM schema_groupe.horaireEquipe, schema_groupe.equipe, schema_groupe.equipe_etudiants, schema_groupe.validation
WHERE schema_groupe.horaireEquipe.equipe_id = schema_groupe.equipe.equipe_id
    AND schema_groupe.horaireEquipe.equipe_id = schema_groupe.equipe_etudiants.equipe_id
    AND schema_groupe.horaireEquipe.serial_unit_id = schema_groupe.validation.serial_unit_id
    AND schema_groupe.horaireEquipe.cipValideur = schema_groupe.validation.cipValideur
group by schema_groupe.equipe.no, schema_groupe.horaireequipe.hpassageprevue,
         schema_groupe.equipe.department_id, schema_groupe.equipe.trimester_id, schema_groupe.equipe.unit_id,
         schema_groupe.equipe.grouping, schema_groupe.horaireEquipe.hpassagereelle,
         schema_groupe.validation.dureePlageHoraire, schema_groupe.validation.local, schema_groupe.validation.cipvalideur;

AlTER VIEW
    ADD COLUMN new_column_name data_type constraint;

CREATE OR REPLACE VIEW extern_validation.validation AS
SELECT schema_groupe.unit.unit_id,schema_groupe.unit.department_id,schema_groupe.unit.trimester_id, schema_groupe.validation.cipValideur, schema_groupe.validation.local,
       array_agg(schema_groupe.horaireequipe.equipe_id), schema_groupe.validation.dureeplagehoraire,TIME '00:00:00' as retard
From ((schema_groupe.validation
LEFT JOIN schema_groupe.horaireequipe ON validation.serial_unit_id = horaireequipe.serial_unit_id and validation.cipvalideur = horaireequipe.cipvalideur)
INNER JOIN schema_groupe.unit ON validation.serial_unit_id = unit.serial_unit_id)
group by schema_groupe.unit.unit_id, schema_groupe.unit.department_id,schema_groupe.unit.trimester_id, schema_groupe.unit.department_id,
         schema_groupe.unit.unit_id, schema_groupe.validation.cipValideur, schema_groupe.validation.local, schema_groupe.validation.cipValideur,
         schema_groupe.validation.local, schema_groupe.validation.dureeplagehoraire;

--Create triggers
CREATE OR REPLACE FUNCTION extern_validation.delete_horaireEquipe()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$ BEGIN
    DELETE FROM schema_groupe.horaireEquipe
    WHERE serial_unit_id = old.serial_unit_id AND cipValideur = old.cipValideur AND equipe_id = old.equipe_id;
END $$;

CREATE TRIGGER delete_horaireEquipe
    INSTEAD OF DELETE on extern_validation.horaireEquipe
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.delete_horaireEquipe();

--Test trigger
-- DELETE FROM schema_groupe.horaireEquipe WHERE equipe_id = 15;