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
    supervisoresSinCarga,
	supervisoresConCarga,
    supervisores,
    reasignar,
    reasignarsup,
    getCantidadDptoPregArea,
    updateInicializarUsr,
    updateInicializarUsrSup,
    updateAsignado,
    updateReAsignado,
    updateAsignadoSup,
    updateReAsignadoSup,
    preguntasPorUsuario,
    preguntasPorUsuDual,
    preguntasPorVerificar,
    variablesApoyo,
    catalogoCodificacion,
    updatePreguntaVerif,
    updatePreguntaSimple,
    updatePreguntaSimpleAnular,
    updatePreguntaDobleOcuAct,
    //updatePreguntaDobleAct,
	updatePreguntaDobleAnular,
    //updatePregunta,
    anularAnteriorVerif,
    anularAnterior,
    updateVerificador,
    updateVerificado,
    devuelvePreguntas,
    devuelvePreguntasCodificado,
    devuelvePreguntasSupervision,
    devuelveCargaParaSupervision,
    devuelvePreguntasSup,
    devuelvePreguntaUsrSup,
    muestraCargaDatos,
    getCantidadCarga,
    cargarDatosGlobal,
    updateOcuAct,
    updateCargaSupervision,
    cargarParaSupervisionSimple,
	cargarParaSupervisionDoble,
    updatePreguntaSimpleCorreccion,
    updatePreguntaDobleCorreccion,
    updatePreguntaSimpleCheck
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
router.get('/supervisoresSinCarga/:id', supervisoresSinCarga);
router.get('/supervisoresConCarga/:id', supervisoresConCarga);

router.get('/supervisores', supervisores);
router.post('/reasignar', reasignar);
router.post('/reasignarsup', reasignarsup);
router.post('/getCantidadDptoPregArea', getCantidadDptoPregArea);
router.post('/updateInicializarUsr', updateInicializarUsr);
router.post('/updateInicializarUsrSup', updateInicializarUsrSup);
router.post('/updateAsignado/:id', updateAsignado);
router.post('/updateReAsignado/:id', updateReAsignado);
router.post('/updateAsignadoSup/:id', updateAsignadoSup);
router.post('/updateReAsignadoSup/:id', updateReAsignadoSup);
/////////////CODIFICACION
router.post('/preguntasPorUsuario', preguntasPorUsuario);//preguntasPorUsuDual
router.post('/preguntasPorUsuDual', preguntasPorUsuDual);
router.post('/preguntasPorVerificar', preguntasPorVerificar);
router.post('/variablesApoyo', variablesApoyo);
router.get('/catalogoCodificacion/:enviar', catalogoCodificacion);
router.put('/updatePreguntaVerif/:id', updatePreguntaVerif);
router.post('/updatePreguntaSimple', updatePreguntaSimple);
router.post('/updatePreguntaSimpleAnular', updatePreguntaSimpleAnular);
router.post('/updatePreguntaDobleOcuAct', updatePreguntaDobleOcuAct);
// router.post('/updatePreguntaDobleAct', updatePreguntaDobleAct);
router.post('/updatePreguntaDobleAnular', updatePreguntaDobleAnular);

//router.put('/updatePregunta/:id', updatePregunta);
router.put('/anularAnteriorVerif/:id', anularAnteriorVerif);
router.put('/anularAnterior/:id', anularAnterior);
router.put('/updateVerificador/:id', updateVerificador);
router.post('/updateVerificado/:user', updateVerificado);
////////CODIFICACCION SELECCIONAR
router.get('/devuelvePreguntas', devuelvePreguntas);
router.post('/devuelvePreguntasCodificado', devuelvePreguntasCodificado);
router.post('/devuelveCargaParaSupervision', devuelveCargaParaSupervision);

router.post('/devuelvePreguntasSupervision', devuelvePreguntasSupervision);
router.post('/devuelvePreguntasSup', devuelvePreguntasSup);
router.post('/devuelvePreguntaUsrSup', devuelvePreguntaUsrSup);
router.post('/updateOcuAct', updateOcuAct);
router.post('/updateCargaSupervision', updateCargaSupervision);

router.post('/cargarParaSupervisionSimple', cargarParaSupervisionSimple);
router.post('/cargarParaSupervisionDoble', cargarParaSupervisionDoble);
router.post('/updatePreguntaSimpleCorreccion', updatePreguntaSimpleCorreccion);
router.post('/updatePreguntaDobleCorreccion', updatePreguntaDobleCorreccion);
router.post('/updatePreguntaSimpleCheck', updatePreguntaSimpleCheck);


module.exports = router;