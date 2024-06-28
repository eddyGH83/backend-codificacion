const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');
const esquema = "codificacion";

/////CATALOGOS

const devuelveCatalogo = async (req, res) => {
	let params = req.body;

	//console.log("dfgdfgdgdfgdgdfgdg");
	const query = {
		text: `
		SELECT 
			id_catalogo,
			catalogo,
			codigo,
			descripcion,
			usucre,
			to_char(feccre, 'DD-MM-YYYY') as feccre,
			usumod,
			to_char(fecmod, 'DD-MM-YYYY') as fecmod
		FROM codificacion.cod_catalogo WHERE catalogo ILIKE $1 
				AND estado ILIKE 'ACTIVO' order by id_catalogo DESC
		
		--SELECT * FROM ${esquema}.cod_catalogo WHERE catalogo ILIKE $1 
		--AND estado ILIKE 'ACTIVO' order by id_catalogo desc `,
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





const devuelveCatalogoPorCodigo = async (req, res) => {
	let params = req.body;
	const query = {
		text: `SELECT * FROM ${esquema}.cod_catalogo WHERE catalogo ILIKE $1 
		AND estado ILIKE 'ACTIVO' and codigo = $2 and unico=1 order by id_catalogo desc `,
		values: [
			params.catalogo,
			params.codigo
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

const devuelveDescripcionPorCodigo = async (req, res) => {
	let params = req.body;
	const query = {
		text: `SELECT * FROM ${esquema}.cod_catalogo WHERE catalogo ILIKE $1 
		AND estado ILIKE 'ACTIVO' and codigo = $2 and unico=1
		order by id_catalogo desc `,
		values: [
			params.catalogo,
			params.codigo
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

const validarRegistros = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select * from ${esquema}.cod_catalogo 
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


const insertarCatalogo = async (req, res) => {
	let {
		codigo,
		descripcion,
		catalogo,
		user
	} = req.body;

	// console.log(req.body);

	const sql = await (await con.query(`
		select count(1) from codificacion.cod_catalogo 
		where codigo='${codigo}' and 
		descripcion ilike '${descripcion}' and estado ilike 'ACTIVO' and catalogo ilike '${catalogo}'
	`)).rows;

	// Validar si el registro ya existe
	if (sql[0].count > 0) {
		return res.status(200).json({
			success: false,
			message: 'El registro ya existe.'
		});
	} else {
		// Insertar registro
		await (await con.query(`
			insert into codificacion.cod_catalogo (catalogo, codigo, descripcion, estado, usucre, feccre, descripcion_unida) values ('${catalogo}', '${codigo}', '${descripcion}', 'ACTIVO', '${user}', now(), REGEXP_REPLACE(unaccent(lower('${descripcion}')) ,'[^\w]{1,}','','g'))
		`));
		return res.status(200).json({
			success: true,
			message: 'Registro insertado correctamente.'
		});
	}

};


const updateCatalogo = async (req, res) => {
	let id = req.params.id;
	//let params = req.body;
	const {
		codigo,
		descripcion,
		user,
		catalogo
	} = req.body;

	console.log(req.body);

	const sql = await (await con.query(`
		select count(1) from codificacion.cod_catalogo 
		where codigo='${codigo}' and 
		descripcion ilike '${descripcion}' and estado ilike 'ACTIVO' and catalogo ilike '${catalogo}'
	`)).rows;

	// Validar si el registro ya existe
	if (sql[0].count > 0) {
		return res.status(200).json({
			success: false,
			message: 'El registro ya existe.'
		});
	} else {
		// Modificar registro
		await (await con.query(`
		UPDATE codificacion.cod_catalogo SET codigo='${codigo}', descripcion='${descripcion}', usumod='${user}', fecmod=now(), 
		descripcion_unida=REGEXP_REPLACE(unaccent(lower('${descripcion}')) ,'[^\w]{1,}','','g') WHERE id_catalogo=${id}
		`));
		return res.status(200).json({
			success: true,
			message: 'Registro modificado correctamente.'
		});
	}

};



const updateEstadoCatalogo = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE ${esquema}.cod_catalogo SET estado=$1, usumod=$2, fecmod=now() WHERE id_catalogo=${id}`,
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




//Lista todos los registros de la tabla cod_matriz
const devuelveMatriz = async (req, res) => {
	const query = {
		text: `
		SELECT 
			id_cod_matriz,
			codigo_ocupacion,
			descripcion_ocupacion,
			codigo_acteco,
			descripcion_acteco,
			to_char(feccre, 'DD-MM-YYYY') as feccre,
			usucre,
			to_char(fecmod, 'DD-MM-YYYY') as fecmod,
			usumod	
		FROM codificacion.cod_matriz WHERE estado ILIKE 'ACTIVO' order by id_cod_matriz desc 
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


// 
const validarMatriz = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select * from ${esquema}.cod_matriz 
			where codigo_ocupacion='${params.codigo_ocupacion}' and codigo_acteco ilike '${params.codigo_acteco}' 
			and descripcion_ocupacion ilike '${params.descripcion_ocupacion}' and descripcion_acteco ilike '${params.descripcion_acteco}' and
			estado ilike 'ACTIVO'`,
		/*values: [
			params.codigo_ocupacion,
			params.codigo_acteco,
			params.descripcion_ocupacion,
			params.decripcion_acteco,
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
	console.log(query)
};


const insertarMatriz = async (req, res) => {
	let params = req.body;
	console.table(params);

	// Validar si el registro ya existe
	const sql = await (await con.query(`
		select count(1) from codificacion.cod_matriz 
		where codigo_ocupacion='${params.codigo_ocupacion}' and codigo_acteco ilike '${params.codigo_acteco}' 
		and descripcion_ocupacion ilike '${params.descripcion_ocupacion}' and descripcion_acteco ilike '${params.descripcion_acteco}' and
		estado ilike 'ACTIVO'
	`)).rows;

	// Validar si los códigos de ocupación y actividad económica existen en los catálogos
	const sql_cat_cob = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_catalogo
	WHERE catalogo = 'cat_cob' AND codigo ='${params.codigo_ocupacion}'	
	`)).rows;

	const sql_cat_caeb = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_catalogo
	WHERE catalogo = 'cat_caeb' AND codigo ='${params.codigo_acteco}'	
	`)).rows;

	// Validar si el registro ya existe
	if (sql[0].count > 0) {
		return res.status(200).json({
			success: false,
			message: 'El registro ya existe.'
		});
	} else {
		// Validar si los códigos de ocupación y actividad económica existen en los catálogos
		if (sql_cat_cob[0].count == 0 && sql_cat_caeb[0].count == 0) {
			return res.status(200).json({
				success: false,
				message: 'Los códigos de ocupación y actividad económica no existen en los catálogos.'
			});
		} else {
			// Insertar registro
			await (await con.query(`
				insert into codificacion.cod_matriz 
				(codigo_ocupacion, descripcion_ocupacion, codigo_acteco, descripcion_acteco, usucre, feccre, estado,cat_ocupacion, cat_acteco, desc_ocu_norm, desc_acteco_norm) values 
				('${params.codigo_ocupacion}', '${params.descripcion_ocupacion}', '${params.codigo_acteco}', '${params.descripcion_acteco}', '${params.user}', now(), 'ACTIVO', 
				'cat_cob', 'cat_caeb', REGEXP_REPLACE(unaccent(lower('${params.descripcion_ocupacion}')) ,'[^\w]{1,}','','g'),  
				REGEXP_REPLACE(unaccent(lower('${params.descripcion_acteco}')) ,'[^\w]{1,}','','g'))
			`));
			return res.status(200).json({
				success: true,
				message: 'Registro insertado correctamente.'
			});

		}

	}

};


const updateMatriz = async (req, res) => {
	let id = req.params.id;
	let params = req.body;

	// Validar si el registro ya existe
	const sql = await (await con.query(`
		select count(1) from codificacion.cod_matriz 
		where codigo_ocupacion='${params.codigo_ocupacion}' and codigo_acteco ilike '${params.codigo_acteco}' 
		and descripcion_ocupacion ilike '${params.descripcion_ocupacion}' and descripcion_acteco ilike '${params.descripcion_acteco}' and
		estado ilike 'ACTIVO'
	`)).rows;

	// Validar si los códigos de ocupación y actividad económica existen en los catálogos
	const sql_cat_cob = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_catalogo
	WHERE catalogo = 'cat_cob' AND codigo ='${params.codigo_ocupacion}'	
	`)).rows;

	const sql_cat_caeb = await (await con.query(`
	SELECT count(1) FROM codificacion.cod_catalogo
	WHERE catalogo = 'cat_caeb' AND codigo ='${params.codigo_acteco}'	
	`)).rows;

	// Validar si el registro ya existe
	if (sql[0].count > 0) {
		return res.status(200).json({
			success: false,
			message: 'El registro ya existe.'
		});
	} else {
		// Validar si los códigos de ocupación y actividad económica existen en los catálogos
		if (sql_cat_cob[0].count == 0 && sql_cat_caeb[0].count == 0) {
			return res.status(200).json({
				success: false,
				message: 'Los códigos de ocupación y actividad económica no existen en los catálogos.'
			});
		} else {
			// Insertar registro
			await (await con.query(`
				UPDATE codificacion.cod_matriz SET codigo_ocupacion='${params.codigo_ocupacion}', descripcion_ocupacion='${params.descripcion_ocupacion}',
				codigo_acteco='${params.codigo_acteco}', descripcion_acteco='${params.descripcion_acteco}', usumod='${params.user}', fecmod=now(), 
				desc_ocu_norm=REGEXP_REPLACE(unaccent(lower('${params.descripcion_ocupacion}')) ,'[^\w]{1,}','','g'), desc_acteco_norm=REGEXP_REPLACE(unaccent(lower('${params.descripcion_acteco}')) ,'[^\w]{1,}','','g') 
				WHERE id_cod_matriz=${id}
			`));

			return res.status(200).json({
				success: true,
				message: 'Registro modificado correctamente.'
			});
		}

	}

};


const updateEstadoMatriz = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE ${esquema}.cod_matriz SET estado=$1, usumod=$2, fecmod=now() WHERE id_cod_matriz=${id}`,
		values: [
			params.estado,
			params.user
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
//////DICCIONARIO CORRECTOR
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const devuelveCorrector = async (req, res) => {
	let params = req.body;
	const query = {
		text: `
		SELECT 
		id,
		erradas,
		corregidas,
		to_char(feccre, 'DD-MM-YYYY') as feccre,
		usucre,
		to_char(femod, 'DD-MM-YYYY') as femod,
		usumod
		FROM ${esquema}.cod_err_corr where estado='ACTIVO' order by id DESC
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
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const validarCorrector = async (req, res) => {
	let params = req.body;
	const query = {
		text: `select * from ${esquema}.cod_err_corr 
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
	const { erradas, corregidas, user } = req.body;

	//  validar si el registro ya existe
	const sql = await (await con.query(`	  
		select count(1) from codificacion.cod_err_corr 
		where erradas ilike '${erradas}' and corregidas ilike '${corregidas}'
	`)).rows;

	// Validar si el registro ya existe
	if (sql[0].count > 0) {
		return res.status(200).json({
			success: false,
			message: 'El registro ya existe.'
		});
	} else {
		// Insertar registro
		await (await con.query(`
			insert into codificacion.cod_err_corr (erradas, corregidas, usucre, feccre) values ('${erradas}', '${corregidas}', '${user}', now())
		`));
		return res.status(200).json({
			success: true,
			message: 'Registro insertado correctamente.'
		});
	}
};




const updateCorrector = async (req, res) => {
	let id = req.params.id;

	const { erradas, corregidas, user } = req.body;

	//  validar si el registro ya existe
	const sql = await (await con.query(`	  
		select count(1) from codificacion.cod_err_corr 
		where erradas ilike '${erradas}' and corregidas ilike '${corregidas}'
	`)).rows;

	// Validar si el registro ya existe
	if (sql[0].count > 0) {
		return res.status(200).json({
			success: false,
			message: 'El registro ya existe.'
		});
	} else {
		// Modificar registro
		await (await con.query(`
			UPDATE codificacion.cod_err_corr SET erradas='${erradas}', corregidas='${corregidas}', usumod='${user}', femod=now() WHERE id=${id}
			`));
		return res.status(200).json({
			success: true,
			message: 'Registro modificado correctamente.'
		});
	}

};



const updateEstadoDiccCorr = async (req, res) => {
	let id = req.params.id;
	let params = req.body;

	//console.log("id:" + id);

	const query = {
		text: `UPDATE ${esquema}.cod_err_corr SET estado='${params.estado}', usumod='${params.user}', femod=now() WHERE id=${id}`
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
	devuelveCatalogo,
	validarRegistros,
	insertarCatalogo,
	updateCatalogo,
	updateEstadoCatalogo,
	devuelveCorrector,
	validarCorrector,
	insertCorrector,
	updateCorrector,
	updateEstadoDiccCorr,
	devuelveMatriz,
	validarMatriz,
	insertarMatriz,
	updateMatriz,
	updateEstadoMatriz,
	devuelveCatalogoPorCodigo,
	devuelveDescripcionPorCodigo
};
