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


const devuelveUsuarios = async (req, res) => {
	let { rol_id, login, id_usuario } = req.body
	//console.table(req.body);


	let query = ''

	// Sup codificacion
	if (rol_id == 4) {
		query = {
			text: `
			SELECT * FROM codificacion.cod_usuario u 
			inner join codificacion.cod_rol r 
			on u.rol_id=r.rol_id where u.estado = 'A' and u.cod_supvsr=${id_usuario} and r.rol_id = 5  order by id_usuario DESC
			`,
		};
	}

	// Jefe de turno || Sup/Resp de codificacion
	if (rol_id == 3 || rol_id == 2) {
		query = {
			text: `
			SELECT * FROM codificacion.cod_usuario u 
			inner join codificacion.cod_rol r 
			on u.rol_id=r.rol_id where u.estado = 'A' and u.usucre='${login}'  order by id_usuario DESC
			`,
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



const devuelveSupervisores = async (req, res) => {
	let query = ''

	/* 
	1	ADMINISTRADOR DEL SISTEMA					ADM
	2	RESPONSABLE ESPECIALISTA DE CODIFICACIÓN	RESP/ESP
	3	JEFE DE TURNO								JT
	4	SUPERVISOR DE CODIFICACIÓN					SUP
	5	TÉCNICO EN CODIFICACIÓN						COD
	6	TÉCNICO DE CONTINGENCIA						CONT
*/

	query = {
		text: `
			SELECT u.id_usuario, 'Sup. ' || u.nombres || ' ' || u.apellidos || ' | ' || u.turno nombres  FROM codificacion.cod_usuario u 
			inner join codificacion.cod_rol r 
			on u.rol_id=r.rol_id where u.estado = 'A' AND r.rol_id ='4' order by id_usuario DESC
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
	let id = req.body.roles_id
	console.log(req.body)
	const query = {
		text: `SELECT rol_id as value, rol_descripcion as label, * FROM ${esquema}.cod_rol 
		where rol_id > ${id}`,
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
const devuelveSupervisor = async (req, res) => {
	const query = {
		text: `SELECT id_usuario as value, CONCAT( nombres, ' ', apellidos) as label, * FROM ${esquema}.cod_usuario where rol_id = 5 and estado = 'A'`,
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
const registraUsuario_ = async (req, res) => {
	var {
		nombres,
		apellidos,
		login,
		telefono,
		rol_id,
		usucre,
		turno,
		cod_supvsr
	} = req.body;



	//console.table(req.body);
	const query = `insert into codificacion.cod_usuario (nombres, apellidos, password, login, telefono, rol_id, usucre, turno, cod_supvsr) 
					values ('${nombres}','${apellidos}', md5('123456'),'${login}',${telefono}, ${rol_id}, '${usucre}', '${turno}', ${cod_supvsr})`
	console.log(query);

	/* const query_ = {
		text: ` INSERT INTO ${esquema}.cod_usuario (nombres, apellidos, password, login, telefono, rol_id, usucre, turno, cod_supvsr) 
		VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9)`,
		values: [params.nombres, params.apellidos, bcrypt.hashSync('123456', 10), params.login, params.telefono, params.rol_id, params.usucre, params.turno, params.cod_supvsr]
	} */

	await con.query(query)
		.then(result => res.status(200).json({
			query, result
		}))
		.catch(e => console.error(e.stack))
}








// REGISTRO DE USUARIO

const registraUsuario = async (req, res) => {
	var {
		id_usuario,
		nombres,
		apellidos,
		login,
		telefono,
		rol_id,
		usucre,
		turno,
		cod_supvsr
	} = req.body;
	console.table(req.body);

	if (telefono == undefined) {
		telefono = ''
	}

	const qr = await (await con.query(`
		select count(1) from codificacion.cod_usuario 
		where login='${login}' and 
		estado = 'A'
	`)).rows;


	if (qr[0].count > 0) {
		res.status(200).json({
			success: false,
			message: 'El usuario ya existe'
		})
	} else {


		// ADD USUARIO ROL 6, 4, 3 (TECNICO DE CONTINGENCIA, SUPERVISOR DE CODIFICACION, JEFE DE TURNO)
		if (rol_id==6 || rol_id == 4 || rol_id ==3) {
			// 
			await (await con.query(`
			INSERT INTO codificacion.cod_usuario (nombres, apellidos, password, login, telefono, rol_id, usucre, turno, cod_supvsr)  
			VALUES (UPPER('${nombres}'),UPPER('${apellidos}'), md5('123456'),LOWER('${login}'),'${telefono}', ${rol_id}, '${usucre}', '${turno}', ${cod_supvsr})
			`));
		}


		// ADD USUARIO ROL 5 (TECNICO EN CODIFICACION) 				
		if (rol_id == 5) {

			// Obtener el turno del usuario creador (supervisor)
			const trn= await (await con.query(`
				select turno from codificacion.cod_usuario where id_usuario = ${id_usuario};
			`)).rows;	

			// 
			await (await con.query(`
				INSERT INTO codificacion.cod_usuario (nombres, apellidos, password, login, telefono, rol_id, usucre, turno, cod_supvsr)  
				VALUES (UPPER('${nombres}'),UPPER('${apellidos}'), md5('123456'),LOWER('${login}'),'${telefono}', ${rol_id}, '${usucre}', '${trn[0].turno}', ${cod_supvsr})
			`));
		}


		// RESPUESTA
		res.status(200).json({
			success: true,
			message: 'Usuario Adicionado'
		})
	}

}















/* select count(1) from codificacion.cod_usuario 
			where login='epacddoadmin' and 
			estado = 'A' */


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
const modificaUsuario = async (req, res) => {
	var params = req.body;
	let id = req.params.id;
	console.log(params)
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET nombres = $1, apellidos = $2, login = $3, rol_id = $4, 
		telefono = $5, usumod=$6, turno=$7, cod_supvsr=$8, fecmod=now() 
		WHERE id_usuario = ${id}`,
		values: [
			params.nombres,
			params.apellidos,
			params.login,
			params.rol_id,
			params.telefono,
			params.usumod,
			params.turno,
			params.cod_supvsr,
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
const actualizaPass = async (req, res) => {
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
const resetPassUsuario = async (req, res) => {
	let id = req.params.id;
	console.log("-------------id------------", id);
	// let pass = bcrypt.hashSync('123456', 10)
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET password = md5('123456') WHERE id_usuario = ${id}`,
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
	//let id = req.params.id;
	let params = req.body;
	console.table(req.body);
	const query = {
		text: `UPDATE ${esquema}.cod_usuario SET estado='I', usumod=$1, fecmod=now() WHERE id_usuario=$2`,
		values: [
			params.user,
			params.id
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


// Mostrar datos usuario
const mostrarDatosUsuario = async (req, res) => {
	var id_usuario = req.body.id_usuario;

	const query = {
		text: `
		select
			u.nombres,
			u.apellidos,
			u.login,
			u.telefono,
			r.rol_descripcion,
			r.rol_codigo
			from codificacion.cod_usuario u
			join codificacion.cod_rol r on u.rol_id = r.rol_id
		where u.id_usuario = ${id_usuario}`,
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

// Actualiza el numero de celular
const actualizaNroCelular = async (req, res) => {
	var telefono = req.body.telefono;
	var id_usuario = req.body.id_usuario;

	// verificamos que el telefono no sea null
	if (telefono == null) {
		res.status(200).json({
			success: false,
			message: 'El número de celular no puede estar vacío.'
		})
		return
	}

	// Verificar que el telefono no este vacio
	if (telefono == '') {
		res.status(200).json({
			success: false,
			message: 'El número de celular no puede estar vacío.'
		})
		return
	}

	// Verificar que el telefono no tenga mas de 8 caracteres trim	
	telefono = telefono.toString();
	console.log(telefono.length);
	if (telefono.length > 8) {
		res.status(200).json({
			success: false,
			message: 'El número de celular no puede tener más de 8 caracteres.'
		})
	} else {
		const query = await (await con.query(`
		UPDATE ${esquema}.cod_usuario SET telefono = '${telefono}' WHERE id_usuario = ${id_usuario}
		`)).rows;
		res.status(200).json({
			success: true,
			message: 'Número de celular actualizado.'
		})
	}

};


// Modificar Pass
const modificarPass = async (req, res) => {
	var passActual = req.body.passActual
	var passNuevo = req.body.passNuevo
	var passNuevo2 = req.body.passNuevo2
	var id_usuario = req.body.id_usuario;

	// Verificamos si la contraseña actual es correcta
	const qr = await (await con.query(`
		select count(1) from codificacion.cod_usuario where id_usuario=${id_usuario}  and password=md5('${passActual}');
	`)).rows;

	console.log(qr[0].count);
	console.log(`
	select count(1) from codificacion.cod_usuario where id_usuario=${id_usuario}  and password=md5('${passActual}');
`);

	// Verificamos si la contraseña actual es correcta
	if (qr[0].count == 0) {
		res.status(200).json({
			success: false,
			message: 'La contraseña actual no es correcta o está vacía.'
		})
	} else {
		// Las contraseñas no coinciden
		if (passNuevo != passNuevo2 || passNuevo == '' || passNuevo2 == '') {
			res.status(200).json({
				success: false,
				message: 'Las contraseñas no coinciden o está vacía.'
			})
		} else {
			// Actualizamos la contraseña con md5
			await (await con.query(`
				UPDATE ${esquema}.cod_usuario SET password = md5('${passNuevo}') WHERE id_usuario = ${id_usuario}
			`));

			// Actualizamos la contraseña
			res.status(200).json({
				success: true,
				message: 'Contraseña actualizada.'
			})
		}

	}


};


module.exports = {
	devuelveUsuarios,
	devuelveRoles,
	modificaUsuario,
	registraUsuario,
	deleteUsuario,
	resetPassUsuario,
	devuelveUnUsuario,
	actualizaPass,
	validarUsuario,
	devuelveSupervisor,
	devuelveSupervisores,
	actualizaNroCelular,
	mostrarDatosUsuario,
	modificarPass
};


/*
	1	ADMINISTRADOR DEL SISTEMA					ADM
	2	RESPONSABLE ESPECIALISTA DE CODIFICACIÓN	RESP/ESP
	3	JEFE DE TURNO								JT
	4	SUPERVISOR DE CODIFICACIÓN					SUP
	5	TÉCNICO EN CODIFICACIÓN						COD
	6	TÉCNICO DE CONTINGENCIA						CONT
*/