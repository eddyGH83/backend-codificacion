const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');
const esquema = "codificacion";

/////CATALOGOS

const devuelveCatalogo = async (req, res) => {
	let params = req.body;

	console.log("dfgdfgdgdfgdgdfgdg");
	const query = {
		text: `SELECT * FROM ${esquema}.cod_catalogo WHERE catalogo ILIKE $1 
		AND estado ILIKE 'ACTIVO' order by id_catalogo desc `,
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
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `insert into ${esquema}.cod_catalogo (catalogo, codigo, descripcion, estado, usucre, feccre, descripcion_unida) values ($1, $2, $3, 'ACTIVO', $4, now(), REGEXP_REPLACE(unaccent(lower($3)) ,'[^\w]{1,}','','g'))`,
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
		text: `UPDATE ${esquema}.cod_catalogo SET codigo=$1, descripcion=$2, usumod=$3, fecmod=now(), 
		descripcion_unida=REGEXP_REPLACE(unaccent(lower($2)) ,'[^\w]{1,}','','g') WHERE id_catalogo=${id}`,
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





















/////MATRIZ
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const devuelveMatriz = async (req, res) => {
	const query = {
		text: `SELECT * FROM ${esquema}.cod_matriz WHERE estado ILIKE 'ACTIVO' order by id_cod_matriz desc `,
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
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const insertarMatriz = async (req, res) => {
	let params = req.body;
	console.log(params)
	const query = {
		text: `insert into ${esquema}.cod_matriz 
		(codigo_ocupacion, descripcion_ocupacion, codigo_acteco, descripcion_acteco, usucre, feccre, estado,cat_ocupacion, cat_acteco, desc_ocu_norm, desc_acteco_norm) values 
		('${params.codigo_ocupacion}', '${params.descripcion_ocupacion}', '${params.codigo_acteco}', '${params.descripcion_acteco}', '${params.user}', now(), 'ACTIVO', 
		'cat_cob', 'cat_caeb', REGEXP_REPLACE(unaccent(lower('${params.descripcion_ocupacion}')) ,'[^\w]{1,}','','g'),  
		REGEXP_REPLACE(unaccent(lower('${params.descripcion_acteco}')) ,'[^\w]{1,}','','g'))`,
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
const updateMatriz = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE ${esquema}.cod_matriz SET codigo_ocupacion='${params.codigo_ocupacion}', descripcion_ocupacion='${params.descripcion_ocupacion}',
		codigo_acteco='${params.codigo_acteco}', descripcion_acteco='${params.descripcion_acteco}', usumod='${params.user}', fecmod=now(), 
		desc_ocu_norm=REGEXP_REPLACE(unaccent(lower('${params.descripcion_ocupacion}')) ,'[^\w]{1,}','','g'), desc_acteco_norm=REGEXP_REPLACE(unaccent(lower('${params.descripcion_acteco}')) ,'[^\w]{1,}','','g') 
		WHERE id_cod_matriz=${id}`,
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
		text: `SELECT * FROM ${esquema}.cod_err_corr where estado='ACTIVO' order by id desc`,
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
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const insertCorrector = async (req, res) => {
	let params = req.body;
	const query = {
		text: `insert into ${esquema}.cod_err_corr (erradas, corregidas, usucre, feccre) values ($1, $2, $3, now())`,
		values: [
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
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const updateCorrector = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE ${esquema}.cod_err_corr SET erradas=$1, corregidas=$2, usumod=$3, femod=now() WHERE id=${id}`,
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
/**
 * DevByGAR
 * @param {*} req 
 * @param {*} res 
 */

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
