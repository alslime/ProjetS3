--**********************************************************
--Create tables
--**********************************************************
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
    cip_prof VARCHAR(8) NOT NULL,
    CONSTRAINT u_unit UNIQUE (department_id,trimester_id,unit_id,cip_prof)
);
INSERT INTO schema_groupe.unit (department_id, trimester_id, unit_id, cip_prof)
    SELECT DISTINCT department_id, trimester_id, unit_id, cip
    FROM extern_equipe.teachers
    WHERE cip is not null;

CREATE TABLE schema_groupe.equipe
(
    equipe_id SERIAL PRIMARY KEY,
    serial_unit_id INT NOT NULL,
    grouping INT NOT NULL,
    no INT NOT NULL,
    nom TEXT,
    inscriptor TEXT,
    CONSTRAINT u_equipe UNIQUE (serial_unit_id,grouping,no)
);
INSERT INTO schema_groupe.equipe (serial_unit_id,grouping,no,nom,inscriptor)
    SELECT DISTINCT serial_unit_id,grouping,no,nom,inscriptor
    FROM  extern_equipe.equipes, schema_groupe.unit
    WHERE extern_equipe.equipes.department_id = schema_groupe.unit.department_id
        AND extern_equipe.equipes.trimester_id = schema_groupe.unit.trimester_id
        AND extern_equipe.equipes.unit_id = schema_groupe.unit.unit_id;

CREATE TABLE schema_groupe.equipe_etudiants
(
    equipe_id INT NOT NULL,
    cipEtudiant VARCHAR(8) NOT NULL,
    CONSTRAINT pk_equipe_etudiants PRIMARY KEY (equipe_id,cipEtudiant)
);
INSERT INTO schema_groupe.equipe_etudiants
SELECT DISTINCT equipe_id,schema_groupe.usagers.cip
FROM schema_groupe.equipe,
     schema_groupe.usagers,
     extern_equipe.etudiants_equipe_unite,
     schema_groupe.unit
WHERE schema_groupe.equipe.serial_unit_id = schema_groupe.unit.serial_unit_id
    AND extern_equipe.etudiants_equipe_unite.department_id = schema_groupe.unit.department_id
    and extern_equipe.etudiants_equipe_unite.trimester_id = schema_groupe.unit.trimester_id
    and extern_equipe.etudiants_equipe_unite.unit_id = schema_groupe.unit.unit_id
    and extern_equipe.etudiants_equipe_unite.no = schema_groupe.equipe.no
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
    retard INTERVAL,
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
    estTerminee BOOL NOT NULL
);

--**********************************************************
--Create views
--**********************************************************
CREATE SCHEMA extern_validation;

CREATE OR REPLACE VIEW extern_validation.unit_infoMadeUp AS
SELECT DISTINCT department_id,
                trimester_id,
                's6eapp1' as unit_id,
                cip_prof,
                '2021/01/01'::date as debut,
                '2023/01/01'::date as fin,
                '2022/07/20'::date as dateValid,
                '09:30:00'::time as heure_debut,
                '3:00:00'::interval as temps,
                'C1-5028' as local
FROM schema_groupe.unit
WHERE department_id = '1808' AND
      trimester_id = 'E22' AND
      cip_prof = 'boua2511';

CREATE OR REPLACE VIEW extern_validation.equipe_etudiants AS
SELECT DISTINCT department_id, trimester_id, unit_id, cipetudiant, no, grouping
FROM schema_groupe.equipe_etudiants, schema_groupe.equipe, schema_groupe.unit
WHERE equipe.equipe_id = schema_groupe.equipe_etudiants.equipe_id AND
        equipe.serial_unit_id = unit.serial_unit_id;

CREATE OR REPLACE VIEW extern_validation.horaireEquipe AS
SELECT DISTINCT no,
       CAST(concat(string_agg(cipetudiant,',')) as VARCHAR) as membres,
       department_id,
       trimester_id,
       unit_id,
       grouping,
       dureePlageHoraire,
       local,
       horaireequipe.cipvalideur,
       retard,
       hpassageprevue,
       estterminee
FROM schema_groupe.horaireequipe
         INNER JOIN schema_groupe.equipe
                    ON horaireequipe.equipe_id = equipe.equipe_id
         INNER JOIN schema_groupe.equipe_etudiants
                    ON horaireequipe.equipe_id = equipe_etudiants.equipe_id
         INNER JOIN schema_groupe.unit
                    ON horaireequipe.serial_unit_id = unit.serial_unit_id
         INNER JOIN schema_groupe.validation
                    ON horaireequipe.serial_unit_id = validation.serial_unit_id and horaireequipe.cipvalideur = validation.cipvalideur
