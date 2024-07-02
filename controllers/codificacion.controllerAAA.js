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

// averiguar cuanta memoria ocupa el req.body



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
			WHERE   estado = 'DESCARGADO'
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
const normalizaRespuesta = async(req, res) => {
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
const codificaNormalizada = async(req, res) =>{
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
const preguntasPorDepartamentoCod = async (req, res) => {
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
			where a.estado in ('ELABORADO','ASIGNADO') and a.id_pregunta not in (138,140,7)
			group by a.departamento,a.id_pregunta,a.estado
			) a
			group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta			
			union all
			select departamento, nombre, max(case when estado ='ELABORADO' then cuenta else 0 end) count,
			id_pregunta, pregunta, codigo_pregunta
			from(
				select distinct ceco.departamento,
				(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre,
				ceco.id_pregunta,  '50. Ocupación - Actividad Económica' pregunta, ceco.estado,
				(select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=ceco.id_pregunta) as codigo_pregunta,
				count(*) cuenta
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =138 and ceca.id_pregunta=140 and 
			(ceco.codigocodif is null or ceca.codigocodif is null) and 
			ceco.estado in ('ELABORADO', 'ASIGNADO') and
					ceca.estado in ('ELABORADO', 'ASIGNADO')
				group by ceco.departamento,ceco.id_pregunta,ceco.estado
			) a
			group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
			order by departamento, codigo_pregunta,pregunta`
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
const preguntasPorDepartamentoSup = async (req, res) => {
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
			group by a.departamento,a.id_pregunta,a.estado
			) a
		where  id_pregunta not in (138,140)
		group by departamento, nombre, codigo_pregunta, id_pregunta,pregunta
union all 
select departamento, nombre, max(case when estado ='CODIFICADO' then cuenta else 0 end) count,
			id_pregunta, pregunta, codigo_pregunta
			from(
				select distinct ceco.departamento,
				(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre,
				ceco.id_pregunta,  '50. Ocupación - Actividad Económica' pregunta, ceco.estado,
				(select codigo_pregunta from ${esquema}.cod_variables where id_pregunta=ceco.id_pregunta) as codigo_pregunta,
				count(*) cuenta
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =138 and ceca.id_pregunta=140 and 
			ceco.estado in ('CODIFICADO', 'ASIGNASUP') and
					ceca.estado in ('CODIFICADO', 'ASIGNASUP')
				group by ceco.departamento,ceco.id_pregunta,ceco.estado
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
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const codificadores = async (req, res) => {
	const query = {
		text: `SELECT * FROM ${esquema}.cod_usuario WHERE rol_id=6 AND estado ILIKE 'A'`,
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
	const query = {
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
		a.estado,
		a.id_pregunta,
		(select pregunta from ${esquema}.cod_variables where id_pregunta=a.id_pregunta) as pregunta,
		count(*) from ${esquema}.cod_encuesta_codificacion a
		where a.estado=$1 AND a.departamento = $2 and a.id_pregunta = $3
		group by a.departamento,a.id_pregunta,a.estado
		union all
		select depto, nombre, estado, 138 id_pregunta, '50. Ocupación - Actividad Económica' pregunta, count(*) cuenta 
		from  
		(select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
		ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento as depto,
		(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre, ceco.estado estado
		from ${esquema}.cod_encuesta_codificacion ceco
			inner join ${esquema}.cod_encuesta_codificacion ceca
			on ceco.id_informante = ceca.id_informante
		where ceco.id_pregunta =138 and ceca.id_pregunta=140  
		and ceca.estado ilike 'ELABORADO' and ceca.departamento ilike '01'
		and ceco.estado ilike 'ELABORADO' and ceco.departamento ilike '01') x
		group  by  depto, nombre, estado
		order by departamento,pregunta`,
		values: [
			params.estado,
			params.departamento,
			params.id_preg,
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
const updateInicializarUsr = async (req, res) => {
	let params = req.body;
	let query = ""
	if(params.id_pregunta==138){
		query = {
		text: `UPDATE ${esquema}.cod_encuesta_codificacion SET estado='ELABORADO',usucre='admin' 
			where id_pregunta in ($1,140) and departamento=$2 and usucre=$3 and estado='ASIGNADO'`,
		values: [
			params.id_pregunta,
			params.departamento,
			params.usuario
		],
		};
	}else{
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
	const query = {
		text: `UPDATE ${esquema}.cod_encuesta_codificacion SET estado='CODIFICADO',usucre=usucodificador
			where id_pregunta=$1 and departamento=$2 and usucre=$3 and estado='ASIGNASUP'`,
		values: [
			params.id_pregunta,
			params.departamento,
			params.usuario
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
const updateAsignado = async (req, res) => {
	let id = req.params.id;
	let parametro = req.body;
	query = ''
	if(id==138){
		parametro.forEach( params => {
			const consulta = `update ${esquema}.cod_encuesta_codificacion cecupd
			set estado='${params.estado}', usucre='${params.usucre}' from
			(select distinct ceco.id_informante oc_id_inf, ceco.id_encuesta oc_id_enc, ceco.id_pregunta oc_id_preg, ceco.departamento,ceco.estado,
			ceca.id_informante ac_id_inf, ceca.id_encuesta ac_id_enc, ceca.id_pregunta ac_id_preg, ceca.departamento, ceca.estado
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta = 138 and ceca.id_pregunta=140 and ceco.departamento = '${params.departamento}' and 
			 ceco.estado='ELABORADO' and ceca.estado = 'ELABORADO' limit ${params.count}) x 
			WHERE case when cecupd.id_pregunta=138 then 
				cecupd.id_informante = x.oc_id_inf and cecupd.id_encuesta = x.oc_id_enc 
				and cecupd.id_pregunta=x.oc_id_preg else 
				cecupd.id_informante = x.ac_id_inf and cecupd.id_encuesta = x.ac_id_enc 
				and cecupd.id_pregunta=x.ac_id_preg
			end and cecupd.id_pregunta in (138,140) and codigocodif is null; `
			query +=consulta
		});
	}else{
		parametro.forEach( params => {
			const consulta = `WITH cte AS (select * from ${esquema}.cod_encuesta_codificacion where estado ilike 'ELABORADO'
				and id_pregunta not in (138,140) and id_pregunta=${id} and departamento='${params.departamento}' limit ${params.count})
				update ${esquema}.cod_encuesta_codificacion
				set estado='${params.estado}',usucre='${params.usucre}'
				from cte c join ${esquema}.cod_variables b on c.id_pregunta=b.id_pregunta
				where c.id_informante = ${esquema}.cod_encuesta_codificacion.id_informante
				and c.id_encuesta = ${esquema}.cod_encuesta_codificacion.id_encuesta
				and ${esquema}.cod_encuesta_codificacion.estado='ELABORADO'
				and ${esquema}.cod_encuesta_codificacion.id_pregunta=${id}; `
			query +=consulta
		});
	}
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
const updateVerificado = async (req, res) => {
	let user = req.params.user;
	let parametro = req.body;
	query = ''
	parametro.forEach( params => {
		const consulta = `update codificacion.cod_encuesta_codificacion set 
		estado = '${params.estado}', usuverificador= '${user}', fecverificador = now()
		where id_pregunta = ${params.id_pregunta} and id_informante=${params.id_informante} and id_encuesta=${params.id_encuesta}; `
		query +=consulta
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
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateAsignadoSup = async (req, res) => {
	let id = req.params.id;
	let parametro = req.body;
	query = ''
	if(id==138){
		parametro.forEach( params => {
		const consulta = `update ${esquema}.cod_encuesta_codificacion cecupd
		set estado='${params.estado}', usucre='${params.usucre}' from
		(select distinct ceco.id_informante oc_id_inf, ceco.id_encuesta oc_id_enc, ceco.id_pregunta oc_id_preg, 
		 ceco.departamento,ceco.estado,
		ceca.id_informante ac_id_inf, ceca.id_encuesta ac_id_enc, ceca.id_pregunta ac_id_preg, ceca.departamento, ceca.estado
		from ${esquema}.cod_encuesta_codificacion ceco
			inner join ${esquema}.cod_encuesta_codificacion ceca
			on ceco.id_informante = ceca.id_informante
		where ceco.id_pregunta = 138 and ceca.id_pregunta=140 and ceco.departamento = '${params.departamento}' and 
		 ceco.estado='CODIFICADO' and ceca.estado = 'CODIFICADO' limit  ${params.count}) x 
		WHERE case when cecupd.id_pregunta=138 then 
			cecupd.id_informante = x.oc_id_inf and cecupd.id_encuesta = x.oc_id_enc 
			and cecupd.id_pregunta=x.oc_id_preg else 
			cecupd.id_informante = x.ac_id_inf and cecupd.id_encuesta = x.ac_id_enc 
			and cecupd.id_pregunta=x.ac_id_preg	end 
			and cecupd.id_pregunta in (138,140);`
		query +=consulta
		});
	}else{
		parametro.forEach( params => {
		const consulta = `WITH cte AS (select * from ${esquema}.cod_encuesta_codificacion where estado ilike 'CODIFICADO'
			and id_pregunta=${id} and departamento='${params.departamento}' limit ${params.count})
			update ${esquema}.cod_encuesta_codificacion
			set estado='${params.estado}',usucre='${params.usucre}'
			from cte c join ${esquema}.cod_variables b on c.id_pregunta=b.id_pregunta
			where c.id_informante = ${esquema}.cod_encuesta_codificacion.id_informante
			and c.id_encuesta = ${esquema}.cod_encuesta_codificacion.id_encuesta
			and ${esquema}.cod_encuesta_codificacion.estado='CODIFICADO'
			and ${esquema}.cod_encuesta_codificacion.id_pregunta=${id}; `
		query +=consulta
	});
	}
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
const preguntasPorUsuDual = async (req, res) => {
	var params = req.body;
	const query = {
		text: 
			`select distinct ceco.id_informante oid_inf, ceco.id_encuesta oid_enc, ceco.id_pregunta oid_preg, ceco.respuesta oid_resp, ceco.departamento departamento,ceco.codigocodif oid_code,ceco.observacion oobs,ceco.usucodificador ousucod,ceca.usucodificador ausucod,
			ceca.id_informante aid_inf, ceca.id_encuesta aid_enc, ceca.id_pregunta aid_preg, ceca.respuesta aid_resp, ceca.codigocodif aid_code, ceca.estado aestado, ceco.estado oestado, ceca.observacion aobs,
			(select nombre_depto from cartografia.departamentos where codigo_depto=ceco.departamento) as nombre_depto,
			(select pregunta from ${esquema}.cod_variables where id_pregunta = 138) as opregunta,
			(select	pregunta from ${esquema}.cod_variables where id_pregunta = 140) as apregunta
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =$2 and ceca.id_pregunta=140 and 
			ceco.estado =$1 and ceca.estado=$1 and 
			ceco.usucre = $3 and ceca.usucre=$3`,
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
					then concat('Municpio: ', respuesta3)
					else case when pregunta ilike '%comunidad%'
						then concat('Ciudad o Comunidad: ', respuesta3)
						else case when ep.pregunta  ilike '%años%'
							then concat('Edad: ', respuesta3)
							else case when ep.id_pregunta in (496,497,498,499,500,501,502,503,504,505,612,506,507)
								then concat('Nivel de estudios: ', ep.pregunta)
								else case when ep.id_pregunta in (508,509,510,511,512,513,514,515,516) 
									then concat('Curso: ', ep.pregunta)
									else case when ep.id_pregunta in (569,570,571,572,573,574)
										then concat('Categoría ocupacional: ', ep.pregunta) 
										else case when ep.id_pregunta in (558,559)
											then concat('Destino de cultivos o cría: ', ep.pregunta)
											else concat(pregunta, ' ' ,respuesta3)
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
		and  ei.id_nivel=2 and ei.estado!='ANULADO'
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
    const valor = req.params.enviar.split('|');
	const query = {
		text: `SELECT id, descripcion , codigo, MAX(ord) ord FROM ${esquema}.f_cod_catalogoPatron('${valor[0]}','${valor[1]}','${valor[2]}') 
			as (id Int, descripcion Text, codigo Text, ord  Float)
			GROUP BY id, descripcion, codigo HAVING MAX(ord)>0.2 ORDER BY ord DESC,codigo`
	}
	//console.log(query)
    await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack))
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updatePreguntaVerif = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: 
		`UPDATE ${esquema}.cod_encuesta_codificacion SET codigocodif_v1 = codigocodif, codigocodif=$1, estado=$2, usuverificador=$3, 
		fecverificador=now(), observacion=$4, multiple=$6 WHERE id_informante=${id} and id_encuesta=$5 and id_pregunta =$7`,
		values: [
			params.codigocodif,
			params.estado,
			params.usuverificador,
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
const devuelvePreguntasSup = async (req, res) => {
	var params = req.body;
	const query = {
		text: 
			`select a.id_pregunta, b.pregunta, b.area, b.catalogo, count(*)
			from ${esquema}.cod_encuesta_codificacion a,${esquema}.cod_variables b
			where a.id_pregunta=b.id_pregunta and 
			a.id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO') 
			and a.estado ILIKE 'ASIGNASUP' and a.id_pregunta not in  (138,140)  and usucodificador is not null and usucre ilike $1
			group by a.id_pregunta, b.pregunta, b.area, b.catalogo
			union all
			select 138 id_pregunta, '50. Ocupación - Actividad Económica' pregunta,  '' area, 'cat_cob, cat_caeb' catalogo,count(*) cuenta from  
			(select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
			ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =138 and ceca.id_pregunta=140  
			and ceca.estado ilike 'ASIGNASUP' and ceca.usucre ilike $1
			and ceco.estado ilike 'ASIGNASUP' and ceco.usucre ilike $1) x`,
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

const devuelvePreguntaUsrSup = async (req, res) => {
	var params = req.body;
	let query = '' 
	if(params.id_pregunta == 138)
	{	query = {
		text: 
			`select distinct ceco.id_informante oid_inf, ceco.id_encuesta oid_enc, ceco.id_pregunta oid_preg, ceco.respuesta oresp, 
			ceco.respuesta_normalizada orespn,ceco.departamento odep,ceco.codigocodif ocode, ceco.usucodificador ocodificador,
			ceca.id_informante aid_inf, ceca.id_encuesta aid_enc, ceca.id_pregunta aid_preg, ceca.respuesta aresp, 
			ceca.respuesta_normalizada arespn,ceca.departamento adep,ceca.codigocodif acode, ceca.usucodificador acodificador
			from ${esquema}.cod_encuesta_codificacion ceco
				inner join ${esquema}.cod_encuesta_codificacion ceca
				on ceco.id_informante = ceca.id_informante
			where ceco.id_pregunta =138 and ceca.id_pregunta=140 and 
						ceco.estado ='ASIGNASUP' and ceca.estado='ASIGNASUP' and 
						ceco.usucre = $1 and ceca.usucre=$1 limit case when $2=0 then null else $2 end`,
		values: [
			params.usucre,
			params.limite,
		],
		};
		}else{
			query = {
				text: 
					`select a.id_pregunta,id_informante, id_encuesta, b.pregunta, a.respuesta, a.codigocodif, 
					(select nombre_depto from cartografia.departamentos cd where cd.codigo_depto=a.departamento),
					a.usucodificador, b.catalogo, a.estado, a.departamento, a.multiple, false as activo
					from ${esquema}.cod_encuesta_codificacion a, ${esquema}.cod_variables b
					where a.id_pregunta=b.id_pregunta  and a.estado ILIKE 'ASIGNASUP' and usucodificador is not null 
					and usucre ilike $1 and a.id_pregunta = $2
					order by id_informante, id_encuesta limit case when $3=0 then null else $3 end`,
				values: [
					params.usucre,
					params.id_pregunta,
					params.limite,
				],
			};
	}
	//console.log(query)
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
const devuelvePreguntasCodificado = async (req, res) => {
	var params = req.body;
	const query = {
		text:
		`select a.id_pregunta, b.pregunta, b.catalogo, b.area, count(*)
		from ${esquema}.cod_encuesta_codificacion a, ${esquema}.cod_variables b
		where a.id_pregunta=b.id_pregunta and a.id_pregunta in (select id_pregunta from ${esquema}.cod_variables where estado = 'ACTIVO') 
		and a.id_pregunta not in  (138,140)  and a.estado ILIKE 'ASIGNADO' and usucre ilike $1 group by a.id_pregunta, b.pregunta, b.catalogo, b.area
		union all
select 138 id_pregunta, '50. Ocupación - Actividad Económica' pregunta, 'cat_cob, cat_caeb' catalogo, '' area, count(*) cuenta from  
(select distinct ceco.id_informante, ceco.id_encuesta, ceco.id_pregunta, ceco.usucre ,ceco.departamento,
ceca.id_informante, ceca.id_encuesta, ceca.id_pregunta, ceca.usucre,ceca.departamento
from ${esquema}.cod_encuesta_codificacion ceco
	inner join ${esquema}.cod_encuesta_codificacion ceca
	on ceco.id_informante = ceca.id_informante
where ceco.id_pregunta =138 and ceca.id_pregunta=140  
and ceca.estado ilike 'ASIGNADO' and ceca.usucre ilike $1
and ceco.estado ilike 'ASIGNADO' and ceco.usucre ilike $1) x`,
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
