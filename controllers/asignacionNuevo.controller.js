const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');



/* const postCargasTrabajo = async(req, res) => {
	const query = {
		text: `INSERT INTO public.cod_encuesta_codificacion(id_asignacion, correlativo, id_pregunta, codigo_respuesta, respuesta, estado, usucre, departamento)
		select ee.id_asignacion,ee.correlativo,ee.id_pregunta,ee.codigo_respuesta,ee.respuesta,'ELABORADO','admin',cu.id_departamento from enc_informante ei
		join enc_encuesta ee on ei.id_asignacion=ee.id_asignacion and ei.correlativo=ee.correlativo and id_pregunta in (18310,18312,18403) and ee.visible=true
		join cat_upm cu on cu.id_upm=ei.id_upm
		where id_asignacion_padre is not null and correlativo_padre is not null and id_nivel=4 and ei.estado='VERIFICADO'
		and not exists (select * from cod_encuesta_codificacion cd where cd.id_asignacion=ee.id_asignacion and
		cd.correlativo=ee.correlativo and cd.id_pregunta=ee.id_pregunta and cd.estado!='OBSERVADO')
		and exists (select * from enc_observacion eo where eo.id_asignacion=ei.id_asignacion_padre and eo.correlativo=ei.correlativo_padre 
		and eo.id_tipo_obs=8 and eo.proceso=1)`,
	}
	await con.query(query)
		.then(result => res.status(200).json({
			query, result
		}))
		.catch(e => console.error(e.stack))
} */

const getValidarIdEstadoUsuario = async (req, res) => {
	var params = req.body
	const query = {
		text: `select * from codificacion($1,'$2','$3')`,
		value:
			[
				params.id,
				params.estado,
				params.usuario
			],
	}
	await con.query(query)
		.then(result => res.status(200).json({
			query, result
		})).catch(e => console.error(e.stack))
}



const getRespuestaOcupacion = async (req, res) => {
	const response = await con.query(`select * from cod_encuesta_codificacion where codigocodif  IS NOT null AND TRIM(codigocodif)<>''
                                        or codigocodif_v1  IS NOT null AND TRIM(codigocodif_v1)<>''
                                        or codigocodif_v2  IS NOT null AND TRIM(codigocodif_v2)<>''` );
	res.status(200).json(response.rows)
}


const getNombreCatalogo = async (req, res) => {
	const response = await con.query(`SELECT * FROM enc_pregunta where id_pregunta='18310'`);
	res.status(200).json(response.rows)
}



const getRespuestas = async (req, res) => {
	const response = await con.query(`SELECT * FROM cod_encuesta_codificacion WHERE id_pregunta=18310 ORDER BY feccre ASC`);
	res.status(200).json(response.rows)
}


const getRespuestaSinCodificar = async (req, res) => {
	const response = await con.query(`SELECT * FROM cod_encuesta_codificacion WHERE id_pregunta=18310 ORDER BY feccre ASC`);
	res.status(200).json(response.rows)
}

const getDiccionario = async (req, res) => {
	const response = await con.query(`SELECT * FROM diccionario WHERE cat_caeb='cat_cob'`);
	res.status(200).json(response.rows)
}


const postCodificacion = async (req, res) => {
	var params = req.body;
	const query = {
		text: "INSERT INTO seg_usuario (id_departamento, login, password, nombre, id_rol, usucre) VALUES ($1, $2, $3, $4, $5, 'admin')",
		values: [params.id_departamento, params.login, bcrypt.hashSync('123456', 10), params.nombre, params.id_rol]
	}
	await con.query(query)
		.then(result => res.status(200).json({
			query, result
		}))
		.catch(e => console.error(e.stack))
}


const validar = async (req, res) => {
	var params = req.body;
	const query = {
		text: `select * from codificacion(18310,'$1','$2')`,
		values: [params.estado, params.usuario]
	}
	await con.query(query)
		.then(result => res.status(200).json({
			query, result
		}))
		.catch(e => console.error(e.stack))
}




