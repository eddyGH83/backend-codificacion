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
const login = async (req, res) => {
    var { usu, pass } = req.body;

    console.log("----login----");


    const query = `
        SELECT * FROM codificacion.cod_usuario u 
        join codificacion.cod_rol r on u.rol_id = r.rol_id 
        where u.estado = 'A' and u.login='${usu}' and  u.password = md5('${pass}')`;

    await con.query(query, (err, result) => {
        if (err) {
            console.log("ERROR: ", err);
            return res.status(400).json({
                success: false,
                message: "Error en la consulta",
                data: []
            });
        }
        if (result.rows.length == 1) {
            return res.status(200).json({
                success: true,
                message: "Usuario encontrado",
                data: result.rows[0]
            });
        } else {
            return res.status(200).json({
                success: false,
                message: "Usuario no encontrado",
                data: []
            });
        }
    })
}


const devuelveMenu = async (req, res) => {

    var { id_usuario } = req.body

    const query = `
    select r.menu from codificacion.cod_rol r
    join codificacion.cod_usuario u on r.rol_id = u.rol_id
    where u.id_usuario= ${id_usuario}
    `;

    await con.query(query, (err, result) => {
        res.status(200).json(result.rows[0].menu);
    })
}

/* 
Hola
*/


module.exports = {
    login,
    devuelveMenu
};