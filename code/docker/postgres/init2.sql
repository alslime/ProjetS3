CREATE SCHEMA extern_validation;

CREATE VIEW extern_validation.validation AS
    SELECT * FROM extern_equipe.equipes;