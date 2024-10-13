const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');
const esquema = "codificacion";


// Calcula carga disponible por departamento
const cargaDisponible = async (req, res) => {
	const {
		departamento,
		variable
	} = req.body;

	// 
	if (variable == 'doble') {
		try {
			// consulta sql
			const sql = `
		   SELECT count(1) FROM estructuras.inicial0_capitulo_personas 
		   where ((not p49 is null and  trim(p49)<>'') or (not p51 is null and  trim(p51)<>'') ) AND cod_depto= '${departamento}'`

			// ejecutar consulta
			const result = (await con.query(sql)).rows;

			console.table(result);

			// respuesta
			res.status(200).json({
				success: true,
				message: 'Carga disponible calculada correctamente.',
				data: result
			})
		} catch (error) {
			// respuesta
			res.status(200).json({
				success: false,
				message: error
			})
		}

	}

	if (variable == 'simple') {
		return;
	}


}

// Isnerción de registroa para codificación
const insercionDeRegistros = async (req, res) => {
	const {
		departamento,
		variable
	} = req.body;

	try {

	} catch (error) {
		// respuesta
		res.status(200).json({
			success: false,
			message: error
		})

	}

	// Inserción de variable doble: ocu_act
	if (variable == 'doble') {
		try {
			// consulta sql
			const sql = `
				INSERT INTO codificacion.cod_p49_p51_tmp_222222 (secuencial, i00, nro, p26, p41a, p41b, p45, p48esp, respuesta_ocu, p50, respuesta_act, p52, p52esp, estado_ocu, estado_act, usucre, feccre,departamento, carga )
				SELECT secuencial, i00, nro, p26, 
				(CASE p41a WHEN 1 THEN 'Ninguno' 
				WHEN 2 THEN 'Curso de alfabetizacion' 
				WHEN 3 THEN 'Inicial' 
				WHEN 4 THEN 'Basico'
				WHEN 5 THEN 'Intermedio'
				WHEN 6 THEN 'Medio'
				WHEN 7 THEN 'Primaria'
				WHEN 8 THEN 'Secundaria'
				WHEN 9 THEN 'Tecnico Medio'
				WHEN 10 THEN 'Tecnico Superior'
				WHEN 11 THEN 'Licenciatura'
				WHEN 12 THEN 'Maestria'
				WHEN 13 THEN 'Doctorado'
				ELSE null END) p41a, 
				(CASE p41b WHEN 99 THEN null ELSE p41b END) p41b,
				(CASE p45 WHEN 1 THEN 'SI' WHEN 2 THEN 'NO' END) as p45, 
				p48esp, p49, 
				(CASE p50 WHEN 1 THEN 'Trabajador(a) por cuenta propia' 
				WHEN 2 THEN 'Empleada(o) u obrera(o)'
				WHEN 3 THEN 'Empleadora(or) u socia(o)'
				WHEN 4 THEN 'Trabajadora(or) familiar sin remuneración'
				WHEN 5 THEN 'Trabajadora(or) del hogar'
				WHEN 6 THEN 'Cooperativista de producción' ELSE NULL END) as p50,  
				p51,     
				(CASE p52 WHEN 1 THEN 'Dentro o junto a esta vivienda'
				WHEN 2 THEN 'Fuera de la vivienda pero en el mismo municipio'
				WHEN 3 THEN 'En otro municipio'
				WHEN 4 THEN 'En otro país' ELSE NULL END) as p52, 
				p52esp, 'ELABORADO', 'ELABORADO', 'admin', now(),
				(case cod_depto when '01' then 'CHUQUISACA' WHEN '02' THEN 'LA PAZ' WHEN '03' THEN 'COCHABAMBA' WHEN '04' THEN 'ORURO' WHEN '05' THEN 'POTOSI' WHEN '06' THEN 'TARIJA' WHEN '07' THEN 'SANTA CRUZ' WHEN '08' THEN 'BENI' WHEN '09' THEN 'PANDO' else null end)	
				,4
					
				FROM estructuras.inicial0_capitulo_personas cc
				--WHERE (not p49 is null or not p51 is null) and (trim(p49)<>'' or trim(p51)<>'');
				where ((not p49 is null and  trim(p49)<>'') or (not p51 is null and  trim(p51)<>'') )
				--	WHERE not ((p49 is null or trim(p49)='') and (p51 is null or trim(p51)=''))
				--and not exists(select id_p49_p51 from codificacion.cod_p49_p51 cp where cp.secuencial = cc.secuencial and cp.i00 = cc.i00  and cp.nro=cc.nro AND departamento<>'ORURO') 
				AND cod_depto='${departamento}'
			`
			// ejecutar consulta
			const result = (await con.query(sql)).rows;

			console.table(result);

			// respuesta
			res.status(200).json({
				success: true,
				message: 'Carga insertada disponible calculada correctamente.',
				data: result
			})
		} catch (error) {
			// respuesta
			res.status(200).json({
				success: false,
				message: error
			})
		}
	}

	// Inserción de variables simples
	if (variable == 'simple') {
		try {
			// consulta sql
			const sql = `


			`
			// ejecutar consulta
			const result = (await con.query(sql)).rows;

			console.table(result);

			// respuesta
			res.status(200).json({
				success: true,
				message: 'Carga insertada disponible calculada correctamente.',
				data: result
			})

		} catch (error) {
			// respuesta
			res.status(200).json({
				success: false,
				message: error
			})
		}
	}
}











//   
const updateCargaSupervision = async (req, res) => {
	const {
		id_usuario,
		tabla_id,
		registros
	} = req.body;

	//console.table(registros);

	// verificar que tabla es
	if (tabla_id === 'p49_p51') {

		try {
			// recorrer registros
			for (let i = 0; i < registros.length; i++) {
				const element = registros[i];
				await con.query(`
			UPDATE codificacion.cod_p49_p51
			SET estado_ocu = 'VERIFICADO', codigocodif_v1_ocu ='${element.codigocodif_ocu}', fecverificador = now(), usuverificador = '${id_usuario}', 
				estado_act = 'VERIFICADO', codigocodif_v1_act ='${element.codigocodif_act}'
			WHERE id_p49_p51 = ${element.id_registro}
			`)
			}

			// respuesta
			res.status(200).json({
				success: true,
				message: 'Carga supervisada correctamente. ' + tabla_id
			})

		} catch (error) {
			res.status(200).json({
				success: false,
				message: 'Error al supervisar carga. ' + tabla_id
			})
		}

	} else {

		try {
			// recorrer registros
			for (let i = 0; i < registros.length; i++) {
				const element = registros[i];
				await con.query(`
			UPDATE codificacion.cod_${tabla_id}
			SET estado = 'VERIFICADO', codigocodif_v1 ='${element.codigocodif}', fecverificador = now(), usuverificador = '${id_usuario}'			
			WHERE id_${tabla_id} = ${element.id_registro}
			`)
			}

			// respuesta
			res.status(200).json({
				success: true,
				message: 'Carga supervisada correctamente. ' + tabla_id
			})
		} catch (error) {
			res.status(200).json({
				success: false,
				message: 'Error al supervisar carga. ' + tabla_id
			})
		}

	}
}



module.exports = {
	updateCargaSupervision,
	cargaDisponible
};
