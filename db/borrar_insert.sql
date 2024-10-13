-- codificacion.cod_p32esp definition

-- Drop table

-- DROP TABLE codificacion.cod_p32esp;

CREATE TABLE codificacion.cod_p32esp_temp3 (
	id_p32esp serial4 NOT NULL,
	secuencial int4 NOT NULL,
	i00 varchar(8) NOT NULL,
	i001a varchar(8) NOT NULL,
	nro int4 NOT NULL,
	respuesta varchar(50) NOT NULL,
	codigocodif varchar(30) NULL,
	codigocodif_v1 varchar(30) NULL,
	codigocodif_v2 varchar(30) NULL,
	"estado" varchar(60) DEFAULT 'ELABORADO'::character varying NOT NULL,
	usucre varchar(60) NULL,
	feccre timestamp(6) DEFAULT now() NOT NULL,
	usucodificador varchar(60) NULL,
	feccodificador timestamp(6) NULL,
	usuverificador varchar(60) NULL,
	fecverificador timestamp(6) NULL,
	usuverificador2 varchar(60) NULL,
	fecverificador2 timestamp(6) NULL,
	respuesta_normalizada text DEFAULT 'Sin Observaciones'::text NULL,
	departamento varchar(20) NULL,
	orden int4 DEFAULT 0 NULL,
	estado_norm int4 DEFAULT 0 NULL,
	carga int4 NULL,
	i001a_copia varchar(8) NULL,
	segmento varchar(8) NULL,
	verificado int4 DEFAULT 0 NULL,
	id_codificacion int4 NULL,
	CONSTRAINT cod_p32esp_pkey PRIMARY KEY (id_p32esp),
	CONSTRAINT cod_p32esp_secuencial_i00_i001a_nro_key UNIQUE (secuencial, i00, i001a, nro)
);