group by equipe.equipe_id, unit.serial_unit_id, validation.dureeplagehoraire,
         validation.local, horaireequipe.cipvalideur, validation.retard,
         horaireequipe.hpassageprevue,horaireequipe.estterminee;

CREATE OR REPLACE VIEW extern_validation.validation AS
SELECT DISTINCT schema_groupe.unit.unit_id,
       schema_groupe.unit.department_id,
       schema_groupe.unit.trimester_id,
       schema_groupe.validation.cipValideur,
       schema_groupe.validation.local,
       schema_groupe.validation.dureeplagehoraire,
       schema_groupe.validation.retard
From ((schema_groupe.validation
    LEFT JOIN schema_groupe.horaireequipe ON validation.serial_unit_id = horaireequipe.serial_unit_id and validation.cipvalideur = horaireequipe.cipvalideur)
    INNER JOIN schema_groupe.unit ON validation.serial_unit_id = unit.serial_unit_id);

CREATE OR REPLACE VIEW extern_validation.equipe_unit AS
SELECT schema_groupe.equipe.no,
       schema_groupe.unit.department_id,
       schema_groupe.unit.trimester_id,
       schema_groupe.unit.unit_id,
       schema_groupe.equipe.grouping,
       schema_groupe.unit.cip_prof
FROM schema_groupe.equipe,
     schema_groupe.unit
WHERE schema_groupe.equipe.serial_unit_id = schema_groupe.unit.serial_unit_id;

--**********************************************************
--Create triggers
--**********************************************************
CREATE OR REPLACE FUNCTION extern_validation.insert_horaireEquipe()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $BODY$ BEGIN
    INSERT INTO schema_groupe.horaireEquipe(serial_unit_id,
                                            cipvalideur,
                                            equipe_id,
                                            hpassageprevue,
                                            estterminee)
    SELECT schema_groupe.unit.serial_unit_id,
           new.cipValideur,
           schema_groupe.equipe.equipe_id,
           new.hpassageprevue,
           FALSE
    FROM schema_groupe.equipe,
         schema_groupe.validation,
         schema_groupe.unit
    WHERE schema_groupe.equipe.serial_unit_id = schema_groupe.validation.serial_unit_id
            AND schema_groupe.equipe.serial_unit_id = schema_groupe.unit.serial_unit_id
            AND new.trimester_id = schema_groupe.unit.trimester_id
            AND new.department_id = schema_groupe.unit.department_id
            AND new.unit_id = schema_groupe.unit.unit_id
            AND new.grouping = schema_groupe.equipe.grouping
            AND new.no = schema_groupe.equipe.no
            AND new.cipvalideur = schema_groupe.validation.cipvalideur;
    RETURN NULL;
END $BODY$;

CREATE TRIGGER insert_horaireEquipe
    INSTEAD OF INSERT ON extern_validation.horaireEquipe
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.insert_horaireEquipe();

CREATE OR REPLACE FUNCTION extern_validation.update_horaireEquipe()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $BODY$ BEGIN
    UPDATE schema_groupe.horaireEquipe
    SET serial_unit_id=schema_groupe.equipe.serial_unit_id,
        cipvalideur=new.cipvalideur,
        equipe_id=schema_groupe.equipe.equipe_id,
        hpassageprevue=new.hpassageprevue,
        estterminee=new.estterminee
    FROM schema_groupe.validation, schema_groupe.equipe, schema_groupe.unit
    WHERE schema_groupe.horaireEquipe.serial_unit_id = schema_groupe.equipe.serial_unit_id
      AND new.cipvalideur = schema_groupe.horaireEquipe.cipValideur
      AND schema_groupe.horaireEquipe.equipe_id = schema_groupe.equipe.equipe_id
      AND schema_groupe.equipe.serial_unit_id = schema_groupe.validation.serial_unit_id
      AND schema_groupe.equipe.serial_unit_id = schema_groupe.unit.serial_unit_id
      AND new.trimester_id = schema_groupe.unit.trimester_id
      AND new.department_id = schema_groupe.unit.department_id
      AND new.unit_id = schema_groupe.unit.unit_id
      AND new.grouping = schema_groupe.equipe.grouping
      AND new.no = schema_groupe.equipe.no
      AND new.cipvalideur = schema_groupe.validation.cipvalideur;
    RETURN NULL;
END $BODY$;

CREATE TRIGGER update_horaireEquipe
    INSTEAD OF UPDATE ON extern_validation.horaireEquipe
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.update_horaireEquipe();

