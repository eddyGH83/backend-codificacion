const { Router } = require('express');
const router = Router();

const { repCodificados, 
        repHoyAyerMes,
        devuelveRoles,
        registraUsuario,
        modificaUsuario,
        deleteUsuario,
        resetPassUsuario,
        devuelveUnUsuario,
        actualizaPass,
        validarUsuario
    } = require('../controllers/reportes.controller');

router.get('/repCodificados', repCodificados);
router.get('/repHoyAyerMes', repHoyAyerMes);
router.get('/devuelveRoles', devuelveRoles);
router.post('/registraUsuario', registraUsuario);
router.post('/validarUsuario', validarUsuario);
router.put('/modificaUsuario/:id', modificaUsuario);
router.put('/actualizaPass/:id', actualizaPass);
router.delete('/deleteUsuario/:id', deleteUsuario);
router.get('/resetPassUsuario/:id', resetPassUsuario);
router.get('/devuelveUnUsuario/:id', devuelveUnUsuario);

module.exports = router;