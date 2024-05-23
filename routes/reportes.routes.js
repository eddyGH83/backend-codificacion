const { Router } = require('express');
const router = Router();
///Para conexion de con la base de datos
const con = require('../db/config');
///Se requiere que este presente para la subida de los archivos
const bodyParser = require('body-parser');
const multiPart = require('connect-multiparty');
///Libreria para el tratamiento de Excel
const Excel = require('exceljs');

/*****************************************
 * ********---------**************
 * PARA LA IMPORTACIÓN Y CREACION DE RUTAS USAR ESTE ESPACIO
*/

/// Llenar o importar las rutas de los reportes aquí
const { repCodificados, 
        repHoyAyerMes,
        repOdbc_npioc,
        repOdbc_migracion,
        repOdbc,
        reporte1,
        reporte2,
        reporte3,
        reporte4,
        reporte5,
        reporte6,
        reporte7,
        reporte8,
        reporte9,
        reporte10,
        reporte11,
        reporte12,        
        
    } = require('../controllers/reportes.controller');

    /////Definir las rutas Aqui
router.get('/repCodificados', repCodificados);
router.get('/repHoyAyerMes', repHoyAyerMes);
router.get('/repOdbc_npioc/:fechaInicial/:fechaFinal', repOdbc_npioc);
router.get('/repOdbc_migracion/:fechaInicial/:fechaFinal', repOdbc_migracion);
router.get('/repOdbc/:fechaInicial/:fechaFinal', repOdbc);

//////RUTAS DE LOS REPORTES
router.get('/reporte1', reporte1);
router.get('/reporte2', reporte2);
router.get('/reporte3', reporte3);
router.get('/reporte4', reporte4);
router.get('/reporte5', reporte5);
router.get('/reporte6', reporte6);
router.get('/reporte7', reporte7);
router.get('/reporte8', reporte8);
router.get('/reporte9', reporte9);
router.get('/reporte10', reporte10);
router.get('/reporte11', reporte11);
router.get('/reporte12', reporte12);

/*****************************************
 * ********---------**************
 * CIERRE DEL ESPACIO PARA LA IMPORTACIÓN Y CREACION DE RUTAS
 * ***********--------------**************
*/

/*******************************************---------------
 * ****************************************---------------
 * AQUI LA RUTA Y METODO QUE PERMITE SUBIR EL EXCEL Y ALMACENAR EN LA BASE DE DATOS
 * **********************************-------------------------
 */

const multiPartMiddleware = multiPart({
    uploadDir: './subidas'
})

router.post('/subirOdbc_npioc/:login', multiPartMiddleware, (req, res)=>{ 
    //req.body.nn;
    //console.log(req.body.nn);
    let workbook = new Excel.Workbook();
    //let query = ''
    let sw = 0
    //Previamente borramos todo el contenido de la tabla cod_tmp_odbc_oa
    let query = ''                       
    query = `delete from codificacion.cod_tmp_odbc_npioc;`
        con.query(query)
        .then(result => 
            sw = 1
        )
        .catch(e => console.error(e.stack))

    //foreach recorre todos los archivos enviados (Nuestro caso solo 1)
    req.files.uploads.forEach(element => {
        //Lee la carpeta y el nombre del archivo con el que se guarda
        filePath = element.path;
        //Lee o abre el archivo en modo lectura
        workbook.xlsx.readFile(filePath).then(()=>{
            //Recorre todas las hojas que están incluidas en el archivo
            for (let index = 0; index < workbook.worksheets.length; index++) {
                //muestra el nombre o etiqueta de la Hoja
                console.log(workbook.worksheets[index].name)
                //Lee la primera fila de la Hoja (En nuestro caso el título de los campos [id_informante, id_pregunta, id_encuesta, codigo])
                let row = workbook.worksheets[index].getRow(1);
                //Recorremos todas las filas con datos, hasta encontrar una fila sin datos
                for (let i = 2; row.values.length > 0; i++) {
                    //Leemos la fila i para procesarla
                    row = workbook.worksheets[index].getRow(i);
                    console.log(row.values)
                    //Hacemos el if porque la última pasada la fila esta vacía
                    if(row.values.length > 0){
                        //const query = `insert into codificacion.cod_tmp_odbc_oa (id_informante, id_pregunta, id_encuesta, codigo) values
                        //const query = `insert into codificacion.cod_tmp_odbc_oa (id_informante, cod_rev_cob, cod_rev_caeb) values


                        let query1 = ''                       
                        query1 = `insert into codificacion.cod_tmp_odbc_npioc (id_informante, id_pregunta, cod_rev_npioc) values
                            ('${row.values[1]}', '${row.values[2]}', '${row.values[3]}');`
                            con.query(query1)
                            .then(result => 
                                sw = 1
                            )
                            .catch(e => console.error(e.stack))

                    }                    
                }

                let query2=''
                query2 = `update codificacion.cod_encuesta_codificacion ceco
                set codigocodif_v2=x.cod_rev_npioc, usuverificador2='${req.params.login}', fecverificador2=now(), estado='VERIFICADO'
                from (select t.id_informante, ceco.codigocodif_v1, 
                    (case when t.cod_rev_npioc='undefined' or t.cod_rev_npioc='' or t.cod_rev_npioc isnull 
                          then (case when not ceco.codigocodif_v2 isnull and ceco.codigocodif_v2<>'' then ceco.codigocodif_v2 
                                     when not ceco.codigocodif_v1 isnull and ceco.codigocodif_v1<>'' then ceco.codigocodif_v1 
                                else ceco.codigocodif end) 
                          else t.cod_rev_npioc end)cod_rev_npioc, 
                    ceco.id_pregunta 
                    from codificacion.cod_tmp_odbc_npioc t
                    join codificacion.cod_encuesta_codificacion ceco on t.id_informante=ceco.id_informante and ceco.id_pregunta=t.id_pregunta ) x
                where ceco.id_informante=x.id_informante and ceco.id_pregunta=x.id_pregunta;`
console.log(query2);
                    con.query(query2)
                    .then(result => 
                        sw = 1
                    )
                    .catch(e => console.error(e.stack))
          
            }
        }).catch((error)=>{
            console.error("No encontramos el archivo excel. Error: ", error);
         });
    });

    //console.log(query2)  
    res.status(200).json({
        'message' : 'Datos Actualizados Correctamente'
    });
});

