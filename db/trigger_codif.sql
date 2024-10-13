------------------------------------------ TRIGGER: trgr_p20esp ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p20esp() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_emigracion
        SET p202esp_cod = NEW.codigocodif_v2
        WHERE 
          i00 = NEW.i00
          AND p20nro = NEW.p20nro
          AND trim(p202esp) = trim(NEW.respuesta); -- NEW.respuesta es el valor de la columna respuesta de la tabla codificacion.cod_p20esp
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_emigracion
        SET p202esp_cod = NEW.codigocodif_v1
        WHERE 
          i00 = NEW.i00
          AND p20nro = NEW.p20nro
          AND trim(p202esp) = trim(NEW.respuesta);
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_emigracion
        SET p202esp_cod = NEW.codigocodif
        WHERE 
          i00 = NEW.i00
          AND p20nro = NEW.p20nro
          AND trim(p202esp) = trim(NEW.respuesta);
    ELSE
        UPDATE estructuras.inicial0_capitulo_emigracion
        SET p202esp_cod = NULL
        WHERE 
          i00 = NEW.i00
          AND p20nro = NEW.p20nro
          AND trim(p202esp) = trim(NEW.respuesta);
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trgr_p20esp -- Nombre del trigger
AFTER UPDATE OF codigocodif, codigocodif_v1, codigocodif_v2 ON codificacion.cod_p20esp -- Tabla que dispara el trigger, 
                                                                                       -- se dispara cuando se actualiza los campos codigocodif, codigocodif_v1, codigocodif_v2 
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p20esp(); -- Función que se ejecuta

-----------------------------------------------------------------------
AFTER UPDATE OF codigocodif, codigocodif_v1, codigocodif_v2 ON codificacion.cod_p20esp


-- comando between ejemplo sql
-- SELECT * FROM codificacion.cod_p20esp WHERE secuencial BETWEEN 1 AND 10;



















------------------------------------------ TRIGGER: trgr_p32esp ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p32esp() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p32esp_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p32esp_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p32esp_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p32esp_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trgr_p32esp -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p32esp -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p32esp(); -- Función que se ejecuta




-- Coonsultas
SELECT * FROM codificacion.cod_p32esp WHERE secuencial =112878  AND i00='01536882' AND nro='768247'
SELECT p32esp_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =112878  AND i00='01536882' AND nro='768247'
UPDATE codificacion.cod_p32esp SET codigocodif_v2='333' WHERE secuencial =112878  AND i00='01536882' AND nro='768247' -- update
--
SELECT * FROM codificacion.cod_p32esp cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial






------------------------------------------ TRIGGER: trgr_p331 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p331() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p331_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p331_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p331_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p331_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trgr_p331 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p331 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p331(); -- Función que se ejecuta








------------------------------------------ TRIGGER: trgr_p332 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p332() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p332_cod = NEW.codigocodif_v2
        WHERE  nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p332_cod = NEW.codigocodif_v1
        WHERE  nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p332_cod = NEW.codigocodif
        WHERE  nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p332_cod = NULL
        WHERE  nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trgr_p332 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p332 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p332(); -- Función que se ejecuta







------------------------------------------ TRIGGER: trgr_p333 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p333() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p333_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p333_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p333_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p333_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;




-- Crear el trigger
CREATE TRIGGER trgr_p333 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p333 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p333(); -- Función que se ejecuta


-- Consultas
SELECT * FROM codificacion.cod_p333 WHERE secuencial =16138  AND i00='01269932' AND nro='126321'
SELECT p333_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =16138  AND i00='01269932' AND nro='126321'
UPDATE codificacion.cod_p333 SET codigocodif_v2='111' WHERE secuencial =16138  AND i00='01269932' AND nro='126321' -- update
-- 
SELECT * FROM codificacion.cod_p333 cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial








------------------------------------------ TRIGGER: trgr_341 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p341() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p341_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p341_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p341_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p341_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p341 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p341 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p341(); -- Función que se ejecuta



-- Consultas
SELECT * FROM codificacion.cod_p341 WHERE secuencial =16273  AND i00='01252732' AND nro='127398'
SELECT p341_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =16273  AND i00='01252732' AND nro='127398'
UPDATE codificacion.cod_p341 SET codigocodif_v2='4004' WHERE secuencial =16273  AND i00='01252732' AND nro='127398' -- update
-- 
SELECT * FROM codificacion.cod_p352a cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial






------------------------------------------ TRIGGER: trgr_p352a ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p352a() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p35a_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p35a_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p35a_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p35a_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p352a -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p352a -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p352a(); -- Función que se ejecuta









------------------------------------------ TRIGGER: trgr_p353 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p353() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p353_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p353_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p353_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p353_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p353 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p353 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p353(); -- Función que se ejecuta



-- Consultas
SELECT * FROM codificacion.cod_p353 WHERE secuencial =112633  AND i00='01519635' AND nro='767702'
SELECT p353_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =112633  AND i00='01519635' AND nro='767702'
UPDATE codificacion.cod_p353 SET codigocodif_v2=null WHERE  secuencial =112633  AND i00='01519635' AND nro='767702' -- update
-- 
SELECT * FROM codificacion.cod_p353 cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial





