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
	console.table(req.body);


	let query = ''

	// Sup codificacion: solo mostrará sus técnicos en codificación
	if (rol_id == 4) {
		const qr = await (await con.query(`
		SELECT 
			u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
			u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
			r.rol_codigo, u.telefono
		FROM codificacion.cod_usuario u 
		inner join codificacion.cod_rol r 
		on u.rol_id=r.rol_id where u.estado = 'A' and u.cod_supvsr=${id_usuario} and r.rol_id = 5  order by id_usuario DESC
		`)).rows;
		// respuesta
		res.status(200).json(qr);
	}





	// Jefe de turno : mostrará sus supervisores creados y técnicos en codificación creados por sus supervisores
	if (rol_id == 3) {

		// Listamos los supervisores creados por el jefe de turno
		const qr = await (await con.query(`
				SELECT 
					u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
					u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
					r.rol_codigo, u.telefono
				FROM codificacion.cod_usuario u 
				inner join codificacion.cod_rol r 
				on u.rol_id=r.rol_id where u.estado = 'A' and u.cod_supvsr=${id_usuario} and r.rol_id = 4  order by id_usuario DESC 
		`)).rows;

		// por cada supervisor de "qr", mostramos sus técnicos en codificación creados por ellos, buscar por el campo cod_supvsr
		for (let i = 0; i < qr.length; i++) {
			// Listamos los técnicos en codificación creados por los supervisores por el campo cod_supvsr
			const qr2 = await (await con.query(`
				SELECT 
					u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
					u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
					r.rol_codigo, u.telefono
				FROM codificacion.cod_usuario u 
				inner join codificacion.cod_rol r 
				on u.rol_id=r.rol_id where u.estado = 'A' and u.cod_supvsr=${qr[i].id_usuario} and r.rol_id = 5  order by id_usuario DESC
			`)).rows;

			// Agregamos los técnicos en codificación creados por los supervisores
			for (let j = 0; j < qr2.length; j++) {
				qr.push(qr2[j]);
			}
		}
		// respuesta
		res.status(200).json(qr)
	}



	// Responsable especialista de codificación: mostrará sus jefes de turno y supervisores, técnicos en codificación y técnicos de contingencia
	if (rol_id == 2) {



		// Listamos todos los jefes de turno
		const qr = await (await con.query(`
		SELECT 
					u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
					u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
					r.rol_codigo, u.telefono
				FROM codificacion.cod_usuario u 
				inner join codificacion.cod_rol r 
				on u.rol_id=r.rol_id where u.estado = 'A' and r.rol_id = 3  order by id_usuario DESC
		`)).rows;
		// Listamos todos tecnicos en codificacion
		const qr2 = await (await con.query(`
			SELECT 
				u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
				u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
				r.rol_codigo, u.telefono
			FROM codificacion.cod_usuario u 
			inner join codificacion.cod_rol r 
			on u.rol_id=r.rol_id where u.estado = 'A' and r.rol_id = 6  order by id_usuario DESC
		`)).rows;
		// Unimos los jefes de turno con los tecnicos en codificacion
		for (let i = 0; i < qr2.length; i++) {
			qr.push(qr2[i]);
		}









		// Listamos todos los supervisores
		const qr3 = await (await con.query(`
			SELECT 
				u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
				u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
				r.rol_codigo, u.telefono
			FROM codificacion.cod_usuario u 
			inner join codificacion.cod_rol r 
			on u.rol_id=r.rol_id where u.estado = 'A' and r.rol_id = 5  order by id_usuario DESC
		`)).rows;

		// Unimos los supervisores
		for (let j = 0; j < qr3.length; j++) {
			qr.push(qr3[j]);
		}







		// por cada supervisor de "qr3", mostramos sus técnicos en codificación creados por ellos, buscar por el campo cod_supvsr
		for (let k = 0; k < qr3.length; k++) {
			// Listamos los técnicos en codificación creados por los supervisores por el campo cod_supvsr
			const qr4 = await (await con.query(`
			SELECT 
				u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido  nombre_completo,
				u.id_usuario, r.rol_id, u.nombres, u.login, u.usucre, u.fecre, u.usumod, u.fecmod, u.turno, u.estado, u.cod_supvsr, u.pr_apellido, u.sg_apellido, r.rol_descripcion, 
				r.rol_codigo, u.telefono
			FROM codificacion.cod_usuario u 
			inner join codificacion.cod_rol r 
			on u.rol_id=r.rol_id where u.estado = 'A' and u.cod_supvsr=${qr[k].id_usuario} and r.rol_id = 5  order by id_usuario DESC
			`)).rows;

			// Agregamos los técnicos en codificación creados por los supervisores
			for (let l = 0; l < qr4.length; l++) {
				qr.push(qr4[l]);
			}
		}




		// respuestas
		res.status(200).json(qr);
	}


};