router.post('/subirOdbc_migracion/:login', multiPartMiddleware, (req, res)=>{ 
    //req.body.login.login;

    let workbook = new Excel.Workbook();
    //let query = ''
    let sw = 0
    //Previamente borramos todo el contenido de la tabla cod_tmp_odbc_migracion
    let query = ''                       
    query = `delete from codificacion.cod_tmp_odbc_migracion;`
        con.query(query)
        .then(result => 
            sw = 1
        )
        .catch(e => console.error(e.stack))

    //foreach recorre todos los archivos enviados (Nuestro caso solo 1)
    req.files.uploads.forEach(element => {
        //Lee la carpeta y el nombre del archivo con el que se guarda
        filePath = element.path;
        //Lee o abre el archivo en modo lectura
        workbook.xlsx.readFile(filePath).then(()=>{
            //Recorre todas las hojas que están incluidas en el archivo
            for (let index = 0; index < workbook.worksheets.length; index++) {
                //muestra el nombre o etiqueta de la Hoja
                console.log(workbook.worksheets[index].name)
                //Lee la primera fila de la Hoja (En nuestro caso el título de los campos [id_informante, id_pregunta, id_encuesta, codigo])
                let row = workbook.worksheets[index].getRow(1);
                //Recorremos todas las filas con datos, hasta encontrar una fila sin datos
                for (let i = 2; row.values.length > 0; i++) {
                    //Leemos la fila i para procesarla
                    row = workbook.worksheets[index].getRow(i);
                    console.log(row.values)
                    //Hacemos el if porque la última pasada la fila esta vacía
                    if(row.values.length > 0){
                        //const query = `insert into codificacion.cod_tmp_odbc_oa (id_informante, id_pregunta, id_encuesta, codigo) values
                        //const query = `insert into codificacion.cod_tmp_odbc_oa (id_informante, cod_rev_cob, cod_rev_caeb) values


                        let query1 = ''                       
                        query1 = `insert into codificacion.cod_tmp_odbc_migracion (id_informante, id_pregunta, cod_rev_mun, cod_rev_pais) values
                            ('${row.values[1]}', '${row.values[2]}', '${row.values[3]}', '${row.values[4]}');`
                            con.query(query1)
                            .then(result => 
                                sw = 1
                            )
                            .catch(e => console.error(e.stack))

                    }                    
                }

                let query2=''
                query2 = `
                update codificacion.cod_encuesta_codificacion ceco
                set codigocodif_v2=x.cod_rev, usuverificador2='${req.params.login}', fecverificador2=now(), estado='VERIFICADO'
                from (select t.id_informante, 
                (case when t.cod_rev_mun='undefined' or t.cod_rev_mun='' or t.cod_rev_mun isnull 
                      then (case when not ceco.codigocodif_v2 isnull and ceco.codigocodif_v2<>'' then ceco.codigocodif_v2 
                                 when not ceco.codigocodif_v1 isnull and ceco.codigocodif_v1<>'' then ceco.codigocodif_v1 
                      else ceco.codigocodif end) 
                else t.cod_rev_mun end)cod_rev, ceco.id_pregunta 
                from codificacion.cod_tmp_odbc_migracion t
                join codificacion.cod_encuesta_codificacion ceco on t.id_informante=ceco.id_informante and ceco.id_pregunta=t.id_pregunta and ceco.id_pregunta in (95,101,105) 
                
                union all
                select t.id_informante, 
                (case when t.cod_rev_pais='undefined' or t.cod_rev_pais='' or t.cod_rev_pais isnull 
                      then (case when not ceco.codigocodif_v2 isnull and ceco.codigocodif_v2<>'' then ceco.codigocodif_v2 
                                 when not ceco.codigocodif_v1 isnull and ceco.codigocodif_v1<>'' then ceco.codigocodif_v1 
                      else ceco.codigocodif end) 
                else t.cod_rev_pais end)cod_rev, ceco.id_pregunta 
                from codificacion.cod_tmp_odbc_migracion t
                join codificacion.cod_encuesta_codificacion ceco on t.id_informante=ceco.id_informante and ceco.id_pregunta=t.id_pregunta and ceco.id_pregunta in (1001,1002,1003,1004,1005,97,103,107) 
                
                union all
                select t.id_informante, 
                (case when t.cod_rev_mun='undefined' or t.cod_rev_mun='' or t.cod_rev_mun isnull 
                      then (case when not ceco.codigocodif_v2 isnull and ceco.codigocodif_v2<>'' then ceco.codigocodif_v2 
                                 when not ceco.codigocodif_v1 isnull and ceco.codigocodif_v1<>'' then ceco.codigocodif_v1 
                      else ceco.codigocodif end) 
                else t.cod_rev_mun end)cod_rev, ceco.id_pregunta 
                from codificacion.cod_tmp_odbc_migracion t
                join codificacion.cod_encuesta_codificacion ceco on t.id_informante=ceco.id_informante and ceco.id_pregunta=t.id_pregunta and ceco.id_pregunta in (129) and (ceco.respuesta_apoyo = '3' or ceco.respuesta_apoyo ='' or ceco.respuesta_apoyo is null)
                
                union all
                select t.id_informante, 
                (case when t.cod_rev_pais='undefined' or t.cod_rev_pais='' or t.cod_rev_pais isnull 
                      then (case when not ceco.codigocodif_v2 isnull and ceco.codigocodif_v2<>'' then ceco.codigocodif_v2 
                                 when not ceco.codigocodif_v1 isnull and ceco.codigocodif_v1<>'' then ceco.codigocodif_v1 
                      else ceco.codigocodif end) 
                else t.cod_rev_pais end)cod_rev, ceco.id_pregunta 
                from codificacion.cod_tmp_odbc_migracion t
                join codificacion.cod_encuesta_codificacion ceco on t.id_informante=ceco.id_informante and ceco.id_pregunta=t.id_pregunta and ceco.id_pregunta in (129) and (ceco.respuesta_apoyo = '4')
                ) x
                where ceco.id_informante=x.id_informante and ceco.id_pregunta=x.id_pregunta;
                `
                    con.query(query2)
                    .then(result => 
                        sw = 1
                    )
                    .catch(e => console.error(e.stack))

            }
            //console.log("req.body.login "+req.body.login);
            console.log(req.params)
        }).catch((error)=>{
            console.error("No encontramos el archivo excel. Error: ", error);
         });
    });

    //console.log(query2)  
    res.status(200).json({
        'message' : 'Datos Actualizados Correctamente'
    });
});


