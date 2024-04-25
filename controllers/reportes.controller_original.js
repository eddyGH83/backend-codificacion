const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');
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
 */
const devuelveUnUsuario = async (req, res) => {
	let id = req.params.id;
	const query = {
		text: `SELECT * FROM ${esquema}.cod_usuario u join ${esquema}.cod_rol r on u.rol_id=r.rol_id where u.id_usuario = ${id}`,
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
const devuelveRoles = async (req, res) => {
	const query = {
		text: `SELECT rol_id as value, rol_descripcion as label, * FROM ${esquema}.cod_rol`,
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
const validarUsuario = async (req, res) => {
	
	let params = req.body;
	const query = {
		text: `select * from ${esquema}.cod_usuario 
			where login=$1 and 
			estado = 'A'`,
		values: [
			params.login
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
const registraUsuario = async(req, res) => {
    var params = req.body;
    const query = {
        text: `INSERT INTO ${esquema}.cod_usuario (nombres, apellidos, password, login, telefono, rol_id, usucre, fecre) VALUES ($1, $2, $3, $4, $5, $6,$7, now())`,
        values: [params.nombres, params.apellidos, bcrypt.hashSync('123456', 10), params.login, params.telefono, params.rol_id, params.usucre]
    }
    await con.query(query)
        .then(result => res.status(200).json({
            query, result
        }))
        .catch(e => console.error(e.stack))
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const modificaUsuario = async (req, res) => {
	var params = req.body;
	let id = req.params.id;
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET nombres = $1, apellidos = $2, login = $3, rol_id = $4, telefono = $5, usumod=$6, fecmod=now() WHERE id_usuario = ${id}`,
		values: [
			params.nombres,
			params.apellidos,
            params.login,
            params.rol_id,
            params.telefono,
            params.usumod
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
const actualizaPass =async(req, res) => {
	var pass = req.body.pass
	var usmod = req.body.usmod
	let id = req.params.id;
	pass = bcrypt.hashSync(pass, 10)
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET password = '${pass}', fecmod=now(), usumod='${usmod}'  WHERE id_usuario = ${id}`,
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
const resetPassUsuario =async(req, res) => {
	let id = req.params.id;
	let pass = bcrypt.hashSync('123456', 10)
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET password = '${pass}' WHERE id_usuario = ${id}`,
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
const deleteUsuario = async (req, res) => {
	let id = req.params.id;
	let params = req.body;
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET estado='I', usumod=$1, fecmod=now() WHERE id_usuario=${id}`,
		values: [
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


module.exports = {
	repCodificados,
	repHoyAyerMes,
  devuelveRoles,
  modificaUsuario,
  registraUsuario,
  deleteUsuario,
  resetPassUsuario,
  devuelveUnUsuario,
  actualizaPass,
  validarUsuario
};