const asignarCodificacion = async (req, res) => {
	var params = req.body;
	const query = {
		text: `select distinct a.id_pregunta, b.pregunta, a.usucre, count(*) from cod_encuesta_codificacion a, cod_variables b where a.id_pregunta=b.id_pregunta and a.estado='ASIGNADO' and a.id_pregunta='18310' and a.usucre=$1 group by a.id_pregunta, b.pregunta, a.usucre`,
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




const devuelvePreguntasCodificado = async (req, res) => {
	var params = req.body;
	const query = {
		text: /*`select a.id_pregunta, b.pregunta, b.catalogo, b.area, count(*)
		from cod_encuesta_codificacion a, cod_variables b
		where a.id_pregunta=b.id_pregunta and a.id_pregunta in (36854,36880) 
		and a.estado ILIKE 'ASIGNADO' and usucre ilike $1 group by a.id_pregunta, b.pregunta, b.catalogo, b.area`*/
		`select a.id_pregunta, b.pregunta, b.catalogo, b.area, count(*)
		from cod_encuesta_codificacion a, cod_variables b
		where a.id_pregunta=b.id_pregunta and a.id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') 
		and a.estado ILIKE 'ASIGNADO' and usucre ilike $1 group by a.id_pregunta, b.pregunta, b.catalogo, b.area`,
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



const devuelvePreguntas = async (req, res) => {
	const query = {
		text: /*`select a.id_pregunta, b.pregunta, b.area, b.catalogo, count(*)
			from cod_encuesta_codificacion a, cod_variables b
			where a.id_pregunta=b.id_pregunta and a.id_pregunta in (36854,36880) and a.estado ILIKE 'CODIFICADO' and usucodificador is not null group by a.id_pregunta, b.pregunta, b.area, b.catalogo`*/
			`select a.id_pregunta, b.pregunta, b.area, b.catalogo, count(*)
			from cod_encuesta_codificacion a, cod_variables b
			where a.id_pregunta=b.id_pregunta and 
			a.id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') 
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


const devuelvePreguntasUsuario = async (req, res) => {
	var params = req.body;
	const query = {
		text: /*`select a.*,b.pregunta, b.catalogo, c.nombre
			from cod_encuesta_codificacion a, cod_variables b, cat_departamento c
			where a.estado ilike $1 and a.id_pregunta=$2 and a.usucre ilike $3 and a.id_pregunta=b.id_pregunta and a.departamento=c.id_departamento`*/
			`select a.*,b.pregunta, b.catalogo, 
			(select nombre from cat_departamento cd where cd.id_departamento=a.departamento)
			from cod_encuesta_codificacion a
			inner join cod_variables b on a.id_pregunta=b.id_pregunta
			where a.estado ilike $1 and a.id_pregunta=$2 and a.usucre ilike $3`,
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



const devuelvePreguntasUsuarioVerificado = async (req, res) => {
	var params = req.body;
	const query = {
		/*text: `select a.*, b.pregunta, c.nombre,
			(select descripcion from cod_catalogo where catalogo ilike 'cat_caeb' 
			and codigo= a.codigocodif order by descripcion limit 1) as descripcion 
			from cod_encuesta_codificacion a 
			join cod_variables b on a.id_pregunta=b.id_pregunta 
			join cat_departamento c on a.departamento=c.id_departamento 
			where a.id_pregunta=$1 and a.estado ILIKE $2 and usucodificador is not null limit 300`,*/
		text: `select a.*, b.pregunta, (select nombre from cat_departamento cd where cd.id_departamento=a.departamento), 
			b.catalogo, (select descripcion from cod_catalogo where catalogo ilike $3 
			and codigo= a.codigocodif order by descripcion limit 1) as descripcion 
			from cod_encuesta_codificacion a 
			join cod_variables b on a.id_pregunta=b.id_pregunta 
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





const devuelveUsuarios = async (req, res) => {
	const query = {
		text: `SELECT a.id_usuario, a.id_departamento, b.nombre as departamento, a.login, a.password, a.nombre, a.telefono, a.foto, a.estado, a.usucre, a.feccre, a.id_rol, a.id_brigada, a.a_departamento, a.a_brigada
                FROM seg_usuario a, cat_departamento b
                WHERE a.id_departamento=b.id_departamento AND a.estado like 'ELABORADO' and (id_rol='21' or id_rol='24')
                ORDER BY a.feccre DESC`,
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






const registroUsuarios = async (req, res) => {
	var params = req.body;
	const text = `INSERT INTO seg_usuario (id_departamento, login, password, nombre, estado, usucre, feccre, id_rol, id_brigada)
	values (${params.id_departamento},'${params.login}','${bcrypt.hashSync('123456', 10)}','${params.nombre}','${params.estado}','${params.usucre}',now(),${params.id_rol},-1) RETURNING *`
	await con.query(text)
		.then(result => res.status(200).json({
			text, result
		}))
		.catch(e => console.error(e.stack))
}


const modificarUsuarios = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE seg_usuario SET id_departamento=$1, login=$2, nombre=$3, id_rol=$4 WHERE id_usuario=${id}`,
		values: [
			params.id_departamento,
			params.login,
			params.nombre,
			params.id_rol
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


const eliminarUsuarios = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE seg_usuario SET estado=$1 WHERE id_usuario=${id}`,
		values: [
			params.estado,
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

const devuelveCatalogo = async (req, res) => {
	let params = req.body;
	const query = {
		text: `SELECT * FROM cod_catalogo WHERE catalogo ILIKE $1 
		AND estado ILIKE 'ACTIVO' ORDER BY id_catalogo DESC `,
		values: [
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



const catalogoPorRespuesta = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select * from cod_catalogo where catalogo ilike $1`,
		values: [
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


const updatePregunta = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	//console.log('Hola desde Update')
	const query = {
		text: /*`UPDATE cod_encuesta_codificacion SET codigocodif=$1, 
		estado=$2, usucodificador=$3, feccodificador=now(), 
		observacion=$4 WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta in (36854, 36880)`*/
		`UPDATE cod_encuesta_codificacion SET codigocodif=$1, 
		estado=$2, usucodificador=$3, feccodificador=now(), 
		observacion=$4, multiple=$6 WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta =$7`,
		values: [
			params.codigocodif,
			params.estado,
			params.usucodificador,
			params.observacion,
			params.correlativo,
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



const updatePreguntaVerif = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: /*UPDATE cod_encuesta_codificacion SET codigocodif_v1=$1, estado=$2, usuverificador=$3, 
		fecverificador=now(), observacion=$4 WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta in (36854, 36880)*/
		`UPDATE cod_encuesta_codificacion SET codigocodif_v1=$1, estado=$2, usuverificador=$3, 
		fecverificador=now(), observacion=$4, multiple=$6 WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta =$7`,
		values: [
			params.codigocodif_v1,
			params.estado,
			params.usuverificador,
			params.observacion,
			params.correlativo,
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

const anularAnterior = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: /*`UPDATE cod_encuesta_codificacion SET codigocodif=null, estado=$1, usucodificador=null, feccodificador=null 
		 where id_asignacion=${id} and correlativo=$2 and id_pregunta in (36854, 36880)`*/
		 `UPDATE cod_encuesta_codificacion SET codigocodif=null, estado=$1, usucodificador=null, feccodificador=null 
		 where id_asignacion=${id} and correlativo=$2 and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO')`,
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



const anularAnteriorVerif = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: /*`UPDATE cod_encuesta_codificacion SET codigocodif_v1=null, estado=$1, usuverificador=null, fecverificador=null  
		where id_asignacion=${id} and correlativo=$2 and id_pregunta in (36854, 36880)`*/
		`UPDATE cod_encuesta_codificacion SET codigocodif_v1=null, estado=$1, usuverificador=null, fecverificador=null  
		where id_asignacion=${id} and correlativo=$2 and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO')`,
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



const respuestasObservadas = async (req, res) => {
	const query = {
		text: /*`SELECT a.*, b.area FROM cod_encuesta_codificacion a join cod_variables b on a.id_pregunta=b.id_pregunta
			where a.id_pregunta in (36854,36880) and (a.codigocodif is null OR a.codigocodif ILIKE '99999') and a.observacion is not null
			ORDER BY a.id_asignacion ASC`*/
			`SELECT a.*, b.area FROM cod_encuesta_codificacion a join cod_variables b on a.id_pregunta=b.id_pregunta
			where a.id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') 
			and (a.codigocodif is null OR a.codigocodif ILIKE '99999') and a.observacion is not null
			ORDER BY a.id_asignacion ASC`,
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


const updateVerificador = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: /*`UPDATE cod_encuesta_codificacion SET estado=$1, usuverificador=$2, fecverificador=now(), observacion=$3, codigocodif_v1=$4
			WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta in (36854, 36880)`*/
			`UPDATE cod_encuesta_codificacion SET estado=$1, usuverificador=$2, fecverificador=now(), observacion=$3, codigocodif_v1=$4
			WHERE id_asignacion=${id} and correlativo=$5 and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO')`
			,
		values: [
			params.estado,
			params.usuverificador,
			// params.fecverificador,
			params.observacion,
			params.codigocodif_v1,
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



const cargarDatos = async (req, res) => {
	console.log(req.body)
	let params = req.body;
	const query = {
		/*text: `INSERT INTO public.cod_encuesta_codificacion(id_asignacion, correlativo, id_pregunta, codigo_respuesta, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, departamento)
			select ee.id_asignacion,ee.correlativo,ee.id_pregunta,ee.codigo_respuesta,ee.respuesta,null,null,null,'ELABORADO','admin',cu.id_departamento from enc_informante ei
			join enc_encuesta ee on ei.id_asignacion=ee.id_asignacion and ei.correlativo=ee.correlativo 
			and id_pregunta in (36854,36880,36956) 
			and ee.visible=true
			join cat_upm cu on cu.id_upm=ei.id_upm
			where id_nivel=3 and not exists (select * from cod_encuesta_codificacion cd where cd.id_asignacion=ee.id_asignacion and
			cd.correlativo=ee.correlativo and cd.id_pregunta=ee.id_pregunta) limit 2000 RETURNING *`,*/
		text: /*`INSERT INTO public.cod_encuesta_codificacion(id_asignacion, correlativo, id_pregunta, codigo_respuesta, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, departamento)
			select ee.id_asignacion,ee.correlativo,ee.id_pregunta,ee.codigo_respuesta,ee.respuesta,null,null,null,'ELABORADO','admin',cu.id_departamento from enc_informante ei
			join enc_encuesta ee on ei.id_asignacion=ee.id_asignacion and ei.correlativo=ee.correlativo 
			and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') 
			and ee.visible=true-----asdf
			join cat_upm cu on cu.id_upm=ei.id_upm
			where id_nivel=3 and not exists (select * from cod_encuesta_codificacion cd where cd.id_asignacion=ee.id_asignacion and
			cd.correlativo=ee.correlativo and cd.id_pregunta=ee.id_pregunta) limit 2000 RETURNING *`,*/
			`INSERT INTO public.cod_encuesta_codificacion(id_asignacion, correlativo, id_pregunta, codigo_respuesta, respuesta, codigocodif, codigocodif_v1, codigocodif_v2, estado, usucre, departamento)
            select ee.id_asignacion,ee.correlativo,ee.id_pregunta,ee.codigo_respuesta,ee.respuesta,null,null,null,'ELABORADO', $1,cu.id_departamento from enc_informante ei
            join enc_encuesta ee on ei.id_asignacion=ee.id_asignacion and ei.correlativo=ee.correlativo 
            and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') 
            and ee.visible=true
            join cat_upm cu on cu.id_upm=ei.id_upm
            where id_nivel=3 and not exists (select * from cod_encuesta_codificacion cd where cd.id_asignacion=ee.id_asignacion and
            cd.correlativo=ee.correlativo and cd.id_pregunta=ee.id_pregunta) and cu.estado='CONCLUIDO' 
			and case when ee.id_pregunta in (37052,37223,37222,37221,37220,37219,37218,37119,37117) then ei.estado='FINALIZADO'  else ei.estado='CONCLUIDO'  end 
			limit 2000 RETURNING *`,
			values: [
				params.usucre,
			],
		
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




const preguntasPorDepartamentoDisperso = async (req, res) => {
	const query = {
		text: /*`select a.departamento,
		(select nombre from cat_departamento where id_departamento=a.departamento) as nombre,
		a.estado,
		case when id_pregunta=36854 then 'Disperso' else 'Amanzanado' end as area,
		a.id_pregunta,
		(select pregunta from enc_pregunta where id_pregunta=a.id_pregunta) as pregunta,
		count(*) from cod_encuesta_codificacion a
		where a.estado='ELABORADO'
		group by a.departamento,a.id_pregunta,a.estado
		order by departamento,area`*/
		`select a.departamento,
		(select nombre from cat_departamento where id_departamento=a.departamento) as nombre,
		a.estado,
		(select area from cod_variables where id_pregunta=a.id_pregunta) as area,
		a.id_pregunta,
		(select pregunta from cod_variables where id_pregunta=a.id_pregunta) as pregunta,
		count(*) from cod_encuesta_codificacion a
		where a.estado='ELABORADO'
		group by a.departamento,a.id_pregunta,a.estado
		order by departamento,pregunta,area`,

			// `select a.departamento as id_departamento, b.area, c.nombre, a.id_pregunta, b.pregunta, count(*)
			// from cod_encuesta_codificacion a, cod_variables b, cat_departamento c
			// where a.id_pregunta=b.id_pregunta and a.id_pregunta in (36854,36880) and a.estado ilike 'ELABORADO' and a.departamento=c.id_departamento
			// group by a.departamento, a.id_pregunta, b.pregunta, b.area, c.nombre`
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



const preguntasPorDepartamentoAmanzanado = async (req, res) => {
	const query = {
		text: `WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'elaborado') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, cv.area, cte.id_pregunta, cv.pregunta, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'elaborado' and id_pregunta=36880 group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_departamento=cte.b
			join cod_variables cv on cv.id_pregunta=cte.id_pregunta
			where (cv.area ilike 'Disperso' or cv.area ilike 'Amanzanado')
			and cte.id_pregunta=36880`,
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








const updateAsignacion = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE cod_encuesta_codificacion
            SET usucre=$1
            WHERE estado ILIKE 'ELABORADO'`,
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



const codificadores = async (req, res) => {
	const query = {
		text: `SELECT * FROM seg_usuario WHERE id_rol=24 AND estado ILIKE 'ELABORADO'`,
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


const insertCatalogo = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		//text: `insert into cod_catalogo (catalogo, codigo, descripcion, estado, usucre, feccre, descripcion_unida) values ($1, $2, $3, 'ACTIVO', $4, now(), REGEXP_REPLACE(unaccent(lower(descripcion)) ,'[^\w]{1,}','','g'))`,
		text: `insert into cod_catalogo (catalogo, codigo, descripcion, estado, usucre, feccre, descripcion_unida) values ($1, $2, $3, 'ACTIVO', $4, now()), REGEXP_REPLACE(unaccent(lower($3)) ,'[^\w]{1,}','','g'))`,
		values: [
			params.catalogo,
			params.codigo,
			params.descripcion,
			params.user
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

const updateCatalogo = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = { 
		text: `UPDATE cod_catalogo SET codigo=$1, descripcion=$2, usumod=$3, fecmod=now(), descripcion_unida=REGEXP_REPLACE(unaccent(lower($2)) ,'[^\w]{1,}','','g') WHERE id_catalogo=${id}`,
		//text: `UPDATE cod_catalogo SET codigo=$1, descripcion=$2, usumod=$3, fecmod=now() WHERE id_catalogo=${id}`,
		values: [
			params.codigo,
			params.descripcion,
			params.user,
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




const updateEstadoCatalogo = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE cod_catalogo SET estado=$1, usumod=$2, fecmod=now() WHERE id_catalogo=${id}`,
		values: [
			params.estado,
			params.user
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



// const blanquearDatos = async (req, res) => {
// 	let id = req.params.id;
// 	let params = req.body;
// 	const query = {
// 		text: `UPDATE cod_encuesta_codificacion SET codigocodif=null, codigocodif_v1=null, codigocodif_v2=null, estado=$1 where codigocodif='${id}' or codigocodif_v1='${id}' or codigocodif_v2='${id}'`,
// 		values: [
// 			params.estado,
// 		],
// 	};
// 	await con
// 		.query(query)
// 		.then((result) =>
// 			res.status(200).json({
// 				datos: result,
// 			})
// 		)
// 		.catch((e) => console.error(e.stack));
// };



const reasignarCodificador = async (req, res) => {
	const query = {
		text: `SELECT * FROM cod_encuesta_codificacion WHERE estado ILIKE 'ASIGNADO'`,
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



const reasignar = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select su.login,su.nombre,case when ce.usucre is null then 0 else count(*) end from seg_usuario su
			left join (select * from cod_encuesta_codificacion where departamento=$1
			and estado='ASIGNADO' and id_pregunta=$2) ce on ce.usucre=su.login 
			where su.id_rol=24 and su.estado='ELABORADO'
			group by su.login,su.nombre,ce.usucre order by su.login`,
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


const inicioCodificados = async (req, res) => {
	const query = {
		text: /*`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'codificado') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'codificado' and id_pregunta in (36854,36880) group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`*/
			`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'codificado') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'codificado' 
			and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`,
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

const inicioElaborados = async (req, res) => {
	const query = {
		text:/*`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'elaborado') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'elaborado' and id_pregunta in (36854,36880) group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`*/
			`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'elaborado') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'elaborado' 
			and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`
			,
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


const inicioVerificados = async (req, res) => {
	const query = {
		text: /*`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'VERIFICADO') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'VERIFICADO' and id_pregunta in (36854,36880) group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`*/
			`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'VERIFICADO') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'VERIFICADO' 
			and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`,
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



const inicioObservados = async (req, res) => {
	const query = {
		text: /*`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'OBSERVADO') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'OBSERVADO' and id_pregunta in (36854,36880) group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`*/
			`WITH cte AS (select * from (select id_pregunta, estado from cod_encuesta_codificacion where estado ilike 'OBSERVADO') as a,generate_series(1,9) as b)
			select distinct cte.b as departamento, cd.nombre, cte.estado, case when count is null then 0 else a.count end as count from cte
			left join (select departamento, estado, count(*) from cod_encuesta_codificacion where estado ilike 'OBSERVADO' 
			and id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') group by departamento, estado ) as a
			on cte.estado=a.estado and a.departamento=cte.b
			join cat_departamento cd on cd.id_Departamento=cte.b`,
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




const updateAsignado = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `WITH cte AS (select * from cod_encuesta_codificacion where estado ilike 'ELABORADO'
			and id_pregunta=${id} and departamento=$1 limit $2)
			update cod_encuesta_codificacion
			set estado=$3,usucre=$4
			from cte c join cod_variables b on c.id_pregunta=b.id_pregunta
			where c.id_asignacion = cod_encuesta_codificacion.id_asignacion
			and c.correlativo = cod_encuesta_codificacion.correlativo
			and cod_encuesta_codificacion.estado='ELABORADO'
			and cod_encuesta_codificacion.id_pregunta=${id}
			and b.area ilike $5 `,
		values: [
			params.departamento,
			params.count,
			params.estado,
			params.usucre,
			params.area
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

const updateInicializar = async (req, res) => {
	let params = req.body;
	const query = {
		text: `UPDATE cod_encuesta_codificacion SET estado='ELABORADO',usucre='admin' 
			where id_pregunta=$1 and departamento=$2 and estado='ASIGNADO'`,
		values: [
			params.id_pregunta,
			params.departamento,
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



const reporteDiario = async (req, res) => {
	const query = {
		text: /*`SELECT a.usucodificador, a.id_pregunta, c.area, a.feccodificador::date, b.nombre, count(*)
			FROM cod_encuesta_codificacion a JOIN cat_departamento b ON a.departamento=b.id_departamento JOIN cod_variables c ON a.id_pregunta=c.id_pregunta
			WHERE a.id_pregunta IN (36854,36880) AND a.usucodificador IS NOT NULL AND a.codigocodif IS NOT NULL 
			GROUP BY a.usucodificador, a.id_pregunta, c.area, a.feccodificador::date, b.nombre
			ORDER BY a.feccodificador::date ASC`*/
			`SELECT a.usucodificador, a.id_pregunta, c.area, a.feccodificador::date, b.nombre, count(*)
			FROM cod_encuesta_codificacion a JOIN cat_departamento b ON a.departamento=b.id_departamento JOIN cod_variables c ON a.id_pregunta=c.id_pregunta
			WHERE a.id_pregunta IN (select id_pregunta from cod_variables where estado = 'ACTIVO') 
			AND a.usucodificador IS NOT NULL AND a.codigocodif IS NOT NULL 
			GROUP BY a.usucodificador, a.id_pregunta, c.area, a.feccodificador::date, b.nombre
			ORDER BY a.feccodificador::date ASC`,
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


const reporteDiarioVerificado = async (req, res) => {
	const query = {
		text: /*`SELECT a.usuverificador, a.id_pregunta, c.area, a.fecverificador::date, a.estado, b.nombre, count(*)
			FROM cod_encuesta_codificacion a JOIN cat_departamento b ON a.departamento=b.id_departamento JOIN cod_variables c ON a.id_pregunta=c.id_pregunta
			WHERE a.id_pregunta IN (36854,36880) and a.estado ilike 'VERIFICADO'
			GROUP BY a.usuverificador, a.id_pregunta, c.area, a.fecverificador::date, a.estado, b.nombre ORDER BY a.fecverificador::date ASC`*/
			`SELECT a.usuverificador, a.id_pregunta, c.area, a.fecverificador::date, a.estado, b.nombre, count(*)
			FROM cod_encuesta_codificacion a JOIN cat_departamento b ON a.departamento=b.id_departamento JOIN cod_variables c ON a.id_pregunta=c.id_pregunta
			WHERE a.id_pregunta IN (select id_pregunta from cod_variables where estado = 'ACTIVO') and a.estado ilike 'VERIFICADO'
			GROUP BY a.usuverificador, a.id_pregunta, c.area, a.fecverificador::date, a.estado, b.nombre ORDER BY a.fecverificador::date ASC`
			,
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


const reporteVerificados = async (req, res) => {
	let params = req.body;
	const query = {
		text: /*`select a.id_asignacion, a.correlativo, a.id_pregunta, a.codigo_respuesta, a.respuesta, a.codigocodif, a.usucre, 
		a.feccre, a.usucodificador, a.feccodificador, a.fecverificador, a.usuverificador, a.observacion, a.departamento, b.nombre,
		(select respuesta from enc_encuesta where id_asignacion=a.id_asignacion and correlativo=a.correlativo and id_pregunta in (36862,37243)) as apoyo
		from cod_encuesta_codificacion a, cat_departamento b
		where a.departamento=b.id_departamento and a.id_pregunta=$1 and a.estado ilike 'CODIFICADO' and usucodificador is not null`*/
		`select a.id_asignacion, a.correlativo, a.id_pregunta, a.codigo_respuesta, a.respuesta, a.codigocodif, a.usucre, 
		a.feccre, a.usucodificador, a.feccodificador, a.fecverificador, a.usuverificador, a.observacion, a.departamento, b.nombre,
		(select respuesta from enc_encuesta where id_asignacion=a.id_asignacion and correlativo=a.correlativo 
		and id_pregunta in (select unnest(id_variables) from cod_variables where id_pregunta = a.id_pregunta)) as apoyo
		from cod_encuesta_codificacion a, cat_departamento b
		where a.departamento=b.id_departamento and a.id_pregunta=$1 and a.estado ilike 'CODIFICADO' and usucodificador is not null`
		,
		values: [
			params.id_pregunta,
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
// No se esta usando verificar
const reporteVerificadosAutomatico = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select a.id_asignacion, a.correlativo, a.id_pregunta, a.codigo_respuesta, a.respuesta, a.codigocodif, a.usucre, 
		a.feccre, a.usucodificador, a.feccodificador, a.fecverificador, a.usuverificador, a.observacion, a.departamento, b.nombre
			from cod_encuesta_codificacion a, cat_departamento b
			where a.departamento=b.id_departamento and a.id_pregunta=$1 and a.estado ilike $2 and usucodificador is null`,
		values: [
			params.id_pregunta,
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
 * TODO: Se debe verificar el catalog y las variables
 * @param {*} req 
 * @param {*} res 
 */
const verificadosAutomatico = async (req, res) => {
	//let params = req.body;
	const query = {
		text: /*`select a.id_asignacion, a.correlativo, a.id_pregunta, a.codigo_respuesta, a.respuesta, 
		a.codigocodif, a.usucre, a.feccre, a.usucodificador, a.feccodificador, a.fecverificador, 
		a.usuverificador, a.observacion, a.departamento, b.nombre, c.pregunta, a.estado, a.observacion, d.descripcion
			from cod_encuesta_codificacion a join cat_departamento b on a.departamento=b.id_departamento 
			join cod_variables c on a.id_pregunta=c.id_pregunta join cod_catalogo d on a.codigocodif=d.codigo
			where a.id_pregunta IN (36854,36880) and a.estado ilike 'CODIFICADO' and usucodificador is null 
			and d.catalogo ilike 'cat_caeb'`*/
			`select a.id_asignacion, a.correlativo, a.id_pregunta, a.codigo_respuesta, a.respuesta, 
			a.codigocodif, a.usucre, a.feccre, a.usucodificador, a.feccodificador, a.fecverificador, 
			a.usuverificador, a.observacion, a.departamento, b.nombre, c.pregunta, a.estado, a.observacion, d.descripcion
				from cod_encuesta_codificacion a join cat_departamento b on a.departamento=b.id_departamento 
				join cod_variables c on a.id_pregunta=c.id_pregunta join cod_catalogo d on a.codigocodif=d.codigo
				where a.id_pregunta IN (select id_pregunta from cod_variables where estado ilike 'ACTIVO') 
				and a.estado ilike 'CODIFICADO' and usucodificador is null 
				and d.catalogo in (select distinct catalogo from cod_variables cv where estado ilike 'ACTIVO')`,
		/*values: [
			params.catalogo,
		],*/
		
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







const verificarCantidad = async (req, res) => {
	let params = req.body;
	const query = {
		text: `update cod_encuesta_codificacion set estado=$1, usuverificador=$2, fecverificador=now(), codigocodif_v1=$3
			where id_pregunta=$4 and id_asignacion=$5 and correlativo=$6`,
		values: [
			params.estado,
			params.usuverificador,
			// params.fecverificador,
			params.codigocodif_v1,
			params.id_pregunta,
			params.id_asignacion,
			params.correlativo,
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


const reportePendientes = async (req, res) => {
	const query = {
		text: /*`SELECT a.departamento, a.id_pregunta, b.nombre, c.area, a.usucre, a.feccre, count(*)
			FROM cod_encuesta_codificacion a JOIN cat_departamento b ON a.departamento=b.id_departamento JOIN cod_variables c ON a.id_pregunta=c.id_pregunta
			WHERE a.id_pregunta IN (36854,36880) and a.estado ilike 'ASIGNADO'
			GROUP BY a.departamento, a.id_pregunta, b.nombre, c.area, a.usucre, a.feccre ORDER BY a.feccre`*/
			`SELECT a.departamento, a.id_pregunta, b.nombre, c.area, a.usucre, a.feccre, count(*)
			FROM cod_encuesta_codificacion a JOIN cat_departamento b ON a.departamento=b.id_departamento JOIN cod_variables c ON a.id_pregunta=c.id_pregunta
			WHERE a.id_pregunta IN (select id_pregunta from cod_variables where estado = 'ACTIVO') and a.estado ilike 'ASIGNADO'
			GROUP BY a.departamento, a.id_pregunta, b.nombre, c.area, a.usucre, a.feccre ORDER BY a.feccre`,
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


const variableDepto = async (req, res) => {
	const query = {
		text: `select a.departamento, b.nombre, a.estado, count(*) 
		from cod_encuesta_codificacion a join cat_departamento b on b.id_departamento=a.departamento 
		where a.id_pregunta=18312 and a.estado ilike 'codificado' or a.estado ilike 'verificado' 
		group by a.departamento,b.nombre, a.estado, b.id_departamento`,
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


const variableUsuario = async (req, res) => {
	const query = {
		text: `SELECT a.departamento, b.id_departamento ,b.nombre, a.usucre, a.estado, count(*) 
		FROM cod_encuesta_codificacion a JOIN cat_departamento b ON b.id_departamento=a.departamento 
		WHERE a.id_pregunta=18312 AND a.estado ILIKE 'codificado' OR a.estado ILIKE 'verificado' 
		GROUP BY a.departamento,b.nombre, a.estado, a.usucre, b.id_departamento`,
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





// const sinCodificar = async (req, res) => {
// 	const query = {
// 		text: `SELECT * FROM cod_encuesta_codificacion WHERE id_pregunta=18312 AND codigocodif IS NULL`,
// 	};
// 	await con
// 		.query(query)
// 		.then((result) =>
// 			res.status(200).json({
// 				datos: result,
// 			})
// 		)
// 		.catch((e) => console.error(e.stack));
// };

const codificado = async (req, res) => {
	const query = {
		text: /*`SELECT DISTINCT respuesta, codigocodif FROM cod_encuesta_codificacion WHERE 
		id_pregunta in (36854,36880) AND codigocodif IS NOT NULL`*/
		`SELECT DISTINCT respuesta, codigocodif FROM cod_encuesta_codificacion WHERE 
		id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO') AND codigocodif IS NOT NULL`,
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


const codificacionAutomatica = async (req, res) => {
	/*const query = {
		text: `update cod_encuesta_codificacion
		set codigocodif=a.codigocodif_v1, estado='CODIFICADO', feccodificador=now()
		from (select distinct respuesta,codigocodif_v1 from cod_encuesta_codificacion where estado in ('VERIFICADO')) as a
		where cod_encuesta_codificacion.estado='ELABORADO' and a.respuesta=cod_encuesta_codificacion.respuesta`,
	};*/
	let params = req.body;
	const query = {
		/*text: `UPDATE public.cod_encuesta_codificacion cenc
		SET codigocodif = x.codigo, estado='CODIFICADO', usucodificador='AUTOMATICO', feccodificador =now()
		FROM ( SELECT id_asignacion, correlativo, cenc.respuesta,ccat.descripcion,codigo_respuesta, 
		codigocodif,cenc.estado,ccat.codigo,usucodificador, feccodificador 
		FROM public.cod_encuesta_codificacion cenc
		JOIN public.cod_catalogo ccat ON cenc.respuesta=trim(upper(ccat.descripcion)) and 
		ccat.catalogo=$1 and length(ccat.codigo)>=5
		WHERE codigocodif isnull)x
		WHERE cenc.respuesta=upper(x.descripcion) and cenc.id_asignacion = x.id_asignacion and cenc.correlativo = x.correlativo`,*/
		/*values: [
			params.catalogo,
		],*/
		text: `UPDATE public.cod_encuesta_codificacion cenc
		SET codigocodif = x.codigo, estado='CODIFICADO', usucodificador='AUTOMATICO', feccodificador =now()
		FROM ( SELECT id_asignacion, correlativo, cenc.respuesta,ccat.descripcion,codigo_respuesta, 
		codigocodif,cenc.estado,ccat.codigo,usucodificador, feccodificador 
		FROM public.cod_encuesta_codificacion cenc
		JOIN public.cod_catalogo ccat ON cenc.respuesta=trim(upper(ccat.descripcion)) and 
		ccat.catalogo=$1 and
		case when $1 ='cat_caeb' then length(ccat.codigo)>=5 else length(ccat.codigo)>=8 end 
		WHERE codigocodif isnull and ccat.estado='ACTIVO')x
		WHERE cenc.respuesta=upper(x.descripcion) and cenc.id_asignacion = x.id_asignacion and cenc.correlativo = x.correlativo`,
		values: [
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
const codificacionUnoUnoSelec = async (req, res) => {
	const query = {
		text: `select * from cod_encuesta_codificacion cec inner join 
		(select distinct respuesta,codigocodif_v1, id_pregunta from cod_encuesta_codificacion where estado in ('VERIFICADO')) a
		on a.respuesta=cec.respuesta where cec.estado='ELABORADO' and a.id_pregunta=cec.id_pregunta`,
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
 * @param {*} req -> Llega el request 
 * @param {*} res ->  Para la respuesta o response
 */
const codificacionUnoUnoUpd = async (req, res) => {
	const query = {
		text: `update cod_encuesta_codificacion cenc
		SET codigocodif = x.codigo, estado='CODIFICADO', usucodificador='AUTOMATICO_NORMALIZADO', feccodificador =now()
		from
		(select id_asignacion, correlativo, cc.catalogo, respuesta, respuesta_normalizada, codigo,  descripcion_unida, descripcion from cod_encuesta_codificacion cec 
		inner join cod_catalogo cc on cec.respuesta_normalizada = cc.descripcion_unida
		join cod_variables cv on cv.estado like 'ACTIVO'
		and cec.id_pregunta = cv.id_pregunta and cc.catalogo = cv.catalogo and (case when cc.catalogo ='cat_caeb' then length(cc.codigo)>=5 else length(cc.codigo)>=8 end)
		where codigocodif isnull)x
		WHERE cenc.respuesta_normalizada=x.respuesta_normalizada and cenc.id_asignacion = x.id_asignacion and cenc.correlativo = x.correlativo`,
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

const totalRegistros = async (req, res) => {
	let params = req.body;
	const query = {
		text: `SELECT a.departamento, b.nombre, count(*) AS total
			FROM cod_encuesta_codificacion a, cat_departamento b
			WHERE a.departamento=b.id_departamento AND a.id_pregunta='18312' AND b.nombre ILIKE $1
			GROUP BY a.departamento, b.nombre ORDER BY a.departamento asc`,
		values: [
			params.nombre,
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






const variablesApoyo = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: /*`SELECT * FROM enc_encuesta WHERE id_pregunta IN (36862, 37243) AND  id_asignacion=$1 AND correlativo=$2`*/
			`SELECT * FROM enc_encuesta WHERE 
			id_pregunta IN (select unnest(id_variables) from cod_variables where id_pregunta = $3) 
			AND  id_asignacion=$1 AND correlativo=$2`,
		values: [
			params.id_asignacion,
			params.correlativo,
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
	

	
	
const devuelvePreguntasVerificadas = async (req, res) => {
	var params = req.body;
	const query = {
		text: `select a.*,b.pregunta, c.nombre
		from cod_encuesta_codificacion a, cod_variables b, cat_departamento c
		where a.estado ilike $1 and a.id_pregunta=$2 and a.id_pregunta=b.id_pregunta and a.departamento=c.id_departamento LIMIT 500`,
		values: [
			params.estado,
			params.id_pregunta,
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
	
	
const validarRegistros = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select * from cod_catalogo 
			where codigo=$1 and 
			descripcion ilike $2 and estado ilike 'ACTIVO' and catalogo ilike $3`,
		values: [
			params.codigo,
			params.descripcion,
			params.catalogo
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


	
// const catalogoCompleto = async (req, res) => {
// 	const query = {
// 		text: `SELECT * FROM cod_catalogo`,
// 	};
// 	await con
// 		.query(query)
// 		.then((result) =>
// 			res.status(200).json({
// 				datos: result,
// 			})
// 		)
// 		.catch((e) => console.error(e.stack));
// };


const catalogoCodificacion = async (req, res) => {
    const valor = req.params.enviar.split('|');
	const query = {
		text: `SELECT id, descripcion , codigo, MAX(ord) ord FROM f_cod_catalogoPatron('${valor[0]}','${valor[1]}','${valor[2]}') 
			as (id Int, descripcion Text, codigo Text, ord  Float)
			GROUP BY id, descripcion, codigo HAVING MAX(ord)>0.2 ORDER BY ord DESC,codigo`
	}
    await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack))
}





const reporteAutomatico = async (req, res) => {
	const query = {
		text: /*`SELECT 'automatica' AS tipo, count(*) FROM cod_encuesta_codificacion
			WHERE usucodificador IS NULL AND codigocodif IS NOT NULL`*/
			`SELECT 'Codificación automática criterio 2' AS tipo, count(*) FROM cod_encuesta_codificacion
			WHERE usucodificador IS NULL AND codigocodif IS NOT null
			union 
			SELECT 'Codificación asistida' AS tipo, count(*) FROM cod_encuesta_codificacion
						WHERE  usucodificador IS NOT null and usucodificador != 'AUTOMATICO'
			union 
			SELECT 'Codificación automática criterio 1' AS tipo, count(*) FROM cod_encuesta_codificacion
			WHERE  usucodificador ILIKE 'AUTOMATICO'
			union 
			SELECT 'Codificación automática normalizada' AS tipo, count(*) FROM cod_encuesta_codificacion
			WHERE  usucodificador ILIKE 'AUTOMATICO_NORMALIZADO'
			order by tipo`,			
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


const reporteAsistido = async (req, res) => {
	const query = {
		text: `SELECT 'asistida' AS tipo, count(*) FROM cod_encuesta_codificacion
			WHERE  usucodificador IS NOT NULL`,
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
const codificaAutomatico = async (req, res) => {
	let params = req.body;
	const query = {
		text: `SELECT id_pregunta,codigo_respuesta,respuesta,codigocodif,codigocodif_v1,
		codigocodif_v2,cenc.estado,cenc.usucre,catalogo,codigo,descripcion, usucodificador, feccodificador 
		FROM public.cod_encuesta_codificacion cenc
		JOIN public.cod_catalogo ccat ON cenc.respuesta=trim(upper(ccat.descripcion)) and 
		ccat.catalogo=$1 and 
		case when $1 ='cat_caeb' then length(ccat.codigo)>=5 else length(ccat.codigo)>=8 end 
		WHERE codigocodif isnull
		ORDER BY id_asignacion ASC, correlativo ASC, id_pregunta asc`,
		/*`SELECT id_pregunta,codigo_respuesta,respuesta,codigocodif,codigocodif_v1,
		codigocodif_v2,cenc.estado,cenc.usucre,catalogo,codigo,descripcion, usucodificador, feccodificador 
		FROM public.cod_encuesta_codificacion cenc
		JOIN public.cod_catalogo ccat ON cenc.respuesta=trim(upper(ccat.descripcion)) and 
		ccat.catalogo=$1 and length(ccat.codigo)>=5
		WHERE codigocodif isnull
		ORDER BY id_asignacion ASC, correlativo ASC, id_pregunta ASC`,*/
		values: [
			params.catalogo
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
const rptRespuestaNormalizada = async (req, res) => {
	const query = {
		text: `SELECT 'asistida' AS tipo, count(*) FROM cod_encuesta_codificacion
			WHERE  usucodificador IS NOT NULL`,
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

const normalizaRespuesta = async(req, res) => {
	const query = {
		text: `select f_cod_normaliza_data();`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: 'exito',
			}))
		.catch((e) => console.error(e.stack));
};

const codificaNormalizada = async(req, res) =>{
	const query = {
		text: `select cv.id_pregunta, cc.catalogo, respuesta, respuesta_normalizada, codigo,  descripcion_unida, descripcion from cod_encuesta_codificacion cec 
		inner join cod_catalogo cc on cec.respuesta_normalizada = cc.descripcion_unida
		join cod_variables cv on cv.estado like 'ACTIVO'
		and cec.id_pregunta = cv.id_pregunta and cc.catalogo = cv.catalogo and (case when cc.catalogo ='cat_caeb' then length(cc.codigo)>=5 else length(cc.codigo)>=8 end)
		where codigocodif isnull`,
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

const reporteCodficacion = async(req, res) =>{
	const query = {
		text: `select cec.departamento, cd.nombre,  cec.estado, count(cec.estado) acumulado
		from cod_encuesta_codificacion cec
		inner join cat_departamento cd 
		on cec.departamento = cd.id_departamento 
		group by cec.departamento, cd.nombre, cec.estado
		order by cec.departamento`,
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
/**
 * REPORTE DE LOS AVANCES DE CODIFICACIÓN
 * @param {*} req 
 * @param {*} res 
 */
const reporteCodAvance = async(req, res)=>{
	const query = {
		text: `select * from 
		(select departamento,count(*) as avance from cod_encuesta_codificacion cc where estado in ('CODIFICADO','VERIFICADO') group by departamento) as a,
		(select cu.id_departamento,count(*) as total from enc_informante ei 
		join enc_encuesta ee on ee.id_asignacion=ei.id_asignacion and ee.correlativo=ei.correlativo and ee.visible=true and ee.id_pregunta in (select id_pregunta from cod_variables where estado = 'ACTIVO')
		join cat_upm cu on cu.id_upm=ei.id_upm and cu.estado='CONCLUIDO'
		where ei.estado='CONCLUIDO' 
		group by cu.id_departamento) as b
		where a.departamento=b.id_departamento`,
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

const devuelveCorrector = async (req, res) => {
	let params = req.body;
	console.log('Hola desde Server Devuelve- corrector')
	const query = {
		text: `SELECT * FROM cod_err_corr ORDER BY erradas`,
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

const validarCorrector = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select * from cod_err_corr 
			where erradas ilike $1 and corregidas ilike $2`,
		values: [
			params.erradas,
			params.corregidas
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

const insertCorrector = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `insert into cod_err_corr (id, erradas, corregidas, usucre, feccre) values ($1, $2, $3, $4, now())`,
		values: [
			params.id,
			params.erradas,
			params.corregidas,
			params.user
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

const updateCorrector = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		//text: `UPDATE cod_catalogo SET codigo=$1, descripcion=$2, usumod=$3, fecmod=now(), descripcion_unida=REGEXP_REPLACE(unaccent(lower(descripcion)) WHERE id_catalogo=${id}`,
		text: `UPDATE cod_err_corr SET erradas=$1, corregidas=$2, usumod=$3, femod=now() WHERE id=${id}`,
		values: [
			params.erradas,
			params.corregidas,
			params.user,
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

// Devuelve codificadores de un supervisor
const devuelveCodificadores = async (req, res) => {
	const{id_usuario}=req.body;
	
	const query = {
		text: `
		SELECT 
			id_usuario,
			nombres,
			login,
			estado 
		FROM codificacion.cod_usuario
		WHERE estado ='A' and cod_supvsr = '2'`,
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
	/* postCargasTrabajo, */
	getValidarIdEstadoUsuario,
	getRespuestaOcupacion,
	getNombreCatalogo,
	getRespuestas,
	getRespuestaSinCodificar,
	getDiccionario,
	validar,
	asignarCodificacion,
	devuelvePreguntasCodificado,
	devuelvePreguntas,
	devuelvePreguntasUsuario,
	devuelvePreguntasUsuarioVerificado,
	devuelveCatalogo,
	devuelveUsuarios,
	registroUsuarios,
	modificarUsuarios,
	eliminarUsuarios,
	catalogoPorRespuesta,
	updatePregunta,
	updatePreguntaVerif,
	anularAnterior,
	anularAnteriorVerif,
	respuestasObservadas,
	updateVerificador,
	cargarDatos,
	preguntasPorDepartamentoDisperso,
	preguntasPorDepartamentoAmanzanado,
	updateAsignacion,
	codificadores,
	insertCatalogo,
	updateCatalogo,
	updateEstadoCatalogo,
	// blanquearDatos,
	reasignarCodificador,
	reasignar,
	inicioCodificados,
	inicioElaborados,
	inicioVerificados,
	inicioObservados,
	updateAsignado,
	updateInicializar,
	reporteDiario,
	reporteDiarioVerificado,
	reporteVerificados,
	reporteVerificadosAutomatico,
	verificadosAutomatico,
	verificarCantidad,
	postCodificacion,
	reportePendientes,
	variableDepto,
	variableUsuario,
	// sinCodificar,
	codificado,
	codificacionAutomatica,
	totalRegistros,
	variablesApoyo,
	devuelvePreguntasVerificadas,
	validarRegistros,
	// catalogoCompleto
	catalogoCodificacion,
	reporteAutomatico,
	codificaAutomatico,
	codificacionUnoUnoSelec,
	codificacionUnoUnoUpd,
	reporteAsistido,
	normalizaRespuesta,
	codificaNormalizada,
	reporteCodficacion,
	reporteCodAvance,
	devuelveCorrector,
	validarCorrector,
	insertCorrector,
	updateCorrector,
	devuelveCodificadores
};
