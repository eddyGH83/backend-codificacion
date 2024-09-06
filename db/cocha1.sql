select (case when x.id_pregunta isnull then 1 else 0 end) orden, x.id_pregunta,(case when x.pregunta isnull then 'T O T A L' else x.pregunta end) pregunta, x.respuesta, sum(tot) total from
		(select 'p49' id_pregunta, '49. Ocupación' pregunta,cec.respuesta_ocu respuesta, count(cec.respuesta_ocu) tot
		from codificacion.cod_p49_p51 cec
		where cec.estado_ocu<>'CODIFICADO' and cec.estado_ocu<>'VERIFICADO'
		group by cec.respuesta_ocu


		
        UNION ALL
		select 'p32', '32. Nación pueblo indígena originario campesino o afroboliviano', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p32esp cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p331', 'Idioma 1', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p331 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p332', 'Idioma 2', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p332 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p333', 'Idioma 3', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p333 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p341', '¿Cuál es el primer idioma o lengua en el que aprendió a hablar en su niñez?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p341 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p352', '¿Dónde nació? ¿Municipio?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p352a cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p353', '¿Dónde nació? ¿País?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p353 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p362', '¿Dónde vive habitualmente? ¿Municipio?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p362a cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p363', '¿Dónde vive habitualmente? ¿País?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p363 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p372', '¿Dónde vivía el año 2019? ¿Municipio?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p372a cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p373', '¿Dónde vivía el año 2019? ¿País?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p373 cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
				UNION ALL
		select 'p52', 'Principalmente, el lugar donde trabaja está ubicado:', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p52esp cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
		) x
		GROUP BY GROUPING SETS ( (),(x.id_pregunta,x.pregunta, x.respuesta))
		having sum(tot)>=5
		order by orden,x.id_pregunta, total desc;
		
	