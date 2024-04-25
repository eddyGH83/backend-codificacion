const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verificaToken } = require('../middlewares/autenticacion');


const { 
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
}= require('../controllers/creacion.controller');

/* router.post('/', usuariosPost)  */

router.get('/departamento', getDepartamento);
router.get('/departamentoAsignado/:id', getDepartamentoAsignado);
router.get('/rol', getRol);
router.get('/omision', getOmision);
router.get('/usuarios/:id', getUsuarios);
router.post('/usuarios', postUsuarios);
router.put('/usuarios', putUsuarios);
router.delete('/usuarios/:id', deleteUsuarios);
router.put('/usuarios/:id', putUsuariosId);
router.put('/actualizarpass/:id', actualizarPass);

module.exports = router;