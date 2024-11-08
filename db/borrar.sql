-- tengo el siguiente catalogo o diccionario para correccion de errores en palabras o frases, la tabla se llama codificacion.cod_err_corr
-- | id  | erradas | corregidas | estado |
-- | 256 | acite   | aceite     | ACTIVO |
-- | 207 |  aroz   | arroz      | ACTIVO |
-- | 123 |  asucar | azucar     | ACTIVO |
-- | 945 |  aceo   | aseo       | ACTIVO |
-- | 115 |  alena  | arena      | ACTIVO |
-- |  45 |  cania  | caña       | ACTIVO |

-- tengo la siguiente tabla de palabras o frases erradas, la tabla se llama codificacion.cod_p49_p51
-- | id_p49_p51 | respuesta_ocu   | respuesta_act | respuesta_normalizada_ocu | respuesta_normalizada_act |
-- | 1          | acite de cania  | asucar        | acitedecania              | asucar                    |
-- | 2          | aroz con arena  | aseo          | arozconarena              | aseo                      |


-- Se debe corregir las palabras o frases erradas de la tabla codificacion.cod_p49_p51, con el catalogo o diccionario de correccion de errores codificacion.cod_err_corr
-- Las correcciones se deben normalizar, es decir, se deben pasar a minusculas y quitar espacios en blanco, acentos y caracteres especiales, y se debe guardar en la tabla codificacion.cod_p49_p51, en los campos: respuesta_normalizada_ocu y respuesta_normalizada_act
-- Los campos respuesta_ocu y respuesta_act de la tabla codificacion.cod_p49_p51 no se deben modificar, solo se deben normalizar los campos respuesta_normalizada_ocu y respuesta_normalizada_act corregidas
-- LAs palabras o frases erradas que no se encuentren en el catalogo o diccionario de correccion de errores codificacion.cod_err_corr, no se deben corregir, y se deben guardar en la tabla codificacion.cod_p49_p51, en los campos: respuesta_normalizada_ocu y respuesta_normalizada_act, con el mismo valor que los campos respuesta_ocu y respuesta_act respectivamente
-- La normalizacion de las palabras o frases erradas no debe cambiar el orden de las palabras o frases erradas, es decir, si la palabra o frase errada es "acite de cania", la palabra o frase normalizada debe ser "acitedecania", si la palabra o frase errada es "aroz con arena", la palabra o frase normalizada debe ser "arozconarena"
-- | id_p49_p51 | respuesta_ocu  | respuesta_act | respuesta_normalizada_ocu | respuesta_normalizada_act |
-- | 1          | acite de cania | asucar        | aceitedecania             | azucar                    |
-- | 2          | aroz con arena | aseo          | arrozconarena             | aseo                      |




-- crear la tabla codificacion.cod_err_corr
CREATE TABLE codificacion.cod_err_corr
(
    id SERIAL PRIMARY KEY,
    erradas VARCHAR(100),
    corregidas VARCHAR(100),
    estado VARCHAR(100)
);
-- insertar datos en la tabla codificacion.cod_err_corr
INSERT INTO codificacion.cod_err_corr(erradas, corregidas, estado) VALUES
('acite', 'aceite', 'ACTIVO'),
('aroz', 'arroz', 'ACTIVO'),
('asucar', 'azucar', 'ACTIVO'),
('aceo', 'aseo', 'ACTIVO'),
('alena', 'arena', 'ACTIVO'),
('cania', 'caña', 'ACTIVO');

-- crear la tabla codificacion.cod_p49_p51
CREATE TABLE codificacion.cod_p49_p51
(
    id_p49_p51 SERIAL PRIMARY KEY,
    respuesta_ocu VARCHAR(100),
    respuesta_act VARCHAR(100),
    respuesta_normalizada_ocu VARCHAR(100),
    respuesta_normalizada_act VARCHAR(100)
);
-- insertar datos en la tabla codificacion.cod_p49_p51
INSERT INTO codificacion.cod_p49_p51(respuesta_ocu, respuesta_act) VALUES
('acite de cania', 'asucar'),
('aroz con arena', 'aseo');


-- adicionar una campo a una tabla
ALTER TABLE codificacion.cod_p49_p51 ADD COLUMN id_cod_err_corr INT;

-- sql para ver version de postgres
SELECT version();



-- extensiones de postgres
-- address_standardizer, se usa para estandarizar direcciones. ejemplo: 123 calle 45, ciudad
-- adminpack, se usa para administrar la base de datos.
