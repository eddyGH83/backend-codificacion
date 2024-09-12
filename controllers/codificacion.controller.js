const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');
const esquema = "codificacion";


/**
 * Realiza EL DESPLIEGUE O LISTADO DE DATOS CON ESTADO "DESCARGADO"
 * @param {*} req 
 * @param {*} res 
 */

const muestraCargaDatos = async (req, res) => {
	//let params = req.body;
	const query = {
		text: `select  cuenta, id_pregunta, pregunta,codigo_pregunta 
		from (select a.estado, (select area from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as area,
		a.id_pregunta, (select pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as pregunta,
		(select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as codigo_pregunta,
		count(*) cuenta from ${esquema}.cod_encuesta_codificacion a where a.estado ='DESCARGADO'
		group by a.id_pregunta,a.estado) a group by codigo_pregunta, id_pregunta,pregunta, cuenta
		order by codigo_pregunta,pregunta`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			}
			)
		)
		.catch((e) => console.error(e.stack));
};
/**
 * Realiza EL DESPLIEGUE O LISTADO DE DATOS CON ESTADO "DESCARGADO"
 * @param {*} req 
 * @param {*} res 
 */

const getCantidadCarga = async (req, res) => {
	//let params = req.body;
	const query = {
		text: `select count(*) from codificacion.cod_encuesta_codificacion where estado = 'DESCARGADO'`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			}
			)
		)
		.catch((e) => console.error(e.stack));
};

/**
 * Actualiza el estado a "ELABORADO" de acuerdo a la selección del usuario
 * @param {*} req 
 * @param {*} res 
 */

const cargarDatos = async (req, res) => {
	let params = req.body;
	const query = {
		text: `WITH codnc AS (
			SELECT id_pregunta, id_informante, id_encuesta, departamento
			FROM   codificacion.cod_encuesta_codificacion
			WHERE  id_pregunta = ${params.id_pregunta}  and estado = 'DESCARGADO'
			order by random() LIMIT ${params.limite})
		 UPDATE codificacion.cod_encuesta_codificacion cec
		 SET    estado = 'ELABORADO', usucre= '${params.usucre}', feccre=now() FROM codnc
		 WHERE  cec.id_informante = codnc.id_informante and 
		 cec.id_informante=codnc.id_informante and cec.id_pregunta=codnc.id_pregunta`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			}
			)
		)
		.catch((e) => console.error(e.stack));
};

/**
 * Actualiza el estado a "ELABORADO" de acuerdo a la selección del usuario
 * @param {*} req 
 * @param {*} res 
 */
const cargarDatosGlobal = async (req, res) => {
	let params = req.body;
	const query = {
		text: `WITH codnc AS (
			SELECT id_pregunta, id_informante, id_encuesta, departamento
			FROM   codificacion.cod_encuesta_codificacion
			WHERE   estado = 'GADO'
			order by random() LIMIT ${params.limite})
		 UPDATE codificacion.cod_encuesta_codificacion cec
		 SET    estado = 'ELABORADO', usucre= '${params.usucre}', feccre=now() FROM codnc
		 WHERE  cec.id_informante = codnc.id_informante and 
		 cec.id_informante=codnc.id_informante and cec.id_pregunta=codnc.id_pregunta`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			}
			)
		)
		.catch((e) => console.error(e.stack));
};
/**
 * EJECUTA LA FUNCION O PROCEDIMIENTO ALMACENADO QUE NORMALIZA LOS DATOS
 * @param {*} req 
 * @param {*} res 
 */