CREATE OR REPLACE FUNCTION extern_validation.insert_validation()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $BODY$ BEGIN
    INSERT INTO schema_groupe.validation(serial_unit_id,
                                            cipvalideur,
                                            local,
                                            dureePlageHoraire,
                                            retard)
    SELECT schema_groupe.unit.serial_unit_id,
           new.cipValideur,
           new.local,
           new.dureePlageHoraire,
           '0:0'
    FROM schema_groupe.unit
    WHERE new.trimester_id = schema_groupe.unit.trimester_id
      AND new.department_id = schema_groupe.unit.department_id
      AND new.unit_id = schema_groupe.unit.unit_id;
    RETURN NULL;
END $BODY$;

CREATE TRIGGER insert_validation
    INSTEAD OF INSERT ON extern_validation.validation
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.insert_validation();

CREATE OR REPLACE FUNCTION extern_validation.update_validation()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $BODY$ BEGIN
    UPDATE schema_groupe.validation
    SET local = new.local,
        dureePlageHoraire = new.dureeplagehoraire,
        retard = new.retard
    FROM schema_groupe.unit
    WHERE new.cipValideur = schema_groupe.validation.cipValideur
      AND schema_groupe.unit.serial_unit_id = schema_groupe.validation.serial_unit_id
      AND new.trimester_id = schema_groupe.unit.trimester_id
      AND new.department_id = schema_groupe.unit.department_id
      AND new.unit_id = schema_groupe.unit.unit_id;
    RETURN NULL;
END $BODY$;

CREATE TRIGGER update_validation
    INSTEAD OF UPDATE ON extern_validation.validation
    FOR EACH ROW EXECUTE PROCEDURE extern_validation.update_validation();

--**********************************************************
--TESTS
--**********************************************************
-- INSERT INTO extern_validation.validation(trimester_id,department_id,unit_id,cipvalideur,local,dureeplagehoraire)
--     VALUES ('E22',1808,'s6eapp1','houj1308','C1-3021','0:45:0');
--
-- INSERT INTO extern_validation.horaireEquipe(trimester_id,department_id,unit_id,cipvalideur,grouping,no,hpassageprevue)
--     VALUES ('E22',1808,'s6eapp1','houj1308',1,1,'4:30:00');
-- INSERT INTO extern_validation.horaireEquipe(trimester_id,department_id,unit_id,cipvalideur,grouping,no,hpassageprevue)
-- VALUES ('E22',1808,'s6eapp1','houj1308',1,2,'4:30:00');
-- INSERT INTO extern_validation.horaireEquipe(trimester_id,department_id,unit_id,cipvalideur,grouping,no,hpassageprevue)
-- VALUES ('E22',1808,'s6eapp1','houj1308',1,3,'4:30:00');
-- INSERT INTO extern_validation.horaireEquipe(trimester_id,department_id,unit_id,cipvalideur,grouping,no,hpassageprevue)
-- VALUES ('E22',1808,'s6eapp1','houj1308',1,4,'4:30:00');
--
-- INSERT INTO extern_validation.horaireEquipe(trimester_id,department_id,unit_id,cipvalideur,grouping,no,hpassageprevue)
-- SELECT DISTINCT validation.trimester_id,validation.department_id,validation.unit_id,cipvalideur,grouping,no,CAST('4:30:00' as interval)
-- FROM extern_validation.equipe_unit, extern_validation.validation
-- WHERE validation.trimester_id = 'E22' AND equipe_unit.trimester_id = validation.trimester_id AND
--       validation.department_id = '1809' AND equipe_unit.department_id = validation.department_id AND
--       validation.unit_id = 's6eapp1' AND equipe_unit.unit_id = validation.unit_id AND
--       NOT EXISTS(SELECT * FROM extern_validation.horaireEquipe);

-- SELECT validation.trimester_id,
--        validation.department_id,
--        validation.unit_id,
--        cip_prof,
--        grouping,
--        no,
--        (SELECT DISTINCT heure_debut
--         FROM extern_validation.unit_infoMadeUp
--         WHERE trimester_id = 'E22'
--           AND department_id = '1808'
--           AND unit_id = 's6eapp1'
--           AND cip_prof = 'boua2511')::interval + make_interval(mins =>((no-1)*EXTRACT(minutes from (SELECT Distinct dureeplagehoraire
--                                                           FROM extern_validation.validation))::INTEGER)) as dure
-- FROM extern_validation.validation INNER JOIN extern_validation.equipe_unit
--                                              ON
--                                                          validation.trimester_id = equipe_unit.trimester_id AND
--                                                          validation.department_id = equipe_unit.department_id AND
--                                                          validation.unit_id = equipe_unit.unit_id AND
--                                                          validation.cipvalideur = equipe_unit.cip_prof
-- WHERE validation.trimester_id = 'E22'
--   AND validation.department_id = '1808'
--   AND validation.unit_id = 's6eapp1'
--   AND validation.cipvalideur = 'boua2511';

SELECT * From extern_validation.horaireEquipe



