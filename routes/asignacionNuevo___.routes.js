const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { verificaToken } = require('../middlewares/autenticacion');


const { getValidarIdEstadoUsuario, 
        getRespuestaOcupacion,
        getNombreCatalogo,
        getRespuestas,
        getRespuestaSinCodificar,
        getDiccionario,
        validar,
        asignarCodificacion,
        devuelvePreguntasUsuario,
        devuelvePreguntasUsuarioVerificado,
        devuelveUsuarios,
        registroUsuarios,
        modificarUsuarios,
        eliminarUsuarios,
        devuelvePreguntasCodificado,
        devuelvePreguntas,
        devuelveCatalogo,
        catalogoPorRespuesta,
        updatePregunta,
        updatePreguntaVerif,
        anularAnterior,
        anularAnteriorVerif,
        respuestasObservadas,
        updateVerificador,
        cargarDatos, 
        preguntasPorDepartamentoDisperso,
        preguntasPorDepartamentoAmanzanado,
        updateAsignacion,
        codificadores,
        insertCatalogo,
        updateCatalogo,
        updateEstadoCatalogo,
        /* blanquearDatos, */
        reasignarCodificador,
        reasignar,
        inicioCodificados,
        inicioElaborados,
        inicioVerificados,
        inicioObservados,
        updateAsignado,
        updateInicializar,
        reporteDiario,
        reporteDiarioVerificado,
        reporteVerificados,
        reporteVerificadosAutomatico,
        verificadosAutomatico,
        verificarCantidad,
        reportePendientes, 
        variableDepto,
        variableUsuario,
        /* sinCodificar, */
        codificado,
        codificacionAutomatica,
        codificacionUnoUnoSelec,
        codificacionUnoUnoUpd,
        totalRegistros,
        validarRegistros,
        variablesApoyo,
        devuelvePreguntasVerificadas,
        /* catalogoCompleto */
        catalogoCodificacion,
        reporteAutomatico,
        codificaAutomatico,
        reporteAsistido,
        codificaNormalizada,
        normalizaRespuesta,
        reporteCodficacion,
        reporteCodAvance,
        devuelveCorrector,
        validarCorrector, 
        updateCorrector,
        insertCorrector} = require('../controllers/asignacionNuevo.controller');




router.get('/validar/:id/:estado/:usuario', getValidarIdEstadoUsuario);
router.get('/ocupacion', getRespuestaOcupacion);
router.get('/nombreCatalogo', getNombreCatalogo);
router.get('/respuestas', getRespuestas);
router.get('/sinCodificar', getRespuestaSinCodificar);
router.get('/diccionario', getDiccionario);
router.get('/validar/:18310/:estado/:usuario', validar); //revisar
router.post('', asignarCodificacion);
router.post('/preguntasPorUsuario', devuelvePreguntasUsuario);
router.post('/preguntasVerificadas', devuelvePreguntasUsuarioVerificado);
router.post('/preguntasCodificado', devuelvePreguntasCodificado);
router.get('/preguntas', devuelvePreguntas);
router.get('/usuarios', devuelveUsuarios);
router.post('/usuarios', registroUsuarios);
router.put('/usuarios/:id', modificarUsuarios);
router.put('/eliminarUsuarios/:id', eliminarUsuarios);
router.post('/catalogo', devuelveCatalogo);
router.post('/catalogoPorRespuesta/', catalogoPorRespuesta);
router.put('/pregunta/:id', updatePregunta);
router.put('/preguntaVerif/:id', updatePreguntaVerif);
router.put('/anterior/:id', anularAnterior);
router.put('/anteriorVerif/:id', anularAnteriorVerif);
router.get('/respuestasObservadas', respuestasObservadas);
router.put('/verificador/:id', updateVerificador);
router.post('/cargarDatos', cargarDatos);
router.get('/preguntasPorDepartamentoDisperso', preguntasPorDepartamentoDisperso);
router.get('/preguntasPorDepartamentoAmanzanado', preguntasPorDepartamentoAmanzanado);
router.post('/asignacion', updateAsignacion);
router.get('/codificadores', codificadores);
router.post('/nuevoCatalogo', insertCatalogo);
router.put('/modificarCatalogo/:id', updateCatalogo);
router.put('/modificarEstadoCatalogo/:id', updateEstadoCatalogo);
// router.put('/blanquearDatos/:id', blanquearDatos);
router.get('/reasignarCodificador', reasignarCodificador);
router.post('/reasignar', reasignar);
router.get('/codificados', inicioCodificados);
router.get('/elaborados', inicioElaborados);
router.get('/verificados', inicioVerificados);
router.get('/observados', inicioObservados);
router.put('/updateAsignado/:id', updateAsignado);
router.post('/updateInicializar', updateInicializar);
router.get('/reporteDiario', reporteDiario);
router.get('/reporteDiarioVerificado', reporteDiarioVerificado);
router.post('/reporteVerificados', reporteVerificados);
router.post('/reporteVerificadosAutomatico', reporteVerificadosAutomatico);
router.get('/verificadosAutomatico', verificadosAutomatico);
router.post('/verificarCantidad', verificarCantidad);
router.get('/reportePendientes', reportePendientes);
router.get('/variableDepto', variableDepto);
router.get('/variableUsuario', variableUsuario);
// router.get('/sinCodificar', sinCodificar);
router.get('/codificado', codificado);
router.post('/codificacionAutomatica', codificacionAutomatica);
router.post('/totalRegistros', totalRegistros);
router.post('/variablesApoyo', variablesApoyo);
router.post('/devuelvePreguntasVerificadas', devuelvePreguntasVerificadas);
router.post('/validarRegistros', validarRegistros);
// router.get('/catalogoCompleto', catalogoCompleto);
/* router.get('/departamento', getDepartamento); */
router.get('/catalogoCodificacion/:enviar', catalogoCodificacion);
router.get('/reporteAutomatico', reporteAutomatico);
router.post('/codificaAutomatico', codificaAutomatico);
router.get('/codificacionUnoUnoSelec',codificacionUnoUnoSelec);
router.get('/codificacionUnoUnoUpd',codificacionUnoUnoUpd);
router.get('/reporteAsistido', reporteAsistido);

router.get('/codificaNormalizada', codificaNormalizada);
router.get('/normalizaRespuesta', normalizaRespuesta);
router.get('/reporteCodficacion', reporteCodficacion);//reporteCodAvance
router.get('/reporteCodAvance', reporteCodAvance);
router.get('/devuelveCorrector', devuelveCorrector);
router.post('/validarCorrector', validarCorrector);
router.post('/insertCorrector', insertCorrector);
router.put('/updateCorrector/:id', updateCorrector);





module.exports = router;