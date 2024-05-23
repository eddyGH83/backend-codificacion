const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');

const bodyParser = require('body-parser');
const multiPart = require('connect-multiparty');
const Excel = require('exceljs');
const { cargarDatosGlobal } = require('./codificacion.controller');

const esquema = "codificacion";
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const repCodificados = async (req, res) => {
	const query = {
		text: `select count(*), estado, usucodificador from codificacion.cod_encuesta_codificacion
		group by estado, usucodificador`,
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
const repHoyAyerMes = async (req, res) => {
	const query = {
		text: `select count(*), 'hoy' periodo  from  codificacion.cod_encuesta_codificacion
		where DATE(feccodificador) = (select current_date)
		union
		select count(*), 'ayer' periodo  from  codificacion.cod_encuesta_codificacion
		where DATE(feccodificador) = (select current_date  - '1 day'::INTERVAL)
		union
		select count(*), 'en el mes' periodo from codificacion.cod_encuesta_codificacion
		where extract(year from feccodificador)=extract(year from current_date) and
		extract(month from feccodificador)=extract(month from current_date)`,
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
 * @param {*} fechaInicial
 * @param {*} fechaFinal
 */


const repOdbc_npioc = async (req, res) => {
	console.log(req.params)
	const query = `	---NPIOC
select id_informante, cec.id_pregunta,
(case when cec.id_pregunta in (86) then 'PREGUNTA 32' 
when cec.id_pregunta in (88) then 'PREGUNTA 33. Idioma 1' 
when cec.id_pregunta in (89) then 'PREGUNTA 33. Idioma 2' 
when cec.id_pregunta in (90) then 'PREGUNTA 33. Idioma 3' 
when cec.id_pregunta in (92) then 'PREGUNTA 34' else null end) pregunta,
cec.respuesta respuestaCampo , 
cec.codigocodif codigo_codif, 
cc.descripcion acep_desc_codif, 
cec.codigocodif_v1 codigo_super, 
cc_1.descripcion acep_desc_super,
cec.codigocodif_v2 codigo_jefe,
cc_2.descripcion acep_desc_jefe,
cec.usucodificador usuario_codif, 
cec.usuverificador usuario_super,
cec.usuverificador2 usuario_jefe,
'' as cod_rev_npioc, 
date(cec.feccodificador)::text fecha_codif
from codificacion.cod_encuesta_codificacion cec
left join codificacion.cod_variables cv on cec.id_pregunta=cv.id_pregunta
left join codificacion.cod_catalogo cc on cv.catalogo=cc.catalogo and cec.codigocodif=cc.codigo and cc.unico=1 
left join codificacion.cod_variables cv_1 on cec.id_pregunta=cv_1.id_pregunta
left join codificacion.cod_catalogo cc_1 on cv_1.catalogo=cc_1.catalogo and cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 
left join codificacion.cod_variables cv_2 on cec.id_pregunta=cv_2.id_pregunta
left join codificacion.cod_catalogo cc_2 on cv_2.catalogo=cc_2.catalogo and cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 
where not codigocodif isnull and codigocodif<>'' and cec.id_pregunta in (86,88,89,90,92) 
AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
order by pregunta, id_informante`;
console.log(query);
await con
	.query(query)
	.then((result) =>
		res.status(200).json({
			datos: result,
		})
	)
	.catch((e) => console.error(e.stack));
};




const repOdbc_migracion = async (req, res) => {
	console.log(req.params)
	const query = `
	---Migracion
	select id_informante,cec.id_pregunta,
	(case 
	when cec.id_pregunta in (1001) then 'PREGUNTA 20. Persona 1.¿Actualmente vive en otro país?' 
	when cec.id_pregunta in (1002) then 'PREGUNTA 20. Persona 2.¿Actualmente vive en otro país?' 
	when cec.id_pregunta in (1003) then 'PREGUNTA 20. Persona 3.¿Actualmente vive en otro país?' 
	when cec.id_pregunta in (1004) then 'PREGUNTA 20. Persona 4.¿Actualmente vive en otro país?' 
	when cec.id_pregunta in (1005) then 'PREGUNTA 20. Persona 5.¿Actualmente vive en otro país?' 
	
	when cec.id_pregunta in (95) then 'PREGUNTA 35.¿Dónde nació? ¿en qué municipio?' 
	when cec.id_pregunta in (97) then 'PREGUNTA 35.¿Dónde nació? ¿en qué país?' 
	when cec.id_pregunta in (101) then 'PREGUNTA 36.¿Dónde vive habitualmente? ¿en qué municipio?' 
	when cec.id_pregunta in (103) then 'PREGUNTA 36.¿Dónde vive habitualmente? ¿en qué país?' 
	when cec.id_pregunta in (105) then 'PREGUNTA 37.¿Dónde vivía hace cinco años? ¿en qué municipio?' 
	when cec.id_pregunta in (107) then 'PREGUNTA 37.¿Dónde vivía hace cinco años? ¿en qué país?' 
	--when cec.id_pregunta in (129) then 'PREGUNTA 51. donde trabaja ¿en otro municipio?' 
        when (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then 'PREGUNTA 51. donde trabaja ¿en otro municipio?' 
	--when cec.id_pregunta in (129) then 'PREGUNTA 51. donde trabaja ¿en otro país?' else null end) pregunta,
	when (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then 'PREGUNTA 51. donde trabaja ¿en otro país?' else null end) pregunta,
	cc4.descripcion depto,
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.respuesta else null end) municipio, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.codigocodif else null end) codigo_mun_codif, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cc.descripcion else null end) acep_desc_mun_codif, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.codigocodif_v1 else null end) codigo_mun_super, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cc2.descripcion else null end) acep_desc_mun_super,
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.codigocodif_v2 else null end) codigo_mun_jefe, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cc3.descripcion else null end) acep_desc_mun_jefe,
	'' as cod_rev_mun,
	
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.respuesta else null end) pais, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.codigocodif else null end) codigo_pais_codif, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cc.descripcion else null end) acep_desc_pais_codif, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.codigocodif_v1 else null end) codigo_pais_super, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cc2.descripcion else null end) acep_desc_pais_super,
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.codigocodif_v2 else null end) codigo_pais_jefe, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cc3.descripcion else null end) acep_desc_pais_jefe,
	'' as cod_rev_pais,
	
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.usucodificador else null end) usuario_mun_codif, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.usuverificador else null end) usuario_mun_super, 
	(case when cec.id_pregunta in (95,101,105) or (cec.id_pregunta=129 and (cec.respuesta_apoyo='3' or cec.respuesta_apoyo isnull or cec.respuesta_apoyo='')) then cec.usuverificador2 else null end) usuario_mun_jefe, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.usucodificador else null end) usuario_pais_codif, 
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.usuverificador else null end) usuario_pais_super,
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) or (cec.id_pregunta=129 and cec.respuesta_apoyo='4') then cec.usuverificador2 else null end) usuario_pais_jefe,
	
	(case when cec.id_pregunta in (1001,1002,1003,1004,1005,95,103,105,97,101,107,129) then date(cec.feccodificador) else null end)::text fecha_codif
	
	from codificacion.cod_encuesta_codificacion cec
	
	left join codificacion.cod_variables cv on cec.id_pregunta=cv.id_pregunta
	left join codificacion.cod_catalogo cc on cv.catalogo=cc.catalogo and cec.codigocodif=cc.codigo and cc.unico=1 
	left join codificacion.cod_variables cv2 on cec.id_pregunta=cv2.id_pregunta
	left join codificacion.cod_catalogo cc2 on cv2.catalogo=cc2.catalogo and cec.codigocodif_v1=cc2.codigo and cc2.unico=1 
	left join codificacion.cod_variables cv3 on cec.id_pregunta=cv3.id_pregunta
	left join codificacion.cod_catalogo cc3 on cv3.catalogo=cc3.catalogo and cec.codigocodif_v2=cc3.codigo and cc3.unico=1 
		
	left join codificacion.cod_catalogo cc4 on cec.respuesta_apoyo=cc4.codigo and cc4.catalogo='cat_departamento'
	
	where not codigocodif isnull and codigocodif<>'' and cec.id_pregunta in (1001,1002,1003,1004,1005,95,97,101,103,105,107,129) 
	AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	order by pregunta, id_informante
	`;
	console.log(query);
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};


const repOdbc = async (req, res) => {
	console.log(req.params)
	const query = ` --- Ocupacion - Actividad ---
	select cec.id_informante, max(case when ee.id_pregunta=69 then ee.respuesta3 else null end) edad,
		max(case when ep.id_pregunta = 113 and (not ee.respuesta3 isnull and ee.respuesta3<>'') then concat(ep.respuesta->(respuesta3::INTEGER-1)->'respuesta') else null end) Nivel,
		max(case when ep.id_pregunta = 114 and (not ee.respuesta3 isnull and ee.respuesta3<>'') then concat(ep.respuesta->(respuesta3::INTEGER-1)->'respuesta') else null end) curso_anio,
		max(case when ep.id_pregunta = 126 and (not ee.respuesta3 isnull and ee.respuesta3<>'') then concat(ep.respuesta->(respuesta3::INTEGER-1)->'respuesta') else null end) Categoria,
		max(case when ep.id_pregunta = 122 and (not ee.respuesta3 isnull and ee.respuesta3<>'') then concat(ep.respuesta->(respuesta3::INTEGER-1)->'respuesta') else null end) Destino_agropecuario,
		o_ocupacion,o_codigo_codif,o_acep_desc_codif,o_codigo_super,o_acep_desc_super,o_codigo_jefe,o_acep_desc_jefe,
		'' as cod_rev_ocupacion,
		a_actividad,a_codigo_codif,a_acep_desc_codif,a_codigo_super,a_acep_desc_super, a_codigo_jefe,a_acep_desc_jefe,
		'' as cod_rev_actividad,
		max(case when ee.id_pregunta=129 then ee.respuesta3 else null end) lugar_trabajo,
		o_usuario_codif, o_usuario_super,o_usuario_jefe,a_usuario_codif, a_usuario_super,a_usuario_jefe,
		date(fecha_codif)::text fecha_codif
		from (select  id_informante, 
		max(case when cec.id_pregunta=125 then cec.respuesta else null end) o_ocupacion,
		max(case when cec.id_pregunta=125 then cec.codigocodif else null end) o_codigo_codif,
		max(case when cec.id_pregunta=125 then cc.descripcion else null end) o_acep_desc_codif,
		max(case when cec.id_pregunta=125 then cec.codigocodif_v1 else null end) o_codigo_super,
		max(case when cec.id_pregunta=125 then cc2.descripcion else null end) o_acep_desc_super,
		max(case when cec.id_pregunta=125 then cec.codigocodif_v2 else null end) o_codigo_jefe,
		max(case when cec.id_pregunta=125 then cc3.descripcion else null end) o_acep_desc_jefe,
		max(case when cec.id_pregunta=127 then cec.respuesta else null end) a_actividad,
		max(case when cec.id_pregunta=127 then cec.codigocodif else null end) a_codigo_codif,
		max(case when cec.id_pregunta=127 then cc.descripcion else null end) a_acep_desc_codif,
		max(case when cec.id_pregunta=127 then cec.codigocodif_v1 else null end) a_codigo_super,
		max(case when cec.id_pregunta=127 then cc2.descripcion else null end) a_acep_desc_super,
		max(case when cec.id_pregunta=127 then cec.codigocodif_v2 else null end) a_codigo_jefe,
		max(case when cec.id_pregunta=127 then cc3.descripcion else null end) a_acep_desc_jefe,
		
		max(case when cec.id_pregunta=125 then cec.usucodificador else null end) o_usuario_codif, 
		max(case when cec.id_pregunta=125 then cec.usuverificador else null end) o_usuario_super,
		max(case when cec.id_pregunta=125 then cec.usuverificador2 else null end) o_usuario_jefe,
		max(case when cec.id_pregunta=127 then cec.usucodificador else null end) a_usuario_codif, 
		max(case when cec.id_pregunta=127 then cec.usuverificador else null end) a_usuario_super,
		max(case when cec.id_pregunta=127 then cec.usuverificador2 else null end) a_usuario_jefe,
		max(date(cec.feccodificador)::text) fecha_codif
		from codificacion.cod_encuesta_codificacion cec
		
		join codificacion.cod_variables cv on cec.id_pregunta=cv.id_pregunta
		left join codificacion.cod_catalogo cc on cv.catalogo=cc.catalogo and cec.codigocodif=cc.codigo and cc.unico=1
		left join codificacion.cod_catalogo cc2 on cv.catalogo=cc2.catalogo and cec.codigocodif_v1=cc2.codigo and cc2.unico=1
		left join codificacion.cod_catalogo cc3 on cv.catalogo=cc3.catalogo and cec.codigocodif_v2=cc3.codigo and cc3.unico=1
		
		where cec.id_pregunta in (125,127) and not cec.codigocodif isnull and cec.codigocodif<>''
		AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
		group by id_informante having count(*)=2) cec 
		join enc_encuesta ee on cec.id_informante=ee.id_informante
		join enc_pregunta ep on ee.id_pregunta=ep.id_pregunta
		where ee.id_pregunta in (69,113,114,122,126,129) --and not ee.respuesta3 isnull and ee.respuesta3<>'' 
		group by cec.id_informante,o_ocupacion,o_codigo_codif,o_acep_desc_codif,o_codigo_super,o_acep_desc_super,o_codigo_jefe,o_acep_desc_jefe,a_codigo_codif,a_acep_desc_codif,a_codigo_super,
		a_acep_desc_super, a_codigo_jefe,a_acep_desc_jefe,o_usuario_codif, o_usuario_super,o_usuario_jefe,a_actividad,a_usuario_codif, a_usuario_super,a_usuario_jefe,fecha_codif
		order by cec.id_informante
	`;
	console.log(query);
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
////////////////////REPORTES DEL 1 AL 11



/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte1 = async (req, res) => {
	
	const query = {
		text: `select catalogo,codigo, acep_desc, campo_desc, sum(tot) from
		(select cc.catalogo,cc.codigo, cc.descripcion acep_desc, cec.respuesta campo_desc, count(cec.respuesta) tot
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv on cec.id_pregunta=cv.id_pregunta
		join codificacion.cod_catalogo cc on cc.codigo = cec.codigocodif and cc.unico=1 and cc.catalogo=cv.catalogo
		group by cc.catalogo,cc.codigo, cc.descripcion, cec.respuesta
		) x
			GROUP BY ROLLUP( catalogo,codigo, acep_desc,campo_desc)
			having not acep_desc isnull
			order by catalogo,codigo,campo_desc desc`,
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
const reporte2 = async (req, res) => {
	const query = {
		text: `select (case when codigo isnull then catalogo||' - T O T A L' else catalogo end) catalogo,codigo, acep_desc, sum(tot) from
		(select cc.catalogo,cc.codigo, cc.descripcion acep_desc, count(cec.respuesta) tot
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv on cec.id_pregunta=cv.id_pregunta
		join codificacion.cod_catalogo cc on cc.codigo = cec.codigocodif and cc.unico=1 and cc.catalogo=cv.catalogo
		group by cc.catalogo,cc.codigo, cc.descripcion
		 order by  cc.catalogo,cc.codigo 
		) x
		GROUP BY GROUPING SETS ( (catalogo),(catalogo,codigo,acep_desc))
		order by catalogo,codigo `,
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
const reporte3 = async (req, res) => {
	const query = {
		text: `select (case when id_pregunta isnull then 1 else 0 end) orden, id_pregunta,(case when pregunta isnull then 'T O T A L' else pregunta end) pregunta, respuesta, sum(tot) total from
		(select cec.id_pregunta,cv.pregunta, cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cv.pregunta,cec.id_pregunta, cec.respuesta
		) x
		GROUP BY GROUPING SETS ( (),(id_pregunta,pregunta, respuesta))
		having sum(tot)>=5
		order by orden,id_pregunta, total desc`,
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
const reporte4 = async (req, res) => {
	const query = {
		text: `select departamento||'-'||cc.descripcion depto,(case when departamento||'-'||cc.descripcion isnull then 'TOTAL GENERAL' when not departamento||'-'||cc.descripcion isnull and cv.pregunta isnull then 'TOTAL '||(departamento||'-'||cc.descripcion) else departamento||'-'||cc.descripcion end) departamento,
		cec.id_pregunta, cv.pregunta, sum(case when cec.usucodificador ilike 'AUTOMATICO%' then 1 else 0 end) automatica,
			 sum(case when not cec.usucodificador ilike 'AUTOMATICO%' and not cec.usucodificador isnull then 1 else 0 end) asistida,
			 sum(case when cec.codigocodif isnull then 1 else 0 end) pendiente,
			 count(cec.id_pregunta) total
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
		GROUP BY ROLLUP (departamento||'-'||cc.descripcion , (cec.id_pregunta,cv.pregunta ))
		ORDER BY depto,cec.id_pregunta,cv.pregunta`,
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
const reporte5 = async (req, res) => {
	const query = {
		text: `	select (case when cec.departamento||'-'||cc.descripcion isnull then 'T O T A L E S' else cec.departamento||'-'||cc.descripcion end) departamento, count (*) total,
        sum(case when not cec.codigocodif isnull and cec.codigocodif <> '' then 1 else 0 end) codificados,
        (count (*)-sum(case when not cec.codigocodif isnull and cec.codigocodif <> '' then 1 else 0 end)) pendientes_codif,
	    sum(case when not cec.codigocodif_v1 isnull and cec.codigocodif_v1 <> '' then 1 else 0 end) supervisados,
        (count (*) - sum(case when not cec.codigocodif_v1 isnull and cec.codigocodif_v1 <> '' then 1 else 0 end)) pendientes_super
        from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
        GROUP BY GROUPING SETS ( ( cec.departamento||'-'||cc.descripcion),())
        order by departamento`,
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
const reporte6 = async (req, res) => {
	const query = {
		text: `select departamento||'-'||cc.descripcion depto,(case when departamento||'-'||cc.descripcion isnull then 'TOTAL GENERAL' when not departamento||'-'||cc.descripcion isnull and cv.pregunta isnull then 'TOTAL '||(departamento||'-'||cc.descripcion) else departamento||'-'||cc.descripcion end) departamento,
		cec.id_pregunta, cv.pregunta, sum(case when cec.estado = 'VERIFICADO' then 1 else 0 end) supervisado,
			 sum(case when cec.estado in ('CODIFICADO','ASIGNASUP') then 1 else 0 end) pendiente,
			 sum(case when cec.estado in ('CODIFICADO','ASIGNASUP','VERIFICADO') then 1 else 0 end) total
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
		where cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or cec.estado='CODIFICADO' 
		GROUP BY ROLLUP ( departamento||'-'||cc.descripcion,(cec.id_pregunta,cv.pregunta ))
		ORDER BY depto,cec.id_pregunta,cv.pregunta`,
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
const reporte7 = async (req, res) => {
	const query = {
		text: `
		select cec.usucre usuario, (case when cec.usucre isnull then 'TOTAL GENERAL' when not cec.usucre isnull and cv.pregunta isnull then 'TOTAL '||cec.usucre else cec.usucre end) usucre,
		cec.id_pregunta, cv.pregunta, sum(case when cec.estado = 'VERIFICADO' then 1 else 0 end) supervisado,
			 sum(case when cec.estado = 'CODIFICADO' or cec.estado = 'ASIGNASUP' then 1 else 0 end) pendiente,
			 sum(case when cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or cec.estado = 'CODIFICADO' then 1 else 0 end) total
		from (select id_pregunta, usucre, estado from codificacion.cod_encuesta_codificacion where estado='ASIGNASUP'
		union all
		select id_pregunta, usuverificador, estado from codificacion.cod_encuesta_codificacion 
		where estado='VERIFICADO' and not codigocodif_v1 is null and codigocodif_v1<>''
		union all
		select id_pregunta, login_sup, estado from codificacion.cod_encuesta_codificacion cec
		join (select cu.login login_cod, cu2.login login_sup from codificacion.cod_usuario cu 
		join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
		and cu.estado='A')cu on cec.usucre = cu.login_cod 
		where (cec.estado='CODIFICADO')  
		union all
		SELECT cec2.id_pregunta, a.login, cec2.estado
		FROM (
			SELECT id_informante, COUNT(*) AS count, cu2.login --login_sup
			FROM codificacion.cod_encuesta_codificacion cec
			JOIN codificacion.cod_usuario cu ON cec.usucre = cu.login
			JOIN codificacion.cod_usuario cu2 ON cu.cod_supvsr = cu2.id_usuario
			WHERE cu2.rol_id = 5 AND cu2.estado = 'A' AND cu.estado = 'A'
			AND cec.estado = 'CODIFICADO' AND cec.id_pregunta IN (125, 127)
			GROUP BY id_informante, cu2.login
			HAVING COUNT(*) = 1
		) AS a
		join codificacion.cod_encuesta_codificacion cec2
		on a.id_informante=cec2.id_informante and cec2.usucodificador = 'AUTOMATICO_NORMALIZADO' and cec2.id_pregunta IN (125, 127)

		) cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		GROUP BY ROLLUP ( cec.usucre,(cec.id_pregunta,cv.pregunta ))
		ORDER BY usuario, usucre,cec.id_pregunta,cv.pregunta
		`,

		/* text: `select cec.usucre usuario, (case when cec.usucre isnull then 'TOTAL GENERAL' when not cec.usucre isnull and cv.pregunta isnull then 'TOTAL '||cec.usucre else cec.usucre end) usucre,
		cec.id_pregunta, cv.pregunta, sum(case when cec.estado = 'VERIFICADO' then 1 else 0 end) supervisado,
			 sum(case when cec.estado = 'CODIFICADO' or cec.estado = 'ASIGNASUP' then 1 else 0 end) pendiente,
			 sum(case when cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or cec.estado = 'CODIFICADO' then 1 else 0 end) total
		from (select id_pregunta, usucre, estado from codificacion.cod_encuesta_codificacion where estado='ASIGNASUP'
		union all
		select id_pregunta, usuverificador, estado from codificacion.cod_encuesta_codificacion 
		where estado='VERIFICADO' and not codigocodif_v1 is null and codigocodif_v1<>''
		union all
select id_pregunta, login_sup, estado from codificacion.cod_encuesta_codificacion cec
join (select cu.login login_cod, cu2.login login_sup from codificacion.cod_usuario cu 
join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
and cu.estado='A')cu on cec.usucre = cu.login_cod      --cec.usucodificador = cu.login_cod
where (cec.estado='CODIFICADO')  -- and not cec.usucodificador ilike 'AUTOMATICO%')
		) cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		--where cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or (cec.estado='CODIFICADO')
		GROUP BY ROLLUP ( cec.usucre,(cec.id_pregunta,cv.pregunta ))
		ORDER BY usuario, usucre,cec.id_pregunta,cv.pregunta`,
 */
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
const reporte8 = async (req, res) => {
	const query = {
		text: `select date(cec.fecverificador) fecha, (case when date(cec.fecverificador)::text isnull then 'TOTAL GENERAL' when not date(cec.fecverificador)::text isnull and cec.usuverificador isnull then 'TOTAL '||date(cec.fecverificador)::text else date(cec.fecverificador)::text end) fecverificador,
		cec.usuverificador, sum(case when cec.estado = 'VERIFICADO' and cec.codigocodif = cec.codigocodif_v1 then 1 else 0 end) supervisado,
			 sum(case when cec.estado = 'VERIFICADO' and cec.codigocodif <> cec.codigocodif_v1 then 1 else 0 end) recodificado,
			 count(*) total
		from codificacion.cod_encuesta_codificacion cec
		where cec.estado = 'VERIFICADO' and not codigocodif_v1 is null and codigocodif_v1<>''
		GROUP BY ROLLUP ( date(cec.fecverificador),cec.usuverificador)
		ORDER BY fecha,usuverificador`,
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
const reporte9 = async (req, res) => {
	const query = {
		text: `select departamento||'-'||cc.descripcion depto,(case when departamento||'-'||cc.descripcion isnull then 'TOTAL GENERAL' when not departamento||'-'||cc.descripcion isnull and cv.pregunta isnull then 'TOTAL '||(departamento||'-'||cc.descripcion) else departamento||'-'||cc.descripcion end) departamento,
		cec.id_pregunta, cv.pregunta, sum(case when not cec.codigocodif isnull or cec.codigocodif<>'' then 1 else 0 end) codificado,
			 sum(case when cec.codigocodif isnull or cec.codigocodif='' then 1 else 0 end) pendiente,
			 count(*) total
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
		GROUP BY ROLLUP ( departamento||'-'||cc.descripcion,(cec.id_pregunta,cv.pregunta ))
		ORDER BY depto,departamento,cec.id_pregunta,cv.pregunta`,
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
const reporte10 = async (req, res) => {
	const query = {
		text: `select cec.usucodificador codificador, (case when cec.usucodificador isnull then 'TOTAL GENERAL' when not cec.usucodificador isnull and cv.pregunta isnull then 'TOTAL '||cec.usucodificador else cec.usucodificador end) usucodificador,
		cec.id_pregunta, cv.pregunta, sum(case when not cec.codigocodif isnull or cec.codigocodif<>'' then 1 else 0 end) codificado,
			 sum(case when cec.codigocodif isnull or cec.codigocodif='' then 1 else 0 end) pendiente,
			 count(*) total
		from codificacion.cod_encuesta_codificacion cec
		join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
		where (not cec.codigocodif isnull or cec.codigocodif <>'') and usucodificador <> 'AUTOMATICO_NORMALIZADO' and usucodificador <> 'AUTOMATICO_NORMDOBLE'
		GROUP BY ROLLUP ( cec.usucodificador,(cec.id_pregunta,cv.pregunta ))
		ORDER BY codificador, usucodificador,cec.id_pregunta,cv.pregunta`,
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
const reporte11 = async (req, res) => {
	const query = {
		text: `select date(cec.feccodificador) fecha, (case when date(cec.feccodificador)::text isnull then 'TOTAL GENERAL' when not date(cec.feccodificador)::text isnull and cec.usucodificador isnull then 'TOTAL '||date(cec.feccodificador)::text else date(cec.feccodificador)::text end) feccodificador,
		cec.usucodificador, count(*) codificado
		from codificacion.cod_encuesta_codificacion cec
		where (cec.estado = 'CODIFICADO' or cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP') and not cec.codigocodif isnull and cec.codigocodif<>'' and not usucodificador ilike 'AUTOMATICO%'
		GROUP BY ROLLUP ( date(cec.feccodificador),cec.usucodificador)
		ORDER BY fecha,usucodificador`,
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

const reporte12 = async (req, res) => {
	console.log("--------------reporte12------------");
	
	const query = {
		text: `
		select respuesta_ocu, respuesta_act, count frecuencia from codificacion.cod_p49_p51
        where estado_ocu='ELABORADO' and estado_act='ELABORADO'
        group by respuesta_ocu, respuesta_act
        having count>=5
        order by frecuencia desc
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
};


module.exports = {
	repCodificados,
	repHoyAyerMes,
	repOdbc_npioc,
	repOdbc_migracion,
	repOdbc,
	reporte1,
	reporte2,
	reporte3,
	reporte4,
	reporte5,
	reporte6,
	reporte7,
	reporte8,
	reporte9,
	reporte10,
	reporte11,
	reporte12

};
