CREATE SCHEMA schema_groupe;

CREATE TABLE schema_groupe.validation
(
    cipValideur varchar(8) NOT NULL,
    department_id TEXT NOT NULL,
    trimester_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    local TEXT,
    dureePlageHoraire INTERVAL NOT NULL,
    PRIMARY KEY (cipValideur), FOREIGN KEY (cipValideur) REFERENCES extern_equipe.teachers(cip),
    PRIMARY KEY (department_id), FOREIGN KEY (department_id) REFERENCES extern_equipe.teachers(department_id),
    PRIMARY KEY (trimester_id), FOREIGN KEY (trimester_id) REFERENCES extern_equipe.teachers(trimester_id),
    PRIMARY KEY (unit_id), FOREIGN KEY (unit_id) REFERENCES extern_equipe.teachers(unit_id)
);

CREATE TABLE schema_groupe.horaire
(
    department_id TEXT NOT NULL,
    trimester_id TEXT NOT NULL,
    unit_id TEXT NOT NULL,
    grouping INT NOT NULL,
    no INT NOT NULL,
    PRIMARY KEY (department_id), FOREIGN KEY (department_id) REFERENCES extern_equipe.etudiants_equipe_unite(department_id),
    PRIMARY KEY (trimester_id), FOREIGN KEY (trimester_id) REFERENCES extern_equipe.etudiants_equipe_unite(trimester_id),
    PRIMARY KEY (unit_id), FOREIGN KEY (unit_id) REFERENCES extern_equipe.etudiants_equipe_unite(unit_id),
    PRIMARY KEY (grouping), FOREIGN KEY (grouping) REFERENCES extern_equipe.etudiants_equipe_unite(grouping),
    PRIMARY KEY (no), FOREIGN KEY (no) REFERENCES extern_equipe.etudiants_equipe_unite(no),

    cipValideur varchar(8) NOT NULL,
    PRIMARY KEY (cipValideur), FOREIGN KEY (cipValideur) REFERENCES extern_equipe.teachers(cip),

    val_HPassagePrevue DATE NOT NULL,
    val_HPassageReelle DATE NOT NULL
);

--Fill tables



--Create views
CREATE SCHEMA extern_validation;

CREATE VIEW extern_validation.validation AS
    SELECT department_id, trimester_id, unit_id, grouping, no, array_agg(cip)
    from extern_equipe.etudiants_equipe_unite
    group by
        department_id, trimester_id, unit_id, grouping, no;

