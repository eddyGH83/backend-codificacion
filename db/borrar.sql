-- agregar un campo a la tabla
ALTER TABLE `usuarios` ADD `telefono` VARCHAR(10) NOT NULL AFTER `email`;

--codificacion.cod_p20esp
ALTER TABLE codificacion.cod_p20esp ADD segmento	VARCHAR(8);
--codificacion.cod_p32esp
ALTER TABLE codificacion.cod_p32esp ADD segmento	VARCHAR(8);
--codificacion.cod_p331
ALTER TABLE codificacion.cod_p331 ADD segmento	VARCHAR(8);
--codificacion.cod_p332
ALTER TABLE codificacion.cod_p332 ADD segmento	VARCHAR(8);
--codificacion.cod_p333
ALTER TABLE codificacion.cod_p333 ADD segmento	VARCHAR(8);
--codificacion.cod_p341
ALTER TABLE codificacion.cod_p341 ADD segmento	VARCHAR(8);
--codificacion.cod_p352a
ALTER TABLE codificacion.cod_p352a ADD segmento	VARCHAR(8);
--codificacion.cod_p353
ALTER TABLE codificacion.cod_p353 ADD segmento	VARCHAR(8);
--codificacion.cod_p362a
ALTER TABLE codificacion.cod_p362a ADD segmento	VARCHAR(8);
--codificacion.cod_p363
ALTER TABLE codificacion.cod_p363 ADD segmento	VARCHAR(8);
--codificacion.cod_p372a
ALTER TABLE codificacion.cod_p372a ADD segmento	VARCHAR(8);
--codificacion.cod_p373
ALTER TABLE codificacion.cod_p373 ADD segmento	VARCHAR(8);
--codificacion.cod_p48esp
ALTER TABLE codificacion.cod_p48esp ADD segmento	VARCHAR(8);
--codificacion.cod_p49_p51
ALTER TABLE codificacion.cod_p49_p51 ADD segmento	VARCHAR(8);
--codificacion.cod_p52esp
ALTER TABLE codificacion.cod_p52esp ADD segmento	VARCHAR(8);


-- crear un campo en la tabla codificacion.cod_p50esp, con el nombre cod_p50esp_pais
ALTER TABLE codificacion.cod_p50esp ADD cod_p50esp_pais VARCHAR(3);



ALTER TABLE codificacion.cod_p52esp ADD codigocodif_pais VARCHAR(3);
ALTER TABLE codificacion.cod_p52esp ADD codigocodif_v1_pais VARCHAR(3);
ALTER TABLE codificacion.cod_p52esp ADD codigocodif_v2_pais VARCHAR(3);


UPDATE codificacion.cod_p52esp set codigocodif_pais = '000' WHERE codigocodif_pais IS NULL;


- tengo la siguiente tabla codificacion.cod_p52esp;
| id_cod | cod   |
| 1      | 4521  |
| 2      | 450   |
| 3      | 402   |
| 4      | 452654|
| 5      | 021   |

crear una consulta que me devuelva el siguiente resultado
| id_cod | cod   | cod_pais |
| 1      | 4521  | null     |
| 2      | null  | 450      |
| 3      | null  | 402      |
| 4      | 452654| null     |
| 5      | null  | 021      |
-- en cod_pais se debe mostrar el campo cod si el tamaño de caracteres es tres, si no se debe mostrar null
-- la consulta seria
SELECT id_cod, 
       CASE 
            WHEN LENGTH(cod) = 3 THEN cod
            ELSE NULL
       END AS cod,
       CASE 
            WHEN LENGTH(cod) <> 3 THEN cod
            ELSE NULL
       END AS cod_pais
FROM codificacion.cod_p52esp;

-- de tipo entero con un valor por defecto de 0
ALTER TABLE codificacion.cod_p20esp ADD verificado INT DEFAULT 0;

-- 
UPDATE codificacion.cod_p52esp set codigocodif_pais = '000' WHERE codigocodif_pais IS NULL;




-- tengo las siguientes tablas
- tengo la siguiente tabla codificacion.cod_p20esp;
| i00    | p20nro | p202esp | bandera |
| 1      | 4521   | 4521    | 1       |
| 2      | 450    | 450     | 0       |
| 3      | 402    | 402     | 1       |
| 4      | 452654 | 452654  | 0       |

-- la otra tabla: estructuras.inicial0_capitulo_emigracion
| i00    | p20nro | p202esp |
| 1      | 4521   | 4521    |
| 12     | 450    | 450     |
| 3      | 402    | 402     |
| 4      | 4      | 400054  |

-- se debe actualizar la tabla codificacion.cod_p20esp, con los datos de la tabla estructuras.inicial0_capitulo_emigracion,
-- si i00, p20nro y p202esp son iguales, se debe actualizar el campo bandera de la tabla codificacion.cod_p20esp con el valor 1 nada mas
-- la consulta seria
UPDATE codificacion.cod_p20esp c
INNER JOIN estructuras.inicial0_capitulo_emigracion e 
ON c.i00 = e.i00 AND c.p20nro = e.p20nro AND c.p202esp = e.p202esp
SET c.bandera = 1;



UPDATE codificacion.cod_p20esp c
INNER JOIN estructuras.inicial0_capitulo_emigracion e 
ON c.i00 = e.i00 AND c.p20nro = e.p20nro AND  trim(c.respuesta) = trim(e.p202esp)
SET c.verificado = 1;






