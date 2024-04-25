const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');
//const { Client } = require('pg');
//const client = new Client({});
//client.connect()

router.post('/signup', function(req, res) {
    if (!req.body.id_departamento || !req.body.login || !req.body.password || !req.body.nombre) {
        return res.status(400).json({ msg: 'Por favor introduzca el Usuario y Contraseña' })
    } else {
        var params = req.body
        const query = {
            text: `INSERT INTO cpv.cod_usuario (nombres, apellidos, login, password, telefono, imagen,  usucre, fecre, rol_id) 
                    VALUES($1, $2, $3, $4, $5, $6, '$7', now(), $8)`,
            values: [params.nombres,
                    params.apellidos, 
                    params.login, 
                    bcrypt.hashSync(params.password, 10), 
                    params.telefono,
                    params.imagen, 
                    params.usucre,
                    params.rol_id],
        }
        client.query(query)
            .then(result => res.status(200).json({
                usuario: req.body.login,
                nombre: req.body.nombre,
                departamento: req.body.apellidos
            }))
            .catch(e => console.error(e.stack))
            .then(() => client.end())
    }
});

router.post('/signin', function(req, res) {
    console.log('xxxxxxxxxxxxxxxxxxxxx')
	console.log(req.body);
    if (!req.body.login || !req.body.password) {
        res.status(400).json({ msg: 'Porfavor introduzca el Usuario y Contraseña' })
    } else {
        const query = {
            text: 'SELECT * FROM cpv.cod_usuario u join cod_rol r on u.rol_id=r.rol_id WHERE login=$1',
            values: [req.body.login],
        }
        client.query(query, (err, result) => {
            console.log(result)
            if (err) { throw err; console.log(query.text);}
            if (result.rowCount == 0) return res.status(400).json({ msg: 'Usuario no valido' })
            if (!bcrypt.compareSync(req.body.password, result.rows[0].password)) {
                return res.status(400).json({ msg: 'Contraseña no valida' })
            }

	    let generador=result.rows[0];
            delete generador.password;
            let token = jwt.sign({
                usuario: generador
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            return res.status(200).json({
                login: req.body.login,
                usuario: generador,
                token,
                menu: generador.menu
            })
        })

    }
});

router.get('/renew', verificaToken, function (req, res) {
    const { token } = req.headers;
    // console.log ('==================== >>>' + token.replace('"','').trim() + '<---');
    var payload = jwt.decode(token.replace('"','').replace('"','').trim(), process.env.SEED);
    if (payload !== null) {
        const { usuario } = payload;
        res.json({
            usuario: usuario,
            token: token,
            menu: usuario.menu
        });
    } else {
        res.status(400).json({ message: 'Token no valido!' })
    }    
});


module.exports = router;