------------------------------------------ TRIGGER: trgr_p362a ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p362a() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p36a_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p36a_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p36a_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p36a_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p362a -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p362a -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p362a(); -- Función que se ejecuta



-- Consultas
SELECT * FROM codificacion.cod_p362a WHERE secuencial =18327  AND i00='01263110' AND nro='143351'
SELECT p36a_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =18327  AND i00='01263110' AND nro='143351'
UPDATE codificacion.cod_p362a SET codigocodif='5' WHERE secuencial =18327  AND i00='01263110' AND nro='143351' -- update
-- 
SELECT * FROM codificacion.cod_p362a cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial







------------------------------------------ TRIGGER: trgr_p363 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p363() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p363_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p363_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p363_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p363_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p363 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p363 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p363(); -- Función que se ejecuta





-- Consultas
SELECT * FROM codificacion.cod_p363 WHERE secuencial =85259  AND i00='01532173' AND nro='658574'
SELECT p363_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =85259  AND i00='01532173' AND nro='658574'
UPDATE codificacion.cod_p363 SET codigocodif_v2='030' WHERE  secuencial =85259  AND i00='01532173' AND nro='658574' -- update
-- 
SELECT * FROM codificacion.cod_p363 cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial









------------------------------------------ TRIGGER: trgr_p372a ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p372a() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p372a_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p372a_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p372a_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p372a_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p372a -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p372a -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p372a(); -- Función que se ejecuta






-- Consultas
SELECT * FROM codificacion.cod_p372a WHERE secuencial =19419  AND i00='01252910' AND nro='152017'
SELECT p372a_cod  FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =19419  AND i00='01252910' AND nro='152017'
UPDATE codificacion.cod_p372a SET codigocodif_v2='51' WHERE secuencial =19419  AND i00='01252910' AND nro='152017' -- update
-- 
SELECT * FROM codificacion.cod_p372a cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial














------------------------------------------ TRIGGER: trgr_p373 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p373() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p373_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p373_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p373_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p373_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p373 -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p373 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p373(); -- Función que se ejecuta



-- Consultas
SELECT * FROM codificacion.cod_p373 WHERE secuencial =85259  AND i00='01532173' AND nro='658575'
SELECT p373_cod FROM estructuras.inicial0_capitulo_personas  WHERE  secuencial =85259  AND i00='01532173' AND nro='658575'
UPDATE codificacion.cod_p373 SET codigocodif_v2 = '666766' WHERE  secuencial =85259  AND i00='01532173' AND nro='658575'-- update
-- 
SELECT * FROM codificacion.cod_p373 cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial





-- TRIGGER: OK
------------------------------------------ TRIGGER: trgr_p48esp ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p48esp() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p48esp_cod = NEW.codigocodif_v2
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1 IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p48esp_cod = NEW.codigocodif_v1
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p48esp_cod = NEW.codigocodif
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p48esp_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p48esp -- Nombre del trigger
AFTER UPDATE ON codificacion.cod_p48esp -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p48esp(); -- Función que se ejecuta








-- Consultas
SELECT * FROM codificacion.cod_p48esp WHERE secuencial =85259  AND i00='01532173' AND nro='658574'
SELECT p48esp_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =85259  AND i00='01532173' AND nro='658574'
UPDATE codificacion.cod_p48esp SET codigocodif_v2='5' WHERE  secuencial =85259  AND i00='01532173' AND nro='658574' -- update
-- 
SELECT * FROM codificacion.cod_p48esp cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial



















------------------------------------------ TRIGGER: trgr_p49 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p49() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2_ocu IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p49_cod = NEW.codigocodif_v2_ocu
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1_ocu IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p49_cod = NEW.codigocodif_v1_ocu
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_ocu IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p49_cod = NEW.codigocodif_ocu
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p49_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p49 -- Nombre del trigger
AFTER UPDATE OF codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu ON codificacion.cod_p49_p51 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p49(); -- Función que se ejecuta
















-- Consultas
SELECT codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu FROM codificacion.cod_p49_p51 cpp WHERE secuencial =91575157  AND i00='02813915' AND nro='91576101'
SELECT p49_cod FROM estructuras.inicial0_capitulo_personas WHERE secuencial =91575157  AND i00='02813915' AND nro='91576101'
UPDATE codificacion.cod_p49_p51 SET codigocodif_v2_ocu='1195' WHERE secuencial =91575157  AND i00='02813915' AND nro='91576101' -- update
-- 
SELECT * FROM codificacion.cod_p49_p51  cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial





