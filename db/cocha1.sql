-- Paso 1: Instalar la extensión
CREATE EXTENSION postgres_fdw;

-- Paso 2: Crear el servidor remoto
CREATE SERVER sr_trans_nal_p32esp -- Nombre del servidor
FOREIGN DATA WRAPPER postgres_fdw -- Tipo de servidor
OPTIONS (host '10.1.25.104', dbname 'db_transcripcion_cpv', port '5432'); -- Opciones de conexión: db_pando es el nombre de la base de datos remota

-- Paso 3: Crear el usuario mapeado
CREATE USER MAPPING FOR epaco -- Usuario local: el que se conecta al servidor local
SERVER sr_trans_nal_p32esp --  Nombre del servidor remoto, seria el que se creo en el paso 2
OPTIONS (user 'epaco', password 'maced8jG8658'); -- Usuario y contraseña del servidor remoto

-- Paso 4: Importar las tablas remotas
IMPORT FOREIGN SCHEMA db5  -- Esquema de la base de datos remota
FROM SERVER sr_trans_nal_p32esp -- Nombre del servidor remoto
INTO codificacion; -- Esquema de la base de datos local

-- Paso 5: Consultar las tablas remotas
SELECT * FROM public.tabla_remota;



-- Pasos para crear una tabla materializada
-- Paso 1: Crear la tabla materializada
CREATE MATERIALIZED VIEW codificacion.cod_p32esp_temp AS
SELECT * FROM codificacion.cod_p32esp;

-- Paso 2: Actualizar la tabla materializada
REFRESH MATERIALIZED VIEW codificacion.cod_p32esp_temp;

-- Paso 3: Consultar la tabla materializada
SELECT * FROM codificacion.cod_p32esp_temp;

-- Paso 4: Eliminar la tabla materializada
DROP MATERIALIZED VIEW codificacion.cod_p32esp_temp;

-- Paso 5: Eliminar el servidor rem
DROP SERVER
-- Paso 6: Eliminar la extensión
DROP EXTENSION postgres_fdw;

-- Paso 7: Eliminar el usuario mapeado
DROP USER MAPPING FOR epaco SERVER sr

-- Paso 8: Eliminar la tabla remota
DROP FOREIGN TABLE codificacion.cod_p32esp_temp;

-- Paso 9: Eliminar la tabla local
DROP TABLE codificacion.cod_p32esp_temp;