const devuelveJefesTurno = async (req, res) => {
	//let { rol_id, login, id_usuario } = req.body

	let query = ''
	query = {
		text: `
		SELECT u.id_usuario, 'JT. ' || u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido || ' | t. ' || u.turno nombre_completo  FROM codificacion.cod_usuario u
			inner join codificacion.cod_rol r
			on u.rol_id=r.rol_id where u.estado = 'A' AND r.rol_id ='3' order by id_usuario DESC
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
			SELECT u.id_usuario, 'Sup. ' || u.nombres || ' ' || u.pr_apellido || ' ' || u.sg_apellido || ' | t. ' || u.turno nombre_completo  FROM codificacion.cod_usuario u
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
		id_creador,
		nombres,
		pr_apellido,
		sg_apellido,
		telefono,
		rol_id,
		turnoAux // Es el turno de los usuarios  jt y tec. cont
	} = req.body;

	console.table(req.body);

	var cond = true;

	var nombre = 'eddy roque de la cruz'
	// quitar espacios en blanco de la variable nombre, usando el metodo replace
	nombre = nombre.replace(/\s/g, '');
	nombre = nombre.trim();


	// rol_id = 3 // Jefe de turno
	if (rol_id == 3) {
		var cond = true;

		var n = 0; var cn = ''

		// Verificamos si el usuario ya existe
		while (cond) {

			// Si n es igual a 0, cn es igual a vacio, de lo contrario, cn es igual a n convertido a string
			if (n == 0) { cn = ''; } else { cn = n.toString(); }

			// Generamos el nombre de usuario
			var nomUsu = nombres.replace(/\s/g, '').charAt(0) + pr_apellido.replace(/\s/g, '') + cn + 'jt';
			// Verificamos si el usuario ya existe
			const qr = await (await con.query(`select count(1) from codificacion.cod_usuario where login=LOWER('${nomUsu}')`)).rows;

			// Si el usuario no existe, insertamos el usuario				
			if (qr[0].count == 0) {
				cond = false;

				// Averiguamos el turno y el usuario supervisor del usuario
				//const qr2 = await (await con.query(`select turno, login from codificacion.cod_usuario where id_usuario=${id_usuario}`)).rows;

				// Averiguamos el login del usuario creador
				const qr3 = await (await con.query(`select login from codificacion.cod_usuario where id_usuario=${id_creador}`)).rows;

				// Ejecutamos la consulta de inserción
				await con.query(`
				insert into codificacion.cod_usuario (nombres, pr_apellido, sg_apellido, password, login, telefono, rol_id, usucre, turno, cod_supvsr)
				values (UPPER ('${nombres}'),UPPER('${pr_apellido}'),UPPER('${sg_apellido}'), md5('123456'),LOWER('${nomUsu}'),'${telefono}', ${rol_id}, '${qr3[0].login}', '${turnoAux}', ${id_usuario})
				`);

				// respuesta
				res.status(200).json({
					success: true,
					message: 'Jefe de Turno adicionado correctamente.'
				})

			} else {
				n++;
			}
		}
	}



	// rol_id = 4 // Supervisor de codificación
	if (rol_id == 4) {
		var cond = true;

		var n = 0; var cn = ''

		// Verificamos si el usuario ya existe
		while (cond) {

			// Si n es igual a 0, cn es igual a vacio, de lo contrario, cn es igual a n convertido a string
			if (n == 0) { cn = ''; } else { cn = n.toString(); }

			// Generamos el nombre de usuario
			var nomUsu = nombres.replace(/\s/g, '').charAt(0) + pr_apellido.replace(/\s/g, '') + cn + 'sup';
			// Verificamos si el usuario ya existe
			const qr = await (await con.query(`select count(1) from codificacion.cod_usuario where login=LOWER('${nomUsu}')`)).rows;

			// Si el usuario no existe, insertamos el usuario				
			if (qr[0].count == 0) {
				cond = false;

				// Averiguamos el turno y el usuario del jefe de turno
				const qr2 = await (await con.query(`select turno, login from codificacion.cod_usuario where id_usuario=${id_usuario}`)).rows;

				// Averiguamos el login del usuario creador
				const qr3 = await (await con.query(`select login from codificacion.cod_usuario where id_usuario=${id_creador}`)).rows;

				// Ejecutamos la consulta de inserción
				await con.query(`
				insert into codificacion.cod_usuario (nombres, pr_apellido, sg_apellido, password, login, telefono, rol_id, usucre, turno, cod_supvsr) 
				values (UPPER ('${nombres}'),UPPER('${pr_apellido}'),UPPER('${sg_apellido}'), md5('123456'),LOWER('${nomUsu}'),'${telefono}', ${rol_id}, '${qr3[0].login}', '${qr2[0].turno}', ${id_usuario})
				`);

				// respuesta
				res.status(200).json({
					success: true,
					message: 'Supervisor de Codificación adicionado correctamente.'
				})

			} else {
				n++;
			}
		}

	}


	// rol_id = 5; // Técnico en codificación 
	if (rol_id == 5) {
		//console.log('-------Técnico en codificación');
		//console.table(req.body);

		var cond = true;

		var n = 0; var cn = ''

		// Verificamos si el usuario ya existe
		while (cond) {

			// Si n es igual a 0, cn es igual a vacio, de lo contrario, cn es igual a n convertido a string
			if (n == 0) { cn = ''; } else { cn = n.toString(); }

			// Generamos el nombre de usuario
			var nomUsu = nombres.replace(/\s/g, '').charAt(0) + pr_apellido.replace(/\s/g, '') + cn + 'cod';
			// Verificamos si el usuario ya existe
			const qr = await (await con.query(`select count(1) from codificacion.cod_usuario where login=LOWER('${nomUsu}')`)).rows;

			// Si el usuario no existe, insertamos el usuario				
			if (qr[0].count == 0) {
				cond = false;

				// Averiguamos el turno y el usuario supervisor del usuario
				const qr2 = await (await con.query(`select turno, login from codificacion.cod_usuario where id_usuario=${id_usuario}`)).rows;

				// Averiguamos el login del usuario creador
				const qr3 = await (await con.query(`select login from codificacion.cod_usuario where id_usuario=${id_creador}`)).rows;

				// Ejecutamos la consulta de inserción
				await con.query(`
				insert into codificacion.cod_usuario (nombres, pr_apellido, sg_apellido, password, login, telefono, rol_id, usucre, turno, cod_supvsr) 
				values (UPPER ('${nombres}'),UPPER('${pr_apellido}'),UPPER('${sg_apellido}'), md5('123456'),LOWER('${nomUsu}'),'${telefono}', ${rol_id}, '${qr3[0].login}', '${qr2[0].turno}', ${id_usuario})
				`);
			} else {
				n++;
			}
		}

		// respuesta
		res.status(200).json({
			success: true,
			message: 'Tecnico en Codificación adicionado correctamente.'
		})
		return;
	}


	// rol_id = 6; // Técnico de contingencia
	if (rol_id == 6) {
		var cond = true;

		var n = 0; var cn = ''

		// Verificamos si el usuario ya existe
		while (cond) {

			// Si n es igual a 0, cn es igual a vacio, de lo contrario, cn es igual a n convertido a string
			if (n == 0) { cn = ''; } else { cn = n.toString(); }

			// Generamos el nombre de usuario
			var nomUsu = nombres.replace(/\s/g, '').charAt(0) + pr_apellido.replace(/\s/g, '') + cn + 'cont';
			// Verificamos si el usuario ya existe
			const qr = await (await con.query(`select count(1) from codificacion.cod_usuario where login=LOWER('${nomUsu}')`)).rows;

			// Si el usuario no existe, insertamos el usuario				
			if (qr[0].count == 0) {
				cond = false;

				// Averiguamos el turno y el usuario supervisor del usuario
				// const qr2 = await (await con.query(`select turno, login from codificacion.cod_usuario where id_usuario=${id_usuario}`)).rows;

				// Averiguamos el login del usuario creador
				const qr3 = await (await con.query(`select login from codificacion.cod_usuario where id_usuario=${id_creador}`)).rows;

				// Ejecutamos la consulta de inserción
				await con.query(`
				insert into codificacion.cod_usuario (nombres, pr_apellido, sg_apellido, password, login, telefono, rol_id, usucre, turno, cod_supvsr) 
				values (UPPER ('${nombres}'),UPPER('${pr_apellido}'),UPPER('${sg_apellido}'), md5('123456'),LOWER('${nomUsu}'),'${telefono}', ${rol_id}, '${qr3[0].login}', '${turnoAux}', ${id_usuario})
				`);
			} else {
				n++;
			}
		}

		// respuesta
		res.status(200).json({
			success: true,
			message: 'Tecnico de Contingencia adicionado correctamente.'
		})
		return;
	}

}



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
	let id = req.params.id;
	var {
		nombres,
		pr_apellido,
		sg_apellido,
		telefono,
		rol_id,
		id_modificador
	} = req.body;

	console.log("---------->id: ", id);
	console.table(req.body)

	// rol_id = 6; //  Técnico de contingencia
	if (rol_id === 6) {
	}

	// rol_id = 5; // Técnico en codificación
	if (rol_id === 5) {
		// Averiguamos el login del usuario modificador
		const qr3 = await (await con.query(`select login from codificacion.cod_usuario where id_usuario=${id_modificador}`)).rows;

		// Ejecutamos la consulta de modificación


		try {
			await con.query(`
			UPDATE codificacion.cod_usuario SET nombres = UPPER('${nombres}'), pr_apellido = UPPER('${pr_apellido}'), sg_apellido = UPPER('${sg_apellido}'), telefono = '${telefono}', usumod=LOWER('${qr3[0].login}'), fecmod=now() 
			WHERE id_usuario = ${id}
		`);
		} catch (error) {
			console.log(error);
		}

		// respuesta
		res.status(200).json({
			success: true,
			message: 'Técnico en Codificación modificado correctamente.'
		})
	}

	// rol_id = 4; // Supervisor de codificación
	if (rol_id === 4) {
	}

	// rol_id = 3; // Jefe de turno
	if (rol_id === 3) {
	}

};



const modificaUsuario_ = async (req, res) => {
	let id = req.params.id;
	var params = req.body;

	console.log("id: ", id);
	console.table(params)


	// rol_id = 5; // Técnico en codificación
	if (params.rol_id === 5) {
		const query = {
			text: `UPDATE ${esquema}.cod_usuario SET nombres = UPPER($1), pr_apellido = UPPER($2), sg_apellido = UPPER($3), telefono = $4, usumod=$5, fecmod=now() 
			WHERE id_usuario = ${id}`,
			values: [
				params.nombres,
				//params.apellidos,
				params.pr_apellido,
				params.sg_apellido,
				//params.login,
				//params.rol_id,
				params.telefono,
				params.usumod,
				//params.turno,
				//params.cod_supvsr,
			],
		};

		await con
			.query(query)
			.then((result) =>
				res.status(200).json({
					success: true,
					message: 'Usuario modificado correctamente.'
				})
			)
			.catch((e) => console.error(e.stack));

	}

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
		u.pr_apellido,
		u.sg_apellido,
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
	devuelveJefesTurno,
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