router.post('/subirOdbc/:login', multiPartMiddleware, (req, res)=>{ 
    let workbook = new Excel.Workbook();
    //let query = ''
    let sw = 0
    //Previamente borramos todo el contenido de la tabla cod_tmp_odbc_oa
    let query = ''                       
    query = `delete from codificacion.cod_tmp_odbc_ocu_act;`
        con.query(query)
        .then(result => 
            sw = 1
        )
        .catch(e => console.error(e.stack))

    //foreach recorre todos los archivos enviados (Nuestro caso solo 1)
    req.files.uploads.forEach(element => {
        //Lee la carpeta y el nombre del archivo con el que se guarda
        filePath = element.path;
        //Lee o abre el archivo en modo lectura
        workbook.xlsx.readFile(filePath).then(()=>{
            //Recorre todas las hojas que están incluidas en el archivo
            for (let index = 0; index < workbook.worksheets.length; index++) {
                //muestra el nombre o etiqueta de la Hoja
                console.log(workbook.worksheets[index].name)
                //Lee la primera fila de la Hoja (En nuestro caso el título de los campos [id_informante, id_pregunta, id_encuesta, codigo])
                let row = workbook.worksheets[index].getRow(1);
                //Recorremos todas las filas con datos, hasta encontrar una fila sin datos
                for (let i = 2; row.values.length > 0; i++) {
                    //Leemos la fila i para procesarla
                    row = workbook.worksheets[index].getRow(i);
                    console.log(row.values)
                    //Hacemos el if porque la última pasada la fila esta vacía
                    if(row.values.length > 0){
                        //const query = `insert into codificacion.cod_tmp_odbc_oa (id_informante, id_pregunta, id_encuesta, codigo) values
                        //const query = `insert into codificacion.cod_tmp_odbc_oa (id_informante, cod_rev_cob, cod_rev_caeb) values


                        let query1 = ''                       
                        query1 = `insert into codificacion.cod_tmp_odbc_ocu_act (id_informante, cod_rev_ocupacion, cod_rev_actividad) values
                            ('${row.values[1]}', '${row.values[2]}', '${row.values[3]}');`
                            con.query(query1)
                            .then(result => 
                                sw = 1
                            )
                            .catch(e => console.error(e.stack))

                    }                    
                }

                let query2=''
                query2 = `
                update codificacion.cod_encuesta_codificacion ceco
                set codigocodif_v2=x.cod_rev, usuverificador2='${req.params.login}', fecverificador2=now(), estado='VERIFICADO'
                from (
                select t.id_informante, ceco.codigocodif_v1, 
                (case when t.cod_rev_ocupacion='undefined' or t.cod_rev_ocupacion='' or t.cod_rev_ocupacion isnull 
                      then (case when not ceco.codigocodif_v2 isnull and ceco.codigocodif_v2<>'' then ceco.codigocodif_v2 
                                 when not ceco.codigocodif_v1 isnull and ceco.codigocodif_v1<>'' then ceco.codigocodif_v1 
                      else ceco.codigocodif end) 
                else t.cod_rev_ocupacion end)cod_rev, ceco.id_pregunta 
                from codificacion.cod_tmp_odbc_ocu_act t
                join codificacion.cod_encuesta_codificacion ceco on t.id_informante=ceco.id_informante and ceco.id_pregunta=125 
                
                union all
                select t.id_informante, ceca.codigocodif_v1, 
                (case when t.cod_rev_actividad='undefined' or t.cod_rev_actividad='' or t.cod_rev_actividad isnull 
                      then (case when not ceca.codigocodif_v2 isnull and ceca.codigocodif_v2<>'' then ceca.codigocodif_v2 
                                 when not ceca.codigocodif_v1 isnull and ceca.codigocodif_v1<>'' then ceca.codigocodif_v1 
                      else ceca.codigocodif end) 
                else t.cod_rev_actividad end)cod_rev,ceca.id_pregunta 
                from codificacion.cod_tmp_odbc_ocu_act t
                join codificacion.cod_encuesta_codificacion ceca on t.id_informante=ceca.id_informante and ceca.id_pregunta=127 
                ) x
                where ceco.id_informante=x.id_informante and ceco.id_pregunta=x.id_pregunta;`
                    con.query(query2)
                    .then(result => 
                        sw = 1
                    )
                    .catch(e => console.error(e.stack))
            

            }
        }).catch((error)=>{
            console.error("No encontramos el archivo excel. Error: ", error);
         });
    });

    //console.log(query2)  
    res.status(200).json({
        'message' : 'Datos Actualizados Correctamente'
    });
});

/*******************************************---------------FINNNNNN
 * ****************************************---------------FINNNNNNN
 * AQUI TERMINA LA RUTA Y METODO QUE PERMITE SUBIR EL EXCEL Y ALMACENAR EN LA BASE DE DATOS
 * **********************************---------------------FINNNNNNN
 */

module.exports = router;