const normalizaRespuesta = async (req, res) => {
	const query = {
		text: `select ${esquema}.f_cod_normaliza_data();`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: 'exito',
			}))
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const codificaNormalizada = async (req, res) => {
	const query = {
		text: `select id_informante, id_encuesta,cec.id_pregunta, a.catalogo, respuesta, respuesta_normalizada, codigo,  descripcion_unida 
		from ${esquema}.cod_encuesta_codificacion cec inner join
		(select distinct  descripcion_unida, codigo, catalogo, descripcion from ${esquema}.cod_catalogo cc where catalogo in 
		(select distinct catalogo from ${esquema}.cod_variables cv where estado like 'ACTIVO')) a
		on cec.respuesta_normalizada = a.descripcion_unida
		inner join ${esquema}.cod_variables cv
		on cec.id_pregunta  = cv.id_pregunta and a.catalogo = cv.catalogo and 
		(case when a.catalogo ='cat_caeb' or a.catalogo ='cat_cob' then length(a.codigo)>=5 else length(a.codigo)>=3 end)
		where codigocodif isnull and cec.estado ilike 'elaborado'
		group by  id_informante, id_encuesta,cec.id_pregunta, a.catalogo, respuesta, respuesta_normalizada, codigo,  descripcion_unida`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * Actualizacion que actualiza los registros codificados con el algoritmo de normalizacion de respuestas y catalogos
 * @param {*} req -> Llega el request 
 * @param {*} res ->  Para la respuesta o response
 */
const codificacionNormalizadaUpd = async (req, res) => {
	const query = {
		text: `update ${esquema}.cod_encuesta_codificacion cenc
		SET codigocodif = x.codigo, estado='CODIFICADO', usucodificador='AUTOMATICO_NORMALIZADO', feccodificador =now()
		FROM
		(select cec.id_informante, cec.id_encuesta, cec.id_pregunta, respuesta, respuesta_normalizada, codigo, descripcion_unida from ${esquema}.cod_encuesta_codificacion cec 
		inner join
		(select distinct  descripcion_unida, codigo, catalogo, descripcion from ${esquema}.cod_catalogo cc where catalogo in (select distinct catalogo from ${esquema}.cod_variables cv where estado like 'ACTIVO')) a
		on cec.respuesta_normalizada = a.descripcion_unida
		inner join ${esquema}.cod_variables cv
		on cec.id_pregunta  = cv.id_pregunta and a.catalogo = cv.catalogo and 
		(case when a.catalogo ='cat_caeb' or a.catalogo ='cat_cob' then length(a.codigo)>=5 else length(a.codigo)>=3 end)
		where codigocodif isnull  and cec.estado ilike 'elaborado'
		group by cec.id_informante, cec.id_encuesta, cec.id_pregunta, respuesta, respuesta_normalizada, codigo, descripcion_unida
		) x
		WHERE cenc.respuesta_normalizada=x.descripcion_unida and cenc.id_informante = x.id_informante 
		and cenc.id_encuesta = x.id_encuesta and cenc.id_pregunta=x.id_pregunta`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const preguntasPorDepartamentoCod_ = async (req, res) => {
	const query = {
		text: `select departamento, nombre, max(case when estado ='ELABORADO' then cuenta else 0 end) count, 
		id_pregunta, pregunta,codigo_pregunta 
		from (select a.departamento,
			(select nombre_depto from cartografia.departamentos where codigo_depto=a.departamento) as nombre,
			a.estado,
			(select area from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as area,
			a.id_pregunta,
			(select pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta  and estado = 'ACTIVO') as pregunta,
			  (select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as codigo_pregunta,
			count(*) cuenta from ${esquema}.cod_encuesta_codificacion a
			where a.estado in ('ELABORADO','ASIGNADO') and a.id_pregunta not in (125,127)
			group by a.departamento,a.id_pregunta,a.estado
			) a
			group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta			
			union all
			select departamento, nombre, sum(case when estado in('ELABORADO', 'CODIFICADO') then cuenta else 0 end) count,
			id_pregunta, pregunta, codigo_pregunta
			from(
				select distinct ceco.departamento,
				(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre,
				ceco.id_pregunta,  'Preguntas 48-50: Ocupación - Actividad Económica' pregunta, 
                CASE WHEN (ceco.estado IN ('ELABORADO', 'CODIFICADO') and ceca.estado IN ('ELABORADO', 'CODIFICADO'))  
                THEN ceco.estado else ceca.estado end as estado, 
				(select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=ceco.id_pregunta) as codigo_pregunta,
				count(*) cuenta
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
--			where ceco.id_pregunta =125 and ceca.id_pregunta=127 and 
--			(ceco.codigocodif is null or ceca.codigocodif is null) and 
--			(ceco.estado in ('ELABORADO', 'ASIGNADO', 'CODIFICADO') OR
--					ceca.estado in ('ELABORADO', 'ASIGNADO', 'CODIFICADO'))
where ceco.id_pregunta =125 and ceca.id_pregunta=127 and 
((ceco.estado='ELABORADO' and ceca.estado='CODIFICADO') OR (ceco.estado='CODIFICADO' and ceca.estado='ELABORADO') 
or (ceco.estado='ELABORADO' and ceca.estado='ELABORADO')
or (ceco.estado='ASIGNADO' and ceca.estado='ASIGNADO')
) 
				group by ceco.departamento,ceco.id_pregunta,ceco.estado, ceca.estado
			) a
			group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
			order by departamento, codigo_pregunta,pregunta`
	};
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};



// Asignacion de carga a Codificadores por departamento
const preguntasPorDepartamentoCod = async (req, res) => {

	const { depto } = req.body;


	if (depto === 'OTROS') {
		sql_depto = `and departamento = '${depto}'`;
	} else {
		sql_depto = `and departamento = '${depto}'`;
	}




	const query = {
		text: `
			SELECT
				1 orden,
				'p20esp' tabla_id,
				'La Paz' AS depto,
				'20' AS nro_preg,
				'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
				count(*) AS total_carga
			FROM codificacion.cod_p20esp WHERE estado = 'ELABORADO' ${sql_depto}

			UNION

			SELECT
				2 orden,
				'p32esp' tabla_id,
				'La Paz' AS depto,
				'32' AS nro_preg,
				'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p32esp WHERE estado = 'ELABORADO' ${sql_depto}

			UNION

			SELECT
				3 orden,
				'p331' tabla_id,
				'La Paz' AS depto,
				'33' AS nro_preg,
				'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p331 WHERE estado = 'ELABORADO' ${sql_depto}

			UNION
			
			SELECT
				4 orden,
				'p332' tabla_id,
				'La Paz' AS depto,
				'33' AS nro_preg,
				'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p332 WHERE estado = 'ELABORADO' ${sql_depto}

			UNION

			SELECT
				5 orden,
				'p333' tabla_id,
				'La Paz' AS depto,
				'33' AS nro_preg,
				'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p333 WHERE estado = 'ELABORADO' ${sql_depto}

			UNION

			SELECT 
				6 orden,
				'p341' tabla_id,
				'La Paz' AS depto,
				'34' AS nro_preg,
				'¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p341 WHERE estado = 'ELABORADO' ${sql_depto}

			UNION

			SELECT 
				7 orden,
				'p352a' tabla_id,
				'La Paz' AS depto,
				'35' AS nro_preg,
				'¿Dónde nació? ¿Municipio?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p352a WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT 
				8 orden,
				'p353' tabla_id,
				'La Paz' AS depto,
				'35' AS nro_preg,
				'¿Dónde nació? ¿País?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p353 WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT 
				9 orden,
				'p362a' tabla_id,
				'La Paz' AS depto,
				'36' AS nro_preg,
				'¿Dónde vive habitualmente? ¿Municipio?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p362a WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT 
				10 orden,
				'p363' tabla_id,
				'La Paz' AS depto,
				'36' AS nro_preg,
				'¿Dónde vive habitualmente? ¿País?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p363 WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT
				11 orden,
				'p372a' tabla_id,
				'La Paz' AS depto,
				'37' AS nro_preg,
				'¿Dónde vivía el año 2019? ¿Municipio?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p372a WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT 
				12 orden,
				'p373' tabla_id,
				'La Paz' AS depto,
				'37' AS nro_preg,
				'¿Dónde vivía el año 2019? ¿País?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p373 WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT
				13 orden,
				'p48esp' tabla_id,
				'La Paz' AS depto,
				'48' AS nro_preg,
				'Las últimas 4 semanas:' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p48esp WHERE estado = 'ELABORADO'  ${sql_depto}

			UNION

			SELECT 
				14 orden,
				'p49_p51' tabla_id,
				'La Paz' AS depto,
				'49-51' AS nro_preg,
				'Ocupación - Actividad Económica' AS variable,
				count (1) AS total_carga 
			FROM codificacion.cod_p49_p51 
			WHERE (estado_ocu = 'ELABORADO' or estado_act = 'ELABORADO') ${sql_depto}

			UNION
			
			SELECT
				15 orden,
				'p52esp' AS tabla_id,						
			    'La Paz' AS depto,
			    '52' AS nro_preg,
			    'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
			    count(1) AS total_carga
			FROM codificacion.cod_p52esp WHERE estado = 'ELABORADO'  ${sql_depto}
			ORDER BY orden asc
		`
	};


	//console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));

};


// Asignacion de carga a Supervisores por departamento
const preguntasPorDepartamentoSup = async (req, res) => {

	const { depto } = req.body;
	console.log("desde preguntasPorDepartamentoSup");
	console.log(req.body);

	const query = {
		text: `
			SELECT
				1 orden,
				'p20esp' tabla_id,				
				'20' AS nro_preg,
				'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
				count(*) AS total_carga
			FROM codificacion.cod_p20esp WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento='${depto}'

			UNION

			SELECT
				2 orden,
				'p32esp' tabla_id,
				'32' AS nro_preg,
				'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p32esp WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento='${depto}'

			UNION

			SELECT
				3 orden,
				'p331' tabla_id,				
				'33' AS nro_preg,
				'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p331 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento='${depto}'

			UNION
			
			SELECT
				4 orden,
				'p332' tabla_id,				
				'33' AS nro_preg,
				'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p332 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento='${depto}'

			UNION

			SELECT
				5 orden,
				'p333' tabla_id,				
				'33' AS nro_preg,
				'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p333 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento='${depto}'

			UNION

			SELECT 
				6 orden,
				'p341' tabla_id,				
				'34' AS nro_preg,
				'¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p341 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento='${depto}'

			UNION

			SELECT 
				7 orden,
				'p352a' tabla_id,				
				'35' AS nro_preg,
				'¿Dónde nació? ¿Municipio?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p352a WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT 
				8 orden,
				'p353' tabla_id,				
				'35' AS nro_preg,
				'¿Dónde nació? ¿País?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p353 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT 
				9 orden,
				'p362a' tabla_id,				
				'36' AS nro_preg,
				'¿Dónde vive habitualmente? ¿Municipio?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p362a WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT 
				10 orden,
				'p363' tabla_id,				
				'36' AS nro_preg,
				'¿Dónde vive habitualmente? ¿País?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p363 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT
				11 orden,
				'p372a' tabla_id,				
				'37' AS nro_preg,
				'¿Dónde vivía el año 2019? ¿Municipio?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p372a WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT 
				12 orden,
				'p373' tabla_id,				
				'37' AS nro_preg,
				'¿Dónde vivía el año 2019? ¿País?' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p373 WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT
				13 orden,
				'p48esp' tabla_id,				
				'48' AS nro_preg,
				'Las últimas 4 semanas:' AS variable,
				count(1) AS total_carga
			FROM codificacion.cod_p48esp WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'

			UNION

			SELECT 
				14 orden,
				'p49_p51' tabla_id,				
				'49-51' AS nro_preg,
				'Ocupación - Actividad Económica' AS variable,
				count (1) AS total_carga 
			FROM codificacion.cod_p49_p51 
			WHERE (estado_ocu = 'CODIFICADO' AND usucodificador_ocu ilike 'AUTOMATICO_%' AND estado_act = 'CODIFICADO' AND usucodificador_act ilike 'AUTOMATICO_%') and departamento='${depto}'

			UNION
			
			SELECT
				15 orden,
				'p52esp' AS tabla_id,									    
			    '52' AS nro_preg,
			    'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
			    count(1) AS total_carga
			FROM codificacion.cod_p52esp WHERE estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO'  and departamento='${depto}'
			ORDER BY orden asc
		`
	};


	//console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));

};


const preguntasPorDepartamentoSup_old = async (req, res) => {

	var result = [];
	var pr = '';

	const cod_variables = await (await con.query(`
		SELECT id_pregunta, pregunta, catalogo, codigo_pregunta FROM codificacion.cod_variables  WHERE id_pregunta IN (125,88,89,90,92,86,129,97,105,95,101,103,107,1001,1002,1003,1004,1005)
	`)).rows;

	// Recorre las preguntas:
	for (var i = 0; i <= cod_variables.length - 1; i++) {
		var prnc = 0;

		if (cod_variables[i].id_pregunta == 125) {
			const prn = await (await con.query(`
			select 
			COUNT(*)
			from (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 125  and estado='CODIFICADO' and usucodificador ilike 'AUTOMATICO_%'
			) as x
			join (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 127  and estado='CODIFICADO' and usucodificador ilike 'AUTOMATICO_%'
			) as y
			on
			x.id_informante = y.id_informante
			`)).rows;

			prnc = parseInt(prn[0].count, 10);
			pr = ', Pregunta 50: actividad principal';

		} else {
			const prn = await (await con.query(`
				select count(*) from codificacion.cod_encuesta_codificacion where id_pregunta = ${cod_variables[i].id_pregunta} and estado = 'CODIFICADO'  and usucodificador = 'AUTOMATICO_NORMALIZADO'
			`)).rows;
			prnc = prn[0].count;
		}

		result.push({
			"departamento": "03",
			"nombre": "COCHABAMBA",
			"count": prnc,
			"id_pregunta": cod_variables[i].id_pregunta,
			"pregunta": cod_variables[i].pregunta + pr,
			"codigo_pregunta": cod_variables[i].codigo_pregunta
		});

	}



	/* 
	
	"datos": {
		"command": "SELECT",
		"rowCount": 18,
		"oid": null,
		"rows": [
			{
				"departamento": "03",
				"nombre": "COCHABAMBA",
				"count": "0",
				"id_pregunta": 1001,
				"pregunta": "Pregunta 20: Persona 1",
				"codigo_pregunta": "C20"
			}, ...
	*/

	try {
		res.status(200).json({
			datos: { rows: result }
		})
	} catch (error) {
		console.log("preguntasPorDepartamentoSup" + error);
	}
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

const preguntasPorDepartamentoSup___ = async (req, res) => {
	const query = {
		text: `select departamento, nombre, max(case when estado ='CODIFICADO' then cuenta else 0 end) count, 
		id_pregunta, pregunta,codigo_pregunta
		from (select a.departamento,
			(select nombre_depto from cartografia.departamentos where codigo_depto=a.departamento) as nombre,
			a.estado,
			a.id_pregunta,
			(select pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as pregunta,
			  (select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as codigo_pregunta,
			count(*) cuenta from ${esquema}.cod_encuesta_codificacion a
			where a.estado in ('CODIFICADO', 'ASIGNASUP')
			and usucodificador = 'AUTOMATICO_NORMALIZADO'
			group by a.departamento,a.id_pregunta,a.estado
			) a
		where  id_pregunta not in (125,127)
		group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
		
		union all 
		
		select departamento, nombre, sum(case when estado ='CODIFICADO' then 1 else 0 end) count,
			id_pregunta, pregunta, codigo_pregunta
			from(
				select ceco.departamento ,--, ceco.estado oo, ceca.estado aa, ceco.usucodificador, 
				(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre,
				ceco.id_pregunta,  'Preguntas 48-50: Ocupación - Actividad Económica' pregunta, ceco.estado,
				(select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=ceco.id_pregunta) as codigo_pregunta,
				 ceco.usucodificador,ceca.usucodificador
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =125 and ceca.id_pregunta=127 and 
			ceco.estado in ('CODIFICADO', 'ASIGNASUP') and
					ceca.estado in ('CODIFICADO', 'ASIGNASUP')
					and ceco.usucodificador in ('AUTOMATICO_NORMDOBLE')
				and ceca.usucodificador in ('AUTOMATICO_NORMDOBLE')
				--group by ceco.departamento,ceco.id_pregunta,ceco.estado, ceco.usucodificador,ceca.usucodificador
			) a
			group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
			order by departamento, codigo_pregunta,pregunta`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};



// Listar codificadores para asignar carga
const codificadores = async (req, res) => {
	let id = req.params.id;

	// averiguar si es supervisor o jefe de turno
	const rol_id = await (await con.query(`SELECT rol_id FROM codificacion.cod_usuario WHERE id_usuario = ${id}`)).rows[0].rol_id;


	// Es supervisor (Lista de codificadores de sus codificadores)
	if (rol_id == 4) {
		const query = {
			text: `
		SELECT
		    id_usuario,
		    nombres || ' ' || pr_apellido || ' ' || sg_apellido nombre_completo,
		    nombres,
		    pr_apellido,
		    sg_apellido,
		    turno,
		    cod_supvsr,
		    rol_id,
		    login,
			0 total,
    		false activo
		FROM codificacion.cod_usuario WHERE rol_id =5 AND estado ILIKE 'A' and cod_supvsr = ${id}
		`,
		};
		await con
			.query(query)
			.then((result) =>
				res.status(200).json({
					datos: result,
				})
			)
			.catch((e) => console.error(e.stack));
	}




	// Es jefe de turno (Lista de codificadores de sus supervisores)
	if (rol_id == 3) {
		const query = {
			text: `
		SELECT 
			id_usuario,
		    nombres || ' ' || pr_apellido || ' ' || sg_apellido nombre_completo,
		    nombres,
		    pr_apellido,
		    sg_apellido,
		    turno,
		    cod_supvsr,
		    rol_id,
		    login,
			0 total,
    		false activo
		FROM codificacion.cod_usuario WHERE rol_id = 5 and estado = 'A' and cod_supvsr in (
			SELECT id_usuario FROM codificacion.cod_usuario WHERE rol_id = 4 AND estado = 'A' AND cod_supvsr = ${id}
		)
		`,
		};
		await con
			.query(query)
			.then((result) =>
				res.status(200).json({
					datos: result,
				})
			)
			.catch((e) => console.error(e.stack));
	}
};


// Listar codificadores con carga para reasignar carga
const codificadoresConCarga = async (req, res) => {

	var {
		id, // id del supervisor
		tabla_id,
		departamento
	} = req.body;

	// averiguar si es supervisor o jefe de turno
	const rol = await (await con.query(`SELECT rol_id FROM codificacion.cod_usuario WHERE id_usuario = ${id}`)).rows[0].rol_id;

	var total_carga_asignado = 0;

	// si es supervisor (Lista de codificadores de sus codificadores)
	if (rol == 4) {

		// verificamos si tabla_id
		if (tabla_id === 'p49_p51') {
			console.log("cod_p49_p51");
			var codificadores = await (await con.query(`
			SELECT
				b.id_usuario,
				b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
				b.turno,
				b.cod_supvsr,
				b.rol_id,
				b.login,
				a.carga_asignado
				FROM (
			SELECT
				u.login AS usucre,
				CASE
					WHEN COUNT(c.usucre) IS NULL THEN 0
					ELSE COUNT(c.usucre)
				END AS carga_asignado
			FROM codificacion.cod_usuario u
			LEFT JOIN codificacion.cod_p49_p51  c ON u.login = c.usucre AND c.departamento='${departamento}' AND (c.estado_ocu = 'ASIGNADO' OR c.estado_act = 'ASIGNADO')
			WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr = ${id}
			GROUP BY u.login
			) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		} else {

			var codificadores = await (await con.query(`
		SELECT
			b.id_usuario,
			b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
			b.turno,
			b.cod_supvsr,
			b.rol_id,
			b.login,
			a.carga_asignado
			FROM (
		SELECT
			u.login AS usucre,
			CASE
				WHEN COUNT(c.usucre) IS NULL THEN 0
				ELSE COUNT(c.usucre)
			END AS carga_asignado
		FROM codificacion.cod_usuario u
		LEFT JOIN codificacion.cod_${tabla_id}  c ON u.login = c.usucre AND c.estado = 'ASIGNADO' AND c.departamento='${departamento}'
		WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr = ${id}
		GROUP BY u.login
		) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		}

	}



	// si es jefe de turno (Lista de codificadores de sus supervisores)
	if (rol == 3) {

		// verificamos si tabla_id
		if (tabla_id === 'p49_p51') {
			console.log("cod_p49_p51");
			var codificadores = await (await con.query(`
			SELECT
				b.id_usuario,
				b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
				b.turno,
				b.cod_supvsr,
				b.rol_id,
				b.login,
				a.carga_asignado
				FROM (
			SELECT
				u.login AS usucre,
				CASE
					WHEN COUNT(c.usucre) IS NULL THEN 0
					ELSE COUNT(c.usucre)
				END AS carga_asignado
			FROM codificacion.cod_usuario u
			LEFT JOIN codificacion.cod_p49_p51  c ON u.login = c.usucre AND c.departamento='${departamento}' AND (c.estado_ocu = 'ASIGNADO' OR c.estado_act = 'ASIGNADO')
			WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr in ( SELECT id_usuario FROM codificacion.cod_usuario WHERE rol_id = 4 AND estado = 'A' AND cod_supvsr = ${id})
			GROUP BY u.login
			) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		} else {

			var codificadores = await (await con.query(`
		SELECT
			b.id_usuario,
			b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
			b.turno,
			b.cod_supvsr,
			b.rol_id,
			b.login,
			a.carga_asignado
			FROM (
		SELECT
			u.login AS usucre,
			CASE
				WHEN COUNT(c.usucre) IS NULL THEN 0
				ELSE COUNT(c.usucre)
			END AS carga_asignado
		FROM codificacion.cod_usuario u
		LEFT JOIN codificacion.cod_${tabla_id}  c ON u.login = c.usucre AND c.estado = 'ASIGNADO' AND c.departamento='${departamento}'
		WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr in (SELECT id_usuario FROM codificacion.cod_usuario WHERE rol_id = 4 AND estado = 'A' AND cod_supvsr = ${id})
		GROUP BY u.login
		) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		}

	}

};



// Listar supervisores con carga para reasignar carga
const supervisoresConCarga = async (req, res) => {

	var {
		id, // id del supervisor
		tabla_id,
		departamento
	} = req.body;

	// averiguar si es supervisor o jefe de turno
	const rol = await (await con.query(`SELECT rol_id FROM codificacion.cod_usuario WHERE id_usuario = ${id}`)).rows[0].rol_id;

	var total_carga_asignado = 0;

	// si es supervisor (Lista de codificadores de sus codificadores)
	if (rol == 4) {

		// verificamos si tabla_id
		if (tabla_id === 'p49_p51') {
			console.log("cod_p49_p51");
			var codificadores = await (await con.query(`
			SELECT
				b.id_usuario,
				b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
				b.turno,
				b.cod_supvsr,
				b.rol_id,
				b.login,
				a.carga_asignado
				FROM (
			SELECT
				u.login AS usucre,
				CASE
					WHEN COUNT(c.usucre) IS NULL THEN 0
					ELSE COUNT(c.usucre)
				END AS carga_asignado
			FROM codificacion.cod_usuario u
			LEFT JOIN codificacion.cod_p49_p51  c ON u.login = c.usucre AND c.departamento='${departamento}' AND (c.estado_ocu = 'ASIGNADO' OR c.estado_act = 'ASIGNADO')
			WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr = ${id}
			GROUP BY u.login
			) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		} else {

			var codificadores = await (await con.query(`
		SELECT
			b.id_usuario,
			b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
			b.turno,
			b.cod_supvsr,
			b.rol_id,
			b.login,
			a.carga_asignado
			FROM (
		SELECT
			u.login AS usucre,
			CASE
				WHEN COUNT(c.usucre) IS NULL THEN 0
				ELSE COUNT(c.usucre)
			END AS carga_asignado
		FROM codificacion.cod_usuario u
		LEFT JOIN codificacion.cod_${tabla_id}  c ON u.login = c.usucre AND c.estado = 'ASIGNADO' AND c.departamento='${departamento}'
		WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr = ${id}
		GROUP BY u.login
		) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		}

	}



	// si es jefe de turno (Lista de codificadores de sus supervisores)
	if (rol == 3) {

		// verificamos si tabla_id
		if (tabla_id === 'p49_p51') {
			console.log("cod_p49_p51");
			var codificadores = await (await con.query(`
			SELECT
				b.id_usuario,
				b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
				b.turno,
				b.cod_supvsr,
				b.rol_id,
				b.login,
				a.carga_asignado
				FROM (
			SELECT
				u.login AS usucre,
				CASE
					WHEN COUNT(c.usucre) IS NULL THEN 0
					ELSE COUNT(c.usucre)
				END AS carga_asignado
			FROM codificacion.cod_usuario u
			LEFT JOIN codificacion.cod_p49_p51  c ON u.login = c.usucre AND c.departamento='${departamento}' AND (c.estado_ocu = 'ASIGNADO' OR c.estado_act = 'ASIGNADO')
			WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr in ( SELECT id_usuario FROM codificacion.cod_usuario WHERE rol_id = 4 AND estado = 'A' AND cod_supvsr = ${id})
			GROUP BY u.login
			) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		} else {

			var codificadores = await (await con.query(`
		SELECT
			b.id_usuario,
			b.nombres || ' ' || b.pr_apellido || ' ' || b.sg_apellido nombre_completo,
			b.turno,
			b.cod_supvsr,
			b.rol_id,
			b.login,
			a.carga_asignado
			FROM (
		SELECT
			u.login AS usucre,
			CASE
				WHEN COUNT(c.usucre) IS NULL THEN 0
				ELSE COUNT(c.usucre)
			END AS carga_asignado
		FROM codificacion.cod_usuario u
		LEFT JOIN codificacion.cod_${tabla_id}  c ON u.login = c.usucre AND c.estado = 'ASIGNADO' AND c.departamento='${departamento}'
		WHERE u.rol_id = 5 AND u.estado ILIKE 'A' AND u.cod_supvsr in (SELECT id_usuario FROM codificacion.cod_usuario WHERE rol_id = 4 AND estado = 'A' AND cod_supvsr = ${id})
		GROUP BY u.login
		) a JOIN codificacion.cod_usuario b ON a.usucre = b.login
		`)).rows;

			// foreach en codificadores para sumar la carga asignada
			for (let i = 0; i < codificadores.length; i++) {
				total_carga_asignado += Number(codificadores[i].carga_asignado);
			}

			res.status(200).json({
				datos: codificadores,
				total_carga_asignado: total_carga_asignado
			})
			return;
		}

	}

};




// Lista de supervisores sin carga
const supervisoresSinCarga = async (req, res) => {
	let id = req.params.id;

	console.log("Lista de Supsssss!!!!!!!!!!");
	const query = {
		text: `
		SELECT
		    id_usuario,
		    nombres || ' ' || pr_apellido || ' ' || sg_apellido nombre_completo,
		    nombres,
		    pr_apellido,
		    sg_apellido,
		    turno,
		    cod_supvsr,
		    rol_id,
		    login,
			0 total,
    		false activo
		FROM codificacion.cod_usuario WHERE rol_id =4 AND estado ILIKE 'A'
		`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
}





// Supervisión individual simple
const cargarParaSupervisionSimple = async (req, res) => {
	const { tabla_id, id_usuario, login } = req.body;

	console.log("cargar Para Supervision Simple");
	console.log(req.body);

	// si tabla_id es p20esp
	if (tabla_id === 'p20esp') {
		// consulta
		const qr = await (await con.query(`
				SELECT 
					'' contexto,
					id_p20esp as id_pregunta, 
					sec_cuestionario as secuencial, 
					i00, 
					i001a, 
					p20nro, 
					respuesta, 
					codigocodif, 
					codigocodif_v1, 
					codigocodif_v2, 
					estado, 
					usucre, 
					feccre, 
					usucodificador, 
					feccodificador, 
					usuverificador, 
					fecverificador, 
					usuverificador2, 
					fecverificador2, 
					respuesta_normalizada, 
					departamento, 
					orden
				FROM codificacion.cod_p20esp WHERE estado = 'CODIFICADO' AND usucodificador IN (
					SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
				);	
			`)).rows;


		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '20',
			descPreg: '¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p32esp
	if (tabla_id === 'p32esp') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p32esp as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p32esp WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_npioc';		
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '32',
			descPreg: '¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p331
	if (tabla_id === 'p331') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p331 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p331 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '33',
			descPreg: '¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p332
	if (tabla_id === 'p332') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p332 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p332 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '33',
			descPreg: '¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2',
			datos: qr,
			clasificacion: qr2
		})
		return;

	}


	// si tabla_id es p333
	if (tabla_id === 'p333') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p333 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p333 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '33',
			descPreg: '¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p341
	if (tabla_id === 'p341') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p341 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p341 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '34',
			descPreg: '¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p352a
	if (tabla_id === 'p352a') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			case 
			when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
			when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
			when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
			when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
			when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
			when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
			when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
			when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
			when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
			when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
		    end as contexto,
			id_p352a as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p352a WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_municipio
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '35',
			descPreg: '¿Dónde nació? ¿Municipio?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p353
	if (tabla_id === 'p353') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p353 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p353 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '35',
			descPreg: '¿Dónde nació? ¿País?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p362a
	if (tabla_id === 'p362a') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			case 
				when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
				when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
				when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
				when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
				when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
				when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
				when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
				when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
				when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
				when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
			end as contexto,
			id_p362a as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p362a WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_municipio
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '36',
			descPreg: '¿Dónde vive actualmente? ¿Municipio?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p363
	if (tabla_id === 'p363') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p363 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p363 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '36',
			descPreg: '¿Dónde vive actualmente? ¿País?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p372a
	if (tabla_id === 'p372a') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			case 
				when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
				when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
				when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
				when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
				when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
				when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
				when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
				when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
				when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
				when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
			end as contexto,
			id_p372a as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p372a WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_municipio
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '37',
			descPreg: '¿Dónde vivía el año 2019? ¿Municipio?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}



	// si tabla_id es p373
	if (tabla_id === 'p373') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p373 as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p373 WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '37',
			descPreg: '¿Dónde vivía el año 2019? ¿País?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p48esp
	if (tabla_id === 'p48esp') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			case 
			when p48 is not null then '<strong> Descripción: </strong>' || p48
			when p48 is null then  '<strong> Descripción: </strong>' || ' NO DEFINIDO' 
			end as contexto,
			id_p48esp as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p48esp WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: catalogo_cob
		const qr2 = await (await con.query(`
			SELECT
			id_catalogo,
			CASE
				WHEN codigo IS NULL THEN '123456'
				ELSE codigo
			END AS codigo,
			descripcion
			FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_cob'
				--SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_cob';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '48',
			descPreg: 'Las últimas 4 semanas:',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p52esp
	if (tabla_id === 'p52esp') {
		// consulta
		const qr = await (await con.query(` 
			SELECT  
			case 
			when p52 is not null then '<strong> Descripción: </strong>' || p52
			when p52 is null then  '<strong> Descripción: </strong>' || ' NO DEFINIDO' 
			end as contexto,
			id_p52esp as id_pregunta, 
			secuencial,
			respuesta,
			codigocodif,
			estado,
			usucre,
			feccre,
			usucodificador,
			feccodificador,
			usuverificador,
			fecverificador,
			usuverificador2,
			fecverificador2,
			respuesta_normalizada,
			departamento,
			orden
			FROM codificacion.cod_p52esp WHERE estado = 'CODIFICADO' AND usucodificador IN (
				SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr =${id_usuario} and rol_id = 5
			);	
		`)).rows;

		// Clasificacion a utilizar: cod_catalogo
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio_pais';
			`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '52',
			descPreg: 'Principalmente, el lugar donde trabaja está ubicado:',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}



}

// Supervisión individual doble
const cargarParaSupervisionDoble = async (req, res) => {

	const { tabla_id, id_usuario, login } = req.body;

	console.log("cargar Para Supervision Doble---");
	console.log(req.body);

	console.log("01");


	// consulta
	const qr = await (await con.query(`
	SELECT
	id_p49_p51 as id_registro,
	CONCAT(
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Cuántos años cumplidos tiene? </strong> ',p26,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Nivel educativo: </strong> ',p41a,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Curso o año: </strong> ',p41b,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Atendió cultivos agricolas o cría de animales? </strong> ',p45,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>P.48 Otro especifique: </strong> ',p48esp,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>En ese trabajo es (era): </strong> ',p50,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Lugar donde trabaja: </strong> ',p52esp,'<br>'
	) contexto,	
	estado_ocu,
	codigocodif_ocu,
	estado_act,
	codigocodif_act,
	respuesta_ocu,
	respuesta_act,
	usucodificador_ocu,
	usucodificador_act,
	(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_cob' AND  codigo = codigocodif_ocu AND unico = 1 AND estado ='ACTIVO') AS descripcion_ocu,
	(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_caeb' AND  codigo = codigocodif_act AND unico = 1 AND estado ='ACTIVO') AS descripcion_act,
	id_p49_p51, secuencial, i00, i001a, nro, p26, p41a, p41b, p45, p48esp, p50, p52, p52esp, codigocodif_v1_ocu, codigocodif_v2_ocu, feccodificador_ocu, respuesta_normalizada_ocu, codigocodif_v1_act, 
	codigocodif_v2_act, feccodificador_act, respuesta_normalizada_act, usucre, feccre, usuverificador, fecverificador, usuverificador2, fecverificador2, orden_ocu, orden_act, departamento	
	FROM codificacion.cod_p49_p51 
	WHERE (estado_ocu = 'CODIFICADO' AND  estado_act = 'CODIFICADO') AND (usucodificador_ocu NOT  LIKE 'AUTOMATICO_%' OR usucodificador_act NOT LIKE 'AUTOMATICO_%') AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario});		
	`)).rows;

	console.log("02");


	// Total carga ocupacion
	/* const qrTotalOcu = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_p49_p51
	WHERE estado_ocu = 'ASIGNADO' AND usucre='${login}';
	`)).rows; */



	// Total carga actividad
	/* const qrTotalAct = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_p49_p51
	WHERE estado_act = 'ASIGNADO' AND usucre='${login}';
	`)).rows; */



	// Total carga actividad


	// Clasificacion a utilizar para ocupacion:
	const qr2 = await (await con.query(`
	SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
	FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_cob' ORDER BY LENGTH(codigo), codigo ASC
	`)).rows;

	console.log("03");

	// Clasificacion a utilizar para actividad economica:
	const qr3 = await (await con.query(`
	SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
	FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_caeb' ORDER BY LENGTH(codigo), codigo ASC
	`)).rows;

	console.log("04");

	// Respuesta
	res.status(200).json({
		totalCarga: qr.length,
		totalCarga_ocu: qr.length,   // qrTotalOcu[0].count,
		totalCarga_act: qr.length,  // qrTotalAct[0].count,
		nroPreg_ocu: '49',
		nroPreg_act: '51',
		descPreg_ocu: '¿Cuál es (era) su trabajo, ocupación u oficio principal?',
		descPreg_act: 'Principalmente, ¿qué produce, vende o a que actividad se dedica el lugar o establecimiento donde trabaja?',
		datos: qr,
		clasificacion_ocu: qr2,
		clasificacion_act: qr3
	})

	console.log("05");




	/* 
	const qr = await (await con.query(`
			SELECT 
			id_p49_p51 as id_registro,
			estado_ocu,
			codigocodif_ocu,
			estado_act,
			codigocodif_act,
			respuesta_ocu,
			respuesta_act,
			usucodificador_ocu,
			usucodificador_act,
			(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_cob' AND  codigo = codigocodif_ocu AND unico = 1 AND estado ='ACTIVO') AS descripcion_ocu,
			(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_caeb' AND  codigo = codigocodif_act AND unico = 1 AND estado ='ACTIVO') AS descripcion_act,
			CONCAT(p26) contexto_edad,
			CONCAT(p41a) contexto_nivel_edu,
			CONCAT(p41b) contexto_curso,
			CONCAT(p45) contexto_atendio,
			CONCAT(p48esp) contexto_otro,
			CONCAT(p50) contexto_es_era,
			CONCAT(p52esp) contexto_lugar_trabajo
		FROM codificacion.cod_p49_p51
		WHERE (estado_ocu = 'CODIFICADO' AND  estado_act = 'CODIFICADO') AND (usucodificador_ocu NOT  LIKE 'AUTOMATICO_%' OR usucodificador_act NOT LIKE 'AUTOMATICO_%') AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario});		
		`)).rows;
	*/
}




const cargarParaCodificarSimple = async (req, res) => {

	const { tabla_id, id_usuario, login } = req.body;


	console.log("cargar Para Codificar Simple");
	console.log(req.body);


	// si tabla_id es p20esp
	if (tabla_id === 'p20esp') {

		// consulta
		const qr = await (await con.query(`
		SELECT 
			'' contexto,
			id_p20esp as id_pregunta, 
			sec_cuestionario as secuencial, 
			i00, 
			i001a, 
			p20nro, 
			respuesta, 
			codigocodif, 
			codigocodif_v1, 
			codigocodif_v2, 
			estado, 
			usucre, 
			feccre, 
			usucodificador, 
			feccodificador, 
			usuverificador, 
			fecverificador, 
			usuverificador2, 
			fecverificador2, 
			respuesta_normalizada, 
			departamento, 
			orden
		FROM codificacion.cod_p20esp
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
		SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '20',
			descPreg: '¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p32esp
	if (tabla_id === 'p32esp') {

		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p32esp as id_pregunta, 
			secuencial,
			id_p32esp, secuencial, i00, i001a, nro, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
			FROM codificacion.cod_p32esp
			WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;


		// Clasificacion a utilizar: catalogo_npioc
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_npioc';		
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '32',
			descPreg: '¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p331
	if (tabla_id === 'p331') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p331 as id_pregunta, 
			secuencial,
			i00, i001a, nro, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
			FROM codificacion.cod_p331
			WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
			
		`)).rows;


		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '33',
			descPreg: '¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}



	// si tabla_id es p332
	if (tabla_id === 'p332') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p332 as id_pregunta, 
			secuencial,
			i00, i001a, nro, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
			FROM codificacion.cod_p332
			WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;


		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '33',
			descPreg: '¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p333
	if (tabla_id === 'p333') {
		// consulta
		const qr = await (await con.query(`
			SELECT  
			'' contexto,
			id_p333 as id_pregunta, 
			secuencial,
			i00, i001a, nro, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
			FROM codificacion.cod_p333
			WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
		SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '33',
			descPreg: '¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p341
	if (tabla_id === 'p341') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		'' contexto,
		id_p341 as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p341 
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_idioma
		const qr2 = await (await con.query(`
		SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '34',
			descPreg: '¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p352a
	if (tabla_id === 'p352a') {
		// consulta
		const qr = await (await con.query(`
		SELECT  	
		case 
			when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
			when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
			when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
			when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
			when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
			when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
			when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
			when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
			when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
			when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
		end as contexto,
		id_p352a as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p352b, p353, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden, apoyo
		FROM codificacion.cod_p352a
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_municipio
		const qr2 = await (await con.query(`
				SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;


		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '35',
			descPreg: '¿Dónde nació? ¿Municipio?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p353
	if (tabla_id === 'p353') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		'' contexto,
		id_p353 as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p352a, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p353
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
		SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '35',
			descPreg: '¿Dónde nació? ¿País?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p362a
	if (tabla_id === 'p362a') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		case 
			when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
			when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
			when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
			when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
			when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
			when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
			when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
			when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
			when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
			when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
		end as contexto,
		id_p362a as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p362b, p363, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p362a
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_municipio
		const qr2 = await (await con.query(`
				SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '36',
			descPreg: '¿Dónde vive habitualmente? ¿Municipio?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p363
	if (tabla_id === 'p363') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		'' contexto,
		id_p363 as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p362a, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p363
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
				SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;


		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '36',
			descPreg: '¿Dónde vive habitualmente? ¿País?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

	// si tabla_id es p372a
	if (tabla_id === 'p372a') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		case 
			when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
			when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
			when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
			when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
			when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
			when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
			when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
			when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
			when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
			when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
		end as contexto,
		id_p372a as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p372b, p373, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p372a
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_municipio
		const qr2 = await (await con.query(`
				SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;


		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '37',
			descPreg: '¿Dónde vivía el año 2019? ¿Municipio?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}



	// si tabla_id es p373
	if (tabla_id === 'p373') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		'' contexto,
		id_p373 as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p372a, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p373
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_pais
		const qr2 = await (await con.query(`
				SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;


		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '37',
			descPreg: '¿Dónde vivía el año 2019? ¿País?',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p48esp
	if (tabla_id === 'p48esp') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		case 
		when p48 is not null then '<strong> Descripción: </strong>' || p48
		when p48 is null then  '<strong> Descripción: </strong>' || ' NO DEFINIDO' 
		end as contexto,
		id_p48esp as id_pregunta, 
		secuencial,
		case 
		when p26 is not null then p26
		when p26 is null then  '' 
		end as edad,		
		i00, i001a, nro, respuesta, p48, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p48esp
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: catalogo_cob
		const qr2 = await (await con.query(`
			SELECT
			id_catalogo,
			CASE
				WHEN codigo IS NULL THEN '123456'
				ELSE codigo
			END AS codigo,
			descripcion
			FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_cob'
				--SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_cob';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '48',
			descPreg: 'Las últimas 4 semanas:',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}


	// si tabla_id es p52esp
	if (tabla_id === 'p52esp') {
		// consulta
		const qr = await (await con.query(`
		SELECT  
		case 
		when p52 is not null then '<strong> Descripción: </strong>' || p52
		when p52 is null then  '<strong> Descripción: </strong>' || ' NO DEFINIDO' 
		end as contexto,
		id_p52esp as id_pregunta, 
		secuencial,
		i00, i001a, nro, respuesta, p52, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada, departamento, orden
		FROM codificacion.cod_p52esp
		WHERE estado ='ASIGNADO' and usucre = '${login}';
		`)).rows;

		// Clasificacion a utilizar: cod_catalogo
		const qr2 = await (await con.query(`
		SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio_pais';
		`)).rows;

		// Respuesta
		res.status(200).json({
			totalCarga: qr.length,
			nroPreg: '52',
			descPreg: 'Principalmente, el lugar donde trabaja está ubicado:',
			datos: qr,
			clasificacion: qr2
		})
		return;
	}

}

const cargarParaCodificarDoble = async (req, res) => {
	const { tabla_id, id_usuario, login } = req.body;

	console.log("cargar Para Codificar Simple");
	console.log(req.body);

	// consulta
	const qr = await (await con.query(`
	SELECT
	CONCAT(
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Cuántos años cumplidos tiene? </strong> ',p26,' ',
		'<strong class=''ml-4'' style=''font-weight: normal; color:rgb(14, 149, 83);''>Nivel educativo: </strong> ',p41a,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Curso o año: </strong> ',p41b,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Atendió cultivos agricolas o cría de animales? </strong> ',p45,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>P.48 Otro especifique: </strong> ',p48esp,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>En ese trabajo es (era): </strong> ',p50,'<br>',
		'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Lugar donde trabaja: </strong> ',p52esp,'<br>'
	) contexto,	
	id_p49_p51, secuencial, i00, i001a, nro, p26, p41a, p41b, p45, p48esp, respuesta_ocu, p50, respuesta_act, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, estado_ocu, usucodificador_ocu, feccodificador_ocu, respuesta_normalizada_ocu, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, estado_act, usucodificador_act, feccodificador_act, respuesta_normalizada_act, usucre, feccre, usuverificador, fecverificador, usuverificador2, fecverificador2, orden_ocu, orden_act, departamento
	FROM codificacion.cod_p49_p51 WHERE (estado_ocu = 'ASIGNADO' or estado_act ='ASIGNADO') AND usucre='${login}'  ORDER BY id_p49_p51 asc;
	`)).rows;



	// Total carga ocupacion
	const qrTotalOcu = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_p49_p51
	WHERE estado_ocu = 'ASIGNADO' AND usucre='${login}';
	`)).rows;



	// Total carga actividad
	const qrTotalAct = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_p49_p51
	WHERE estado_act = 'ASIGNADO' AND usucre='${login}';
	`)).rows;



	// Total carga actividad

	// Clasificacion a utilizar para ocupacion:
	const qr2 = await (await con.query(`
	SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
	FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_cob' ORDER BY LENGTH(codigo), codigo ASC
	`)).rows;


	// Clasificacion a utilizar para actividad economica:
	const qr3 = await (await con.query(`
	SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
	FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_caeb' ORDER BY LENGTH(codigo), codigo ASC
	`)).rows;


	// Respuesta
	res.status(200).json({
		totalCarga: qr.length,
		totalCarga_ocu: qrTotalOcu[0].count,
		totalCarga_act: qrTotalAct[0].count,
		nroPreg_ocu: '49',
		nroPreg_act: '51',
		descPreg_ocu: '¿Cuál es (era) su trabajo, ocupación u oficio principal?',
		descPreg_act: 'Principalmente, ¿qué produce, vende o a que actividad se dedica el lugar o establecimiento donde trabaja?',
		datos: qr,
		clasificacion_ocu: qr2,
		clasificacion_act: qr3
	})

}







const codificadoresConCarga_old = async (req, res) => {
	//let id = req.params.id;

	const { id, pregunta } = req.body;
	// console.log("codificadores Con Carga ")


	// averiguamos todos los codificadores de un supervisor
	const queryCod = `
	SELECT
		id_usuario, nombres || ' ' || pr_apellido || ' ' || sg_apellido nombre_completo,login
	FROM codificacion.cod_usuario WHERE rol_id =5 AND estado ILIKE 'A' and cod_supvsr = 2
	`
	// ejecutamos la consulta
	const codificadores = (await con.query(queryCod)).rows;

	// por cada codificador averiguamos cuantas encuestas tiene asignadas
	for (let i = 0; i < codificadores.length; i++) {
		const queryEnc = `
		select count(1) from codificacion.cod_${pregunta} WHERE estado = 'ASIGNADO' and usucre = '${codificadores[i].login}'
		--SELECT count(*) FROM codificacion.cod_encuesta_codificacion WHERE estado = 'ASIGNADO' AND id_pregunta = ${pregunta} AND usucre = '${codificadores[i].login}'
		`
		codificadores[i].total_asignado = (await con.query(queryEnc)).rows[0].count;
	}


	console.table(codificadores);



	/* 	const query = {
			text: `
			SELECT
				id_usuario,
				nombres || ' ' || pr_apellido || ' ' || sg_apellido nombre_completo,
				nombres,
				pr_apellido,
				sg_apellido,
				turno,
				cod_supvsr,
				rol_id,
				login,
				0 total,
				false activo
			FROM codificacion.cod_usuario WHERE rol_id =5 AND estado ILIKE 'A' and cod_supvsr = ${id}
	
			--SELECT * FROM ${esquema}.cod_usuario WHERE rol_id =5 AND estado ILIKE 'A' and cod_supvsr = ${id}
			`,
		}; */
	res.status(200).json({
		datos: codificadores,
	})
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const supervisores = async (req, res) => {
	const query = {
		text: `SELECT * FROM ${esquema}.cod_usuario WHERE rol_id=5 AND estado ILIKE 'A'`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reasignar = async (req, res) => {
	let params = req.body;
	let query = ""
	/*		if(params.id_pregunta==125 || params.id_pregunta==127){ 
				query = {
			text: `select su.login,nombres, apellidos,case when ce.usucre is null then 0 else count(*) end 
				from ${esquema}.cod_usuario su
				left join (select * from ${esquema}.cod_encuesta_codificacion where departamento=$1
				and estado='ASIGNADO' and (id_pregunta=$2 or id_pregunta in (125,127))) ce on ce.usucre=su.login 
				where su.rol_id=6 and su.estado='A'
				group by su.login,apellidos, nombres,ce.usucre order by su.login`, 
			values: [
				params.id_departamento,
				params.id_pregunta
			],
		};
	}
	else {*/
	query = {
		text: `select su.login,nombres, apellidos,case when ce.usucre is null then 0 else count(*) end 
			from ${esquema}.cod_usuario su
			left join (select * from ${esquema}.cod_encuesta_codificacion where departamento=$1
			and estado='ASIGNADO' and id_pregunta=$2) ce on ce.usucre=su.login 
			where su.rol_id=6 and su.estado='A'
			group by su.login,apellidos, nombres,ce.usucre order by su.login`,
		values: [
			params.id_departamento,
			params.id_pregunta
		],
	};

	//};
	//console.log(params)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reasignarsup = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select su.login,nombres, apellidos,case when ce.usucre is null then 0 else count(*) end 
			from ${esquema}.cod_usuario su
			left join (select * from ${esquema}.cod_encuesta_codificacion where departamento=$1
			and estado='ASIGNASUP' and id_pregunta=$2) ce on ce.usucre=su.login 
			where su.rol_id=5 and su.estado='A'
			group by su.login,apellidos, nombres,ce.usucre order by su.login`,
		values: [
			params.id_departamento,
			params.id_pregunta
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getCantidadDptoPregArea = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select a.departamento,
		(select nombre_depto from cartografia.departamentos where codigo_depto=a.departamento) as nombre,
		a.id_pregunta,
		(select pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as pregunta,
		count(*) from ${esquema}.cod_encuesta_codificacion a
		where a.estado=$1 AND a.departamento = $2 and a.id_pregunta = $3 and id_pregunta not in (125,127)
		group by a.departamento,a.id_pregunta
		union all
		select depto, nombre, 125 id_pregunta, 'Preguntas 48-50: Ocupación - Actividad Económica' pregunta, count(*) cuenta 
		from  
		(select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
		ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento as depto,
		(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre, ceco.estado estado
		from ${esquema}.cod_encuesta_codificacion ceco
			inner join ${esquema}.cod_encuesta_codificacion ceca
			on ceco.id_informante = ceca.id_informante
		where ceco.id_pregunta =$3 and ceca.id_pregunta=case when ceco.id_pregunta = 125 then 127 else -1 end  
		--and ceca.estado ilike $1 and ceca.departamento ilike $2
		--and ceco.estado ilike $1 and ceco.departamento ilike $2) x
		and ((ceca.estado ilike 'ELABORADO' and ceco.estado ='CODIFICADO') OR (ceca.estado ilike 'CODIFICADO' and ceco.estado ='ELABORADO') OR (ceca.estado ilike 'ELABORADO' and ceco.estado ='ELABORADO')) and ceca.departamento ilike $2
		and ceco.departamento ilike $2) x
		group  by  depto, nombre
		order by departamento,pregunta`,
		values: [
			params.estado,
			params.departamento,
			params.id_preg,
		],
	};
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateInicializarUsr = async (req, res) => {
	let params = req.body;
	let query = ""
	if (params.id_pregunta == 125) {
		query = {
			text: `UPDATE ${esquema}.cod_encuesta_codificacion SET estado='ELABORADO',usucre='admin' 
			where id_pregunta in ($1,127) and departamento=$2 and usucre=$3 and estado='ASIGNADO'`,
			values: [
				params.id_pregunta,
				params.departamento,
				params.usuario
			],
		};
	} else {
		query = {
			text: `UPDATE ${esquema}.cod_encuesta_codificacion SET estado='ELABORADO',usucre='admin' 
			where id_pregunta=$1 and departamento=$2 and usucre=$3 and estado='ASIGNADO'`,
			values: [
				params.id_pregunta,
				params.departamento,
				params.usuario
			],
		};
	}
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateInicializarUsrSup = async (req, res) => {
	let params = req.body;
	let query = ""
	if (params.id_pregunta == 125) {
		query = {
			text: `UPDATE ${esquema}.cod_encuesta_codificacion SET estado='CODIFICADO',usucre=usucodificador
				where id_pregunta in ($1, 127) and departamento=$2 and usucre=$3 and estado='ASIGNASUP'`,
			values: [
				params.id_pregunta,
				params.departamento,
				params.usuario
			],
		};
	} else {
		query = {
			text: `UPDATE ${esquema}.cod_encuesta_codificacion SET estado='CODIFICADO',usucre=usucodificador
				where id_pregunta = $1 and departamento=$2 and usucre=$3 and estado='ASIGNASUP'`,
			values: [
				params.id_pregunta,
				params.departamento,
				params.usuario
			],
		};
	}
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};






const updateAsignado_ = async (req, res) => {
	let id = req.params.id;
	let parametro = req.body;
	query = ''

	/* if (id == 125) {
		parametro.forEach(params => {
			const consulta = `update ${esquema}.cod_encuesta_codificacion cecupd
			set estado='ASIGNADO', usucre='${params.usucre}' from
			(select distinct ceco.id_informante oc_id_inf, ceco.id_encuesta oc_id_enc, ceco.id_pregunta oc_id_preg, ceco.departamento,ceco.estado,
			ceca.id_informante ac_id_inf, ceca.id_encuesta ac_id_enc, ceca.id_pregunta ac_id_preg, ceca.departamento, ceca.estado
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta = 125 and ceca.id_pregunta=127 and ceco.departamento = '${params.departamento}' and 
			 (ceco.estado='ELABORADO' or ceca.estado = 'ELABORADO') limit ${params.count}) x 
			WHERE case when cecupd.id_pregunta=125 then 
				cecupd.id_informante = x.oc_id_inf and cecupd.id_encuesta = x.oc_id_enc 
				and cecupd.id_pregunta=x.oc_id_preg else 
				cecupd.id_informante = x.ac_id_inf and cecupd.id_encuesta = x.ac_id_enc 
				and cecupd.id_pregunta=x.ac_id_preg
			end and cecupd.id_pregunta in (125,127) ; `
			//end and cecupd.id_pregunta in (125,127) and codigocodif is null; `
			query += consulta
		});
	} else {
		parametro.forEach(params => {
			const consulta = `WITH cte AS (select * from ${esquema}.cod_encuesta_codificacion where estado ilike 'ELABORADO'
				and id_pregunta not in (125,127) and id_pregunta=${id} and departamento='${params.departamento}' limit ${params.count})
				update ${esquema}.cod_encuesta_codificacion
				set estado='${params.estado}',usucre='${params.usucre}'
				from cte c join ${esquema}.cod_variables b on c.id_pregunta=b.id_pregunta
				where c.id_informante = ${esquema}.cod_encuesta_codificacion.id_informante
				and c.id_encuesta = ${esquema}.cod_encuesta_codificacion.id_encuesta
				and ${esquema}.cod_encuesta_codificacion.estado='ELABORADO'
				and ${esquema}.cod_encuesta_codificacion.id_pregunta=${id}; `
			query += consulta
		});
	} */
	//console.log(query)
	/* await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack)); */
};



// Asignación de carga a codificadores
const updateAsignado = async (req, res) => {
	let tabla_id = req.params.id;
	let parametro = req.body;
	console.log("------------------------------------------Nueva asignacion-------------------------------------------");

	console.table(parametro);

	// Si el parametro es un array y su longitud es 0, se retorna un error
	if (parametro.length == 0) {
		// Mesaje de retorno
		res.status(200).json({
			success: false,
			message: 'No hay cantidad para asignar.'
		});
		return;
	}


	// Verificamos is es simple o doble
	if (tabla_id == 'p49_p51') {

		// Total de carga que llega del front 
		var total_carga = 0;
		parametro.forEach(paramss => { total_carga += paramss.count; });


		// Carga disponible 
		const result = await (await con.query(
			`SELECT count(1) FROM codificacion.cod_p49_p51 WHERE (estado_ocu='ELABORADO' OR estado_act = 'ELABORADO') and departamento = '${parametro[0].departamento}';`
		)).rows;


		// Si la cantidad de carga es mayor a la disponible, se retorna un error
		if (total_carga > result[0].count) {
			res.status(200).json({
				success: false,
				message: 'No hay carga disponible. Cancele la asignación y vuelva a intentar.'
			});
			return;
		}


		var qr = '';
		for (let i = 0; i < parametro.length; i++) {
			var params = parametro[i];
			qr = `
			UPDATE codificacion.cod_p49_p51 cdf SET
					estado_ocu = CASE
						WHEN cdf.estado_ocu = 'ELABORADO' THEN 'ASIGNADO'
						ELSE cdf.estado_ocu
					END,
					estado_act = CASE
						WHEN cdf.estado_act = 'ELABORADO' THEN 'ASIGNADO'
						ELSE cdf.estado_act
					END,
					usucre = '${params.usucre}'
				FROM (
					SELECT
						id_p49_p51,
						respuesta_ocu,
						codigocodif_ocu,
						estado_ocu,
						usucodificador_ocu,
						respuesta_act,
						codigocodif_act,
						estado_act,
						usucodificador_act,
						usucre
					FROM codificacion.cod_p49_p51
					WHERE (estado_ocu = 'ELABORADO' OR estado_act = 'ELABORADO') and departamento='${parametro[0].departamento}'
					LIMIT ${params.count}
				) x
				WHERE cdf.id_p49_p51 = x.id_p49_p51; 
			`;
			console.log(qr);
			await con.query(qr);
		}

		// Mensaje de retorno de la asignacion
		res.status(200).json({
			success: true,
			message: 'Se ha asignado correctamente.'
		});

		return;
	} else {
		// Total de carga
		var total_carga = 0;
		parametro.forEach(paramss => { total_carga += paramss.count; });


		// Veririfica disponibilidad de carga
		const queryDisp = `
		SELECT count(1) from codificacion.cod_${tabla_id} where estado = 'ELABORADO' and departamento = '${parametro[0].departamento}';`
		const result = await (await con.query(queryDisp)).rows;

		// Si la cantidad de carga es mayor a la disponible, se retorna un error
		if (total_carga > result[0].count) {
			// Mensaje de retorno
			res.status(200).json({
				success: false,
				message: 'No hay carga disponible. Cancele la asignación y vuelva a intentar.'
			});
			return;
		}

		// Asignacion de carga
		var tabla = 'cod_' + tabla_id;
		var id = 'id_' + tabla_id;
		query = '';

		parametro.forEach(params => {
			const consulta = `
						WITH cte AS (select * from codificacion.${tabla} where estado ilike 'ELABORADO' and departamento='${parametro[0].departamento}' limit ${params.count})
						update codificacion.${tabla} set estado='${params.estado}',usucre='${params.usucre}' FROM cte c
						where codificacion.${tabla}.${id} = c.${id} and codificacion.${tabla}.estado='ELABORADO';`
			query += consulta
		});
		await con.query(query)

		// Mensaje de retorno de la asignacion
		res.status(200).json({
			success: true,
			message: 'Se ha asignado correctamente.'
		});

		return;
	}

};


// Reasignación de carga a codificadores
const updateReAsignado = async (req, res) => {
	let tabla_id = req.params.id;
	let parametro = req.body;

	//var tabla = 'cod_' + tabla_id;
	//var id = 'id_' + tabla_id;
	var query = '';


	console.log("------------------------------------------Nueva Re-Asignacion-------------------------------------------");

	console.table(parametro);

	// Si el parametro es un array y su longitud es 0, se retorna un error
	if (parametro.length == 0) {
		// Mesaje de retorno
		res.status(200).json({
			success: false,
			message: 'No hay cantidad para reasignar.'
		});
		return;
	}

	// Reasingacion de carga 
	if (tabla_id !== 'p49_p51') {

		// Modificamos todos los registros a ELABORADO
		parametro.forEach(params => {
			const consulta = `
				update codificacion.cod_${tabla_id} set estado='ELABORADO', usucre='admin'
				where estado='ASIGNADO' and departamento='${params.departamento}' and usucre='${params.usucre}';
			`
			query += consulta
		});
		// Ejectuamos la consulta
		await con.query(query);


		// ReAsignacion de carga
		var tabla = 'cod_' + tabla_id;
		var id = 'id_' + tabla_id;
		query2 = '';

		parametro.forEach(params => {
			const consulta = `
						WITH cte AS (select * from codificacion.${tabla} where estado ilike 'ELABORADO' and departamento='${parametro[0].departamento}' limit ${params.carga_asignado})
						update codificacion.${tabla} set estado='ASIGNADO',usucre='${params.usucre}' FROM cte c
						where codificacion.${tabla}.${id} = c.${id} and codificacion.${tabla}.estado='ELABORADO';`
			query2 += consulta
		});
		// Ejectuamos la consulta
		await con.query(query2);

		res.status(200).json({
			success: true,
			message: 'Reasignacion correcta.'
		});

		return;

	} else {

		// Modificamos todos los registros  a ELABORADO
		parametro.forEach(params => {
			const consulta = `
				UPDATE codificacion.cod_p49_p51 cdf SET
				estado_ocu = CASE
						WHEN cdf.estado_ocu = 'ASIGNADO'  THEN 'ELABORADO'
						-- WHEN cdf.estado_ocu <> 'ASIGNADO'  THEN 'ELABORADO'
						-- 	WHEN cdf.estado_ocu = 'ASIGNADO'  THEN 'ELABORADO'
						ELSE cdf.estado_ocu
					END,
					estado_act = CASE
						--WHEN cdf.estado_act <> 'ASIGNADO' THEN 'ELABORADO'
						WHEN cdf.estado_act = 'ASIGNADO' THEN 'ELABORADO'
						--WHEN cdf.estado_act = 'ASIGNADO' THEN 'ELABORADO'
						ELSE cdf.estado_act
					END,
					usucre = 'admin'
				FROM (
					SELECT
						id_p49_p51,
						respuesta_ocu,
						codigocodif_ocu,
						estado_ocu,
						usucodificador_ocu,
						respuesta_act,
						codigocodif_act,
						estado_act,
						usucodificador_act,
						usucre
					FROM codificacion.cod_p49_p51
					WHERE (estado_ocu = 'ASIGNADO' OR estado_act = 'ASIGNADO') and departamento='${params.departamento}' and  usucre = '${params.usucre}'
				) x
				WHERE cdf.id_p49_p51 = x.id_p49_p51;
			`
			// Ejectuamos la consulta
			query += consulta
		});
		// Ejectuamos la consulta
		await con.query(query);




		// Nuevamente reasignamos la carga
		var qr = '';
		for (let i = 0; i < parametro.length; i++) {
			var params = parametro[i];
			qr = `
			UPDATE codificacion.cod_p49_p51 cdf SET
					estado_ocu = CASE
						WHEN cdf.estado_ocu = 'ELABORADO' THEN 'ASIGNADO'
						--WHEN cdf.estado_ocu <> 'ELABORADO' AND cdf.estado_act = 'ELABORADO' THEN 'ASIGNADO'
						--WHEN cdf.estado_ocu = 'ELABORADO' AND cdf.estado_act = 'ELABORADO' THEN 'ASIGNADO'
						ELSE cdf.estado_ocu
					END,
					estado_act = CASE
						--WHEN df.estado_act <> 'ELABORADO' THEN 'ASIGNADO'
						--WHEN cdf.estado_ocu <> 'ELABORADO' AND cdf.estado_act = 'ELABORADO' THEN 'ASIGNADO'
						WHEN cdf.estado_act = 'ELABORADO' THEN 'ASIGNADO'
						ELSE cdf.estado_act
					END,
					usucre = '${params.usucre}'
				FROM (
					SELECT
						id_p49_p51,
						respuesta_ocu,
						codigocodif_ocu,
						estado_ocu,
						usucodificador_ocu,
						respuesta_act,
						codigocodif_act,
						estado_act,
						usucodificador_act,
						usucre
					FROM codificacion.cod_p49_p51
					WHERE (estado_ocu = 'ELABORADO' OR estado_act = 'ELABORADO') and departamento='${parametro[0].departamento}'
					LIMIT ${params.carga_asignado}
				) x
				WHERE cdf.id_p49_p51 = x.id_p49_p51; 
			`;
			//console.log(qr);
			await con.query(qr);
		}


		res.status(200).json({
			success: true,
			message: 'Reasignacion correcta.'
		});
		return;
	}

};




// Asignación de carga a supervisores
const updateAsignadoSup = async (req, res) => {
	let tabla_id = req.params.id;
	let parametro = req.body;
	console.log("------------------------------------------Nueva asignacion de carga a Supervisor-------------------------------------------");

	console.table(parametro);

	// Si el parametro es un array y su longitud es 0, se retorna un error
	if (parametro.length == 0) {
		// Mesaje de retorno
		res.status(200).json({
			success: false,
			message: 'No hay cantidad para asignar.'
		});
		return;
	}


	// Verificamos is es simple o doble
	if (tabla_id == 'p49_p51') {

		// Total de carga que llega del front 
		var total_carga = 0;
		parametro.forEach(paramss => { total_carga += paramss.count; });


		// Carga disponible 
		const result = await (await con.query(
			`SELECT count(1) FROM codificacion.cod_p49_p51 WHERE (estado_ocu='CODIFICADO' OR estado_act = 'CODIFICADO') and departamento = '${parametro[0].departamento}';`
		)).rows;


		// Si la cantidad de carga es mayor a la disponible, se retorna un error
		if (total_carga > result[0].count) {
			res.status(200).json({
				success: false,
				message: 'No hay carga disponible. Cancele la asignación y vuelva a intentar.'
			});
			return;
		}


		var qr = '';
		for (let i = 0; i < parametro.length; i++) {
			var params = parametro[i];
			qr = `
			UPDATE codificacion.cod_p49_p51 cecupd SET
				estado_ocu = 'ASIGNASUP',
				estado_act = 'ASIGNASUP',
				usucre = '${params.usucre}'
			FROM (
					SELECT
						id_p49_p51,
						respuesta_ocu,
						codigocodif_ocu,
						estado_ocu,
						usucodificador_ocu,
						respuesta_act,
						codigocodif_act,
						estado_act,
						usucodificador_act,
						usucre
					FROM codificacion.cod_p49_p51
					WHERE (estado_ocu = 'CODIFICADO' OR estado_act = 'CODIFICADO') and departamento='${parametro[0].departamento}'
					LIMIT ${params.count}
				) x
			WHERE cecupd.id_p49_p51 = x.id_p49_p51; 
			`;
			console.log(qr);
			await con.query(qr);
		}

		// Mensaje de retorno de la asignacion
		res.status(200).json({
			success: true,
			message: 'Se ha asignado correctamente.'
		});

		return;
	} else {
		// Total de carga
		var total_carga = 0;
		parametro.forEach(paramss => { total_carga += paramss.count; });


		// Veririfica disponibilidad de carga
		const queryDisp = `
		SELECT count(1) from codificacion.cod_${tabla_id} where estado = 'CODIFICADO' AND usucodificador = 'AUTOMATICO_NORMALIZADO' and departamento = '${parametro[0].departamento}';`
		const result = await (await con.query(queryDisp)).rows;

		// Si la cantidad de carga es mayor a la disponible, se retorna un error
		if (total_carga > result[0].count) {
			// Mensaje de retorno
			res.status(200).json({
				success: false,
				message: 'No hay carga disponible. Cancele la asignación y vuelva a intentar.'
			});
			return;
		}

		// Asignacion de carga
		var tabla = 'cod_' + tabla_id;
		var id = 'id_' + tabla_id;
		query = '';

		parametro.forEach(params => {
			const consulta = `
						WITH cte AS (select * from codificacion.${tabla} where estado ilike 'CODIFICADO' and usucodificador='AUTOMATICO_NORMALIZADO' and departamento='${parametro[0].departamento}' limit ${params.count})
						update codificacion.${tabla} set estado='ASIGNASUP',usucre='${params.usucre}' FROM cte c
						where codificacion.${tabla}.${id} = c.${id} and codificacion.${tabla}.estado='CODIFICADO' AND codificacion.${tabla}.usucodificador='AUTOMATICO_NORMALIZADO';`
			query += consulta
		});
		await con.query(query)

		// Mensaje de retorno de la asignacion
		res.status(200).json({
			success: true,
			message: 'Se ha asignado correctamente.'
		});

		return;
	}

};






// Reasignación de carga a supervisores
const updateReAsignadoSup = async (req, res) => {
	let tabla_id = req.params.id;
	let parametro = req.body;



	//var tabla = 'cod_' + tabla_id;
	//var id = 'id_' + tabla_id;
	var query = '';


	console.log("------------------------------------------Nueva Re-Asignacion de carga a Supervisor -------------------------------------------");
	console.log("tabla_id: " + tabla_id);
	console.table(parametro);

	// Si el parametro es un array y su longitud es 0, se retorna un error
	if (parametro.length == 0) {
		// Mesaje de retorno
		res.status(200).json({
			success: false,
			message: 'No hay cantidad para reasignar.'
		});
		return;
	}

	res.status(200).json({
		success: false,
		message: 'Carga Reasignado  a Sup'
	});
	return;

};




const updateAsignado_old = async (req, res) => {
	let tabla_id = req.params.id;
	let parametro = req.body;

	// Si el parametro es un array y su longitud es 0, se retorna un error
	if (parametro.length == 0) {
		// Mesaje de retorno
		res.status(200).json({
			success: false,
			message: 'No hay cantidad para asignar.'
		});
		return;
	}


	// Verifica si es algun departamento u otro
	if (parametro[0].departamento !== 'OTROS') {
		// Total de carga
		var total_carga = 0;
		parametro.forEach(paramss => { total_carga += paramss.count; });


		// Veririfica disponibilidad de carga
		const queryDisp = `
		SELECT count(1) from codificacion.cod_${tabla_id} where estado = 'ELABORADO' and departamento = '${parametro[0].departamento}';`
		const result = await (await con.query(queryDisp)).rows;

		// Si la cantidad de carga es mayor a la disponible, se retorna un error
		if (total_carga > result[0].count) {
			// Mensaje de retorno
			res.status(200).json({
				success: false,
				message: 'No hay carga disponible. Cancele la asignación y vuelva a intentar.'
			});
			return;
		}

		// Asignacion de carga
		var tabla = 'cod_' + tabla_id;
		var id = 'id_' + tabla_id;
		query = '';

		parametro.forEach(params => {
			const consulta = `
						WITH cte AS (select * from codificacion.${tabla} where estado ilike 'ELABORADO' and departamento='${parametro[0].departamento}' limit ${params.count})
						update codificacion.${tabla} set estado='${params.estado}',usucre='${params.usucre}' FROM cte c
						where codificacion.${tabla}.${id} = c.${id} and codificacion.${tabla}.estado='ELABORADO';`
			query += consulta
		});
		await con.query(query)


		// Mensaje de retorno de la asignacion
		res.status(200).json({
			success: true,
			message: 'Se ha asignado correctamente.'
		});

		return;

	} else {
		// Total de carga
		var total_carga = 0;
		parametro.forEach(paramss => { total_carga += paramss.count; });


		// Veririfica disponibilidad de carga
		const queryDisp = `
		SELECT count(1) from codificacion.cod_${tabla_id} where estado = 'ELABORADO' and departamento is null;`
		const result = await (await con.query(queryDisp)).rows;


		// Si la cantidad de carga es mayor a la disponible, se retorna un error
		if (total_carga > result[0].count) {
			// Mensaje de retorno
			res.status(200).json({
				success: false,
				message: 'No hay carga disponible. Cancele la asignación y vuelva a intentar.'
			});
			return;
		}

		// Asignacion de carga
		var tabla = 'cod_' + tabla_id;
		var id = 'id_' + tabla_id;
		query = '';

		parametro.forEach(params => {
			const consulta = `
						WITH cte AS (select * from codificacion.${tabla} where estado ilike 'ELABORADO' and departamento is null limit ${params.count})
						update codificacion.${tabla} set estado='${params.estado}',usucre='${params.usucre}' FROM cte c
						where codificacion.${tabla}.${id} = c.${id} and codificacion.${tabla}.estado='ELABORADO';`
			query += consulta
		});
		await con.query(query)


		// Mensaje de retorno de la asignacion
		res.status(200).json({
			success: true,
			message: 'Se ha asignado correctamente.'
		});

		return;

	}

};





const updateVerificado = async (req, res) => {
	let user = req.params.user;
	let parametro = req.body;
	console.log("estado: " + parametro[0].estado);
	console.log("user: " + parametro[0].user);
	console.log("codigocodif_v1: " + parametro[0].codigocodif_v1);
	console.log("id_pregunta: " + parametro[0].id_pregunta);
	console.log("id_informante: " + parametro[0].id_informante);
	console.log("id_encuesta: " + parametro[0].id_encuesta);

	query = ''
	parametro.forEach(params => {
		const consulta = `update codificacion.cod_encuesta_codificacion set 
		estado = '${params.estado}', usuverificador= '${user}', codigocodif_v1 = '${params.codigocodif_v1}', fecverificador = now()
		where id_pregunta = ${params.id_pregunta} and id_informante=${params.id_informante} and id_encuesta=${params.id_encuesta}; `
		query += consulta
	});
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));

	// res.send("sfsdfsdfsdfs!!");
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

// *Asignacion
const updateAsignadoSup_old = async (req, res) => {
	let id = req.params.id;
	let parametro = req.body;

	console.log(" updateAsignadoSup id: " + req.params.id);

	query = ''
	if (id == 125) {
		parametro.forEach(params => {

			console.log(" updateAsignadoSup estado: " + params.estado);
			console.log(" updateAsignadoSup usucre: " + params.usucre);
			console.log(" updateAsignadoSup departamento: " + params.departamento);
			console.log(" updateAsignadoSup count: " + params.count);

			const consulta = `update ${esquema}.cod_encuesta_codificacion cecupd
		set estado='${params.estado}', usucre='${params.usucre}' from
		(select distinct ceco.id_informante oc_id_inf, ceco.id_encuesta oc_id_enc, ceco.id_pregunta oc_id_preg, 
		 ceco.departamento,ceco.estado,
		ceca.id_informante ac_id_inf, ceca.id_encuesta ac_id_enc, ceca.id_pregunta ac_id_preg, ceca.departamento, ceca.estado
		from ${esquema}.cod_encuesta_codificacion ceco
			inner join ${esquema}.cod_encuesta_codificacion ceca
			on ceco.id_informante = ceca.id_informante
		where ceco.id_pregunta = 125 and ceca.id_pregunta=127  and 
		 ceco.estado='CODIFICADO' and ceca.estado = 'CODIFICADO' 

		  and (ceco.usucodificador = 'AUTOMATICO_NORMDOBLE' or ceco.usucodificador = 'AUTOMATICO_NORMALIZADO')
         and (ceca.usucodificador = 'AUTOMATICO_NORMDOBLE' or ceca.usucodificador = 'AUTOMATICO_NORMALIZADO')

		 limit  ${params.count}) x 
		WHERE case when cecupd.id_pregunta=125 then 
			cecupd.id_informante = x.oc_id_inf and cecupd.id_encuesta = x.oc_id_enc 
			and cecupd.id_pregunta=x.oc_id_preg else 
			cecupd.id_informante = x.ac_id_inf and cecupd.id_encuesta = x.ac_id_enc 
			and cecupd.id_pregunta=x.ac_id_preg	end 
			and cecupd.id_pregunta in (125,127);`
			query += consulta
		});
	} else {
		parametro.forEach(params => {
			console.log(" updateAsignadoSup estado: " + params.estado);
			console.log(" updateAsignadoSup usucre: " + params.usucre);
			console.log(" updateAsignadoSup departamento: " + params.departamento);
			console.log(" updateAsignadoSup count: " + params.count);

			const consulta = `WITH cte AS (select * from ${esquema}.cod_encuesta_codificacion where estado ilike 'CODIFICADO' and usucodificador = 'AUTOMATICO_NORMALIZADO'
			and id_pregunta=${id} and departamento='${params.departamento}' limit ${params.count})
			update ${esquema}.cod_encuesta_codificacion
			set estado='${params.estado}',usucre='${params.usucre}'
			from cte c join ${esquema}.cod_variables b on c.id_pregunta=b.id_pregunta
			where c.id_informante = ${esquema}.cod_encuesta_codificacion.id_informante
			and c.id_encuesta = ${esquema}.cod_encuesta_codificacion.id_encuesta
			and ${esquema}.cod_encuesta_codificacion.estado='CODIFICADO'
			and ${esquema}.cod_encuesta_codificacion.usucodificador = 'AUTOMATICO_NORMALIZADO'
			and ${esquema}.cod_encuesta_codificacion.id_pregunta=${id};`
			query += consulta
		});
	}
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};

const updateAsignadoSup__ = async (req, res) => {
	let id = req.params.id;
	let parametro = req.body;

	console.log(" updateAsignadoSup id: " + req.params.id);

	query = ''
	if (id == 125) {
		parametro.forEach(params => {
			console.log("params.usucre ::" + params.usucre + "  estado::" + params.estado + "  count::" + params.count);
			"update hksdfs set "

		});
	} else {
		parametro.forEach(params => {
			console.log(" updateAsignadoSup estado: " + params.estado);
			console.log(" updateAsignadoSup usucre: " + params.usucre);
			console.log(" updateAsignadoSup departamento: " + params.departamento);
			console.log(" updateAsignadoSup count: " + params.count);

			const consulta = `WITH cte AS (select * from ${esquema}.cod_encuesta_codificacion where estado ilike 'CODIFICADO'
			and id_pregunta=${id} and departamento='${params.departamento}' limit ${params.count})
			update ${esquema}.cod_encuesta_codificacion
			set estado='${params.estado}',usucre='${params.usucre}'
			from cte c join ${esquema}.cod_variables b on c.id_pregunta=b.id_pregunta
			where c.id_informante = ${esquema}.cod_encuesta_codificacion.id_informante
			and c.id_encuesta = ${esquema}.cod_encuesta_codificacion.id_encuesta
			and ${esquema}.cod_encuesta_codificacion.estado='CODIFICADO'
			and ${esquema}.cod_encuesta_codificacion.usucodificador = 'AUTOMATICO_NORMALIZADO'
			and ${esquema}.cod_encuesta_codificacion.id_pregunta=${id};`
			query += consulta
		});
	}
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const preguntasPorUsuario = async (req, res) => {
	var params = req.body;
	const query = {
		text:
			`select a.*,b.pregunta, b.catalogo, 
			(select nombre_depto from cartografia.departamentos cd where cd.codigo_depto=a.departamento)
			from ${esquema}.cod_encuesta_codificacion a
			inner join ${esquema}.cod_variables b on a.id_pregunta=b.id_pregunta
			where a.estado ilike $1 and a.id_pregunta=$2 and a.usucre ilike $3 order by id_informante, id_encuesta`,
		values: [
			params.estado,
			params.id_pregunta,
			params.usucre,
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

// ...#/codificadual
const preguntasPorUsuDual__ = async (req, res) => {
	var params = req.body;
	const query = {
		text:
			`select distinct ceco.id_informante oid_inf, ceco.id_encuesta oid_enc, ceco.id_pregunta oid_preg, ceco.respuesta oid_resp, ceco.departamento departamento,ceco.codigocodif oid_code,ceco.observacion oobs,ceco.usucodificador ousucod,ceca.usucodificador ausucod,
			ceca.id_informante aid_inf, ceca.id_encuesta aid_enc, ceca.id_pregunta aid_preg, ceca.respuesta aid_resp, ceca.codigocodif aid_code, ceca.estado aestado, ceco.estado oestado, ceca.observacion aobs,
			(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre_depto,
			(select pregunta from codificacion.cod_variables where id_pregunta = 125) as opregunta,
			(select	pregunta from codificacion.cod_variables where id_pregunta = 127) as apregunta,
			co.descripcion odescripcion, ca.descripcion adescripcion			
			from codificacion.cod_encuesta_codificacion ceco
				inner join codificacion.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
				inner join codificacion.cod_variables bo on ceco.id_pregunta=bo.id_pregunta 
				inner join codificacion.cod_variables ba on ceca.id_pregunta=ba.id_pregunta
				left join codificacion.cod_catalogo co on bo.catalogo = co.catalogo and ceco.codigocodif=co.codigo and co.unico=1
				left join codificacion.cod_catalogo ca on ba.catalogo = ca.catalogo and ceca.codigocodif=ca.codigo and ca.unico=1
			where ceco.id_pregunta =$2 and ceca.id_pregunta=127 and 
			ceco.estado =$1 and ceca.estado=$1 and 
			ceco.usucre = $3 and ceca.usucre=$3
			union all 
			select distinct ceco.id_informante oid_inf, ceco.id_encuesta oid_enc, ceco.id_pregunta oid_preg, ceco.respuesta oid_resp, ceco.departamento departamento,ceco.codigocodif oid_code,ceco.observacion oobs,ceco.usucodificador ousucod,ceca.usucodificador ausucod,
			ceca.id_informante aid_inf, ceca.id_encuesta aid_enc, ceca.id_pregunta aid_preg, ceca.respuesta aid_resp, ceca.codigocodif aid_code, ceca.estado aestado, ceco.estado oestado, ceca.observacion aobs,
			(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre_depto,
			(select pregunta from codificacion.cod_variables where id_pregunta = 125) as opregunta,
			(select	pregunta from codificacion.cod_variables where id_pregunta = 127) as apregunta,
			co.descripcion odescripcion, ca.descripcion adescripcion			
			from codificacion.cod_encuesta_codificacion ceco
				inner join codificacion.cod_encuesta_codificacion ceca on ceco.id_informante = ceca.id_informante
                inner join codificacion.cod_usuario cu on ceco.usucre = cu.login
                inner join codificacion.cod_usuario cs on cu.cod_supvsr = cs.id_usuario
				inner join codificacion.cod_variables bo on ceco.id_pregunta=bo.id_pregunta 
				inner join codificacion.cod_variables ba on ceca.id_pregunta=ba.id_pregunta
				inner join codificacion.cod_catalogo co on bo.catalogo = co.catalogo and ceco.codigocodif=co.codigo and co.unico=1
				inner join codificacion.cod_catalogo ca on ba.catalogo = ca.catalogo and ceca.codigocodif=ca.codigo and ca.unico=1
			where ceco.id_pregunta =$2 and ceca.id_pregunta=127 and 
			ceco.estado ='CODIFICADO' and ceca.estado='CODIFICADO'  
			and cs.login ilike $3`,
		values: [
			params.estado,
			params.id_pregunta,
			params.usucre,
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
	console.log(query)
};


const preguntasPorUsuDual = async (req, res) => {
	var {
		id_pregunta,
		limite,
		usucre
	} = req.body;

	//var limite = 50
	if (limite) {
		console.log("Existe");
	} else {
		limite = 0;

	}

	console.log("id_pregunta::::::::::::: " + id_pregunta);
	console.log("limite::::::::::::: " + limite);
	console.log("usucre::::::::::::: " + usucre);


	var result2 = [];
	var departamentos = ["Chuquisaca", "La Paz", "Cochabamba", "Oruro", "Potosí", "Tarija", "Santa Cruz", "Beni", "Pando"];
	const preg113 = ["Ninguno", "Curso de alfabetización", "Inicial (Pre kínder, kínder)", "Básico", "Intermedio", "Medio", "Primaria", "Secundaria", "Técnico Medio (Institutos, CEA)", "Técnico Superior (Institutos y Universidades)", "Licenciatura (Universidades, UNIPOL, UNIMIL, Escuela Superior de Maestros) ", "Maestría", "Doctorado"];
	const preg114 = ["1", "2", "3", "4", "5", "6", "7", "8"];
	const preg122 = ["¿La mayor parte para consumo de su familia?", "¿La mayor parte para la venta?"]
	const preg126 = ["obrera(o) empleada(o)? ", "trabajadora(or) por cuenta propia?", "empleadora(or) o socia(o)?", "trabajadora(or) familiar sin remuneración?", "trabajadora(or) del hogar?", "cooperativista de producción?"];


	if (id_pregunta == 125) {
		console.log("if (id_pregunta == 125) {");
		try {
			// result = Pregunta 25:
			const result = await (await con.query(`
        SELECT 
			   id_encuesta oid_enc, 
			   id_pregunta oid_preg,
			   respuesta oid_resp, 
			   respuesta_normalizada orespn,
			   departamento departamento,
			   codigocodif oid_code, 
			   usucodificador ousucod,
			   id_informante oid_inf,
			   estado oestado
        FROM 
			${esquema}.cod_encuesta_codificacion 
		WHERE 
			id_pregunta =125 and usucre='${usucre}' and estado='ASIGNASUP' and usucodificador  ilike 'AUTOMATICO_%'
				
			UNION ALL
		
			select 
			x.id_encuesta oid_enc, 
			x.id_pregunta oid_preg,
			x.respuesta oid_resp, 
			x.respuesta_normalizada orespn,
			x.departamento departamento,
			x.codigocodif oid_code, 
			x.usucodificador ousucod,
			x.id_informante oid_inf,
			x.estado oestado
			from (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 125  and estado='CODIFICADO' and (usucre in (select cu.login login_cod from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A' and cu2.login ='${usucre}') or usucre='AUTOMATICO_NORMALIZADO')
			) as x
			join (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 127  and estado='CODIFICADO' and (usucre in (select cu.login login_cod from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A' and cu2.login ='${usucre}') or usucre='AUTOMATICO_NORMALIZADO' )
			) as y
			on
			x.id_informante = y.id_informante order by oid_enc  limit case when ${limite}=0 then null else ${limite} end 
		

        `)).rows;


			for (var i = 0; i <= result.length - 1; i++) {
				// Completamos con la pregunta 127
				var result27 = await (await con.query(`select  * from ${esquema}.cod_encuesta_codificacion  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta =127`)).rows;

				result[i].aid_enc = result27[0].id_encuesta;
				result[i].aid_preg = result27[0].id_pregunta;
				result[i].aid_resp = result27[0].respuesta;
				result[i].arespn = result27[0].respuesta_normalizada;
				result[i].departamento = result27[0].departamento;
				result[i].aid_code = result27[0].codigocodif;
				result[i].ausucod = result27[0].usucodificador;
				result[i].aid_inf = result27[0].id_informante;
				result[i].aestado = result27[0].estado;
				result[i].nombre_depto = 'COCHABAMBA';
				// Estado

				// Descripcion 127
				var resDescripcion127 = await (await con.query(`select descripcion from codificacion.cod_catalogo where catalogo ='cat_caeb' and codigo='${result27[0].codigocodif}' and unico = 1`)).rows;
				result[i].adescripcion = resDescripcion127[0].descripcion;

				// Descripcion 125				
				var result125 = await (await con.query(`select  * from ${esquema}.cod_encuesta_codificacion  where id_informante=${parseInt(result[i].aid_inf, 10)} and id_pregunta =125`)).rows;
				var resDescripcion125 = await (await con.query(`select descripcion from codificacion.cod_catalogo where catalogo ='cat_cob' and codigo='${result125[0].codigocodif}' and unico = 1`)).rows;
				result[i].odescripcion = resDescripcion125[0].descripcion;


			}

			res.status(200).json({
				datos: { rows: result }
			})
		} catch (error) {
			console.log("|devuelvePreguntaUsrSup|125,127|Back-End| " + error);
		}
	}
};





/**
 * Verificacion de preguntas
 * @param {*} req 
 * @param {*} res 
 */
const preguntasPorVerificar = async (req, res) => {

	var params = req.body;
	const query = {
		text: `select a.*, b.pregunta, (select nombre_depto from cartografia.departamentos cd where cd.codigo_depto=a.departamento), 
			b.catalogo, (select descripcion from ${esquema}.cod_catalogo where catalogo ilike $3 
			and codigo= a.codigocodif order by descripcion limit 1) as descripcion 
			from ${esquema}.cod_encuesta_codificacion a 
			join ${esquema}.cod_variables b on a.id_pregunta=b.id_pregunta 
			where a.id_pregunta=$1 and a.estado ILIKE $2 and usucodificador is not null limit 30`,
		values: [
			params.id_pregunta,
			params.estado,
			params.catalogo,
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const variablesApoyo = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text:
			`select ei.id_informante, id_encuesta,ep.id_pregunta,
			case when eee.respuesta3='1' and ep.pregunta in ('La Paz', 'Oruro', 'Potosi', 'Tarija', 'Chuquisaca', 'Santa Cruz', 'Beni', 'Pando', 'Cochabamba')
			then concat('Departamento: ', ep.pregunta)
			else case when pregunta ilike '%municipio%' 
					then concat('Municipio: ', respuesta3)
					else case when pregunta ilike '%comunidad%'
						then concat('Ciudad o Comunidad: ', respuesta3)
						else case when ep.pregunta  ilike '%años%'
							then concat('Edad: ', respuesta3)
							else case when ep.id_pregunta in (113)
							then concat('Nivel de estudios: ', ep.respuesta->(respuesta3::INTEGER-1)->'respuesta')
							else case when ep.id_pregunta in (114) 
								then concat('Curso: ', ep.respuesta->(respuesta3::INTEGER-1)->'respuesta')
								else case when ep.id_pregunta in (126)
									then concat('Categoría ocupacional: ', ep.respuesta->(respuesta3::INTEGER-1)->'respuesta')
									else case when ep.id_pregunta in (122)
										then concat('Destino de cultivos o cría: ', ep.respuesta->(respuesta3::INTEGER-1)->'respuesta')
										--else (case when respuesta3 = '' then  ' ' else concat( ep.respuesta->(respuesta3::INTEGER-1)->'respuesta') end)
											else ( case when ep.id_pregunta in (96,102,106) then concat(pregunta, ' ' , respuesta3) 
												else  (case when respuesta3 = '' then  ' ' else concat( ep.respuesta->(respuesta3::INTEGER-1)->'respuesta') end) end)
										end
										end
									end
								end
							end
						end 
					end
			end as respuesta
		from enc_encuesta eee 
		inner join enc_informante ei on eee.id_informante = ei.id_informante
		inner join enc_pregunta ep on eee.id_pregunta= ep.id_pregunta
		where char_length(respuesta3)>=1 and eee.id_informante = $1
		 and eee.id_pregunta in
		( select unnest(id_variables) as r from codificacion.cod_variables where id_pregunta = $2) 
		-- and  ei.id_nivel=2 and ei.estado!='ANULADO'
		order by ep.codigo_pregunta`,// AND id_encuesta=$2
		values: [
			params.id_informante,
			//params.correlativo,
			params.id_pregunta
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const catalogoCodificacion = async (req, res) => {
	let query;   //el let es variable global
	const valor = req.params.enviar.split('|');
	console.log(valor)
	if (valor[2] !== '') {
		query = `SELECT id, descripcion , codigo, MAX(ord) ord FROM ${esquema}.f_cod_catalogoPatron('${valor[0]}','${valor[1]}','${valor[2]}') 
		as (id Int, descripcion Text, codigo Text, ord  Float)
		GROUP BY id, descripcion, codigo HAVING MAX(ord)>0.2 ORDER BY id, ord DESC,codigo`
	} else {
		query = `SELECT id, descripcion , codigo, MAX(ord) ord FROM ${esquema}.f_cod_catalogoPatron('${valor[0]}','${valor[1]}','${valor[2]}') 
		as (id Int, descripcion Text, codigo Text, ord  Float)
		GROUP BY id, descripcion, codigo HAVING MAX(ord)>0.2 ORDER BY ord DESC,codigo`
	}

	console.log(query)
	await con
		.query(query)
		.then((result) => {
			console.log('------------')
			console.log(result.rows);
			res.status(200).json({
				datos: result,
			})
		}
		)
		.catch((e) => console.error(e.stack))
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updatePreguntaVerif = async (req, res) => {
	//console.log(req.body)
	let id = req.params.id;
	let params = req.body;
	const query = `UPDATE ${esquema}.cod_encuesta_codificacion SET codigocodif_v1='${params.codigocodif}', estado='${params.estado}', 
		usuverificador='${params.usuverificador}', 
		fecverificador=now(), observacion='${params.observacion}', multiple=${params.multiple} 
		WHERE id_informante=${id} and id_encuesta=${params.id_encuesta} and id_pregunta =${params.id_pregunta}`;
	//console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};





// Codificacion Simple
const updatePreguntaSimple = async (req, res) => {
	var {
		id_registro, // id por el cual se modifica
		tabla_id, // se extrae el campo id y la tabla
		codigocodif,
		usucodificador
	} = req.body;

	// verifica si el registro esta asignado a codificar 
	const verif = await con.query(`SELECT count(1)  FROM codificacion.cod_${tabla_id} WHERE id_${tabla_id} = ${id_registro} AND estado ='ASIGNADO' AND usucre = '${usucodificador}'`);

	// Si no esta asignado, se retorna un error
	if (verif.rows[0].count == 0) {
		res.status(200).json({
			success: false,
			message: 'Back-end: No se puede codificar, el registro no esta asignado.'
		})
		return;
	}


	// Consulta de actualizacion
	const qr = `
		UPDATE codificacion.cod_${tabla_id}
		SET codigocodif = '${codigocodif}', 
			estado = 'CODIFICADO', 
			usucodificador = '${usucodificador}', 
			feccodificador = now()
		WHERE id_${tabla_id} = ${id_registro};
	` ;

	// Ejecucion de la consulta
	await con.query(qr);

	// Respuesta
	res.status(200).json({
		success: true,
		message: 'Back-end: Se ha codificado correctamente.'
	})

	return;
};



// Supervision simple correctos 
const updatePreguntaSimpleCorreccion = async (req, res) => {
	var {
		id_registro, // id por el cual se modifica
		tabla_id, // se extrae el campo id y la tabla
		codigocodif,
		usuverificador
	} = req.body;

	// update
	await con.query(`
		UPDATE codificacion.cod_${tabla_id} 
		SET estado = 'VERIFICADO', codigocodif_v1 = ${codigocodif}, fecverificador = now(), usuverificador = '${usuverificador}'			
		WHERE id_${tabla_id} = ${id_registro}
	`)

	// respuesta
	res.status(200).json({
		success: true,
		message: 'La supervisión se ha realizado correctamente.'
	})
}

const updatePreguntaSimpleCheck = async (req, res) => {

	const {
		id_registro,
		tabla_id,
		codigocodif,
		usuverificador,
	} = req.body;

	console.log("------------->Hola desde updatePreguntaSimpleCheck");
	console.log(req.body);

	// Tabla_id
	if (tabla_id !== 'p49_p51') {
		// query	
		await con.query(`
			UPDATE codificacion.cod_${tabla_id}
			SET estado = 'VERIFICADO', codigocodif_v1 ='${codigocodif}', fecverificador = now(), usuverificador = '${usuverificador}'			
			WHERE id_${tabla_id} = ${id_registro}
		`);

		// Respuesta
		res.status(200).json({
			success: true,
			message: 'Se ha supervisado correctamente. Pregunta simple.' + tabla_id
		})

		return;

	} else {

	}


}


// Supervision doble Indiviuales (Recodificación) --> (boton Correcto)
const updatePreguntaDobleCorreccion = async (req, res) => {

	const {
		id_usuario,
		tabla_id,
		id_registro,
		codigocodifOcuItem,
		codigocodifActItem
	} = req.body;
	// console.table(req.body);

	// consulta de actualizacion

	await con.query(`
		UPDATE codificacion.cod_p49_p51
		SET estado_ocu = 'VERIFICADO', codigocodif_v1_ocu = '${codigocodifOcuItem}' , fecverificador = now(), usuverificador = '${id_usuario}', 
			estado_act = 'VERIFICADO', codigocodif_v1_act = '${codigocodifActItem}'
		WHERE id_p49_p51 = ${id_registro}
	`)

	// Respuesta
	res.status(200).json({
		success: true,
		message: 'Se ha supervisado la doble individual'
	})
}





// Anular codificacion simple
const updatePreguntaSimpleAnular = async (req, res) => {
	var {
		id_registro, // id por el cual se modifica
		tabla_id, // se extrae el campo id y la tabla
	} = req.body;

	// print
	console.table(req.body);

	// Consulta de actualizacion
	const qr = `
		UPDATE codificacion.cod_${tabla_id}
		SET codigocodif = null, 
			estado = 'ASIGNADO', 
			usucodificador = null, 
			feccodificador = null
		WHERE id_${tabla_id} = ${id_registro};
	` ;

	// Ejecucion de la consulta
	await con.query(qr);

	// Respuesta
	res.status(200).json({
		success: true,
		message: 'Se ha anulado correctamente.'
	})

	return;
}


// Codificacion Doble ocupacion
const updatePreguntaDobleOcuAct = async (req, res) => {

	const {
		id_registro,	// id por el cual se modifica
		codigocodifOcu,	// codigo de codificacion
		usucodificadorOcu,	// usuario que codifica
		codigocodifAct,	// codigo de codificacion
		usucodificadorAct,	// usuario que codifica
	} = req.body;



	// Verificar si el registro esta asignado a codificar
	const verif = await con.query(`
		SELECT count(1)  FROM codificacion.cod_p49_p51 
		WHERE id_p49_p51 = ${id_registro} AND 
		((estado_ocu ='ASIGNADO' AND usucodificador_ocu = '${usucodificadorOcu}') AND (estado_act ='ASIGNADO' AND usucodificador_act = '${usucodificadorAct}'))
	`);


	console.log("Hola desde updatePreguntaDoble");
	console.table(req.body);

	// buscar registro
	const qr1 = `
	SELECT 
		CASE  
			WHEN codigocodif_ocu IS NULL THEN  ''
			ELSE codigocodif_ocu		
		END AS codigocodif_ocu,
		CASE  
			WHEN usucodificador_ocu IS NULL THEN  ''
			ELSE usucodificador_ocu		
		END AS usucodificador_ocu,
		CASE  
			WHEN codigocodif_act IS NULL THEN  ''
			ELSE codigocodif_act		
		END AS codigocodif_act,
		CASE  
			WHEN usucodificador_act IS NULL THEN  ''
			ELSE usucodificador_act		
		END AS usucodificador_act,
		CASE  
			WHEN usucre IS NULL THEN  ''
			ELSE usucre		
		END AS usucre
	FROM codificacion.cod_p49_p51 WHERE id_p49_p51 = ${Number(id_registro)}
	`
	// ejecutar consulta
	const datosSinCodif = await (await con.query(qr1)).rows;

	console.table(datosSinCodif);
	console.log(datosSinCodif[0].usucre);


	// Verificamos datosSinCodif.rows[0].usucodificador_ocu empieza con AUTOMATICO_  y si usucodificador_act empieza con AUTOMATICO_
	if (datosSinCodif[0].usucre == usucodificadorAct || datosSinCodif[0].usucre == usucodificadorOcu) {


		// Consulta de actualizacion OCU
		if (datosSinCodif[0].codigocodif_ocu !== codigocodifOcu) {
			const qrOcu = `
			UPDATE codificacion.cod_p49_p51
			SET codigocodif_ocu = '${codigocodifOcu}', 
				estado_ocu = 'CODIFICADO', 
				usucodificador_ocu = '${usucodificadorOcu}', 
				feccodificador_ocu = now()
			WHERE id_p49_p51 = ${id_registro};
			`;
			await con.query(qrOcu);
		}


		// Consulta de actualizacion ACT
		if (datosSinCodif[0].codigocodif_act !== codigocodifAct) {
			const qrAct = `
			UPDATE codificacion.cod_p49_p51
			SET codigocodif_act = '${codigocodifAct}', 
				estado_act = 'CODIFICADO', 
				usucodificador_act = '${usucodificadorAct}', 
				feccodificador_act = now()
			WHERE id_p49_p51 = ${id_registro};
			`;
			await con.query(qrAct);
		}


		res.status(200).json({
			success: true,
			message: 'Se ha codificado correctamente. Ocu, id_registro:: ' + id_registro
		})

		return;

	} else {
		res.status(200).json({
			success: false,
			message: 'No se puede codificar, el registro no esta asignado.'
		})
		return;
	}


}



// Codificacion Doble actividad
const updatePreguntaDobleAct______ = async (req, res) => {

	const {
		id_registro,	// id por el cual se modifica
		codigocodif,	// codigo de codificacion
		usucodificador,	// usuario que codifica
	} = req.body;

	console.log("Hola desde updatePreguntaDoble");
	console.table(req.body);

	// Consulta de actualizacion
	const qr = `
	    UPDATE codificacion.cod_p49_p51
		SET codigocodif_act = '${codigocodif}', 
			estado_act = 'CODIFICADO', 
			usucodificador_act = '${usucodificador}', 
			feccodificador_act = now()
		WHERE id_p49_p51 = ${id_registro};
	`;

	// Ejecucion de la consulta
	await con.query(qr);

	// Respuesta
	res.status(200).json({
		success: true,
		message: 'Se ha codificado correctamente. Act, id_registro:: ' + id_registro
	})
	return;
}



const updatePreguntaDobleAnular = async (req, res) => {

	const { } = req.body;
	console.log("Hola desde updatePreguntaDobleAnular");
	console.log(req.body);

	// Respuesta
	res.status(200).json({
		success: true,
		message: 'Se ha anulado correctamente.'
	})
	return;
}



const updatePregunta_old = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	//console.log('Hola desde Update')
	const query = {
		text:
			`UPDATE ${esquema}.cod_encuesta_codificacion SET codigocodif=$1, 
		estado=$2, usucodificador=$3, feccodificador=now(), 
		observacion=$4, multiple=$6 WHERE id_informante=${id} and id_encuesta=$5 and id_pregunta =$7`,
		values: [
			params.codigocodif,
			params.estado,
			params.usucodificador,
			params.observacion,
			params.id_encuesta,
			params.multiple,
			params.id_pregunta
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const anularAnteriorVerif = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE ${esquema}.cod_encuesta_codificacion SET codigocodif_v1=null, estado=$1, usuverificador=null, fecverificador=null  
		where id_informante=${id} and id_encuesta=$2 and id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO')`,
		values: [
			params.estado,
			params.correlativo
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const anularAnterior = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text:
			`UPDATE ${esquema}.cod_encuesta_codificacion SET codigocodif=null, estado=$1, usucodificador=null, feccodificador=null 
		 where id_informante=${id} and id_encuesta=$2 and id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO')`,
		values: [
			params.estado,
			params.id_encuesta
		],
	};
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateVerificador = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: /*`UPDATE cod_encuesta_codificacion SET estado=$1, usuverificador=$2, fecverificador=now(), observacion=$3, codigocodif_v1=$4
			WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta in (36854, 36880)`*/
			`UPDATE ${esquema}.cod_encuesta_codificacion SET estado=$1, usuverificador=$2, fecverificador=now(), observacion=$3, codigocodif_v1=$4
			WHERE id_informante=${id} and id_encuesta=$5 and id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO')`
		,
		values: [
			params.estado,
			params.usuverificador,
			// params.fecverificador,
			params.observacion,
			params.codigocodif_v1,
			params.id_encuesta
		],
	};
	console.log(query)
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const devuelvePreguntas = async (req, res) => {
	const query = {
		text:
			`select a.id_pregunta, b.pregunta, b.area, b.catalogo, count(*)
			from ${esquema}.cod_encuesta_codificacion a, ${esquema}.cod_variables b
			where a.id_pregunta=b.id_pregunta and 
			a.id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO') 
			and a.estado ILIKE 'CODIFICADO' and usucodificador is not null 
			group by a.id_pregunta, b.pregunta, b.area, b.catalogo`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */




const devuelvePreguntasSup_ = async (req, res) => {
	var params = req.body;

	console.log("params.usucre: " + params.usucre);

	const query = {
		text:
			`select id_pregunta, pregunta, area, catalogo, count(*)
			from
				(
			select a.id_pregunta, b.pregunta, b.area, b.catalogo --, count(*)
			from ${esquema}.cod_encuesta_codificacion a,${esquema}.cod_variables b
			where a.id_pregunta=b.id_pregunta and 
			a.id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO') 
			and a.estado ILIKE 'ASIGNASUP' and a.id_pregunta not in  (125,127)  and usucodificador is not null and usucre ilike $1
			--group by a.id_pregunta, b.pregunta, b.area, b.catalogo
			union all
			SELECT cec.id_pregunta, cv.pregunta, null, cv.catalogo --, count(*)
			FROM ${esquema}.cod_encuesta_codificacion cec
			inner join ${esquema}.cod_usuario cu
			on cec.usucre = cu.login
			inner join ${esquema}.cod_usuario cs
			on cu.cod_supvsr = cs.id_usuario
			inner join ${esquema}.cod_variables cv
			on cec.id_pregunta = cv.id_pregunta
			where usucodificador not in ('AUTOMATICO_NORMALIZADO', 'AUTOMATICO_NORMDOBLE')
			and cec.codigocodif is not null and cec.estado ilike 'CODIFICADO'
			and cec.id_pregunta not in  (125,127)
			and cs.login ilike $1
			--group by cec.id_pregunta, cv.pregunta, cv.catalogo
			)c
			group by id_pregunta, pregunta, area, catalogo
			union all
			select 125 id_pregunta, 'Preguntas 48-50: Ocupación - Actividad Económica' pregunta,  null area, 'cat_cob, cat_caeb' catalogo,count(*) cuenta from  
			(select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
			ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =125 and ceca.id_pregunta=127  
			and ceca.estado ilike 'ASIGNASUP' and ceca.usucre ilike $1
			and ceco.estado ilike 'ASIGNASUP' and ceco.usucre ilike $1
			union all 
             select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
			ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca on ceco.id_informante = ceca.id_informante
            inner join ${esquema}.cod_usuario cu on ceco.usucre = cu.login  
            inner join ${esquema}.cod_usuario cs on cu.cod_supvsr = cs.id_usuario
			where ceco.id_pregunta =125 and ceca.id_pregunta=127  
            and cs.login ilike $1 and ceca.estado ilike 'CODIFICADO' and ceco.estado ilike 'CODIFICADO') x`,
		values: [
			params.usucre,
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};


//  .../selecsup
const devuelvePreguntasSup__old = async (req, res) => {
	var params = req.body;
	//params.limite = 0;
	//var limite=params.limite;

	//console.log("id_pregunta: " + params.id_pregunta);
	//console.log("limite: " + params.limite);
	console.log("usucre: " + params.usucre);

	//console.log("devuelvePreguntasSup");

	console.log("params.usucre: " + params.usucre);
	result = [];

	const cod_variables = await (await con.query(`
		SELECT id_pregunta, pregunta, catalogo FROM codificacion.cod_variables  WHERE id_pregunta IN (125,88,89,90,92,86,129,97,105,95,101,103,107,1001,1002,1003,1004,1005)
	`)).rows;


	// Averigua el id_usuario del supervisor
	const supervisor = await (await con.query(`select id_usuario  from codificacion.cod_usuario where login = '${params.usucre}'`)).rows;
	// Averigua sus codificadores
	const codificadores = await (await con.query(`select  login from codificacion.cod_usuario where cod_supvsr = ${supervisor[0].id_usuario}`)).rows;

	//var cods = '';




	// Recorre las preguntas:
	for (var i = 0; i <= cod_variables.length - 1; i++) {
		var prnc = 0;
		var cat = '';
		var pr = '';


		carga = 0;

		if (cod_variables[i].id_pregunta == 125) { //  125 => (125, 127)
			pr = '';
			// Carga: AUTOMATICA_NORMDOBLE + AUTOMATICA_NORMALIZADA
			const prn = await (await con.query(`
				select 
				count(*)
				from (
					select * from codificacion.cod_encuesta_codificacion where id_pregunta = 125  and estado='ASIGNASUP' and usucre = '${params.usucre}'
				) as x
				join (
					select * from codificacion.cod_encuesta_codificacion where id_pregunta = 127  and estado='ASIGNASUP' and usucre = '${params.usucre}'
				) as y
				on
				x.id_informante = y.id_informante 
			`)).rows;
			prnc = prn[0].count;


			const prn2 = await (await con.query(`
		
			select 
			COUNT(*)
			from (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 125  and estado='CODIFICADO' and (usucre in (select cu.login login_cod from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A' and cu2.login ='${params.usucre}') or usucre='AUTOMATICO_NORMALIZADO')
			) as x
			join (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 127  and estado='CODIFICADO' and (usucre in (select cu.login login_cod from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A' and cu2.login ='${params.usucre}') or usucre='AUTOMATICO_NORMALIZADO')
			) as y
			on
			x.id_informante = y.id_informante

		`)).rows;
			carga = prn2[0].count;




			pr = ', Pregunta 50: actividad principal';   // "cat_cob, cat_caeb"
			cat = ', cat_caeb';
		} else { // (88,89,90,92,86,129,97,105,95,101,103,107,1001,1002,1003,1004,1005)

			// Carga: AUTOMATICA_NORMALIZADA
			const prn = await (await con.query(`select count(*) from codificacion.cod_encuesta_codificacion where estado='ASIGNASUP' and usucodificador ='AUTOMATICO_NORMALIZADO' and usucre  ='${params.usucre}' and id_pregunta=${cod_variables[i].id_pregunta}`)).rows;
			prnc = prn[0].count;


			// Carga:  DE  CODIFICADORES
			var carga = 0;
			for (var j = 0; j <= codificadores.length - 1; j++) {
				const pr = await (await con.query(`select count(*) from codificacion.cod_encuesta_codificacion where estado='CODIFICADO' and usucodificador ='${codificadores[j].login}' and id_pregunta=${cod_variables[i].id_pregunta}`)).rows;
				carga = carga + parseInt(pr[0].count, 10);
			}
		}



		result.push({
			//"Borrar: Codificadores": cods,
			//"Borrar: Supervisor": supervisor[0].id_usuario,
			"id_pregunta": cod_variables[i].id_pregunta,
			"pregunta": cod_variables[i].pregunta + pr,
			"area": null,
			"catalogo": cod_variables[i].catalogo + cat,
			"count": "Cod: " + carga + " + Aut: " + prnc + ' = ' + (parseInt(carga, 10) + parseInt(prnc, 10)),
			//"limite": 5
		});
	}

	res.status(200).json({
		datos: { rows: result }
	})
};



// Variables para Supervision: TOTAL= Cod + Aut
const devuelvePreguntasSup = async (req, res) => {
	var params = req.body;
	console.log(req.body);

	// Trabajamos con las preguntas


	// 

};











const devuelvePreguntaUsrSup_ = async (req, res) => {
	var params = req.body;
	//console.log("=================================================================================");
	console.log("id_pregunta: " + params.id_pregunta);
	console.log("limite: " + params.limite);
	console.log("usucre: " + params.usucre);




	let query = ''
	if (params.id_pregunta == 125) {
		query = {
			text:
				`select distinct ceco.id_informante , ceco.id_encuesta oid_enc, ceco.id_pregunta oid_preg, ceco.respuesta oresp, 
			ceco.respuesta_normalizada orespn,ceco.departamento odep,ceco.codigocodif ocode, ceco.usucodificador ocodificador,
			ceca.id_informante aid_inf, ceca.id_encuesta aid_enc, ceca.id_pregunta aid_preg, ceca.respuesta aresp, 
			ceca.respuesta_normalizada arespn,ceca.departamento adep,ceca.codigocodif acode, ceca.usucodificador acodificador,
			co.descripcion odescripcion, ca.descripcion adescripcion
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			inner join ${esquema}.cod_variables bo on ceco.id_pregunta=bo.id_pregunta 
			inner join ${esquema}.cod_variables ba on ceca.id_pregunta=ba.id_pregunta
			inner join ${esquema}.cod_catalogo co on bo.catalogo = co.catalogo and ceco.codigocodif=co.codigo and co.unico=1
			inner join ${esquema}.cod_catalogo ca on ba.catalogo = ca.catalogo and ceca.codigocodif=ca.codigo and ca.unico=1
			where ceco.id_pregunta =125 and ceca.id_pregunta=127 and 
						ceco.estado ='ASIGNASUP' and ceca.estado='ASIGNASUP' and 
						ceco.usucre = $1 and ceca.usucre=$1 
			union all
			select distinct ceco.id_informante oid_inf, ceco.id_encuesta oid_enc, ceco.id_pregunta oid_preg, ceco.respuesta oresp, 
			ceco.respuesta_normalizada orespn,ceco.departamento odep,ceco.codigocodif ocode, ceco.usucodificador ocodificador,
			ceca.id_informante aid_inf, ceca.id_encuesta aid_enc, ceca.id_pregunta aid_preg, ceca.respuesta aresp, 
			ceca.respuesta_normalizada arespn,ceca.departamento adep,ceca.codigocodif acode, ceca.usucodificador acodificador,
			co.descripcion odescripcion, ca.descripcion adescripcion
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca on ceco.id_informante = ceca.id_informante
				inner join ${esquema}.cod_usuario cu on ceco.usucre = cu.login  
				inner join ${esquema}.cod_usuario cs on cu.cod_supvsr = cs.id_usuario
				inner join ${esquema}.cod_variables bo on ceco.id_pregunta=bo.id_pregunta 
				inner join ${esquema}.cod_variables ba on ceca.id_pregunta=ba.id_pregunta
				inner join ${esquema}.cod_catalogo co on bo.catalogo = co.catalogo and ceco.codigocodif=co.codigo and co.unico=1
				inner join ${esquema}.cod_catalogo ca on ba.catalogo = ca.catalogo and ceca.codigocodif=ca.codigo and ca.unico=1	
			where ceco.id_pregunta =125 and ceca.id_pregunta=127  
					and cs.login ilike $1 and
					ceco.estado ='CODIFICADO' and ceca.estado='CODIFICADO'
					limit case when $2=0 then null else $2 end`,
			values: [
				params.usucre,
				params.limite,
			],
		};
	} else {
		query = {
			text:
				`select a.id_pregunta,id_informante, id_encuesta, b.pregunta, a.respuesta, a.codigocodif, 
					(select nombre_depto from cartografia.departamentos cd where cd.codigo_depto=a.departamento),
					a.usucodificador, b.catalogo, a.estado, a.departamento, a.multiple, false as activo, c.descripcion
					from ${esquema}.cod_encuesta_codificacion a, ${esquema}.cod_variables b, ${esquema}.cod_catalogo c
					where a.id_pregunta=b.id_pregunta and b.catalogo = c.catalogo and a.codigocodif=c.codigo and c.unico=1  
					and a.estado ILIKE 'ASIGNASUP' and usucodificador is not null 
					and a.usucre ilike $1 and a.id_pregunta = $2
					union all
					select a.id_pregunta,id_informante, id_encuesta, b.pregunta, a.respuesta, a.codigocodif, 
					(select nombre_depto from cartografia.departamentos cd where cd.codigo_depto=a.departamento),
					a.usucodificador, b.catalogo, a.estado, a.departamento, a.multiple, false as activo, c.descripcion
					from ${esquema}.cod_encuesta_codificacion a inner join ${esquema}.cod_variables b on a.id_pregunta=b.id_pregunta
					inner join ${esquema}.cod_usuario cu
					on a.usucre = cu.login
					inner join ${esquema}.cod_usuario cs
					on cu.cod_supvsr = cs.id_usuario
					inner join ${esquema}.cod_catalogo c on b.catalogo = c.catalogo and a.codigocodif=c.codigo and c.unico=1
					where a.id_pregunta=b.id_pregunta  and a.estado ILIKE 'CODIFICADO' and usucodificador is not null 
					and cs.login ilike $1 
					and a.id_pregunta = $2
					order by id_informante, id_encuesta limit case when $3=0 then null else $3 end`,
			values: [
				params.usucre,
				params.id_pregunta,
				params.limite,
			],
		};
	}
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};

// .../supervision
const devuelvePreguntaUsrSup = async (req, res) => {
	var {
		id_pregunta,
		limite,
		usucre
	} = req.body;

	//var limite = 50
	if (limite) {
		console.log("Existe");
	} else {
		limite = 0;

	}

	console.log("id_pregunta::::::::::::: " + id_pregunta);
	console.log("limite::::::::::::: " + limite);
	console.log("usucre::::::::::::: " + usucre);


	var result2 = [];
	var departamentos = ["Chuquisaca", "La Paz", "Cochabamba", "Oruro", "Potosí", "Tarija", "Santa Cruz", "Beni", "Pando"];
	const preg113 = ["Ninguno", "Curso de alfabetización", "Inicial (Pre kínder, kínder)", "Básico", "Intermedio", "Medio", "Primaria", "Secundaria", "Técnico Medio (Institutos, CEA)", "Técnico Superior (Institutos y Universidades)", "Licenciatura (Universidades, UNIPOL, UNIMIL, Escuela Superior de Maestros) ", "Maestría", "Doctorado"];
	const preg114 = ["1", "2", "3", "4", "5", "6", "7", "8"];
	const preg122 = ["¿La mayor parte para consumo de su familia?", "¿La mayor parte para la venta?"]
	const preg126 = ["obrera(o) empleada(o)? ", "trabajadora(or) por cuenta propia?", "empleadora(or) o socia(o)?", "trabajadora(or) familiar sin remuneración?", "trabajadora(or) del hogar?", "cooperativista de producción?"];

	if (id_pregunta == 125) {
		console.log("if (id_pregunta == 125) {");
		try {
			// result = Pregunta 25:
			const result = await (await con.query(`
        SELECT 
			   id_encuesta oid_enc, 
			   id_pregunta oid_preg,
			   respuesta oresp, 
			   respuesta_normalizada orespn,
			   departamento odep,
			   codigocodif ocode, 
			   usucodificador ocodificador,
			   id_informante oid_inf
        FROM 
			${esquema}.cod_encuesta_codificacion 
		WHERE 
			id_pregunta =125 and usucre='${usucre}' and estado='ASIGNASUP' and usucodificador  ilike 'AUTOMATICO_%'
				
			UNION ALL
		
			select 
			x.id_encuesta oid_enc, 
			x.id_pregunta oid_preg,
			x.respuesta oresp, 
			x.respuesta_normalizada orespn,
			x.departamento odep,
			x.codigocodif ocode, 
			x.usucodificador ocodificador,
			x.id_informante oid_inf
			from (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 125  and estado='CODIFICADO' and (usucre in (select cu.login login_cod from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A' and cu2.login ='${usucre}') or usucre='AUTOMATICO_NORMALIZADO')
			) as x
			join (
				select * from codificacion.cod_encuesta_codificacion where id_pregunta = 127  and estado='CODIFICADO' and (usucre in (select cu.login login_cod from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A' and cu2.login ='${usucre}') or usucre='AUTOMATICO_NORMALIZADO' )
			) as y
			on
			x.id_informante = y.id_informante order by oid_enc  limit case when ${limite}=0 then null else ${limite} end 
		

        `)).rows;




			for (var i = 0; i <= result.length - 1; i++) {
				// Completamos con la pregunta 127
				var result27 = await (await con.query(`select  * from ${esquema}.cod_encuesta_codificacion  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta =127`)).rows;
				result[i].aid_enc = result27[0].id_encuesta;
				result[i].aid_preg = result27[0].id_pregunta;
				result[i].aresp = result27[0].respuesta;
				result[i].arespn = result27[0].respuesta_normalizada;
				result[i].adep = result27[0].departamento;
				result[i].acode = result27[0].codigocodif;
				result[i].acodificador = result27[0].usucodificador;
				result[i].aid_inf = result27[0].id_informante;
				result[i].odescripcion = 'fsdfsd';
				result[i].adescripcion = 'fsdfsd';

				// Variables de apoyo
				// Edad
				var varEdad = await (await con.query(`select respuesta3 from public.enc_encuesta  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta=69`)).rows;
				//console.log(typeof varEdad[0].respuesta3);
				if (varEdad[0].respuesta3 !== null) { result[i].edad = varEdad[0].respuesta3 }


				// Nivel Educativo
				var varNivelEducativo = await (await con.query(`select respuesta3 from public.enc_encuesta  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta=113`)).rows;
				if (varNivelEducativo[0].respuesta3 !== null) { result[i].nivelEducativo = preg113[parseInt(varNivelEducativo[0].respuesta3 - 1, 10)] }
				//console.log(typeof varNivelEducativo[0].respuesta3);

				// Curso
				var varCurso = await (await con.query(`select respuesta3 from public.enc_encuesta  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta=114`)).rows;
				if (varCurso[0].respuesta3 !== null) { result[i].curso = preg114[parseInt(varCurso[0].respuesta3 - 1, 10)] }
				// console.log(typeof varCurso[0].respuesta3);

				// Cultivos Agricolas ... 
				try {
					var varDestCultivoCria = await (await con.query(`select respuesta3 from public.enc_encuesta  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta=122`)).rows;
					if (varDestCultivoCria[0].respuesta3 !== "") { result[i].destCultivoCria = preg122[parseInt(varDestCultivoCria[0].respuesta3 - 1, 10)] }
				} catch (error) {
					console.log("error:" + error);
				}

				/* console.log(
					`select respuesta3 from public.enc_encuesta  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta=122`
				); */
				//console.log(typeof varDestCultivoCria[0].respuesta3);

				// ¿En este trabajo...?
				var varCategoriaOcup = await (await con.query(`select respuesta3 from public.enc_encuesta  where id_informante=${parseInt(result[i].oid_inf, 10)} and id_pregunta=126`)).rows;
				if (varCategoriaOcup[0].respuesta3) { result[i].categoriaOcup = preg126[parseInt(varCategoriaOcup[0].respuesta3 - 1, 10)] }


				//console.log("oid_enc:  "+result[i].oid_enc);
				//console.log(typeof varCategoriaOcup[0].respuesta3);
			}

			res.status(200).json({
				datos: { rows: result }
			})
		} catch (error) {
			console.log("|devuelvePreguntaUsrSup|125,127|Back-End| " + error);
		}
	} else {

		/* console.log("id_pregunta "+ id_pregunta);
		console.log("limite "+ limite);
		console.log("usucre "+ usucre); */

		try {
			// carga de automatica normalizada
			/* const result = await (await con.query(`
				SELECT 
					*
				FROM 
					${esquema}.cod_encuesta_codificacion 
				WHERE 
					id_pregunta =${id_pregunta} and usucre='${usucre}' and usucodificador ='AUTOMATICO_NORMALIZADO'and estado='ASIGNASUP' limit case when ${limite}=0 then null else ${limite} end
			`)).rows; */


			// Averigua el id_usuario del supervisor
			const supervisor = await (await con.query(`select id_usuario  from codificacion.cod_usuario where login = '${usucre}'`)).rows;

			// Averigua sus codificadores
			//const codificadores = await (await con.query(`select  login from codificacion.cod_usuario where cod_supvsr = ${supervisor[0].id_usuario}`)).rows;


			const result = await (await con.query(`
				
				SELECT 
				*
				FROM 
				${esquema}.cod_encuesta_codificacion 
				WHERE 
				id_pregunta =${id_pregunta} and usucre='${usucre}' and usucodificador ='AUTOMATICO_NORMALIZADO'and estado='ASIGNASUP'

				union all

				select * 
				from codificacion.cod_encuesta_codificacion 
				where estado='CODIFICADO' and id_pregunta=${id_pregunta} and usucodificador in (
					select  login from codificacion.cod_usuario where cod_supvsr = ${supervisor[0].id_usuario}
				)
				limit case when ${limite}=0 then null else ${limite} end

			`)).rows;


			// carga de codificadores
			/* for (var j = 0; j <= codificadores.length - 1; j++) {
				const pr = await (await con.query(`select * from codificacion.cod_encuesta_codificacion where estado='CODIFICADO' and usucodificador ='${codificadores[j].login}' and id_pregunta=${id_pregunta}`)).rows;
			} */


			/* select count(*) from codificacion.cod_encuesta_codificacion where estado='ASIGNASUP' and usucodificador ='AUTOMATICO_NORMALIZADO' and usucre  ='${params.usucre}' */
			var catalogo = '';
			var varApoyo = 'NO CORRESPONDE';
			var pregunta = '';


			// CATALOGO, PREGUNTA
			if (id_pregunta == 56) {
				catalogo = 'cat_pais';	// PREGUNTA 20
				pregunta = 'AQUI PREGUNTA 20...'
			}
			if (id_pregunta == 86) {
				catalogo = 'cat_npioc';	// PREGUNTA 32
				pregunta = 'Pregunta 32: Nación pueblo indígena originario campesino o afroboliviano'
			}

			if (id_pregunta == 88) {
				catalogo = 'cat_idioma';	// PREGUNTA 33
				pregunta = 'Pregunta 33: ¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1'
			}
			if (id_pregunta == 89) {
				catalogo = 'cat_idioma';	// PREGUNTA 33
				pregunta = 'Pregunta 33: ¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2'
			}
			if (id_pregunta == 90) {
				catalogo = 'cat_idioma';	// PREGUNTA 33
				pregunta = 'Pregunta 33: ¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3'
			}


			if (id_pregunta == 92) {
				catalogo = 'cat_idioma';	// PREGUNTA 34
				pregunta = 'Pregunta: 34. ¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?'
			}

			if (id_pregunta == 95) {
				catalogo = 'cat_municipio';	// PREGUNTA 35
				pregunta = 'Pregunta 35: Municipio donde nació';
			}
			if (id_pregunta == 97) {
				catalogo = 'cat_pais';		// PREGUNTA 35
				pregunta = 'Pregunta 35: País donde nació';
			}

			if (id_pregunta == 101) {
				catalogo = 'cat_municipio'; // PREGUNTA 36
				pregunta = 'Pregunta 36: Municipio donde vive habitualmente';
			}
			if (id_pregunta == 103) {
				catalogo = 'cat_pais'; 		// PREGUNTA 36
				pregunta = 'Pregunta 36: País donde vive habitualmente';
			}

			if (id_pregunta == 105) {
				catalogo = 'cat_municipio'; // PREGUNTA 37
				pregunta = 'Pregunta 37: ¿En qué municipio vivía hace cinco años (año 2018)?';
			}
			if (id_pregunta == 107) {
				catalogo = 'cat_pais'; 		// PREGUNTA 37
				pregunta = 'Pregunta 37: ¿En qué país vivía hace cinco años (año 2018)?';
			}

			if (id_pregunta == 129) {
				catalogo = 'cat_municipio_pais'; 		// PREGUNTA 51
				pregunta = 'Pregunta 51: ¿Cuál es principalmente el lugar donde trabaja?';
			}


			if (id_pregunta == 1001) {
				catalogo = 'cat_pais'; 		// PREGUNTA 20
				pregunta = 'Pregunta 20: Persona 1';
			}
			if (id_pregunta == 1002) {
				catalogo = 'cat_pais'; 		// PREGUNTA 20
				pregunta = 'Pregunta 20: Persona 2';
			}
			if (id_pregunta == 1003) {
				catalogo = 'cat_pais'; 		// PREGUNTA 20
				pregunta = 'Pregunta 20: Persona 3';
			}
			if (id_pregunta == 1004) {
				catalogo = 'cat_pais'; 		// PREGUNTA 20
				pregunta = 'Pregunta 20: Persona 4';
			}
			if (id_pregunta == 1005) {
				catalogo = 'cat_pais'; 		// PREGUNTA 20
				pregunta = 'Pregunta 20: Persona 5';
			}


			console.log("Variables de apoyo");

			// VARIABLE DE APOYO

			for (var i = 0; i <= result.length - 1; i++) {
				varApoyo = 'NO CORRESPONDE';
				var descripcion = ' - - -';


				// variable apoyo
				if (id_pregunta == 95) {
					const resultVaApoyo = await (await con.query(`
					SELECT respuesta3  from public.enc_encuesta where id_pregunta in(96) and id_informante=${result[i].id_informante}
					`)).rows;
					varApoyo = departamentos[resultVaApoyo[0].respuesta3 - 1];
				}

				if (id_pregunta == 101) {
					const resultVaApoyo = await (await con.query(`
					SELECT respuesta3  from public.enc_encuesta where id_pregunta in(102) and id_informante=${result[i].id_informante}
					`)).rows;
					varApoyo = departamentos[resultVaApoyo[0].respuesta3 - 1];
				}

				if (id_pregunta == 105) {
					const resultVaApoyo = await (await con.query(`
					SELECT respuesta3  from public.enc_encuesta where id_pregunta in(106) and id_informante=${result[i].id_informante}
					`)).rows;
					varApoyo = departamentos[resultVaApoyo[0].respuesta3 - 1];
				}

				// Descripción 88,89,90,92,86,129,97,105,95,101,103,107,1001,1002,1003,1004,1005,125

				if (id_pregunta == 88) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_idioma' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 89) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_idioma' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 90) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_idioma' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 92) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_idioma' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 86) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_npioc' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 129) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_municipio_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 97) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 105) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_municipio' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 95) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_municipio' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 101) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_municipio' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 103) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 107) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 125) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_cob' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 127) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_caeb' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 1001) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 1002) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 1003) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}

				if (id_pregunta == 1004) {
					const resultDescripcion = await (await con.query(`
					select descripcion  from codificacion.cod_catalogo where codigo = '${result[i].codigocodif}' and catalogo = 'cat_pais' and unico=1
					`)).rows;
					if (resultDescripcion.length > 0) {
						descripcion = resultDescripcion[0].descripcion;
					}
				}



				// Descripción 88,89,90,92,86,129,97,105,95,101,103,107,1001,1002,1003,1004,1005,125



				result2.push({
					"id_pregunta": result[i].id_pregunta,
					"id_informante": result[i].id_informante,
					"id_encuesta": result[i].id_encuesta,
					"pregunta": pregunta,
					"respuesta": result[i].respuesta,
					"codigocodif": result[i].codigocodif,
					"nombre_depto": "COCHABAMBA",
					"usucodificador": result[i].usucodificador,
					"catalogo": catalogo,
					"estado": result[i].estado,
					"departamento": "03",
					"multiple": false,
					"activo": true,
					"descripcion": descripcion,
					"limite": limite,
					"varApoyo": varApoyo,
				});
			}

			res.status(200).json({
				datos: { rows: result2 }
			})
		} catch (error) {
			console.log("|devuelvePreguntaUsrSup|55,86,88,92,...|Back-End| " + error);
		}

	}





};



/* 
		   id_encuesta oid_enc, 
		   id_pregunta oid_preg,
		   respuesta oresp, 
		   respuesta_normalizada orespn,
		   departamento odep,
		   codigocodif ocode, 
		   usucodificador ocodificador,
		   id_informante oid_inf
		   ===================================================
		   "id_informante": "186",
			"oid_enc": "7282",
			"oid_preg": 125,
			"oresp": "VENDEDOR",
			"orespn": "vendedor",
			"odep": "03",
			"ocode": "52210",
			"ocodificador": "AUTOMATICO_NORMDOBLE",
			"aid_inf": "186",
			"aid_enc": "7343",
			"aid_preg": 127,
			"aresp": "VENTA EN TIENDA DE BARRIO",
			"arespn": "ventaentiendadebarrio",
			"adep": "03",
			"acode": "47113",
			"acodificador": "AUTOMATICO_NORMDOBLE",
			"odescripcion": "Vendedores en tiendas o almacenes",
			"adescripcion": "Venta al por menor en tiendas de barrio con surtido compuesto principalmente de alimentos, bebidas y tabaco"
			=================================================
			{ field: 'var1', header: 'Edad' },
			{ field: 'var2', header: 'Nivel Edu.' },
			{ field: 'var3', header: 'Curso' },
			{ field: 'var4', header: 'Destino de cultivos o cría' },
			{ field: 'var5', header: 'Cat. ocupacional' },

*/


const devuelvePreguntasCodificado = async (req, res) => {
	var params = req.body;
	const query = {
		text: `
		SELECT
			1 orden,
			'p20esp' tabla_id,
			'La Paz' AS depto,
			'20' AS nro_preg,
			'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
			count(*) AS total_carga
		FROM codificacion.cod_p20esp WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			2 orden,
			'p32esp' tabla_id,
			'La Paz' AS depto,
			'32' AS nro_preg,
			'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p32esp WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			3 orden,
			'p331' tabla_id,
			'La Paz' AS depto,
			'33' AS nro_preg,
			'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p331 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			4 orden,
			'p332' tabla_id,
			'La Paz' AS depto,
			'33' AS nro_preg,
			'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p332 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			5 orden,
			'p333' tabla_id,
			'La Paz' AS depto,
			'33' AS nro_preg,
			'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p333 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			6 orden,
			'p341' tabla_id,
			'La Paz' AS depto,
			'34' AS nro_preg,
			'¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p341 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			7 orden,
			'p352a' tabla_id,
			'La Paz' AS depto,
			'35' AS nro_preg,
			'¿Dónde nació? ¿Municipio?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p352a WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			8 orden,
			'p353' tabla_id,
			'La Paz' AS depto,
			'35' AS nro_preg,
			'¿Dónde nació? ¿País?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p353 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			9 orden,
			'p362a' tabla_id,
			'La Paz' AS depto,
			'36' AS nro_preg,
			'¿Dónde vive habitualmente? ¿Municipio?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p362a WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			10 orden,
			'p363' tabla_id,
			'La Paz' AS depto,
			'36' AS nro_preg,
			'¿Dónde vive habitualmente? ¿País?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p363 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			11 orden,
			'p372a' tabla_id,
			'La Paz' AS depto,
			'37' AS nro_preg,
			'¿Dónde vivía el año 2019? ¿Municipio?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p372a WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			12 orden,
			'p373' tabla_id,
			'La Paz' AS depto,
			'37' AS nro_preg,
			'¿Dónde vivía el año 2019? ¿País?' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p373 WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			13 orden,
			'p48esp' tabla_id,
			'La Paz' AS depto,
			'48' AS nro_preg,
			'Las últimas 4 semanas:' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p48esp WHERE estado = 'ASIGNADO' AND usucre = $1

		UNION

		SELECT
			14 orden,
			'p49_p51' tabla_id,
			'La Paz' AS depto,
			'49-51' AS nro_preg,
			'Ocupación - Actividad Económica' AS variable,
			count (1) AS total_carga
		FROM codificacion.cod_p49_p51 WHERE (estado_ocu = 'ASIGNADO' or  estado_act = 'ASIGNADO')  AND usucre = $1

		UNION

		SELECT
			15 orden,
			'p52esp' AS tabla_id,
			'La Paz' AS depto,
			'52' AS nro_preg,
			'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
			count(1) AS total_carga
		FROM codificacion.cod_p52esp WHERE estado = 'ASIGNADO' AND usucre = $1
		ORDER BY orden asc
		`,
		values: [
			params.usucre,
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};

// Asistida (devulve TOTAL ASISTIDA para la supervision)
const devuelvePreguntasSupervision = async (req, res) => {
	//var params = req.body;

	const {
		id_usuario // id_usuario del supervisor
	} = req.body;

	// query
	const query = `
	SELECT 
		1 orden,
		'p20esp' tabla_id,
		'20' AS nro_preg,
		'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p20esp 
	WHERE estado ='CODIFICADO' AND usucre  IN (SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		2 orden,
		'p32esp' tabla_id,
		'32' AS nro_preg,
		'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p32esp
	WHERE estado ='CODIFICADO' AND usucre  IN (SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})
	UNION

	SELECT
		3 orden,
		'p331' tabla_id,
		'33' AS nro_preg,
		'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p331
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		4 orden,
		'p332' tabla_id,
		'33' AS nro_preg,
		'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p332
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		5 orden,
		'p333' tabla_id,
		'33' AS nro_preg,
		'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p333
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		6 orden,
		'p341' tabla_id,
		'34' AS nro_preg,
		'¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p341
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		7 orden,
		'p352a' tabla_id,
		'35' AS nro_preg,
		'¿Dónde nació? ¿Municipio?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p352a
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		8 orden,
		'p353' tabla_id,
		'35' AS nro_preg,
		'¿Dónde nació? ¿País?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p353
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		9 orden,
		'p362a' tabla_id,
		'36' AS nro_preg,
		'¿Dónde vive habitualmente? ¿Municipio?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p362a
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		10 orden,
		'p363' tabla_id,
		'36' AS nro_preg,
		'¿Dónde vive habitualmente? ¿País?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p363
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		11 orden,
		'p372a' tabla_id,
		'37' AS nro_preg,
		'¿Dónde vivía el año 2019? ¿Municipio?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p372a
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		12 orden,
		'p373' tabla_id,
		'37' AS nro_preg,
		'¿Dónde vivía el año 2019? ¿País?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p373
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		13 orden,
		'p48esp' tabla_id,
		'48' AS nro_preg,
		'Las últimas 4 semanas:' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p48esp
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		14 orden,
		'p49_p51' tabla_id,
		'49-51' AS nro_preg,
		'Ocupación - Actividad Económica' AS variable,
		count(1) totalCod,
		0 totalAut,
		false btn_simple
	FROM codificacion.cod_p49_p51
	WHERE (estado_ocu = 'CODIFICADO' and  estado_act = 'CODIFICADO') AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})

	UNION

	SELECT
		15 orden,
		'p52esp' tabla_id,
		'52' AS nro_preg,
		'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p52esp
	WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})	
	ORDER BY orden asc
	`;

	// ejecutar query
	const registros = await (await con.query(query)).rows;

	console.table(registros);

	res.status(200).json({
		datos: registros
	})

};


// Automatica (devulve TOTAL AUTOMATICA para la supervision)
const devuelvePreguntasSupervisionAutomatica = async (req, res) => {
	//var params = req.body;

	const {
		id_usuario,
		login // id_usuario del supervisor
	} = req.body;

	console.log("####################devuelvePreguntasSupervisionAutomatica####################");	
	console.table(req.body);
	

	// query
	const query = `
	SELECT 
		1 orden,
		'p20esp' tabla_id,
		'20' AS nro_preg,
		'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p20esp 
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		2 orden,
		'p32esp' tabla_id,
		'32' AS nro_preg,
		'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p32esp
	WHERE estado ='ASIGNASUP' AND usucre='${login}'
	UNION

	SELECT
		3 orden,
		'p331' tabla_id,
		'33' AS nro_preg,
		'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 1' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p331
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		4 orden,
		'p332' tabla_id,
		'33' AS nro_preg,
		'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 2' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p332
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		5 orden,
		'p333' tabla_id,
		'33' AS nro_preg,
		'¿Qué idiomas o lenguas habla?, según el mayor uso: idioma 3' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p333
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		6 orden,
		'p341' tabla_id,
		'34' AS nro_preg,
		'¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p341
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		7 orden,
		'p352a' tabla_id,
		'35' AS nro_preg,
		'¿Dónde nació? ¿Municipio?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p352a
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		8 orden,
		'p353' tabla_id,
		'35' AS nro_preg,
		'¿Dónde nació? ¿País?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p353
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		9 orden,
		'p362a' tabla_id,
		'36' AS nro_preg,
		'¿Dónde vive habitualmente? ¿Municipio?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p362a
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		10 orden,
		'p363' tabla_id,
		'36' AS nro_preg,
		'¿Dónde vive habitualmente? ¿País?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p363
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		11 orden,
		'p372a' tabla_id,
		'37' AS nro_preg,
		'¿Dónde vivía el año 2019? ¿Municipio?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p372a
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		12 orden,
		'p373' tabla_id,
		'37' AS nro_preg,
		'¿Dónde vivía el año 2019? ¿País?' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p373
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		13 orden,
		'p48esp' tabla_id,
		'48' AS nro_preg,
		'Las últimas 4 semanas:' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p48esp
	WHERE estado ='ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		14 orden,
		'p49_p51' tabla_id,
		'49-51' AS nro_preg,
		'Ocupación - Actividad Económica' AS variable,
		count(1) totalCod,
		0 totalAut,
		false btn_simple
	FROM codificacion.cod_p49_p51
	WHERE estado_ocu = 'ASIGNASUP' and  estado_act = 'ASIGNASUP' AND usucre='${login}'

	UNION

	SELECT
		15 orden,
		'p52esp' tabla_id,
		'52' AS nro_preg,
		'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
		count(1) totalCod,
		0 totalAut,
		true btn_simple
	FROM codificacion.cod_p52esp
	WHERE estado ='ASIGNASUP' AND usucre='${login}'	
	ORDER BY orden asc
	`;

	// ejecutar query
	const registros = await (await con.query(query)).rows;

	console.table(registros);

	res.status(200).json({
		datos: registros
	})

};


// Devuelve carga para supervision simple y doble
const devuelveCargaParaSupervision = async (req, res) => {
	const {
		id_usuario, // id_usuario del supervisor	
		tabla_id // tabla_id
	} = req.body;

	// p49_p51
	if (tabla_id === 'p49_p51') {
		const query = `
		SELECT 
			id_p49_p51 as id_registro,
			secuencial,
			estado_ocu,
			codigocodif_ocu,
			estado_act,
			codigocodif_act,
			respuesta_ocu,
			respuesta_act,
			usucodificador_ocu,
			usucodificador_act,
			(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_cob' AND  codigo = codigocodif_ocu AND unico = 1 AND estado ='ACTIVO') AS descripcion_ocu,
			(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_caeb' AND  codigo = codigocodif_act AND unico = 1 AND estado ='ACTIVO') AS descripcion_act,
			CONCAT(p26) contexto_edad,
			CONCAT(p41a) contexto_nivel_edu,
			CONCAT(p41b) contexto_curso,
			CONCAT(p45) contexto_atendio,
			CONCAT(p48esp) contexto_otro,
			CONCAT(p50) contexto_es_era,
			CONCAT(p52esp) contexto_lugar_trabajo,
			departamento,
			CONCAT(
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Cuántos años cumplidos tiene? </strong> ',p26,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Nivel educativo: </strong> ',p41a,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Curso o año: </strong> ',p41b,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Atendió cultivos agricolas o cría de animales? </strong> ',p45,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>P.48 Otro especifique: </strong> ',p48esp,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>En ese trabajo es (era): </strong> ',p50,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Lugar donde trabaja: </strong> ',p52esp,'<br>'
			) contexto_html
		FROM codificacion.cod_p49_p51
		WHERE (estado_ocu = 'CODIFICADO' AND  estado_act = 'CODIFICADO') AND (usucodificador_ocu NOT  LIKE 'AUTOMATICO_%' OR usucodificador_act NOT LIKE 'AUTOMATICO_%') AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr= ${id_usuario})		
		order by codigocodif_act
		limit 1500
		`;
		const registros = await (await con.query(query)).rows;


		// Clasificacion a utilizar para ocupacion:
		const catalogo_ocu = await (await con.query(`
		SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
		FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_cob' ORDER BY LENGTH(codigo), codigo ASC
		`)).rows;


		// Clasificacion a utilizar para actividad economica:
		const catalogo_act = await (await con.query(`
		SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
		FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_caeb' ORDER BY LENGTH(codigo), codigo ASC
		`)).rows;

		// Catalogo
		res.status(200).json({
			datos: registros,
			catalogo_ocu,
			catalogo_act
		})
		return;
	}

	// p20esp
	if (tabla_id === 'p20esp') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p20esp  as id_registro,
					sec_cuestionario secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p20esp
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais'
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p32esp
	if (tabla_id === 'p32esp') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p32esp  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_npioc' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p32esp
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario}) LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_npioc';		
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p331
	if (tabla_id === 'p331') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p331  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
		 			'' var_contexto,
					departamento		
				FROM codificacion.cod_p331
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p332
	if (tabla_id === 'p332') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p332  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p332
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p333
	if (tabla_id === 'p333') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p333  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p333
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p341
	if (tabla_id === 'p341') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 					 
					id_p341  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p341
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p352a
	if (tabla_id === 'p352a') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p352a  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio' AND codigo =codigocodif) as descripcion,
					case 
						when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
						when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
						when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
						when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
						when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
						when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
						when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
						when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
						when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
						when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
					end as var_contexto,
					departamento
				FROM codificacion.cod_p352a
				WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}



	// p353
	if (tabla_id === 'p353') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p353  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				'' var_contexto,
				departamento		
			FROM codificacion.cod_p353
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;



		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;


	}


	// p362a
	if (tabla_id === 'p362a') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p362a  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio' AND codigo =codigocodif) as descripcion,
				case 
					when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
					when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
					when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
					when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
					when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
					when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
					when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
					when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
					when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
					when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
				end as var_contexto,
				departamento
			FROM codificacion.cod_p362a
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;


		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p363
	if (tabla_id === 'p363') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p363  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				'- -' var_contexto,
				departamento		
			FROM codificacion.cod_p363
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}



	// p372a
	if (tabla_id === 'p372a') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p372a  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio' AND codigo =codigocodif) as descripcion,
				case 
					when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
					when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
					when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
					when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
					when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
					when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
					when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
					when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
					when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
					when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
				end as var_contexto,
				departamento
			FROM codificacion.cod_p372a
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p373
	if (tabla_id === 'p373') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p373  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				'- -' var_contexto,
				departamento		
			FROM codificacion.cod_p373
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p48esp
	if (tabla_id === 'p48esp') {
		console.log('---------p48esp-------');
		console.log(req.body);
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p48esp  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_cob' AND unico ='1' AND codigo =codigocodif) as descripcion,
				case 
					when p48 is not NULL AND p26 is not null  then '<strong> Descripción: </strong>' || p48 || '<br><strong> Edad: </strong>' || p26
					when p48 is not NULL AND p26 is null  then '<strong> Descripción: </strong>' || p48 || '<br><strong> Edad: </strong> NO DEFINIDO'
					when p48 is NULL AND p26 is NOT null  then '<strong> Descripción: </strong> NO DEFINIDO<br><strong> Edad: </strong>' || P26
					when p48 is NULL AND p26 is null  then '<strong> Descripción: </strong> NO DEFINIDO <br><strong> Edad: </strong> NO DEFINIDO'
				end as var_contexto,
				departamento
			FROM codificacion.cod_p48esp
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT id_catalogo, codigo, descripcion FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_cob';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		});
		// return;

	}

	// p52esp
	if (tabla_id === 'p52esp') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p52esp  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				case 
					when p52 is not null then '<strong> Descripción: </strong>' || p52
					when p52 is null then  '<strong> Descripción: </strong>' || ' NO DEFINIDO' 
				end as var_contexto,
				departamento
			FROM codificacion.cod_p52esp
			WHERE estado ='CODIFICADO' AND usucre  IN ( SELECT login FROM codificacion.cod_usuario WHERE cod_supvsr = ${id_usuario})  LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio_pais';
		`)).rows;


		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


}


const devuelveCargaParaSupervisionAutomatica = async (req, res) => {
	const {
		id_usuario, // id_usuario del supervisor	
		tabla_id, // tabla_id
		login
	} = req.body;

	// p49_p51
	if (tabla_id === 'p49_p51') {
		const query = `
		SELECT 
			id_p49_p51 as id_registro,
			secuencial,
			estado_ocu,
			codigocodif_ocu,
			estado_act,
			codigocodif_act,
			respuesta_ocu,
			respuesta_act,
			usucodificador_ocu,
			usucodificador_act,
			(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_cob' AND  codigo = codigocodif_ocu AND unico = 1 AND estado ='ACTIVO') AS descripcion_ocu,
			(SELECT descripcion  FROM codificacion.cod_catalogo WHERE catalogo ='cat_caeb' AND  codigo = codigocodif_act AND unico = 1 AND estado ='ACTIVO') AS descripcion_act,
			CONCAT(p26) contexto_edad,
			CONCAT(p41a) contexto_nivel_edu,
			CONCAT(p41b) contexto_curso,
			CONCAT(p45) contexto_atendio,
			CONCAT(p48esp) contexto_otro,
			CONCAT(p50) contexto_es_era,
			CONCAT(p52esp) contexto_lugar_trabajo,
			departamento,
			CONCAT(
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Cuántos años cumplidos tiene? </strong> ',p26,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Nivel educativo: </strong> ',p41a,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Curso o año: </strong> ',p41b,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>¿Atendió cultivos agricolas o cría de animales? </strong> ',p45,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>P.48 Otro especifique: </strong> ',p48esp,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>En ese trabajo es (era): </strong> ',p50,'<br>',
				'<strong style=''font-weight: normal; color:rgb(14, 149, 83);''>Lugar donde trabaja: </strong> ',p52esp,'<br>'
			) contexto_html
		FROM codificacion.cod_p49_p51
		WHERE (estado_ocu = 'ASIGNASUP' AND  estado_act = 'ASIGNASUP') AND (usucodificador_ocu ILIKE 'AUTOMATICO_%' AND usucodificador_act ILIKE 'AUTOMATICO_%') AND usucre='${login}'		
		order by codigocodif_act
		limit 1500
		`;
		const registros = await (await con.query(query)).rows;


		// Clasificacion a utilizar para ocupacion:
		const catalogo_ocu = await (await con.query(`
		SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
		FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_cob' ORDER BY LENGTH(codigo), codigo ASC
		`)).rows;


		// Clasificacion a utilizar para actividad economica:
		const catalogo_act = await (await con.query(`
		SELECT id_catalogo, catalogo, codigo, descripcion, estado, usucre, feccre, usumod, fecmod, descripcion_unida, unico
		FROM codificacion.cod_catalogo WHERE estado ='ACTIVO' AND catalogo ='cat_caeb' ORDER BY LENGTH(codigo), codigo ASC
		`)).rows;

		// Catalogo
		res.status(200).json({
			datos: registros,
			catalogo_ocu,
			catalogo_act
		})
		return;
	}

	// p20esp
	if (tabla_id === 'p20esp') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p20esp  as id_registro,
					sec_cuestionario secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p20esp
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais'
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p32esp
	if (tabla_id === 'p32esp') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p32esp  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_npioc' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p32esp
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_npioc';		
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p331
	if (tabla_id === 'p331') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p331  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
		 			'' var_contexto,
					departamento		
				FROM codificacion.cod_p331
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p332
	if (tabla_id === 'p332') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p332  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p332
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p333
	if (tabla_id === 'p333') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p333  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p333
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}

	// p341
	if (tabla_id === 'p341') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 					 
					id_p341  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_idioma' AND unico ='1' AND codigo =codigocodif) as descripcion,
					'' var_contexto,
					departamento		
				FROM codificacion.cod_p341
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_idioma';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p352a
	if (tabla_id === 'p352a') {
		// Consulta	
		const registros = await (await con.query(`
				SELECT 
					id_p352a  as id_registro,
					secuencial,
					estado,
					respuesta,
					codigocodif,
					usucodificador,
					(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio' AND codigo =codigocodif) as descripcion,
					case 
						when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
						when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
						when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
						when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
						when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
						when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
						when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
						when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
						when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
						when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
					end as var_contexto,
					departamento
				FROM codificacion.cod_p352a
				WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
			`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}



	// p353
	if (tabla_id === 'p353') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p353  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				'' var_contexto,
				departamento		
			FROM codificacion.cod_p353
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;



		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;


	}


	// p362a
	if (tabla_id === 'p362a') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p362a  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio' AND codigo =codigocodif) as descripcion,
				case 
					when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
					when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
					when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
					when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
					when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
					when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
					when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
					when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
					when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
					when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
				end as var_contexto,
				departamento
			FROM codificacion.cod_p362a
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;


		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p363
	if (tabla_id === 'p363') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p363  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				'- -' var_contexto,
				departamento		
			FROM codificacion.cod_p363
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}



	// p372a
	if (tabla_id === 'p372a') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p372a  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio' AND codigo =codigocodif limit 1) as descripcion,
				case 
					when apoyo = '01' then '<strong> ¿En qué departamento?</strong>' || ' CHUQUISACA' 
					when apoyo = '02' then '<strong> ¿En qué departamento?</strong>' || ' LA PAZ' 
					when apoyo = '03' then '<strong> ¿En qué departamento?</strong>' || ' COCHABAMBA' 
					when apoyo = '04' then '<strong> ¿En qué departamento?</strong>' || ' ORURO' 
					when apoyo = '05' then '<strong> ¿En qué departamento?</strong>' || ' POTOSI' 
					when apoyo = '06' then '<strong> ¿En qué departamento?</strong>' || ' TARIJA' 
					when apoyo = '07' then '<strong> ¿En qué departamento?</strong>' || ' SANTA CRUZ' 
					when apoyo = '08' then '<strong> ¿En qué departamento?</strong>' || ' BENI' 
					when apoyo = '09' then '<strong> ¿En qué departamento?</strong>' || ' PANDO' 
					when apoyo is null then  '<strong> ¿En qué departamento?</strong>' || ' NO DEFINIDO' 
				end as var_contexto,
				departamento
			FROM codificacion.cod_p372a
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p373
	if (tabla_id === 'p373') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p373  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				'- -' var_contexto,
				departamento		
			FROM codificacion.cod_p373
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_pais';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


	// p48esp
	if (tabla_id === 'p48esp') {
		console.log('---------p48esp-------');
		console.log(req.body);
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p48esp  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_cob' AND unico ='1' AND codigo =codigocodif) as descripcion,
				case 
					when p48 is not NULL AND p26 is not null  then '<strong> Descripción: </strong>' || p48 || '<br><strong> Edad: </strong>' || p26
					when p48 is not NULL AND p26 is null  then '<strong> Descripción: </strong>' || p48 || '<br><strong> Edad: </strong> NO DEFINIDO'
					when p48 is NULL AND p26 is NOT null  then '<strong> Descripción: </strong> NO DEFINIDO<br><strong> Edad: </strong>' || P26
					when p48 is NULL AND p26 is null  then '<strong> Descripción: </strong> NO DEFINIDO <br><strong> Edad: </strong> NO DEFINIDO'
				end as var_contexto,
				departamento
			FROM codificacion.cod_p48esp
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT id_catalogo, codigo, descripcion FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_cob';
		`)).rows;

		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		});
		// return;

	}

	// p52esp
	if (tabla_id === 'p52esp') {
		// Consulta	
		const registros = await (await con.query(`
			SELECT 
				id_p52esp  as id_registro,
				secuencial,
				estado,
				respuesta,
				codigocodif,
				usucodificador,
				(SELECT descripcion FROM codificacion.cod_catalogo WHERE  catalogo ='cat_municipio_pais' AND unico ='1' AND codigo =codigocodif) as descripcion,
				case 
					when p52 is not null then '<strong> Descripción: </strong>' || p52
					when p52 is null then  '<strong> Descripción: </strong>' || ' NO DEFINIDO' 
				end as var_contexto,
				departamento
			FROM codificacion.cod_p52esp
			WHERE estado ='ASIGNASUP' AND usucre='${login}' LIMIT 1500
		`)).rows;

		// Catalogo
		const catalogo = await (await con.query(`
			SELECT * FROM codificacion.cod_catalogo WHERE estado = 'ACTIVO' and catalogo ='cat_municipio_pais';
		`)).rows;


		// respuesta
		res.status(200).json({
			datos: registros,
			catalogo: catalogo
		})
		return;
	}


}






const devuelvePreguntasCodificado_ = async (req, res) => {
	var params = req.body;
	const query = {
		text: `
			select a.id_pregunta, b.pregunta, b.catalogo, b.area, count(*)
			from ${esquema}.cod_encuesta_codificacion a, ${esquema}.cod_variables b
			where a.id_pregunta=b.id_pregunta and a.id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO') 
			and a.id_pregunta not in  (125,127)  and a.estado ILIKE 'ASIGNADO' and usucre ilike $1 group by a.id_pregunta, b.pregunta, b.catalogo, b.area
			union all
			select 125 id_pregunta, 'Preguntas 48-50: Ocupación - Actividad Económica' pregunta, 'cat_cob, cat_caeb' catalogo, '' area, count(*) cuenta from  
			(select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
			ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =125 and ceca.id_pregunta=127  
			and ceca.estado ilike 'ASIGNADO' and ceca.usucre ilike $1
			and ceco.estado ilike 'ASIGNADO' and ceco.usucre ilike $1) x
			having count(*)>0
		`,
		values: [
			params.usucre,
		],
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};

// updateOcuAct
const updateOcuAct = async (req, res) => {

	const {
		login,
		id_p49_p51,
		codigo,
		descripcion,
		variable,
	} = req.body;

	console.log(req.body);

	// verificamos si la variables es ocupacion o actividad
	if (variable === 'ocu') {

		await con.query(`
		UPDATE codificacion.cod_p49_p51
		SET estado_ocu = 'CODIFICADO', codigocodif_ocu = '${codigo}', feccodificador_ocu = now(), usucodificador_ocu = '${login}'
		WHERE id_p49_p51 = ${id_p49_p51}
		`)

		// Respuesta
		res.status(200).json({
			success: true,
		});

		return;
	}


	// verificamos si la variables es ocupacion o actividad
	if (variable === 'act') {

		await con.query(`
		UPDATE codificacion.cod_p49_p51
		SET estado_act = 'CODIFICADO', codigocodif_act = '${codigo}', feccodificador_act = now(), usucodificador_act = '${login}'
		WHERE id_p49_p51 = ${id_p49_p51}
		`)

		// Respuesta
		res.status(200).json({
			success: true,
		});
		return;
	}


};


// 
const updateCargaSupervision = async (req, res) => {
	const {
		id_usuario,
		tabla_id,
		registros
	} = req.body;

	console.log(req.body);

	// verificar que tabla es
	if (tabla_id === 'p49_p51') {

		console.log('------------------------------------p49_p51--------------------------------------------');

		// recorrer registros
		for (let i = 0; i < registros.length; i++) {
			const element = registros[i];

			await con.query(`
			UPDATE codificacion.cod_p49_p51
			SET estado_ocu = 'VERIFICADO', codigocodif_v1_ocu ='${element.codigocodif_ocu}', fecverificador = now(), usuverificador = '${id_usuario}', 
				estado_act = 'VERIFICADO', codigocodif_v1_act ='${element.codigocodif_act}'
			WHERE id_p49_p51 = ${element.id_registro}
			`)
		}

		// respuesta
		res.status(200).json({
			success: true,
			message: 'Carga supervisada correctamente. ' + tabla_id
		})
	} else {
		console.log('------------------------------------cod_' + tabla_id + '--------------------------------------------');
		// recorrer registros
		for (let i = 0; i < registros.length; i++) {
			const element = registros[i];
			await con.query(`
			UPDATE codificacion.cod_${tabla_id}
			SET estado = 'VERIFICADO', codigocodif_v1 ='${element.codigocodif}', fecverificador = now(), usuverificador = '${id_usuario}'			
			WHERE id_${tabla_id} = ${element.id_registro}
			`)
		}

		// respuesta
		res.status(200).json({
			success: true,
			message: 'Carga supervisada correctamente. ' + tabla_id
		})
	}
}
/* 
estado
codigocodif_v1
fecverificador
usuverificador
*/


module.exports = {
	cargarDatos,
	normalizaRespuesta,
	codificaNormalizada,
	codificacionNormalizadaUpd,
	preguntasPorDepartamentoCod,
	preguntasPorDepartamentoSup,
	codificadores,
	cargarParaCodificarSimple,
	cargarParaCodificarDoble,
	codificadoresConCarga,
	supervisoresSinCarga,
	supervisoresConCarga,
	supervisores,
	reasignar,
	reasignarsup,
	getCantidadDptoPregArea,
	updateInicializarUsr,
	updateInicializarUsrSup,
	updateAsignado,
	updateReAsignado,
	preguntasPorUsuario,
	preguntasPorUsuDual,
	preguntasPorVerificar,
	variablesApoyo,
	catalogoCodificacion,
	updatePreguntaVerif,
	updatePreguntaSimple,
	updatePreguntaSimpleAnular,
	updatePreguntaDobleOcuAct,
	//updatePreguntaDobleAct,
	updatePreguntaDobleAnular,
	// updatePregunta,
	anularAnteriorVerif,
	anularAnterior,
	updateVerificador,
	updateVerificado,
	devuelvePreguntas,
	devuelvePreguntasCodificado,
	devuelvePreguntasSupervision,
	devuelveCargaParaSupervision,
	devuelveCargaParaSupervisionAutomatica,
	devuelvePreguntasSup,
	devuelvePreguntaUsrSup,
	muestraCargaDatos,
	cargarDatosGlobal,
	getCantidadCarga,
	updateAsignadoSup,
	updateReAsignadoSup,
	updateOcuAct,
	updateCargaSupervision,
	cargarParaSupervisionSimple,
	cargarParaSupervisionDoble,
	updatePreguntaSimpleCorreccion,
	updatePreguntaDobleCorreccion,
	updatePreguntaSimpleCheck,
	devuelvePreguntasSupervisionAutomatica
};
