const { Router } = require('express');
const router = Router();

const { devuelveUsuarios, 
        devuelveJefesTurno,
        devuelveRoles,
        registraUsuario,
        modificaUsuario,
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
    } = require('../controllers/usuarios.controller');

router.post('/devuelveUsuarios', devuelveUsuarios);
router.get('/devuelveJefesTurno', devuelveJefesTurno);
router.post('/devuelveRoles', devuelveRoles);
router.post('/registraUsuario', registraUsuario);//validarUsuario
router.post('/validarUsuario', validarUsuario);
router.put('/modificaUsuario/:id', modificaUsuario);
router.put('/actualizaPass/:id', actualizaPass);
router.post('/deleteUsuario', deleteUsuario);
router.get('/resetPassUsuario/:id', resetPassUsuario);
router.get('/devuelveUnUsuario/:id', devuelveUnUsuario);
router.get('/devuelveSupervisor', devuelveSupervisor);
router.get('/devuelveSupervisores', devuelveSupervisores);
router.post('/actualizaNroCelular', actualizaNroCelular);
router.post('/mostrarDatosUsuario', mostrarDatosUsuario);
router.post('/modificarPass', modificarPass);

module.exports = router;