const { Router } = require('express');
const router = Router();


const { 
    cargarDatos,
    normalizaRespuesta,
    codificaNormalizada,
    codificacionNormalizadaUpd,
    preguntasPorDepartamentoCod,
    preguntasPorDepartamentoSup,
    codificadores,
    cargarParaCodificarSimple,
    cargarParaCodificarDoble,
    codificadoresConCarga,
    supervisores,
    reasignar,
    reasignarsup,
    getCantidadDptoPregArea,
    updateInicializarUsr,
    updateInicializarUsrSup,
    updateAsignado,
    updateReAsignado,
    updateAsignadoSup,
    preguntasPorUsuario,
    preguntasPorUsuDual,
    preguntasPorVerificar,
    variablesApoyo,
    catalogoCodificacion,
    updatePreguntaVerif,
    updatePreguntaSimple,
    updatePreguntaSimpleAnular,
    //updatePregunta,
    anularAnteriorVerif,
    anularAnterior,
    updateVerificador,
    updateVerificado,
    devuelvePreguntas,
    devuelvePreguntasCodificado,
    devuelvePreguntasSup,
    devuelvePreguntaUsrSup,
    muestraCargaDatos,
    getCantidadCarga,
    cargarDatosGlobal,
    updateOcuAct
}= require('../controllers/codificacion.controller');

/* router.post('/', usuariosPost)  getCantidadCarga cargarDatosGlobal*/
router.get('/getCantidadCarga', getCantidadCarga);
router.get('/muestraCargaDatos', muestraCargaDatos);
router.post('/cargarDatos', cargarDatos);
router.post('/cargarDatosGlobal', cargarDatosGlobal);
router.get('/normalizaRespuesta', normalizaRespuesta);
router.get('/codificaNormalizada', codificaNormalizada);
router.get('/codificacionNormalizadaUpd',codificacionNormalizadaUpd);
////ASIGNACION CODIFICADORES Y SUPERVISORES////////////
router.post('/preguntasPorDepartamentoCod', preguntasPorDepartamentoCod);
router.post('/preguntasPorDepartamentoSup', preguntasPorDepartamentoSup);
router.post('/cargarParaCodificarSimple', cargarParaCodificarSimple);
router.post('/cargarParaCodificarDoble', cargarParaCodificarDoble);

router.get('/codificadores/:id', codificadores);
router.post('/codificadoresConCarga', codificadoresConCarga);
router.get('/supervisores', supervisores);
router.post('/reasignar', reasignar);
router.post('/reasignarsup', reasignarsup);
router.post('/getCantidadDptoPregArea', getCantidadDptoPregArea);
router.post('/updateInicializarUsr', updateInicializarUsr);
router.post('/updateInicializarUsrSup', updateInicializarUsrSup);
router.post('/updateAsignado/:id', updateAsignado);
router.post('/updateReAsignado/:id', updateReAsignado);
router.post('/updateAsignadoSup/:id', updateAsignadoSup);
/////////////CODIFICACION
router.post('/preguntasPorUsuario', preguntasPorUsuario);//preguntasPorUsuDual
router.post('/preguntasPorUsuDual', preguntasPorUsuDual);
router.post('/preguntasPorVerificar', preguntasPorVerificar);
router.post('/variablesApoyo', variablesApoyo);
router.get('/catalogoCodificacion/:enviar', catalogoCodificacion);
router.put('/updatePreguntaVerif/:id', updatePreguntaVerif);
router.post('/updatePreguntaSimple', updatePreguntaSimple);
router.post('/updatePreguntaSimpleAnular', updatePreguntaSimpleAnular);


//router.put('/updatePregunta/:id', updatePregunta);
router.put('/anularAnteriorVerif/:id', anularAnteriorVerif);
router.put('/anularAnterior/:id', anularAnterior);
router.put('/updateVerificador/:id', updateVerificador);
router.post('/updateVerificado/:user', updateVerificado);
////////CODIFICACCION SELECCIONAR
router.get('/devuelvePreguntas', devuelvePreguntas);
router.post('/devuelvePreguntasCodificado', devuelvePreguntasCodificado);
router.post('/devuelvePreguntasSup', devuelvePreguntasSup);
router.post('/devuelvePreguntaUsrSup', devuelvePreguntaUsrSup);
router.post('/updateOcuAct', updateOcuAct);
module.exports = router;