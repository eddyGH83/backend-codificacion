const { Router } = require('express');
const router = Router();

const { devuelveCatalogo,
        validarRegistros,
        insertarCatalogo,
        updateCatalogo,
        updateEstadoCatalogo,
        devuelveCorrector,
        validarCorrector,
        insertCorrector,
        updateCorrector,
        updateEstadoDiccCorr,
        devuelveMatriz,
        validarMatriz,
        insertarMatriz,
        updateMatriz,
        updateEstadoMatriz,
        devuelveCatalogoPorCodigo,
        devuelveDescripcionPorCodigo,
    } = require('../controllers/diccionarios.controller');

router.post('/devuelveCatalogo', devuelveCatalogo);//devuelveCatalogoPorCodigo
router.post('/devuelveCatalogoPorCodigo', devuelveCatalogoPorCodigo);
router.post('/devuelveDescripcionPorCodigo', devuelveDescripcionPorCodigo);
router.post('/validarRegistros', validarRegistros);
router.post('/insertarCatalogo', insertarCatalogo);
router.put('/updateCatalogo/:id', updateCatalogo);
router.put('/updateEstadoCatalogo/:id', updateEstadoCatalogo);
router.get('/devuelveCorrector', devuelveCorrector);
router.post('/validarCorrector', validarCorrector);
router.post('/insertCorrector', insertCorrector);
router.put('/updateCorrector/:id', updateCorrector);
router.put('/updateEstadoDiccCorr/:id', updateEstadoDiccCorr);//
router.get('/devuelveMatriz', devuelveMatriz);
router.post('/validarMatriz', validarMatriz);
router.post('/insertarMatriz', insertarMatriz);
router.put('/updateMatriz/:id', updateMatriz);
router.put('/updateEstadoMatriz/:id', updateEstadoMatriz);

module.exports = router;