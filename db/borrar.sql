SELECT
	'La Paz' AS depto,
	'20' AS nro_preg,
	'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
	count(*) AS total_carga
FROM codificacion.cod_p20esp WHERE estado = 'ELABORADO'

UNION

SELECT
	'La Paz' AS depto,
	'32' AS nro_preg,
	'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
	count(1) AS total_carga
FROM codificacion.cod_p32esp WHERE estado = 'ELABORADO'

UNION

SELECT
	'La Paz' AS depto,
	'33' AS nro_preg,
	'Idioma 1' AS variable,
	count(1) AS total_carga
FROM codificacion.cod_p331 WHERE estado = 'ELABORADO'

UNION

SELECT
	'La Paz' AS depto,
	'33' AS nro_preg,
	'Idioma 2' AS variable,
	count(1) AS total_carga
FROM codificacion.cod_p332 WHERE estado = 'ELABORADO'

UNION

SELECT
	'La Paz' AS depto,
	'33' AS nro_preg,
	'Idioma 3' AS variable,
	count(1) AS total_carga
FROM codificacion.cod_p332 WHERE estado = 'ELABORADO'

UNION

SELECT 
	'La Paz' AS depto,
	'34' AS nro_preg,
	'¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?' AS variable,
	0 AS total_carga
UNION

SELECT 
	'La Paz' AS depto,
	'35' AS nro_preg,
	'¿Dónde nació?' AS variable,
	0 AS total_carga
UNION
SELECT 
	'La Paz' AS depto,
	'36' AS nro_preg,
	'¿Dónde vive habitualmente?' AS variable,
	0 AS total_carga
UNION
SELECT 
	'La Paz' AS depto,
	'37' AS nro_preg,
	'¿Dónde vivía el año 2019?' AS variable,
	0 AS total_carga
UNION

SELECT
	'La Paz' AS depto,
	'48' AS nro_preg,
	'Las últimas 4 semanas:' AS variable,
	count(1) AS total_carga
FROM codificacion.cod_p48esp WHERE estado = 'ELABORADO'

UNION

SELECT 
	'La Paz' AS depto,
	'49-51' AS nro_preg,
	'Ocupación - Actividad Económica' AS variable,
	count (1) AS total_carga FROM codificacion.cod_p49_p51
	WHERE estado = 'ELABORADO'                
UNION

SELECT
	'La Paz' AS depto,
	'52' AS nro_preg,
	'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
	count(1) AS total_carga
FROM codificacion.cod_p52esp
WHERE estado = 'ELABORADO'
ORDER BY nro_preg;




¿Qué es DevOps?


Un lenguaje de programación
Una metodología ágil de desarrollo de software popular en las organizaciones
Una combinación de prácticas y herramientas que buscan automatizar y mejorar la colaboración entre desarrollo y operaciones
Un tipo de software para gestión de proyectos



-- tabla: catalogo_pais
SELECT codigo, descripcion, nro, unico
FROM codificacion.catalogo_pais;



-- tabla: cod_catalogo
SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
FROM codificacion.cod_catalogo;

-- Hacer un insert en la tabla cod_catalogo, donde los registros sean de la tabla catalogo_pais
INSERT INTO codificacion.cod_catalogo (id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico)
SELECT
	1 AS id_catalogo,
	'catalogo_pais' AS catalogo,
	codigo,
	descripcion,
	'ACTIVO' AS estado,
	'admin' AS usucre,
	now() AS feccre,
	'admin' AS usumod,
	now() AS fecmod,
	CONCAT(codigo, ' - ', descripcion) AS descripcion_unida,
	CONCAT(codigo, descripcion) AS unicoid
FROM codificacion.catalogo_pais;

------------------- tabla: cod_persona, donde el campo img debe se debe almacenar una cadena de caracteres aleatorios unicos de tamaño 8, 
create table codificacion.cod_persona
(
	id_persona serial not null,
	nombre varchar(100) not null,
	apellido_paterno varchar(100) not null,
	apellido_materno varchar(100) not null,
	ci varchar(20) not null,
	img varchar(8) not null DEFAULT substr(md5(random()::text), 1, 8),
	estado varchar(20) not null,
	usucre varchar(20) not null,
	feccre timestamp not null,
	usumod varchar(20),
	fecmod timestamp,
	unicoid varchar(100) not null,
	primary key (id_persona)
);

--- Ejemmplo 1:
SELECT img substr(md5(random()::text), 1, 8)  from codificacion.cod_persona;  -- para generar una cadena de caracteres aleatorios unicos de tamaño 8

--- Ejemplo 2:
SELECT md5(random()::text) from codificacion.cod_persona;  -- para generar una cadena de caracteres aleatorios unicos de tamaño 32

--- Ejemplo 3:
SELECT substr(md5(random()::text), 1, 8) from codificacion.cod_persona;  -- para generar una cadena de caracteres aleatorios unicos de tamaño 8