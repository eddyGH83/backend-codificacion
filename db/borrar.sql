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