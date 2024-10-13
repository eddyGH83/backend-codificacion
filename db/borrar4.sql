-- tengo una tabla llamada codificacion.cod_p49_p51, con informacion:
-- | id_p49_p51 | respuesta_ocu   | respuesta_act | consecutivo |
-- | 345hjgfyd  | acite de cania  | asucar        | null        |
-- | 045h00fyd  | aroz con arena  | aseo          | null        |
-- | 399hjfghd  | acite de cania  | asucar        | null        |
-- | hj6dfguy8  | acite de cania  | asucar        | null        |


-- El campo consecutivo se debe rrellenar con numeros de 1 en adelante (de forma manual), de acuerdo a la cantidad de registros de la tabla codificacion.cod_p49_p51
-- | id_p49_p51 | respuesta_ocu   | respuesta_act | consecutivo |
-- | 345hjgfyd  | acite de cania  | asucar        | 1           |
-- | 045h00fyd  | aroz con arena  | aseo          | 2           |
-- | 399hjfghd  | acite de cania  | asucar        | 3           |
-- | hj6dfguy8  | acite de cania  | asucar        | 4           |


-- la consulta para actualizar el campo consecutivo de la tabla codificacion.cod_p49_p51 es:
-- UPDATE codificacion.cod_p49_p51 SET consecutivo = 1 WHERE id_p49_p51 = '345hjgfyd';



-- adicionar una campo a una tabla en postgresql int4
ALTER TABLE codificacion.cod_p49_p51 ADD COLUMN consecutivo INT4;

-----------------
codificacion.cod_p32esp
codificacion.cod_p331
codificacion.cod_p332
codificacion.cod_p333
codificacion.cod_p341
codificacion.cod_p352a
codificacion.cod_p353
codificacion.cod_p362a
codificacion.cod_p363
codificacion.cod_p372a
codificacion.cod_p373
codificacion.cod_p48esp
codificacion.cod_p49_p51
codificacion.cod_p52esp




-- adicionar una campo a una tabla en postgresql int4
ALTER TABLE codificacion.cod_p20esp_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p32esp_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p331_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p332_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p333_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p341_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p352a_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p353_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p362a_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p363_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p372a_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p373_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p48esp_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p49_p51_temp ADD COLUMN id_codificacion INT4;
ALTER TABLE codificacion.cod_p52esp_temp ADD COLUMN id_codificacion INT4;




-- eliminar registros de las tablas temporales
DELETE FROM codificacion.cod_p20esp_temp;
DELETE FROM codificacion.cod_p32esp_temp;
DELETE FROM codificacion.cod_p331_temp;
DELETE FROM codificacion.cod_p332_temp;
DELETE FROM codificacion.cod_p333_temp;
DELETE FROM codificacion.cod_p341_temp;
DELETE FROM codificacion.cod_p352a_temp;
DELETE FROM codificacion.cod_p353_temp;
DELETE FROM codificacion.cod_p362a_temp;
DELETE FROM codificacion.cod_p363_temp;
DELETE FROM codificacion.cod_p372a_temp;
DELETE FROM codificacion.cod_p373_temp;
DELETE FROM codificacion.cod_p48esp_temp;
DELETE FROM codificacion.cod_p49_p51_temp;
DELETE FROM codificacion.cod_p52esp_temp;


-- select * from codificacion.cod_p20esp_temp;