SELECT 
	CASE p41a 
	WHEN 'Ninguno' THEN 1
 WHEN 'Curso de alfabetizacion'  THEN 2
 WHEN 'Inicial'  THEN 3
 WHEN 'Basico' THEN 4
 WHEN 'Intermedio' THEN 5
 WHEN 'Medio' THEN 6
 WHEN 'Primaria' THEN 7
 WHEN 'Secundaria' THEN 8
 WHEN 'Tecnico Medio' THEN 9
 WHEN 'Tecnico Superior' THEN 10
 WHEN 'Licenciatura' THEN 11
 WHEN 'Maestria' THEN 12
 WHEN 'Doctorado' THEN 13
 
 
 
	ELSE NULL END p41a 
FROM codificacion.cod_p49_p51







------------------------------------------ TRIGGER: trgr_p51 ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p51() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2_act IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p51_cod = NEW.codigocodif_v2_act
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_v1_act IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p51_cod = NEW.codigocodif_v1_act
        WHERE nro = NEW.nro;
    ELSIF NEW.codigocodif_act IS NOT NULL THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p51_cod = NEW.codigocodif_act
        WHERE nro = NEW.nro;
    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p51_cod = NULL
        WHERE nro = NEW.nro;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
-- Crear el trigger
CREATE TRIGGER trgr_p51 -- Nombre del trigger
AFTER UPDATE OF codigocodif_act, codigocodif_v1_act, codigocodif_v2_act ON codificacion.cod_p49_p51 -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p51(); -- Función que se ejecuta















-- Consultas
SELECT codigocodif_act, codigocodif_v1_act, codigocodif_v2_act FROM codificacion.cod_p49_p51 cpp WHERE secuencial =91315968  AND i00='01524303' AND nro='91316435'
SELECT p49 p51_cod FROM estructuras.inicial0_capitulo_personas WHERE secuencial =91315968  AND i00='01524303' AND nro='91316435'
UPDATE codificacion.cod_p49_p51 SET codigocodif_v2_act='1195' WHERE secuencial =91315968  AND i00='01524303' AND nro='91316435'-- update
-- 
SELECT * FROM codificacion.cod_p49_p51  cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial









-- funcion sql de postgresql para averiguar el tamaño de una cadena
SELECT LENGTH('hola mundo') AS longitud; -- 10




------------------------------------------ TRIGGER: trgr_p52esp ------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.trgr_p52esp() RETURNS TRIGGER -- Función que se ejecuta
AS
$$
BEGIN
    IF NEW.codigocodif_v2 IS NOT NULL AND LENGTH(NEW.codigocodif_v2) = 3 THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NEW.codigocodif_v2, p52_pais_cod = NEW.respuesta
        WHERE nro = NEW.nro;

    ELSIF NEW.codigocodif_v2 IS NOT NULL AND LENGTH(NEW.codigocodif_v2) <> 3 THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NEW.codigocodif_v2, p52_mun_cod = NEW.respuesta
        WHERE nro = NEW.nro;
    
    ELSIF NEW.codigocodif_v1 IS NOT NULL AND LENGTH(NEW.codigocodif_v1) = 3 THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NEW.codigocodif_v1, p52_pais_cod = NEW.respuesta
        WHERE nro = NEW.nro;

    ELSIF NEW.codigocodif_v1 IS NOT NULL AND LENGTH(NEW.codigocodif_v1) <> 3 THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NEW.codigocodif_v1, p52_mun_cod = NEW.respuesta
        WHERE nro = NEW.nro;

    ELSIF NEW.codigocodif IS NOT NULL AND LENGTH(NEW.codigocodif) = 3 THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NEW.codigocodif, p52_pais_cod = NEW.respuesta
        WHERE nro = NEW.nro;

    ELSIF NEW.codigocodif IS NOT NULL AND LENGTH(NEW.codigocodif) <> 3 THEN
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NEW.codigocodif, p52_mun_cod = NEW.respuesta
        WHERE nro = NEW.nro;

    ELSE
        UPDATE estructuras.inicial0_capitulo_personas
        SET p52esp_cod = NULL, p52_pais_cod = NULL, p52_mun_cod = NULL
        WHERE nro = NEW.nro;
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Crear el trigger
CREATE TRIGGER trgr_p52esp -- Nombre del trigger
AFTER UPDATE OF codigocodif, codigocodif_v1, codigocodif_v2 ON codificacion.cod_p52esp -- Tabla que dispara el trigger
FOR EACH ROW -- Por cada fila
EXECUTE FUNCTION codificacion.trgr_p52esp(); -- Función que se ejecuta











-- Consultas
SELECT * FROM codificacion.cod_p52esp WHERE secuencial =85259  AND i00='01532173' AND nro='658574'
SELECT p52esp_cod FROM estructuras.inicial0_capitulo_personas  WHERE secuencial =85259  AND i00='01532173' AND nro='658574'
UPDATE codificacion.cod_p52esp SET codigocodif_v1='5000' WHERE secuencial =85259  AND i00='01532173' AND nro='658574' -- update
-- 
SELECT * FROM codificacion.cod_p52esp cpe
INNER JOIN estructuras.inicial0_capitulo_personas icp 
ON cpe.secuencial =icp.secuencial





