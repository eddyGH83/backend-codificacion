const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const con = require('../db/config');


const bodyParser = require('body-parser');
const multiPart = require('connect-multiparty');
const Excel = require('exceljs');
const { cargarDatosGlobal } = require('./codificacion.controller');


// para el excel
const fs = require('fs');
const path = require('path');


const esquema = "codificacion";
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const repCodificados = async (req, res) => {
	const query = {
		text: `select count(*), estado, usucodificador from codificacion.cod_encuesta_codificacion
		group by estado, usucodificador`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const repHoyAyerMes = async (req, res) => {
	const query = {
		text: `select count(*), 'hoy' periodo  from  codificacion.cod_encuesta_codificacion
		where DATE(feccodificador) = (select current_date)
		union
		select count(*), 'ayer' periodo  from  codificacion.cod_encuesta_codificacion
		where DATE(feccodificador) = (select current_date  - '1 day'::INTERVAL)
		union
		select count(*), 'en el mes' periodo from codificacion.cod_encuesta_codificacion
		where extract(year from feccodificador)=extract(year from current_date) and
		extract(month from feccodificador)=extract(month from current_date)`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} fechaInicial 
 * @param {*} fechaFinal 
 */

// odbc_npioc
const repOdbc_npioc = async (req, res) => {

	const query = `

	---NPIOC

WITH updated_p32esp AS (
    UPDATE codificacion.cod_p32esp AS p32esp
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p32esp, cc.descripcion acep_desc_codif, cc_1.descripcion acep_desc_super, cc_2.descripcion acep_desc_jefe
	FROM codificacion.cod_p32esp cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_npioc' 
	left join codificacion.cod_catalogo cc_1 on cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 and cc_1.catalogo='cat_npioc' 
	left join codificacion.cod_catalogo cc_2 on cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 and cc_2.catalogo='cat_npioc' 
	where not codigocodif isnull and codigocodif<>'' 
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
		AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p32esp.id_p32esp = subquery.id_p32esp
    RETURNING p32esp.id_p32esp id_p, p32esp.secuencial, p32esp.nro,'cod_p32esp' num_preg, departamento, 'Pregunta 32' pregunta, 
              p32esp.respuesta respuestaCampo, p32esp.codigocodif codigo_codif, subquery.acep_desc_codif, p32esp.codigocodif_v1 codigo_super, 
              subquery.acep_desc_super,p32esp.codigocodif_v2 codigo_jefe,subquery.acep_desc_jefe,p32esp.usucodificador usuario_codif, 
              p32esp.usuverificador usuario_super,p32esp.usuverificador2 usuario_jefe,'' as cod_rev_jefe, 
              date(p32esp.feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p331 AS (
    UPDATE codificacion.cod_p331 AS p331
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p331, cc.descripcion acep_desc_codif, cc_1.descripcion acep_desc_super,cc_2.descripcion acep_desc_jefe
        FROM codificacion.cod_p331 cec
		left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_idioma' 
		left join codificacion.cod_catalogo cc_1 on cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 and cc_1.catalogo='cat_idioma' 
		left join codificacion.cod_catalogo cc_2 on cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 and cc_2.catalogo='cat_idioma' 
		where not codigocodif isnull and codigocodif<>'' 
		--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
               AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p331.id_p331 = subquery.id_p331
    RETURNING p331.id_p331,p331.secuencial, p331.nro,'cod_p331' num_preg, p331.departamento, 'Pregunta 33 idioma 1' pregunta, 
                p331.respuesta respuestaCampo , p331.codigocodif codigo_codif, subquery.acep_desc_codif, p331.codigocodif_v1 codigo_super, 
                subquery.acep_desc_super,p331.codigocodif_v2 codigo_jefe,subquery.acep_desc_jefe,
                p331.usucodificador usuario_codif, p331.usuverificador usuario_super,p331.usuverificador2 usuario_jefe,'' as cod_rev_jefe, 
                date(p331.feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p332 AS (
    UPDATE codificacion.cod_p332 AS p332
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p332,cc.descripcion acep_desc_codif, cc_1.descripcion acep_desc_super,cc_2.descripcion acep_desc_jefe
	FROM codificacion.cod_p332 cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_idioma' 
	left join codificacion.cod_catalogo cc_1 on cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 and cc_1.catalogo='cat_idioma' 
	left join codificacion.cod_catalogo cc_2 on cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 and cc_2.catalogo='cat_idioma' 
	where not codigocodif isnull and codigocodif<>'' 
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p332.id_p332 = subquery.id_p332
    RETURNING p332.id_p332,p332.secuencial, p332.nro,'cod_p332' num_preg, p332.departamento, 'Pregunta 33 idioma 2' pregunta, 
		p332.respuesta respuestaCampo , p332.codigocodif codigo_codif, subquery.acep_desc_codif, p332.codigocodif_v1 codigo_super, 
		subquery.acep_desc_super,p332.codigocodif_v2 codigo_jefe,subquery.acep_desc_jefe,p332.usucodificador usuario_codif, 
		p332.usuverificador usuario_super,p332.usuverificador2 usuario_jefe,'' as cod_rev_jefe, 
		date(p332.feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p333 AS (
    UPDATE codificacion.cod_p333 AS p333
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p333,cc.descripcion acep_desc_codif, cc_1.descripcion acep_desc_super,cc_2.descripcion acep_desc_jefe
	FROM codificacion.cod_p333 cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_idioma' 
	left join codificacion.cod_catalogo cc_1 on cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 and cc_1.catalogo='cat_idioma' 
	left join codificacion.cod_catalogo cc_2 on cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 and cc_2.catalogo='cat_idioma' 
	where not codigocodif isnull and codigocodif<>'' 
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p333.id_p333 = subquery.id_p333
    RETURNING  p333.id_p333,p333.secuencial, p333.nro,'cod_p333' num_preg, p333.departamento, 'Pregunta 33 idioma 3' pregunta, 
		p333.respuesta respuestaCampo , p333.codigocodif codigo_codif, subquery.acep_desc_codif, 
		p333.codigocodif_v1 codigo_super, subquery.acep_desc_super,p333.codigocodif_v2 codigo_jefe,subquery.acep_desc_jefe,
		p333.usucodificador usuario_codif, p333.usuverificador usuario_super,p333.usuverificador2 usuario_jefe,'' as cod_rev_jefe, 
		date(p333.feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p341 AS (
    UPDATE codificacion.cod_p341 AS p341
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p341, cc.descripcion acep_desc_codif, cc_1.descripcion acep_desc_super,cc_2.descripcion acep_desc_jefe
	FROM codificacion.cod_p341 cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_idioma' 
	left join codificacion.cod_catalogo cc_1 on cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 and cc_1.catalogo='cat_idioma' 
	left join codificacion.cod_catalogo cc_2 on cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 and cc_2.catalogo='cat_idioma' 
	where not codigocodif isnull and codigocodif<>'' 
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
		AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p341.id_p341 = subquery.id_p341
    RETURNING  p341.id_p341, p341.secuencial, p341.nro,'cod_p341' num_preg, p341.departamento, 'Pregunta 34' pregunta, 
		p341.respuesta respuestaCampo , p341.codigocodif codigo_codif, subquery.acep_desc_codif, p341.codigocodif_v1 codigo_super, 
		subquery.acep_desc_super,p341.codigocodif_v2 codigo_jefe,subquery.acep_desc_jefe,p341.usucodificador usuario_codif, 
		p341.usuverificador usuario_super,p341.usuverificador2 usuario_jefe,'' as cod_rev_jefe, 
		date(p341.feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p48esp AS (
    UPDATE codificacion.cod_p48esp AS p48esp
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p48esp, cc.descripcion acep_desc_codif, cc_1.descripcion acep_desc_super,cc_2.descripcion acep_desc_jefe
	FROM codificacion.cod_p48esp cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_cob' 
	left join codificacion.cod_catalogo cc_1 on cec.codigocodif_v1=cc_1.codigo and cc_1.unico=1 and cc_1.catalogo='cat_cob' 
	left join codificacion.cod_catalogo cc_2 on cec.codigocodif_v2=cc_2.codigo and cc_2.unico=1 and cc_2.catalogo='cat_cob' 
	where not codigocodif isnull and codigocodif<>'' 
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
   ) subquery
    WHERE p48esp.id_p48esp = subquery.id_p48esp
    RETURNING p48esp.id_p48esp,p48esp.secuencial, p48esp.nro,'cod_p48esp' num_preg, p48esp.departamento, 'Pregunta 48' pregunta, 
		p48esp.respuesta respuestaCampo , p48esp.codigocodif codigo_codif, subquery.acep_desc_codif, p48esp.codigocodif_v1 codigo_super, 
		subquery.acep_desc_super,p48esp.codigocodif_v2 codigo_jefe,subquery.acep_desc_jefe,p48esp.usucodificador usuario_codif, 
		p48esp.usuverificador usuario_super,p48esp.usuverificador2 usuario_jefe,'' as cod_rev_jefe, 
		date(p48esp.feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
		
)

-- Combina los resultados de las tres tablas en una consulta final
SELECT *
FROM updated_p32esp
UNION ALL
SELECT *
FROM updated_p331
UNION ALL
SELECT *
FROM updated_p332
UNION ALL
SELECT *
FROM updated_p333
UNION ALL
SELECT *
FROM updated_p341
UNION ALL
SELECT *
FROM updated_p48esp
order by pregunta, id_p, secuencial,nro

	`;

	try {
		const result = await con.query(query); // Ejecutar la consulta SQL

		const workbook = new Excel.Workbook(); // Crear un nuevo libro de Excel
		const worksheet = workbook.addWorksheet('Data'); // Crear una nueva hoja de cálculo

		// Añadir encabezados
		const columns = result.fields.map(field => ({ header: field.name, key: field.name }));
		worksheet.columns = columns; // Definir las columnas

		// Añadir filas
		result.rows.forEach(row => {
			worksheet.addRow(row);
		});

		// Definir la ruta de salida dentro de la carpeta 'odbc-excel'
		const outputDir = path.resolve(__dirname, '../odbc-excel');
		const outputPath = path.join(outputDir, 'odbc_npioc.xlsx');

		// Crear el directorio si no existe
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Eliminar el archivo si existe
		if (fs.existsSync(outputPath)) {
			fs.unlinkSync(outputPath);
		}

		// Guardar el archivo Excel
		await workbook.xlsx.writeFile(outputPath);
		console.log(`Excel file created at ${outputPath}`);

		// solo Enviar el directorio de salida
		res.status(200).send({
			datos: "excel creado",
		});

		console.log(typeof (outputPath));


	} catch (error) {
		console.error('Error generating Excel file:', error);
		res.status(200).send('Error generating Excel file');
	}


}





// odbc_migracion
const repOdbc_migracion = async (req, res) => {
	console.log(req.params)
	const query = `
	
WITH updated_p20esp AS (
    UPDATE codificacion.cod_p20esp AS p20
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p20esp, cc.descripcion AS acep_desc_pais_codif, 
               cc2.descripcion AS acep_desc_pais_super, 
               cc3.descripcion AS acep_desc_pais_jefe
        FROM codificacion.cod_p20esp cec
        LEFT JOIN codificacion.cod_catalogo cc ON cec.codigocodif = cc.codigo AND cc.unico = 1 AND cc.catalogo = 'cat_pais'
        LEFT JOIN codificacion.cod_catalogo cc2 ON cec.codigocodif_v1 = cc2.codigo AND cc2.unico = 1 AND cc2.catalogo = 'cat_pais'
        LEFT JOIN codificacion.cod_catalogo cc3 ON cec.codigocodif_v2 = cc3.codigo AND cc3.unico = 1 AND cc3.catalogo = 'cat_pais'
        WHERE NOT cec.codigocodif IS NULL AND cec.codigocodif <> '' 
         -- AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
          AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p20.id_p20esp = subquery.id_p20esp
    RETURNING p20.id_p20esp AS id_p, p20.sec_cuestionario AS secuencial, p20.p20nro AS nro, 
              'cod_p20esp' AS num_preg, 'PREGUNTA 20' AS pregunta, departamento, '' AS depto, '' AS municipio, 
              '' AS codigo_mun_codif, '' AS acep_desc_mun_codif, '' AS codigo_mun_super, '' AS acep_desc_mun_super, 
              '' AS codigo_mun_jefe, '' AS acep_desc_mun_jefe, '' AS cod_rev_mun, p20.respuesta AS pais, 
              p20.codigocodif AS codigo_pais_codif, subquery.acep_desc_pais_codif, 
              p20.codigocodif_v1 AS codigo_pais_super, subquery.acep_desc_pais_super, 
              p20.codigocodif_v2 AS codigo_pais_jefe, subquery.acep_desc_pais_jefe, 
              '' AS cod_rev_pais, '' AS usuario_mun_codif, '' AS usuario_mun_super, '' AS usuario_mun_jefe, 
              p20.usucodificador AS usuario_pais_codif, p20.usuverificador AS usuario_pais_super, 
              p20.usuverificador2 AS usuario_pais_jefe, date(feccodificador)::text AS fecha_codif, 
              date(fecverificador2)::text AS fecha_esp_cont
),

-- Actualización de la segunda tabla (cod_p352a)
updated_p352a AS (
    UPDATE codificacion.cod_p352a AS p352a
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p352a, cc.descripcion AS acep_desc_mun_codif, 
               cc2.descripcion AS acep_desc_mun_super, 
               cc3.descripcion AS acep_desc_mun_jefe
        FROM codificacion.cod_p352a cec
        LEFT JOIN codificacion.cod_catalogo cc ON cec.codigocodif = cc.codigo AND cc.catalogo = 'cat_municipio' AND cc.unico = 1
        LEFT JOIN codificacion.cod_catalogo cc2 ON cec.codigocodif_v1 = cc2.codigo AND cc2.catalogo = 'cat_municipio' AND cc2.unico = 1
        LEFT JOIN codificacion.cod_catalogo cc3 ON cec.codigocodif_v2 = cc3.codigo AND cc3.catalogo = 'cat_municipio' AND cc3.unico = 1
        WHERE NOT cec.codigocodif IS NULL AND cec.codigocodif <> '' 
          --AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
           AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p352a.id_p352a = subquery.id_p352a
    RETURNING p352a.id_p352a, p352a.secuencial, p352a.nro, 'cod_p352a' AS num_preg, 
              'PREGUNTA 35. Municipio. Donde nacio?' AS pregunta, departamento, p352b AS depto, p352a.respuesta AS municipio, 
              p352a.codigocodif AS codigo_mun_codif, subquery.acep_desc_mun_codif, p352a.codigocodif_v1 AS codigo_mun_super, 
              subquery.acep_desc_mun_super, p352a.codigocodif_v2 AS codigo_mun_jefe, subquery.acep_desc_mun_jefe, 
              '' AS cod_rev_mun, '' AS pais, '' AS codigo_pais_codif, '' AS acep_desc_pais_codif, '' AS codigo_pais_super, 
              '' AS acep_desc_pais_super, '' AS codigo_pais_jefe, '' AS acep_desc_pais_jefe, '' AS cod_rev_pais, 
              p352a.usucodificador AS usuario_mun_codif, p352a.usuverificador AS usuario_mun_super, 
              p352a.usuverificador2 AS usuario_mun_jefe, p352a.usucodificador AS usuario_pais_codif, 
              p352a.usuverificador AS usuario_pais_super, p352a.usuverificador2 AS usuario_pais_jefe, 
              date(feccodificador)::text AS fecha_codif, date(fecverificador2)::text AS fecha_esp_cont
),

-- Actualización de la tercera tabla (cod_p353)
updated_p353 AS (
    UPDATE codificacion.cod_p353 AS p353
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
        --estado_norm=100
    FROM (
        SELECT cec.id_p353, cc.descripcion AS acep_desc_pais_codif, 
               cc2.descripcion AS acep_desc_pais_super, 
               cc3.descripcion AS acep_desc_pais_jefe
        FROM codificacion.cod_p353 cec
        LEFT JOIN codificacion.cod_catalogo cc ON cec.codigocodif = cc.codigo AND cc.unico = 1 AND cc.catalogo = 'cat_pais'
        LEFT JOIN codificacion.cod_catalogo cc2 ON cec.codigocodif_v1 = cc2.codigo AND cc2.unico = 1 AND cc2.catalogo = 'cat_pais'
        LEFT JOIN codificacion.cod_catalogo cc3 ON cec.codigocodif_v2 = cc3.codigo AND cc3.unico = 1 AND cc3.catalogo = 'cat_pais'
        WHERE NOT cec.codigocodif IS NULL AND cec.codigocodif <> '' 
         --AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
          AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p353.id_p353 = subquery.id_p353
    RETURNING p353.id_p353, p353.secuencial, p353.nro, 'cod_p353' AS num_preg, 
              'PREGUNTA 35. País. Donde nacio?' AS pregunta, departamento, '' AS depto, '' AS municipio, 
              '' AS codigo_mun_codif, '' AS acep_desc_mun_codif, '' AS codigo_mun_super, '' AS acep_desc_mun_super, 
              '' AS codigo_mun_jefe, '' AS acep_desc_mun_jefe, '' AS cod_rev_mun, p353.respuesta AS pais, 
              p353.codigocodif AS codigo_pais_codif, subquery.acep_desc_pais_codif, p353.codigocodif_v1 AS codigo_pais_super, 
              subquery.acep_desc_pais_super, p353.codigocodif_v2 AS codigo_pais_jefe, subquery.acep_desc_pais_jefe, 
              '' AS cod_rev_pais, '' AS usuario_mun_codif, '' AS usuario_mun_super, '' AS usuario_mun_jefe, 
              p353.usucodificador AS usuario_pais_codif, p353.usuverificador AS usuario_pais_super, 
              p353.usuverificador2 AS usuario_pais_jefe, date(feccodificador)::text AS fecha_codif,date(fecverificador2)::text AS fecha_esp_cont
),

updated_p362a AS (
    UPDATE codificacion.cod_p362a AS p362a
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
	--estado_norm=100
    FROM(
	SELECT cec.id_p362a, cc.descripcion AS acep_desc_mun_codif, cc2.descripcion AS acep_desc_mun_super, cc3.descripcion AS acep_desc_mun_jefe
	FROM codificacion.cod_p362a cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.catalogo='cat_municipio' and cc.unico=1
	left join codificacion.cod_catalogo cc2 on cec.codigocodif_v1=cc2.codigo and cc2.catalogo='cat_municipio' and cc2.unico=1
	left join codificacion.cod_catalogo cc3 on cec.codigocodif_v2=cc3.codigo and cc3.catalogo='cat_municipio' and cc3.unico=1
	where not codigocodif isnull and codigocodif<>''  
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	          AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p362a.id_p362a = subquery.id_p362a
    RETURNING p362a.id_p362a,p362a.secuencial, p362a.nro, 'cod_p362a' AS num_preg, 
              'PREGUNTA 36. Municipio. Donde vive?' AS pregunta,departamento, p362a.p362b depto,p362a.respuesta municipio,
              p362a.codigocodif codigo_mun_codif, subquery.acep_desc_mun_codif, p362a.codigocodif_v1 codigo_mun_super, subquery.acep_desc_mun_super,
              p362a.codigocodif_v2 codigo_mun_jefe, subquery.acep_desc_mun_jefe, '' cod_rev_mun,'' pais, 
              '' codigo_pais_codif, '' acep_desc_pais_codif, '' codigo_pais_super, 
              '' acep_desc_pais_super, '' codigo_pais_jefe, '' acep_desc_pais_jefe, 
              '' cod_rev_pais, p362a.usucodificador usuario_mun_codif, p362a.usuverificador usuario_mun_super, p362a.usuverificador2 usuario_mun_jefe,
              p362a.usucodificador usuario_pais_codif, p362a.usuverificador usuario_pais_super,
              p362a.usuverificador2 usuario_pais_jefe,  date(feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
		
),

updated_p363 AS (
    UPDATE codificacion.cod_p363 AS p363
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
	--estado_norm=100
    FROM (
        SELECT cec.id_p363, cc.descripcion acep_desc_pais_codif, cc2.descripcion acep_desc_pais_super, cc3.descripcion acep_desc_pais_jefe
        FROM codificacion.cod_p363 cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_pais'
	left join codificacion.cod_catalogo cc2 on cec.codigocodif_v1=cc2.codigo and cc2.unico=1 and cc2.catalogo='cat_pais'
	left join codificacion.cod_catalogo cc3 on cec.codigocodif_v2=cc3.codigo and cc3.unico=1 and cc3.catalogo='cat_pais'
	where not codigocodif isnull and codigocodif<>''  
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	          AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p363.id_p363 = subquery.id_p363
    RETURNING p363.id_p363,p363.secuencial, p363.nro, 'cod_p363' AS num_preg, 
              'PREGUNTA 36. País. Donde vive?' AS pregunta,p363.departamento, '' depto, '' municipio,
	      '' codigo_mun_codif, '' acep_desc_mun_codif, '' codigo_mun_super,'' acep_desc_mun_super,'' codigo_mun_jefe, 
              '' acep_desc_mun_jefe, '' cod_rev_mun, p363.respuesta pais, p363.codigocodif codigo_pais_codif, 
              subquery.acep_desc_pais_codif, p363.codigocodif_v1 codigo_pais_super, subquery.acep_desc_pais_super,
              p363.codigocodif_v2 codigo_pais_jefe, subquery.acep_desc_pais_jefe, '' cod_rev_pais,
              '' usuario_mun_codif,'' usuario_mun_super,'' usuario_mun_jefe,
              p363.usucodificador usuario_pais_codif, p363.usuverificador usuario_pais_super,p363.usuverificador2 usuario_pais_jefe,
              date(feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p372a AS (
    UPDATE codificacion.cod_p372a AS p372a
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
	--estado_norm=100
    FROM (
        SELECT cec.id_p372a, cc.descripcion acep_desc_mun_codif, cc2.descripcion acep_desc_mun_super,cc3.descripcion acep_desc_mun_jefe
        FROM codificacion.cod_p372a cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.catalogo='cat_municipio' and cc.unico=1
	left join codificacion.cod_catalogo cc2 on cec.codigocodif_v1=cc2.codigo and cc2.catalogo='cat_municipio' and cc2.unico=1
	left join codificacion.cod_catalogo cc3 on cec.codigocodif_v2=cc3.codigo and cc3.catalogo='cat_municipio' and cc3.unico=1
	where not codigocodif isnull and codigocodif<>''  
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
                   AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p372a.id_p372a = subquery.id_p372a
    RETURNING 
             p372a.id_p372a,p372a.secuencial, p372a.nro, 'cod_p372a' num_preg, 
             'PREGUNTA 37. Municipio. Donde vivia?' pregunta,p372a.departamento, p372a.p372b depto,p372a.respuesta municipio,
             p372a.codigocodif codigo_mun_codif, subquery.acep_desc_mun_codif, p372a.codigocodif_v1 codigo_mun_super,
             subquery.acep_desc_mun_super,p372a.codigocodif_v2 codigo_mun_jefe, subquery.acep_desc_mun_jefe, '' cod_rev_mun,
             '' pais, '' codigo_pais_codif, '' acep_desc_pais_codif, '' codigo_pais_super, '' acep_desc_pais_super,
             '' codigo_pais_jefe, '' acep_desc_pais_jefe, '' cod_rev_pais,p372a.usucodificador usuario_mun_codif,
             p372a.usuverificador usuario_mun_super,p372a.usuverificador2 usuario_mun_jefe,p372a.usucodificador usuario_pais_codif, 
             p372a.usuverificador usuario_pais_super,p372a.usuverificador2 usuario_pais_jefe,  
             date(feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
		
),

updated_p373 AS (
    UPDATE codificacion.cod_p373 AS p373
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
	--estado_norm=100
    FROM (
        SELECT cec.id_p373,cc.descripcion acep_desc_pais_codif, cc2.descripcion acep_desc_pais_super, cc3.descripcion acep_desc_pais_jefe
        FROM codificacion.cod_p373 cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and cc.unico=1 and cc.catalogo='cat_pais'
	left join codificacion.cod_catalogo cc2 on cec.codigocodif_v1=cc2.codigo and cc2.unico=1 and cc2.catalogo='cat_pais'
	left join codificacion.cod_catalogo cc3 on cec.codigocodif_v2=cc3.codigo and cc3.unico=1 and cc3.catalogo='cat_pais'
	where not codigocodif isnull and codigocodif<>''  
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date      
	          AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
    ) subquery
    WHERE p373.id_p373 = subquery.id_p373
    RETURNING 
             p373.id_p373,p373.secuencial, p373.nro, 'cod_p373' num_preg, 
             'PREGUNTA 37. País. Donde vivia?' pregunta,p373.departamento, '' depto, '' municipio,'' codigo_mun_codif, 
	     '' acep_desc_mun_codif, '' codigo_mun_super,'' acep_desc_mun_super,'' codigo_mun_jefe, '' acep_desc_mun_jefe, '' cod_rev_mun,
             p373.respuesta pais, p373.codigocodif codigo_pais_codif, subquery.acep_desc_pais_codif, p373.codigocodif_v1 codigo_pais_super, 
             subquery.acep_desc_pais_super,p373.codigocodif_v2 codigo_pais_jefe, subquery.acep_desc_pais_jefe, '' cod_rev_pais,
             '' usuario_mun_codif,'' usuario_mun_super,'' usuario_mun_jefe,
             p373.usucodificador usuario_pais_codif, p373.usuverificador usuario_pais_super,p373.usuverificador2 usuario_pais_jefe,
             date(feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
),

updated_p52esp AS (
    UPDATE codificacion.cod_p52esp AS p52esp
    SET estado = 'VERIFICADO', cp.usucre='ODBC'
	--estado_norm=100
    FROM (
        SELECT cec.id_p52esp, (case when LENGTH(cec.codigocodif) <> 3 then cc.descripcion else '' end) acep_desc_mun_codif, 
        (case when LENGTH(cec.codigocodif_v1) <> 3 then cc2.descripcion else '' end) acep_desc_mun_super,
        (case when LENGTH(cec.codigocodif_v2) <> 3 then cc3.descripcion else '' end) acep_desc_mun_jefe,
        (case when LENGTH(cec.codigocodif) = 3 then cc.descripcion else '' end) acep_desc_pais_codif,
        (case when LENGTH(cec.codigocodif_v1) = 3 then cc2.descripcion else '' end) acep_desc_pais_super,
        (case when LENGTH(cec.codigocodif_v2) = 3 then cc3.descripcion else '' end) acep_desc_pais_jefe
        FROM codificacion.cod_p52esp cec
	left join codificacion.cod_catalogo cc on cec.codigocodif=cc.codigo and (case when LENGTH(cec.codigocodif) = 3 then cc.catalogo='cat_pais' and cc.unico=1 else cc.catalogo='cat_municipio' and cc.unico=1 end)
	left join codificacion.cod_catalogo cc2 on cec.codigocodif_v1=cc2.codigo and (case when LENGTH(cec.codigocodif) = 3 then cc2.catalogo='cat_pais' and cc2.unico=1 else cc2.catalogo='cat_municipio' and cc2.unico=1 end)
	left join codificacion.cod_catalogo cc3 on cec.codigocodif_v2=cc3.codigo and (case when LENGTH(cec.codigocodif) = 3 then cc3.catalogo='cat_pais' and cc3.unico=1 else cc3.catalogo='cat_municipio' and cc3.unico=1 end)
	where not codigocodif isnull and codigocodif<>''  
	--AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	          AND feccodificador::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date

    ) subquery
    WHERE p52esp.id_p52esp = subquery.id_p52esp
    RETURNING 
	p52esp.id_p52esp,p52esp.secuencial, p52esp.nro, 'cod_p52esp' num_preg, 
	'PREGUNTA 52. Lugar donde trabaja esta ubicado.' pregunta,departamento, '' depto, 
	(case when LENGTH(p52esp.codigocodif) <> 3 then p52esp.respuesta else '' end) municipio,
	(case when LENGTH(p52esp.codigocodif) <> 3 then p52esp.codigocodif else '' end) codigo_mun_codif, 
	subquery.acep_desc_mun_codif, 
	(case when LENGTH(p52esp.codigocodif_v1) <> 3 then p52esp.codigocodif_v1 else '' end) codigo_mun_super,
	subquery.acep_desc_mun_super,
	(case when LENGTH(p52esp.codigocodif_v2) <> 3 then p52esp.codigocodif_v2 else '' end) codigo_mun_jefe, 
	subquery.acep_desc_mun_jefe, '' cod_rev_mun,
	(case when LENGTH(p52esp.codigocodif) = 3 then p52esp.respuesta else '' end) pais, 
	(case when LENGTH(p52esp.codigocodif) = 3 then p52esp.codigocodif else '' end) codigo_pais_codif, 
	subquery.acep_desc_pais_codif, 
	(case when LENGTH(p52esp.codigocodif_v1) = 3 then p52esp.codigocodif_v1 else '' end) codigo_pais_super, 
	subquery.acep_desc_pais_super,
	(case when LENGTH(p52esp.codigocodif_v2) = 3 then p52esp.codigocodif_v2 else '' end) codigo_pais_jefe, 
	subquery.acep_desc_pais_jefe, '' cod_rev_pais,
	p52esp.usucodificador usuario_mun_codif,p52esp.usuverificador usuario_mun_super,p52esp.usuverificador2 usuario_mun_jefe,
	p52esp.usucodificador usuario_pais_codif, p52esp.usuverificador usuario_pais_super,p52esp.usuverificador2 usuario_pais_jefe, 
	date(feccodificador)::text fecha_codif, date(fecverificador2)::text fecha_esp_cont
)

-- Combina los resultados de las tres tablas en una consulta final
SELECT *
FROM updated_p20esp
UNION ALL
SELECT *
FROM updated_p352a
UNION ALL
SELECT *
FROM updated_p353
UNION ALL
SELECT *
FROM updated_p362a
UNION ALL
SELECT *
FROM updated_p363
UNION ALL
SELECT *
FROM updated_p372a
UNION ALL
SELECT *
FROM updated_p373
UNION ALL
SELECT *
FROM updated_p52esp
order by pregunta, id_p, secuencial,nro


	`;

	try {
		const result = await con.query(query); // Ejecutar la consulta SQL

		const workbook = new Excel.Workbook(); // Crear un nuevo libro de Excel
		const worksheet = workbook.addWorksheet('Data'); // Crear una nueva hoja de cálculo

		// Añadir encabezados
		const columns = result.fields.map(field => ({ header: field.name, key: field.name }));
		worksheet.columns = columns; // Definir las columnas

		// Añadir filas
		result.rows.forEach(row => {
			worksheet.addRow(row);
		});

		// Definir la ruta de salida dentro de la carpeta 'odbc-excel'
		const outputDir = path.resolve(__dirname, '../odbc-excel');
		const outputPath = path.join(outputDir, 'odbc_emigracion.xlsx');

		// Crear el directorio si no existe
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Eliminar el archivo si existe
		if (fs.existsSync(outputPath)) {
			fs.unlinkSync(outputPath);
		}

		// Guardar el archivo Excel
		await workbook.xlsx.writeFile(outputPath);
		console.log(`Excel file created at ${outputPath}`);

		// solo Enviar el directorio de salida
		res.status(200).send({
			datos: "excel creado",
		});

		console.log(typeof (outputPath));


	} catch (error) {
		console.error('Error generating Excel file:', error);
		res.status(200).send('Error generating Excel file');
	}


};





// odbc_ocu_act
const repOdbc = async (req, res) => {
	console.log(req.params)
	/*	const query = ` --- Ocupacion - Actividad ---
		SELECT id_p49_p51, secuencial, nro, departamento, p26, p41a, p41b, p50, p45, p48esp, p52, p52esp, 
		respuesta_ocu, codigocodif_ocu, cc_o.descripcion o_acep_desc_codif, codigocodif_v1_ocu, cc_o2.descripcion o_acep_desc_super, codigocodif_v2_ocu, cc_o3.descripcion o_acep_desc_jefe, '' rev_ocu,
		respuesta_act, codigocodif_act, cc_act.descripcion a_acep_desc_codif , codigocodif_v1_act, cc_act2.descripcion a_acep_desc_super, codigocodif_v2_act, cc_act3.descripcion a_acep_desc_jefe, '' rev_act ,
		usucodificador_ocu,usucodificador_act, usuverificador, usuverificador2
		FROM codificacion.cod_p49_p51 cp
		JOIN codificacion.cod_catalogo cc_o ON cp.codigocodif_ocu = cc_o.codigo and cc_o.catalogo='cat_cob' and cc_o.unico=1
		left JOIN codificacion.cod_catalogo cc_o2 ON cp.codigocodif_v1_ocu = cc_o2.codigo and cc_o2.catalogo='cat_cob' and cc_o2.unico=1
		left JOIN codificacion.cod_catalogo cc_o3 ON cp.codigocodif_v2_ocu = cc_o3.codigo and cc_o3.catalogo='cat_cob' and cc_o3.unico=1
		JOIN codificacion.cod_catalogo cc_act ON cp.codigocodif_act = cc_act.codigo and cc_act.catalogo='cat_caeb' and cc_act.unico=1
		left JOIN codificacion.cod_catalogo cc_act2 ON cp.codigocodif_v1_act = cc_act2.codigo and cc_act2.catalogo='cat_caeb' and cc_act2.unico=1
		left JOIN codificacion.cod_catalogo cc_act3 ON cp.codigocodif_v2_act = cc_act3.codigo and cc_act3.catalogo='cat_caeb' and cc_act3.unico=1
		WHERE estado_ocu <>'ELABORADO' and estado_act <> 'ELABORADO' and estado_ocu <>'ASIGNADO' and estado_act <> 'ASIGNADO'
		AND feccodificador_ocu::date BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date
	`;
	*/
	const query = ` 
WITH fecha_filtrada AS (
    SELECT 
        cp.*,
        CASE 
            WHEN cp.usucodificador_ocu ILIKE 'AUTOMATICO%' AND cp.usucodificador_act ILIKE 'AUTOMATICO%' THEN cp.feccodificador_ocu::date 
            WHEN cp.usucodificador_ocu ILIKE 'AUTOMATICO%' AND NOT cp.usucodificador_act ILIKE 'AUTOMATICO%' THEN cp.feccodificador_act::date 
            WHEN NOT cp.usucodificador_ocu ILIKE 'AUTOMATICO%' AND cp.usucodificador_act ILIKE 'AUTOMATICO%' THEN cp.feccodificador_ocu::date 
            WHEN NOT cp.usucodificador_ocu ILIKE 'AUTOMATICO%' AND NOT cp.usucodificador_act ILIKE 'AUTOMATICO%' THEN cp.feccodificador_act::date 
            ELSE NULL 
        END AS fecha_codificada
    FROM 
        codificacion.cod_p49_p51 cp
)
UPDATE codificacion.cod_p49_p51
SET
        estado_ocu = 'VERIFICADO', estado_act='VERIFICADO', cp.usucre='ODBC' -- Aquí puedes definir qué columnas deseas actualizar
	--estado_norm_act=100
FROM fecha_filtrada
JOIN codificacion.cod_catalogo cc_o ON fecha_filtrada.codigocodif_ocu = cc_o.codigo AND cc_o.catalogo = 'cat_cob' AND cc_o.unico = 1
LEFT JOIN codificacion.cod_catalogo cc_o2 ON fecha_filtrada.codigocodif_v1_ocu = cc_o2.codigo AND cc_o2.catalogo = 'cat_cob' AND cc_o2.unico = 1
LEFT JOIN codificacion.cod_catalogo cc_o3 ON fecha_filtrada.codigocodif_v2_ocu = cc_o3.codigo AND cc_o3.catalogo = 'cat_cob' AND cc_o3.unico = 1
JOIN codificacion.cod_catalogo cc_act ON fecha_filtrada.codigocodif_act = cc_act.codigo AND cc_act.catalogo = 'cat_caeb' AND cc_act.unico = 1
LEFT JOIN codificacion.cod_catalogo cc_act2 ON fecha_filtrada.codigocodif_v1_act = cc_act2.codigo AND cc_act2.catalogo = 'cat_caeb' AND cc_act2.unico = 1
LEFT JOIN codificacion.cod_catalogo cc_act3 ON fecha_filtrada.codigocodif_v2_act = cc_act3.codigo AND cc_act3.catalogo = 'cat_caeb' AND cc_act3.unico = 1
WHERE codificacion.cod_p49_p51.id_p49_p51 = fecha_filtrada.id_p49_p51
    AND fecha_filtrada.estado_ocu <> 'ELABORADO' AND fecha_filtrada.estado_act <> 'ELABORADO' 
    AND fecha_filtrada.estado_ocu <> 'ASIGNADO' AND fecha_filtrada.estado_act <> 'ASIGNADO'
    AND (
       (fecha_filtrada.fecha_codificada BETWEEN '${req.params.fechaInicial}'::date AND '${req.params.fechaFinal}'::date)
	-- fecha_filtrada.id_p49_p51 in (372250,372237,372419,372240,372264)
    )
RETURNING 
    cod_p49_p51.id_p49_p51, 
    cod_p49_p51.secuencial, 
    cod_p49_p51.nro, 
    cod_p49_p51.departamento, 
    cod_p49_p51.p26 AS edad, 
    cod_p49_p51.p41a AS nivel, 
    cod_p49_p51.p41b AS curso_anio, 
    cod_p49_p51.p50 AS categoria, 
    cod_p49_p51.p45 AS cultiva_cria, 
    cod_p49_p51.p48esp AS p48_otro, 
    cod_p49_p51.p52esp AS lugar_trabajo, 
    fecha_filtrada.respuesta_ocu AS o_ocupacion, 
    fecha_filtrada.codigocodif_ocu AS o_codigo_codif, 
    cc_o.descripcion AS o_acep_desc_codif, 
    fecha_filtrada.codigocodif_v1_ocu AS o_codigo_super, 
    cc_o2.descripcion AS o_acep_desc_super, 
    fecha_filtrada.codigocodif_v2_ocu AS o_codigo_esp_cont, 
    cc_o3.descripcion AS o_acep_desc_esp_cont, 
    '' AS cod_rev_ocupacion,
    fecha_filtrada.respuesta_act AS a_actividad, 
    fecha_filtrada.codigocodif_act AS a_codigo_codif, 
    cc_act.descripcion AS a_acep_desc_codif , 
    fecha_filtrada.codigocodif_v1_act AS a_codigo_super, 
    cc_act2.descripcion AS a_acep_desc_super, 
    fecha_filtrada.codigocodif_v2_act AS a_codigo_esp_cont, 
    cc_act3.descripcion AS a_acep_desc_esp_cont, 
    '' AS cod_rev_actividad,
    fecha_filtrada.usucodificador_ocu AS o_usuario_codif, 
    fecha_filtrada.usucodificador_act AS a_usuario_codif, 
    fecha_filtrada.usuverificador AS usuario_super, 
    fecha_filtrada.usuverificador2 AS usuario_esp_cont, 
    date(fecha_filtrada.fecha_codificada)::text AS fecha_codif, 
    date(fecha_filtrada.fecverificador2)::text AS fecha_esp_cont;
	`;

	try {
		const result = await con.query(query); // Ejecutar la consulta SQL

		const workbook = new Excel.Workbook(); // Crear un nuevo libro de Excel
		const worksheet = workbook.addWorksheet('Data'); // Crear una nueva hoja de cálculo

		// Añadir encabezados
		const columns = result.fields.map(field => ({ header: field.name, key: field.name }));
		worksheet.columns = columns; // Definir las columnas

		// Añadir filas
		result.rows.forEach(row => {
			worksheet.addRow(row);
		});

		// Definir la ruta de salida dentro de la carpeta 'odbc-excel'
		const outputDir = path.resolve(__dirname, '../odbc-excel');
		const outputPath = path.join(outputDir, 'odbc_ocu_act.xlsx');

		// Crear el directorio si no existe
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// Eliminar el archivo si existe
		if (fs.existsSync(outputPath)) {
			fs.unlinkSync(outputPath);
		}

		// Guardar el archivo Excel
		await workbook.xlsx.writeFile(outputPath);
		console.log(`Excel file created at ${outputPath}`);

		// solo Enviar el directorio de salida
		res.status(200).send({
			datos: "excel creado",
		});

		console.log(typeof (outputPath));


	} catch (error) {
		console.error('Error generating Excel file:', error);
		res.status(200).send('Error generating Excel file');
	}


};
////////////////////REPORTES DEL 1 AL 11







/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte1 = async (req, res) => {

	const query = {
		text: ` select * from codificacion.fn_reporte_1() `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte2 = async (req, res) => {
	/*	const query = {
			text: `select (case when codigo isnull then catalogo||' - T O T A L' else catalogo end) catalogo,codigo, acep_desc, sum(tot) from
			(select cc.catalogo,cc.codigo, cc.descripcion acep_desc, count(cec.respuesta) tot
			from codificacion.cod_encuesta_codificacion cec
			join codificacion.cod_variables cv on cec.id_pregunta=cv.id_pregunta
			join codificacion.cod_catalogo cc on cc.codigo = cec.codigocodif and cc.unico=1 and cc.catalogo=cv.catalogo
			group by cc.catalogo,cc.codigo, cc.descripcion
			 order by  cc.catalogo,cc.codigo 
			) x
			GROUP BY GROUPING SETS ( (catalogo),(catalogo,codigo,acep_desc))
			order by catalogo,codigo `,
		};*/
	const query = {
		text: `	select * from codificacion.fn_reporte_2() `,
	};

	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte3 = async (req, res) => {
	// const query = {
	// 	text: `select (case when id_pregunta isnull then 1 else 0 end) orden, id_pregunta,(case when pregunta isnull then 'T O T A L' else pregunta end) pregunta, respuesta, sum(tot) total from
	// 	(select cec.id_pregunta,cv.pregunta, cec.respuesta, count(cec.respuesta) tot
	// 	from codificacion.cod_encuesta_codificacion cec
	// 	join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
	// 	where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
	// 	group by cv.pregunta,cec.id_pregunta, cec.respuesta
	// 	) x
	// 	GROUP BY GROUPING SETS ( (),(id_pregunta,pregunta, respuesta))
	// 	having sum(tot)>=5
	// 	order by orden,id_pregunta, total desc`,
	// };
	const query = {
		text: ` select * from codificacion.fn_reporte_3() `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte4 = async (req, res) => {
	// const query = {
	// 	text: `select departamento||'-'||cc.descripcion depto,(case when departamento||'-'||cc.descripcion isnull then 'TOTAL GENERAL' when not departamento||'-'||cc.descripcion isnull and cv.pregunta isnull then 'TOTAL '||(departamento||'-'||cc.descripcion) else departamento||'-'||cc.descripcion end) departamento,
	// 	cec.id_pregunta, cv.pregunta, sum(case when cec.usucodificador ilike 'AUTOMATICO%' then 1 else 0 end) automatica,
	// 		 sum(case when not cec.usucodificador ilike 'AUTOMATICO%' and not cec.usucodificador isnull then 1 else 0 end) asistida,
	// 		 sum(case when cec.codigocodif isnull then 1 else 0 end) pendiente,
	// 		 count(cec.id_pregunta) total
	// 	from codificacion.cod_encuesta_codificacion cec
	// 	join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
	// 	join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
	// 	GROUP BY ROLLUP (departamento||'-'||cc.descripcion , (cec.id_pregunta,cv.pregunta ))
	// 	ORDER BY depto,cec.id_pregunta,cv.pregunta`,
	// };
	const query = {
		text: ` select * from codificacion.fn_reporte_4() `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte5 = async (req, res) => {
	// const query = {
	// 	text: `	select (case when cec.departamento||'-'||cc.descripcion isnull then 'T O T A L E S' else cec.departamento||'-'||cc.descripcion end) departamento, count (*) total,
	//     sum(case when not cec.codigocodif isnull and cec.codigocodif <> '' then 1 else 0 end) codificados,
	//     (count (*)-sum(case when not cec.codigocodif isnull and cec.codigocodif <> '' then 1 else 0 end)) pendientes_codif,
	//     sum(case when not cec.codigocodif_v1 isnull and cec.codigocodif_v1 <> '' then 1 else 0 end) supervisados,
	//     (count (*) - sum(case when not cec.codigocodif_v1 isnull and cec.codigocodif_v1 <> '' then 1 else 0 end)) pendientes_super
	//     from codificacion.cod_encuesta_codificacion cec
	// 	join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
	// 	join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
	//     GROUP BY GROUPING SETS ( ( cec.departamento||'-'||cc.descripcion),())
	//     order by departamento`,
	// };
	const query = {
		text: `	select * from codificacion.fn_reporte_5() `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte6 = async (req, res) => {
	// const query = {
	// 	text: `select departamento||'-'||cc.descripcion depto,(case when departamento||'-'||cc.descripcion isnull then 'TOTAL GENERAL' when not departamento||'-'||cc.descripcion isnull and cv.pregunta isnull then 'TOTAL '||(departamento||'-'||cc.descripcion) else departamento||'-'||cc.descripcion end) departamento,
	// 	cec.id_pregunta, cv.pregunta, sum(case when cec.estado = 'VERIFICADO' then 1 else 0 end) supervisado,
	// 		 sum(case when cec.estado in ('CODIFICADO','ASIGNASUP') then 1 else 0 end) pendiente,
	// 		 sum(case when cec.estado in ('CODIFICADO','ASIGNASUP','VERIFICADO') then 1 else 0 end) total
	// 	from codificacion.cod_encuesta_codificacion cec
	// 	join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
	// 	join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
	// 	where cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or cec.estado='CODIFICADO' 
	// 	GROUP BY ROLLUP ( departamento||'-'||cc.descripcion,(cec.id_pregunta,cv.pregunta ))
	// 	ORDER BY depto,cec.id_pregunta,cv.pregunta`,
	// };
	const query = {
		text: ` select * from codificacion.fn_reporte_6() `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte7 = async (req, res) => {
	/*	const query = {
			text: `
			select cec.usucre usuario, (case when cec.usucre isnull then 'TOTAL GENERAL' when not cec.usucre isnull and cv.pregunta isnull then 'TOTAL '||cec.usucre else cec.usucre end) usucre,
			cec.id_pregunta, cv.pregunta, sum(case when cec.estado = 'VERIFICADO' then 1 else 0 end) supervisado,
				 sum(case when cec.estado = 'CODIFICADO' or cec.estado = 'ASIGNASUP' then 1 else 0 end) pendiente,
				 sum(case when cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or cec.estado = 'CODIFICADO' then 1 else 0 end) total
			from (select id_pregunta, usucre, estado from codificacion.cod_encuesta_codificacion where estado='ASIGNASUP'
			union all
			select id_pregunta, usuverificador, estado from codificacion.cod_encuesta_codificacion 
			where estado='VERIFICADO' and not codigocodif_v1 is null and codigocodif_v1<>''
			union all
			select id_pregunta, login_sup, estado from codificacion.cod_encuesta_codificacion cec
			join (select cu.login login_cod, cu2.login login_sup from codificacion.cod_usuario cu 
			join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
			and cu.estado='A')cu on cec.usucre = cu.login_cod 
			where (cec.estado='CODIFICADO')  
			union all
			SELECT cec2.id_pregunta, a.login, cec2.estado
			FROM (
				SELECT id_informante, COUNT(*) AS count, cu2.login --login_sup
				FROM codificacion.cod_encuesta_codificacion cec
				JOIN codificacion.cod_usuario cu ON cec.usucre = cu.login
				JOIN codificacion.cod_usuario cu2 ON cu.cod_supvsr = cu2.id_usuario
				WHERE cu2.rol_id = 5 AND cu2.estado = 'A' AND cu.estado = 'A'
				AND cec.estado = 'CODIFICADO' AND cec.id_pregunta IN (125, 127)
				GROUP BY id_informante, cu2.login
				HAVING COUNT(*) = 1
			) AS a
			join codificacion.cod_encuesta_codificacion cec2
			on a.id_informante=cec2.id_informante and cec2.usucodificador = 'AUTOMATICO_NORMALIZADO' and cec2.id_pregunta IN (125, 127)
	
			) cec
			join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
			GROUP BY ROLLUP ( cec.usucre,(cec.id_pregunta,cv.pregunta ))
			ORDER BY usuario, usucre,cec.id_pregunta,cv.pregunta
			`,
	*/
	/* text: `select cec.usucre usuario, (case when cec.usucre isnull then 'TOTAL GENERAL' when not cec.usucre isnull and cv.pregunta isnull then 'TOTAL '||cec.usucre else cec.usucre end) usucre,
	cec.id_pregunta, cv.pregunta, sum(case when cec.estado = 'VERIFICADO' then 1 else 0 end) supervisado,
		 sum(case when cec.estado = 'CODIFICADO' or cec.estado = 'ASIGNASUP' then 1 else 0 end) pendiente,
		 sum(case when cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or cec.estado = 'CODIFICADO' then 1 else 0 end) total
	from (select id_pregunta, usucre, estado from codificacion.cod_encuesta_codificacion where estado='ASIGNASUP'
	union all
	select id_pregunta, usuverificador, estado from codificacion.cod_encuesta_codificacion 
	where estado='VERIFICADO' and not codigocodif_v1 is null and codigocodif_v1<>''
	union all
select id_pregunta, login_sup, estado from codificacion.cod_encuesta_codificacion cec
join (select cu.login login_cod, cu2.login login_sup from codificacion.cod_usuario cu 
join codificacion.cod_usuario cu2 on cu.cod_supvsr=cu2.id_usuario and cu2.rol_id=5 and cu2.estado ='A'
and cu.estado='A')cu on cec.usucre = cu.login_cod      --cec.usucodificador = cu.login_cod
where (cec.estado='CODIFICADO')  -- and not cec.usucodificador ilike 'AUTOMATICO%')
	) cec
	join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
	--where cec.estado = 'VERIFICADO' or cec.estado = 'ASIGNASUP' or (cec.estado='CODIFICADO')
	GROUP BY ROLLUP ( cec.usucre,(cec.id_pregunta,cv.pregunta ))
	ORDER BY usuario, usucre,cec.id_pregunta,cv.pregunta`,
*/
	const query = {
		text: ` select * from codificacion.fn_reporte_7() `,
	};

	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte8 = async (req, res) => {
	/*	const query = {
			text: `select date(cec.fecverificador) fecha, (case when date(cec.fecverificador)::text isnull then 'TOTAL GENERAL' when not date(cec.fecverificador)::text isnull and cec.usuverificador isnull then 'TOTAL '||date(cec.fecverificador)::text else date(cec.fecverificador)::text end) fecverificador,
			cec.usuverificador, sum(case when cec.estado = 'VERIFICADO' and cec.codigocodif = cec.codigocodif_v1 then 1 else 0 end) supervisado,
				 sum(case when cec.estado = 'VERIFICADO' and cec.codigocodif <> cec.codigocodif_v1 then 1 else 0 end) recodificado,
				 count(*) total
			from codificacion.cod_encuesta_codificacion cec
			where cec.estado = 'VERIFICADO' and not codigocodif_v1 is null and codigocodif_v1<>''
			GROUP BY ROLLUP ( date(cec.fecverificador),cec.usuverificador)
			ORDER BY fecha,usuverificador`,
		};*/
	const query = {
		text: ` select * from codificacion.fn_reporte_8() `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte9 = async (req, res) => {
	/*	const query = {
			text: `select departamento||'-'||cc.descripcion depto,(case when departamento||'-'||cc.descripcion isnull then 'TOTAL GENERAL' when not departamento||'-'||cc.descripcion isnull and cv.pregunta isnull then 'TOTAL '||(departamento||'-'||cc.descripcion) else departamento||'-'||cc.descripcion end) departamento,
			cec.id_pregunta, cv.pregunta, sum(case when not cec.codigocodif isnull or cec.codigocodif<>'' then 1 else 0 end) codificado,
				 sum(case when cec.codigocodif isnull or cec.codigocodif='' then 1 else 0 end) pendiente,
				 count(*) total
			from codificacion.cod_encuesta_codificacion cec
			join codificacion.cod_variables cv ON cec.id_pregunta=cv.id_pregunta and cv.estado='ACTIVO'
			join codificacion.cod_catalogo cc on cec.departamento=cc.codigo and cc.catalogo='cat_departamento'
			GROUP BY ROLLUP ( departamento||'-'||cc.descripcion,(cec.id_pregunta,cv.pregunta ))
			ORDER BY depto,departamento,cec.id_pregunta,cv.pregunta`,
		};*/
	const query = {
		text: `select * from codificacion.fn_reporte_9()`,
	};

	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte10 = async (req, res) => {

	const {
		login
	} = req.body
	console.log("sdfsdfsdfsdfs");

	console.log(req.body);

	const query = {
		text: `	select * from codificacion.fn_reporte_10('${login}')`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte11 = async (req, res) => {
	const {
		login
	} = req.body
	console.log(req.body);
	const query = {
		text: `	select * from codificacion.fn_reporte_11('${login}')`,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const reporte12 = async (req, res) => {
	//console.log ('select respuesta_ocu, respuesta_act, count(*) frecuencia from codificacion.cod_p49_p51 where estado_ocu=ELABORADO and estado_act=ELABORADO group by respuesta_ocu, respuesta_act having count(*)>=5 order by frecuencia desc');
	const query = {
		text: `select trim(respuesta_ocu) respuesta_ocu, trim(respuesta_act) respuesta_act, count(*) frecuencia from codificacion.cod_p49_p51
		where estado_ocu='ELABORADO' and estado_act='ELABORADO' 
		group by respuesta_ocu, respuesta_act 
		having count(*)>=5
		order by frecuencia desc `,
	};
	await con
		.query(query)
		.then((result) =>
			res.status(200).json({
				datos: result,
			})
		)
		.catch((e) => console.error(e.stack));
};


const reporte13 = async (req, res) => {
	const { cod_depto } = req.body;
	console.table(req.body);

	let resultado = [];
	let total_depto = 0;

	if (cod_depto == '04') {
		resultado = [
			{
				departamento: "ORURO",
				carga_db_inicial_0: 1,
				fecha_carga: "27-06-2024",
				nro_cuestionarios: 83344,
				nro_personas: 173457
			},
			{
				departamento: "ORURO",
				carga_db_inicial_0: 2,
				fecha_carga: "01-08-2024",
				nro_cuestionarios: 20305,
				nro_personas: 37234
			},
			{
				departamento: "ORURO",
				carga_db_inicial_0: 3,
				fecha_carga: "28-08-2024",
				nro_cuestionarios: 169784,
				nro_personas: 390826
			},
			{
				departamento: "TOTAL ORURO",
				carga_db_inicial_0: "",
				fecha_carga: "",
				nro_cuestionarios: 273433,
				nro_personas: 601517,
			}
		];
		total_depto = 282390;
	} else {
		resultado = [];
		total_depto = 0
	}

	// respuestas 202
	res.status(200).json({
		datos: resultado,
		total_depto: total_depto
	});

};


const download01 = async (req, res) => {
	// Consulta
	const resultado = await (await con.query(
		`
	SELECT 
	p49, --ok
	p51, --ok
	p26, --ok
	case 
			when p41a = 1 then '(1) Ninguno' 
			when p41a = 2 then '(2) Curso de alfabetización'
			when p41a = 3 then '(3) Inicial (Pre kinder, kinder)'
			when p41a = 4 then '(4) Básico'
			when p41a = 5 then '(5) Intermedio'
			when p41a = 6 then '(6) Medio'
			when p41a = 7 then '(7) Primaria'
			when p41a = 8 then '(8) Secundaria'
			when p41a = 9 then '(9) Técnico medio'
			when p41a = 10 then '(10) Técnico superior'
			when p41a = 11 then '(11) Licenciatura'
			when p41a = 12 then '(12) Maestría'
			when p41a = 13 then '(13) Doctorado'
			when p45 = 99 then '(99) Mas de una opción rellenada'  
	end as p41a,
	case 
			when p41b = 0 then 'Nivel (0)'
			when p41b = 1 then 'Nivel (1)' 
			when p41b = 2 then 'Nivel (2)'
			when p41b = 3 then 'Nivel (3)'
			when p41b = 4 then 'Nivel (4)'
			when p41b = 5 then 'Nivel (5)'
			when p41b = 6 then 'Nivel (6)'
			when p41b = 7 then 'Nivel (7)'
			when p41b = 8 then 'Nivel (8)'
			when p41b = 99 then '(99) Mas de una opción rellenada'  
	end as p41b,

	case 
			when p45 = 1 then '(1) Sí' 
			when p45 = 2 then '(2) No'
			when p45 = 99 then '(99) Mas de una opción rellenada'  
	end as p50,	
	p48esp,   -- ok
	case 
			when p50 = 1 then '(1) Trabajadora(or) por cuenta propia' 
			when p50 = 2 then '(2) Empleada(o) u obrera(o)' 
			when p50 = 3 then '(3) Empleadora(o) o socia(0)' 
			when p50 = 4 then '(4) Trabajadora(or) familiar sin remuneración'
			when p50 = 5 then '(5) Trabajadora(or) del hogar'
			when p50 = 6 then '(6) Cooperativista de producción'
			when p50 = 99 then '(99) Mas de una opción rellenada'  
	end as p50,	
	case 
			when p52 = 1 then '(1) Dentro o junto a esta vivienda' 
			when p52 = 2 then '(2) Fuera de la vivienda, pero en el mismo municipio' 
			when p52 = 3 then '(3) En otro municipio' 
			when p52 = 4 then '(4) En otro país' 
			when p52 = 99 then '(99) Mas de una opción rellenada'  
	end as p52,	    
	p52esp -- ok
	FROM estructuras.inicial1_capitulo_personas
	WHERE p49 IS NOT NULL OR  p51 IS NOT NULL
	`
	)).rows;

	// respuestas 202
	res.status(200).json({
		datos: resultado
	});
}

module.exports = {
	repCodificados,
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
	reporte13,
	download01
};
