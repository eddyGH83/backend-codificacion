------------------------------------------------------------------------------------------------
-- FUNCION PARA NORMALIZAR variables simples y doble
------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.fn_normalizacion_simple_doble_aut() RETURNS void AS $$
BEGIN

    UPDATE codificacion.cod_p20esp_temp2 SET respuesta_normalizada = REGEXP_REPLACE(unaccent(lower(respuesta)), '[^\w]{1,}', '', 'g') WHERE NOT respuesta_normalizada IS NULL;  

END;
$$ LANGUAGE plpgsql;






------------------------------------------------------------------------------------------------
-- FUNCION PARA INSERTAR DATOS EN LA TABLA codificacion.cod_p49_p51_temp DE LA TABLA 
-- estructuras.inicial0_capitulo_personas
------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.fn_insercion_simple_doble_aut(cod_depto_param TEXT, carga_param INT) RETURNS void AS $$
BEGIN


    -- INSERCIÓN codificacion.cod_p20esp_temp2
    INSERT INTO codificacion.cod_p20esp_temp2(
        sec_cuestionario, i00, i001a, p20nro, respuesta, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        sec_cuestionario, i00, i001a, p20nro, p202esp, 'ELABORADO', 'admin', now(), 
        (CASE cc.cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END),
        0, 
        segmento, 
        carga_param
    FROM estructuras.inicial0_capitulo_emigracion cc
    WHERE NOT p202esp IS NULL 
        AND TRIM(p202esp) <> '' 
        AND NOT EXISTS (
            SELECT id_p20esp 
            FROM codificacion.cod_p20esp cp 
            WHERE cp.sec_cuestionario = cc.sec_cuestionario 
                AND cp.i00 = cc.i00 
                AND cp.p20nro = cc.p20nro
        )
        AND cc.cod_depto = cod_depto_param;

       



    -- INSERCIÓN codificacion.cod_p32esp_temp2
    INSERT INTO codificacion.cod_p32esp_temp2(
        secuencial, i00, i001a, nro, respuesta, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p32esp, 
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,
        0,
        segmento,
        carga_param
    FROM estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p32esp IS NULL 
        AND TRIM(p32esp) <> ''
        AND NOT EXISTS (
            SELECT id_p32esp 
            FROM codificacion.cod_p32esp_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;








    -- INSERCIÓN codificacion.cod_p331_temp2
    INSERT INTO codificacion.cod_p331_temp2(
        secuencial, i00, i001a, nro, respuesta, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p331, 
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,
        0,
        segmento,
        carga_param       
    FROM estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p331 IS NULL 
        AND TRIM(p331) <> ''
        AND NOT EXISTS (
            SELECT id_p331 
            FROM codificacion.cod_p331_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;




    -- INSERCIÓN codificacion.cod_p332_temp2
    INSERT INTO codificacion.cod_p332_temp2(
        secuencial, i00, i001a, nro, respuesta, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p332, 
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,
        0,
        segmento,
        carga_param
    FROM estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p332 IS NULL 
        AND TRIM(p332) <> ''
        AND NOT EXISTS (
            SELECT id_p332 
            FROM codificacion.cod_p332_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;





    -- INSERCIÓN codificacion.cod_p333_temp2
    INSERT INTO codificacion.cod_p333_temp2(
        secuencial, i00, i001a, nro, respuesta, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p333,  
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,
        0,
        segmento,
        carga_param
    FROM estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p333 IS NULL 
        AND TRIM(p333) <> ''
        AND NOT EXISTS (
            SELECT id_p333 
            FROM codificacion.cod_p333_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;




    -- INSERCIÓN codificacion.cod_p334_temp2
    INSERT INTO codificacion.cod_p341_temp2(
        secuencial, i00, i001a, nro, respuesta, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p341,  
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,
        0,
        segmento,
        carga_param
    FROM estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p341 IS NULL 
        AND TRIM(p341) <> ''
        AND NOT EXISTS (
            SELECT id_p341 
            FROM codificacion.cod_p341_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;








    -- INSERCIÓN codificacion.cod_p342_temp2
    INSERT INTO codificacion.cod_p352a_temp2(
        secuencial, i00, i001a, nro, respuesta, p352b, p353, estado, usucre, feccre, departamento, orden, apoyo, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p352a, 
        CASE p352b 
            WHEN '1' THEN 'CHUQUISACA' 
            WHEN '2' THEN 'LA PAZ'
            WHEN '3' THEN 'COCHABAMBA' 
            WHEN '4' THEN 'ORURO' 
            WHEN '5' THEN 'POTOSI' 
            WHEN '6' THEN 'TARIJA'
            WHEN '7' THEN 'SANTA CRUZ'
            WHEN '8' THEN 'BENI'
            WHEN '9' THEN 'PANDO' 
            ELSE NULL 
        END AS p352b, 
        p353, 	
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END AS departamento,		
        0,
        CASE p352b 
            WHEN '1' THEN '01' 
            WHEN '2' THEN '02' 
            WHEN '3' THEN '03' 
            WHEN '4' THEN '04' 
            WHEN '5' THEN '05' 
            WHEN '6' THEN '06' 
            WHEN '7' THEN '07' 
            WHEN '8' THEN '08' 
            WHEN '9' THEN '09' 
            ELSE NULL 
        END AS apoyo, 
        segmento,
        carga_param
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p352a IS NULL 
        AND TRIM(p352a) <> ''
        AND NOT EXISTS (
            SELECT id_p352a 
            FROM codificacion.cod_p352a_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;





    -- INSERCIÓN codificacion.cod_p353_temp2
    INSERT INTO codificacion.cod_p353_temp2(
        secuencial, i00, i001a, nro, respuesta, p352a, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p353, 
        p352a,  
        'ELABORADO', 
        'admin', 
        now(),
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,		
        0,
        segmento,
        carga_param
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p353 IS NULL 
        AND TRIM(p353) <> ''
        AND NOT EXISTS (
            SELECT id_p353 
            FROM codificacion.cod_p353_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;







    -- INSERCIÓN codificacion.cod_p354_temp2
    INSERT INTO codificacion.cod_p362a_temp2(
        secuencial, i00, i001a, nro, respuesta, p362b, p363, estado, usucre, feccre, departamento, orden, apoyo, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p362a, 
        CASE p362b 
            WHEN '1' THEN 'CHUQUISACA' 
            WHEN '2' THEN 'LA PAZ'
            WHEN '3' THEN 'COCHABAMBA' 
            WHEN '4' THEN 'ORURO' 
            WHEN '5' THEN 'POTOSI' 
            WHEN '6' THEN 'TARIJA'
            WHEN '7' THEN 'SANTA CRUZ'
            WHEN '8' THEN 'BENI'
            WHEN '9' THEN 'PANDO' 
            ELSE NULL 
        END AS p362b,  
        p363, 	
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END AS departamento,	
        0,
        CASE p362b 
            WHEN '1' THEN '01' 
            WHEN '2' THEN '02' 
            WHEN '3' THEN '03' 
            WHEN '4' THEN '04' 
            WHEN '5' THEN '05' 
            WHEN '6' THEN '06' 
            WHEN '7' THEN '07' 
            WHEN '8' THEN '08' 
            WHEN '9' THEN '09' 
            ELSE NULL 
        END AS apoyo, 
        segmento,
        carga_param
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p362a IS NULL 
        AND TRIM(p362a) <> ''
        AND NOT EXISTS (
            SELECT id_p362a 
            FROM codificacion.cod_p362a_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;





    -- INSERCIÓN codificacion.cod_p363_temp2
    INSERT INTO codificacion.cod_p363_temp2(
        secuencial, i00, i001a, nro, respuesta, p362a, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p363, 
        p362a,  
        'ELABORADO', 
        'admin', 
        now(),
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,		
        0,
        segmento,
        carga_param
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p363 IS NULL 
        AND TRIM(p363) <> ''
        AND NOT EXISTS (
            SELECT id_p363 
            FROM codificacion.cod_p363_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;





    -- INSERCIÓN codificacion.cod_p364_temp2
    INSERT INTO codificacion.cod_p372a_temp2(
        secuencial, i00, i001a, nro, respuesta, p372b, p373, estado, usucre, feccre, departamento, orden, apoyo, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p372a, 
        CASE p372b 
            WHEN '1' THEN 'CHUQUISACA' 
            WHEN '2' THEN 'LA PAZ'
            WHEN '3' THEN 'COCHABAMBA' 
            WHEN '4' THEN 'ORURO' 
            WHEN '5' THEN 'POTOSI' 
            WHEN '6' THEN 'TARIJA'
            WHEN '7' THEN 'SANTA CRUZ'
            WHEN '8' THEN 'BENI'
            WHEN '9' THEN 'PANDO' 
            ELSE NULL 
        END AS p372b,  
        p373, 	
        'ELABORADO', 
        'admin', 
        now(),
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END AS departamento,	
        0,
        CASE p372b 
            WHEN '1' THEN '01' 
            WHEN '2' THEN '02' 
            WHEN '3' THEN '03' 
            WHEN '4' THEN '04' 
            WHEN '5' THEN '05' 
            WHEN '6' THEN '06' 
            WHEN '7' THEN '07' 
            WHEN '8' THEN '08' 
            WHEN '9' THEN '09' 
            ELSE NULL 
        END AS apoyo, 
        segmento,
        carga_param,
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p372a IS NULL 
        AND TRIM(p372a) <> ''
        AND NOT EXISTS (
            SELECT id_p372a 
            FROM codificacion.cod_p372a_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;





    -- INSERCIÓN codificacion.cod_p373_temp2
    INSERT INTO codificacion.cod_p373_temp2(
        secuencial, i00, i001a, nro, respuesta, p372a, estado, usucre, feccre, departamento, orden, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p373, 
        p372a,  
        'ELABORADO', 
        'admin', 
        now(),
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END,		
        0,
        segmento,
        carga_param
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p373 IS NULL 
        AND TRIM(p373) <> ''
        AND NOT EXISTS (
            SELECT id_p373 
            FROM codificacion.cod_p373_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;





    -- INSERCIÓN codificacion.cod_p49_p51_temp2
    INSERT INTO codificacion.cod_p52esp_temp2(
        secuencial, i00, i001a, nro, respuesta, p52, estado, usucre, feccre, departamento, orden, apoyo, segmento, carga
    )
    SELECT 
        secuencial, 
        i00, 
        i001a, 
        nro, 
        p52esp, 
        CASE p52 
            WHEN '1' THEN 'Dentro o junto a esta vivienda' 
            WHEN '2' THEN 'Fuera de la vivienda pero en el mismo municipio'
            WHEN '3' THEN 'En otro municipio' 
            WHEN '4' THEN 'En otro país' 
            ELSE NULL 
        END AS p52,   	
        'ELABORADO', 
        'admin', 
        now(), 
        CASE cod_depto 
            WHEN '01' THEN 'CHUQUISACA' 
            WHEN '02' THEN 'LA PAZ' 
            WHEN '03' THEN 'COCHABAMBA' 
            WHEN '04' THEN 'ORURO' 
            WHEN '05' THEN 'POTOSI' 
            WHEN '06' THEN 'TARIJA' 
            WHEN '07' THEN 'SANTA CRUZ' 
            WHEN '08' THEN 'BENI' 
            WHEN '09' THEN 'PANDO' 
            ELSE NULL 
        END AS departamento,						
        0,
        p52::text AS apoyo,
        segmento,
        carga_param
    FROM 
        estructuras.inicial0_capitulo_personas cc
    WHERE 
        NOT p52esp IS NULL 
        AND TRIM(p52esp) <> ''
        AND NOT EXISTS (
            SELECT id_p52esp 
            FROM codificacion.cod_p52esp_temp2 cp 
            WHERE cp.secuencial = cc.secuencial 
            AND cp.i00 = cc.i00 
            AND cp.nro = cc.nro
        )
        AND cod_depto = cod_depto_param;

END;
$$ LANGUAGE plpgsql;












-- Ejecutar la funcion codificacion.fn_insercion_simple_doble_aut
SELECT codificacion.fn_insercion_simple_doble_aut('05', 10);






------------------------------------------------------------------------------------------------
-- FUNCION PARA CORREGIR Y NORMALIZAR PALABRAS ERRADAS DE LA TABLA codificacion.cod_p49_p51_temp
------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION codificacion.fn_correccion_normalizacion_aut() RETURNS void AS $$
BEGIN
    UPDATE codificacion.cod_p49_p51_temp
    SET 
        respuesta_normalizada_ocu2 = (
            SELECT string_agg(
                COALESCE(
                    lower(regexp_replace(unaccent(e.corregidas), '[^\w]', '', 'g')),
                    lower(regexp_replace(unaccent(word), '[^\w]', '', 'g'))
                ), ''
            ORDER BY ord
            )
            FROM unnest(string_to_array(respuesta_ocu, ' ')) WITH ORDINALITY AS t(word, ord)
            LEFT JOIN codificacion.cod_err_corr e
            ON lower(word) = lower(e.erradas)
            WHERE e.estado = 'ACTIVO' OR e.erradas IS NULL
        ),
        respuesta_normalizada_act2 = (
            SELECT string_agg(
                COALESCE(
                    lower(regexp_replace(unaccent(e.corregidas), '[^\w]', '', 'g')),
                    lower(regexp_replace(unaccent(word), '[^\w]', '', 'g'))
                ), ''
            ORDER BY ord
            )
            FROM unnest(string_to_array(respuesta_act, ' ')) WITH ORDINALITY AS t(word, ord)
            LEFT JOIN codificacion.cod_err_corr e
            ON lower(word) = lower(e.erradas)
            WHERE e.estado = 'ACTIVO' OR e.erradas IS NULL
        ) 
    WHERE codigocodif_act is null  AND  codigocodif_ocu is NULL;
END;
$$ LANGUAGE plpgsql;



