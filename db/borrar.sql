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