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


const preguntasPorDepartamentoCod = async (req, res) => {

	const query = {
		text: `
			SELECT 
				'La Paz' AS depto,
				'20' AS nro_preg,
				'¿Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?' AS variable,
				0 AS total_carga	
			UNION
			SELECT 
				'La Paz' AS depto,
				'32' AS nro_preg,
				'¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?' AS variable,
				0 AS total_carga
			UNION
			SELECT 
				'La Paz' AS depto,
				'33' AS nro_preg,
				'Idioma 1' AS variable,
				0 AS total_carga
			UNION
			SELECT 
				'La Paz' AS depto,
				'33' AS nro_preg,
				'Idioma 2' AS variable,
				0 AS total_carga
			UNION
			SELECT 
				'La Paz' AS depto,
				'33' AS nro_preg,
				'Idioma 3' AS variable,
				0 AS total_carga
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
				0 AS total_carga
			UNION	
			SELECT 
				'La Paz' AS depto,
				'49-51' AS nro_preg,
				'Ocupación - Actividad Económica' AS variable,
				count (1) AS total_carga FROM codificacion.cod_p49_p51
			UNION
			SELECT 
				'La Paz' AS depto,
				'52' AS nro_preg,
				'Principalmente, el lugar donde trabaja está ubicado:' AS variable,
				0 AS total_carga		
		`
	};

	/* var  registros = [
		{
			depto: "LA PAZ",
			nroPreg: "20",
			variable: "Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?",
			totalCarga: 45

		},
		{
			depto: "LA PAZ",
			nroPreg: "32",
			variable: "¿Se autoidentifica con alguna nación, pueblo indígena originario campesino o afroboliviano?",
			totalCarga: 23
		},
		{
			depto: "LA PAZ",
			nroPreg: "33",
			variable: "Idioma 1",
			totalCarga: 0
		},
		{
			depto: "LA PAZ",
			nroPreg: "33",
			variable: "Idioma 2",
			totalCarga: 21
		},
		{
			depto: "LA PAZ",
			nroPreg: "33",
			variable: "Idioma 3",
			totalCarga: 92
		},
		{
			depto: "LA PAZ",
			nroPreg: "34",
			variable: "¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?",
			totalCarga: 12
		},
		{
			depto: "LA PAZ",
			nroPreg: "35",
			variable: "¿Dónde nació?",
			totalCarga: 0
		},
		{
			depto: "LA PAZ",
			nroPreg: "36",
			variable: "¿Dónde vive habitualmente?",
			totalCarga: 27
		},
		{
			depto: "LA PAZ",
			nroPreg: "37",
			variable: "¿Dónde vivía el año 2019?",
			totalCarga: 12
		},
		{
			depto: "LA PAZ",
			nroPreg: "48",
			variable: "Las últimas 4 semanas:",
			totalCarga: 42
		},
		{
			depto: "LA PAZ",
			nroPreg: "49-51",
			variable: "Ocupación - Actividad Económica",
			totalCarga: 62
		},
		{
			depto: "LA PAZ",
			nroPreg: "52",
			variable: "Principalmente, el lugar donde trabaja está ubicado:",
			totalCarga: 82
		},
	] */

	//res.status(200).json(registros)

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
//  /asignarsup  (Asignacion)
const preguntasPorDepartamentoSup = async (req, res) => {

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

/* 
select departamento, nombre, max(case when estado ='CODIFICADO' then cuenta else 0 end) count, 
		id_pregunta, pregunta,codigo_pregunta
		from (select a.departamento,
			(select nombre_depto from cartografia.departamentos where codigo_depto=a.departamento) as nombre,
			a.estado,
			a.id_pregunta,
			(select pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as pregunta,
			  (select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as codigo_pregunta,
			count(*) cuenta from ${esquema}.cod_encuesta_codificacion a
			where a.estado in ('CODIFICADO', 'ASIGNASUP')
			--and usucodificador in ('AUTOMATICO_NORMALIZADO', 'AUTOMATICO_NORMDOBLE')
			group by a.departamento,a.id_pregunta,a.estado
			) a
		where  id_pregunta not in (125,127)
		group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
union all 
select departamento, nombre, max(case when estado ='CODIFICADO' then cuenta else 0 end) count,
			id_pregunta, pregunta, codigo_pregunta
			from(
				select distinct ceco.departamento,
				(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre,
				ceco.id_pregunta,  'Preguntas 48-50: Ocupación jjj - Actividad Económica' pregunta, ceco.estado,
				(select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=ceco.id_pregunta) as codigo_pregunta,
				count(*) cuenta
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =125 and ceca.id_pregunta=127 and 
			ceco.estado in ('CODIFICADO', 'ASIGNASUP') and
					ceca.estado in ('CODIFICADO', 'ASIGNASUP')
					--and ceco.usucodificador in ('AUTOMATICO_NORMDOBLE')
				--and ceca.usucodificador in ('AUTOMATICO_NORMDOBLE')
				group by ceco.departamento,ceco.id_pregunta,ceco.estado
			) a
			group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
			order by departamento, codigo_pregunta,pregunta
*/
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const codificadores = async (req, res) => {
	let id = req.params.id;
	console.log("ffffffffffffffffffffffffffffffffffffffffffff", id)
	const query = {
		text: `SELECT * FROM ${esquema}.cod_usuario WHERE rol_id =5 AND estado ILIKE 'A' and cod_supvsr = ${id}`,
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


const updateAsignado = async (req, res) => {
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
const updateAsignadoSup = async (req, res) => {
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
const updatePregunta = async (req, res) => {
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
const devuelvePreguntasSup = async (req, res) => {
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
				pregunta = 'Pregunta 33: Idioma 1'
			}
			if (id_pregunta == 89) {
				catalogo = 'cat_idioma';	// PREGUNTA 33
				pregunta = 'Pregunta 33: Idioma 2'
			}
			if (id_pregunta == 90) {
				catalogo = 'cat_idioma';	// PREGUNTA 33
				pregunta = 'Pregunta 33: Idioma 3'
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const devuelvePreguntasCodificado = async (req, res) => {
	var params = req.body;
	const query = {
		text:
			`select a.id_pregunta, b.pregunta, b.catalogo, b.area, count(*)
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
having count(*)>0`,
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

module.exports = {
	cargarDatos,
	normalizaRespuesta,
	codificaNormalizada,
	codificacionNormalizadaUpd,
	preguntasPorDepartamentoCod,
	preguntasPorDepartamentoSup,
	codificadores,
	supervisores,
	reasignar,
	reasignarsup,
	getCantidadDptoPregArea,
	updateInicializarUsr,
	updateInicializarUsrSup,
	updateAsignado,
	preguntasPorUsuario,
	preguntasPorUsuDual,
	preguntasPorVerificar,
	variablesApoyo,
	catalogoCodificacion,
	updatePreguntaVerif,
	updatePregunta,
	anularAnteriorVerif,
	anularAnterior,
	updateVerificador,
	updateVerificado,
	devuelvePreguntas,
	devuelvePreguntasCodificado,
	devuelvePreguntasSup,
	devuelvePreguntaUsrSup,
	muestraCargaDatos,
	cargarDatosGlobal,
	getCantidadCarga,
	updateAsignadoSup
};
