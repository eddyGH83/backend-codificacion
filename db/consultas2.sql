-- tengo la siguiente tabla:
--SELECT * FROM codificacion.cod_p20esp e 
--INNER JOIN estructuras.inicial0_capitulo_emigracion em
--ON e.i00=em.i00 AND e.p20nro =em.p20nro AND  e.respuesta = em.p202esp -- AND  e.sec_cuestionario=em.sec_cuestionario

-- tengo la siguiente tabla: codificacion.cod_p20esp, con los campos: i00, p20nro y segmento.
-- tengo la siguiente tabla: estructuras.inicial0_capitulo_emigracion, con los campos: i00, p20nro y segmento.
-- la tabla estructuras.inicial0_capitulo_emigracion tiene información en el campo segmento que no está en la tabla codificacion.cod_p20esp.
-- se debe hacer un update en la tabla codificacion.cod_p20esp, para que el campo segmento tenga la información de la tabla estructuras.inicial0_capitulo_emigracion.
-- Para hacer el update se debe hacer un inner join entre las dos tablas, con los campos i00 y p20nro. 
-- El campo segmento de la tabla codificacion.cod_p20esp debe ser actualizado con el campo segmento de la tabla estructuras.inicial0_capitulo_emigracion.
-- consulta sql:
UPDATE codificacion.cod_p20esp e 
INNER JOIN estructuras.inicial0_capitulo_emigracion em
ON e.i00=em.i00 AND e.p20nro =em.p20nro AND  e.respuesta = em.p202esp -- AND  e.sec_cuestionario=em.sec_cuestionario
SET e.segmento = em.segmento;



-- UPDATE: codificacion.cod_p20esp
UPDATE codificacion.cod_p20esp AS e
SET segmento = em.segmento
FROM estructuras.inicial0_capitulo_emigracion AS em
WHERE e.i00 = em.i00  AND e.p20nro = em.p20nro and e.respuesta = em.p202esp AND e.sec_cuestionario=em.sec_cuestionario;



-- UPDATE: codificacion.cod_p32esp
UPDATE codificacion.cod_p32esp AS e
SET segmento = em.segmento
FROM estructuras.inicial0_capitulo_personas AS p
WHERE e.i00 = p.i00  AND e.p32nro = p.p32nro and e.respuesta = p.p322esp AND e.sec_cuestionario=p.sec_cuestionario;



-- UPDATE: codificacion.cod_p331
UPDATE codificacion.cod_p331 AS e
SET segmento = p.segmento
FROM estructuras.inicial0_capitulo_personas AS p
WHERE e.i00 = p.i00  AND e.nro = p.nro and e.respuesta = p.p331 AND e.secuencial =p.secuencial ; 



-- UPDATE: codificacion.cod_p332
UPDATE codificacion.cod_p332 AS e
SET segmento = p.segmento
FROM estructuras.inicial0_capitulo_personas AS p
WHERE e.i00 = p.i00  AND e.nro = p.nro and e.respuesta = p.p332 AND e.secuencial =p.secuencial ; 



-- UPDATE: codificacion.cod_p333
UPDATE codificacion.cod_p333 AS e
SET segmento = p.segmento
FROM estructuras.inicial0_capitulo_personas AS p
WHERE e.i00 = p.i00  AND e.nro = p.nro and e.respuesta = p.p333 AND e.secuencial =p.secuencial ;



-- UPDATE: codificacion.cod_p341
UPDATE codificacion.cod_p341 AS e
SET segmento = p.segmento
FROM estructuras.inicial0_capitulo_personas AS p
WHERE e.i00 = p.i00  AND e.nro = p.nro and e.respuesta = p.p341 AND e.secuencial =p.secuencial ;







-- codificacion.cod_p331  codificacion.cod_p332  codificacion.cod_p333  codificacion.cod_p341



