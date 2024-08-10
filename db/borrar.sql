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

---------------inicial1_capitulo_vivienda---------------
CREATE TABLE estructura.inicial1_capitulo_vivienda (
	secuencial int4 NOT NULL,
	i00 varchar(8) NOT NULL DEFAULT 0,
	i001a varchar(8) NOT NULL DEFAULT 0,
	i01 varchar(8) NOT NULL,
	i02 varchar(4) NULL,
	i03 varchar(2) NULL,
	i03a varchar(1) NULL,
	i04 varchar(2) NULL,
	i05 varchar(2) NULL,
	i06 varchar(35) NULL,
	i07 varchar(35) NULL,
	i08 varchar(4) NULL,
	i09 varchar(3) NULL,
	i10 varchar(4) NULL,
	i11 varchar(15) NULL,
	i12 varchar(4) NULL,
	mco int4 NULL,
	p01 int4 NULL,
	p02 int4 NULL,
	p03 int4 NULL,
	p04 int4 NULL,
	p05 int4 NULL,
	p06 int4 NULL,
	p07 int4 NULL,
	p08 int4 NULL,
	p09 int4 NULL,
	p10 int4 NULL,
	p11 int4 NULL,
	p12 int4 NULL,
	p13 int4 NULL,
	p14 int4 NULL,
	p15 int4 NULL,
	p16 int4 NULL,
	p17 int4 NULL,
	p181 int4 NULL,
	p182 int4 NULL,
	p183 int4 NULL,
	p184 int4 NULL,
	p185 int4 NULL,
	p186 int4 NULL,
	p187 int4 NULL,
	p188 int4 NULL,
	p189 int4 NULL,
	p1810 int4 NULL,
	p191 int4 NULL,
	p192 int4 NULL,
	p193 int4 NULL,
	p194 int4 NULL,
	p195 int4 NULL,
	p196 int4 NULL,
	p197 int4 NULL,
	p198 int4 NULL,
	p20 varchar(4) NULL,
	p20a varchar(2) NULL,
	p21 varchar(4) NULL,
	p21a varchar(2) NULL,
	p23 varchar(2) NULL,
	p23a varchar(2) NULL,
	p23b varchar(2) NULL,
	p23c varchar(2) NULL,
	p23d varchar(2) NULL,
	p23e varchar(2) NULL,
	cod_depto varchar(2) NULL,
	cod_prov varchar(2) NULL,
	cod_mpio varchar(2) NULL,
	cod_cd_com varchar(5) NULL,
	zona varchar(2) NULL,
	sector varchar(6) NULL,
	segmento varchar(8) NULL,
	area varchar(2) NULL,
	con_mpio varchar(6) NULL,
	g_aforo_viv_colectiva int4 NULL,
	CONSTRAINT inicial1_capitulo_vivienda_pk PRIMARY KEY (secuencial),
	CONSTRAINT inicial1_capitulo_vivienda_unique UNIQUE (i00)
);

---------------cod_num_cuestionarios---------------
CREATE TABLE codificacion.cod_num_cuestionarios (
	secuencial int4 NOT NULL,
	i00 varchar(8) NOT NULL DEFAULT 0,
	i001a varchar(8) NOT NULL DEFAULT 0,
	cont_creacion int4 NOT NULL,
	fecha_creacion timestamp NOT NULL DEFAULT now(),
	cod_depto varchar(2) NOT NULL,
	obs text NULL,
	CONSTRAINT inicial1_capitulo_vivienda_pk PRIMARY KEY (secuencial),
	CONSTRAINT inicial1_capitulo_vivienda_unique UNIQUE (i00)
);

-- insertar datos en la tabla inicial1_capitulo_vivienda en la tabla cod_num_cuestionarios
INSERT INTO codificacion.cod_num_cuestionarios (secuencial, i00, i001a, cont_creacion, fecha_creacion, cod_depto, obs) 
SELECT 
	secuencial, i00, i001a, 1, now(), cod_depto, null
FROM estructura.inicial1_capitulo_vivienda from cod_depto = '04';



---------------------
SELECT a.i00  FROM estructuras.inicial1_capitulo_personas GROUP BY a.i00 a
JOIN estructuras.inicial1_capitulo_vivienda v
ON a.i00 = v.i00




---------------------
-- Crear tabla limites.asignacion

CREATE TABLE limites.asignacion (
	id_asignacion serial NOT NULL,
	cod_depto varchar(2) NOT NULL,
	depto varchar(16) NOT NULL,
	cod_sector varchar(16) NOT NULL,
	segmento varchar(16) NOT NULL,





	id_usuario int4 NOT NULL,
	id_rol int4 NOT NULL,
	id_sistema int4 NOT NULL,
	estado varchar(20) NOT NULL,
	usucre varchar(20) NOT NULL,
	feccre timestamp NOT NULL,
	usumod varchar(20),
	fecmod timestamp,
	unicoid varchar(100) NOT NULL,
	CONSTRAINT asignacion_pk PRIMARY KEY (id_asignacion)
);

-- Tabla usuarios
CREATE TABLE limites.usuarios (
	id_usuario serial NOT NULL,
	nombre varchar(100) NOT NULL,
	apellido_paterno varchar(100) NOT NULL,
	apellido_materno varchar(100) NOT NULL,	
	rol int NOT NULL,
	estado varchar(20) NOT NULL DEFAULT 'ACTIVO',
	fecha_creacion timestamp NOT NULL DEFAULT now(),	
	CONSTRAINT usuarios_pk PRIMARY KEY (id_usuario)
);

-- Tabla roles
CREATE TABLE limites.roles (
	id_rol serial NOT NULL,
	rol varchar(128) NOT NULL,
	estado BOOLEAN NOT NULL DEFAULT TRUE,
	fecha_creacion timestamp NOT NULL DEFAULT now(),	
	CONSTRAINT roles_pk PRIMARY KEY (id_rol)
);

-- El cod es numerico
SELECT * from codificacion WHERE cod is numeric;  


-----------------------


-- como buscar un registro en una tabla por fecha, si el campo es de tipo timestamp: 2024-06-27 11:22:15.287

SELECT * FROM tabla WHERE fecha::date = '2024-06-27';



-- tengo una tabla llamada cod_p20esp en el esquema codificacion, y tengo otra tabla llamada cod_p20esp_2 en el esquema estructura
-- crear un trigger cada vez que se actualice un registro en la tabla cod_p20esp, se actualice en la tabla cod_p20esp_2 del esquema estructura
-- El trigger se llama tr_cod_p20esp
-- El trigger se ejecuta antes de la actualización
-- LA consulta es la siguiente:
