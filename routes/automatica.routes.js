const { Router } = require('express');
const router = Router();

// Importar funciones de controlador
const { 
    cargaDisponible
}= require('../controllers/automatica.controller');







// Definir rutas
router.post('/cargaDisponible', cargaDisponible);


module.exports = router;