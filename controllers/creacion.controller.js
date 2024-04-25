const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');



const getDepartamento = async (req, res) => {
    const response = await con.query(`select * from cat_departamento order by id_departamento`);
    res.status(200).json(response.rows)
}


const getDepartamentoAsignado = async (req, res) => {
    var params = req.body
    const query = {
        text: `SELECT * FROM cat_departamento WHERE id_departamento = ANY(select unnest(STRING_TO_ARRAY(a_departamento,',')::INT[]) from seg_usuario where id_usuario=$1) order by 1`,
        value: [params.id],
    }
    await con.query(query)
        .then(result => res.status(200).json({
            query, result
        })).catch(e => console.error(e.stack))
}


const getRol = async (req, res) => {
    const response = await con.query('select * from seg_rol');
    res.status(200).json(response.rows)
}

const getOmision = async (req, res) => {
    const response = await con.query(`select codigo id, descripcion codigo from cat_catalogo where catalogo='cat_omision' and estado='ELABORADO'`);
    res.status(200).json(response.rows)
}

const getUsuarios = async (req, res) => {
    var params = req.body
    const query = {
        text: `SELECT * FROM seg_usuario WHERE id_departamento in $1 and estado='ELABORADO' order by login desc`,
        value: [params.id],
    }
    await con.query(query)
        .then(result => res.status(200).json({
            query, result
        })).catch(e => console.error(e.stack))
}

const postUsuarios = async(req, res) => {
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


const putUsuarios = async (req, res) => {
	var params = req.body;

	const query = {
		text: 'UPDATE seg_usuario SET id_departamento = $1, login = $2, nombre = $3, id_rol = $4 WHERE id_usuario = $5',
		values: [
			params.id_departamento,
            params.login,
            params.nombre,
            params.id_rol,
            params.id_usuario
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



const deleteUsuarios = async (req, res) => {
	var id = req.params.id;

	const query = {
		text: `UPDATE seg_usuario SET estado='ELIMINADO' WHERE id_usuario = ${id}`,
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


const putUsuariosId = async (req, res) => {
	var params = req.body;

	const query = {
		text: 'UPDATE seg_usuario SET nombre = $1, login = $2 WHERE id_usuario = $3',
		values: [
			params.nombre,
            params.login,
            params.id,
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

//actualizarPass
const actualizarPass = async (req, res) => {
	var params = req.body;
    const query1 = {
        text: 'select * from seg_usuario where id_usuario=$1',
        values: [params.id_usuario],
    }
    await con.query(query1, (err, result) => {
        if (!bcrypt.compareSync(params.actpassword, result.rows[0].password)) {
            console.log('no valido')
            return res.status(400).json({ msg: 'Contraseña actual no valida' })
        }
    })
	const query = {
		text: 'UPDATE seg_usuario SET password = $1 WHERE id_usuario = $2',
		values: [
            bcrypt.hashSync(params.password, 10),
			params.id_usuario

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
    getDepartamento,
    getDepartamentoAsignado,
    getRol,
    getOmision,
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    putUsuariosId,
    actualizarPass
};
