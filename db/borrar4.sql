-- insertar un nuevo campo en la tabla
codificacion.cod_p20esp
codificacion.cod_p32esp
codificacion.cod_p331
codificacion.cod_p332
codificacion.cod_p333
codificacion.cod_p341
codificacion.cod_p352a
codificacion.cod_p353
codificacion.cod_p362a
codificacion.cod_p363
codificacion.cod_p372a
codificacion.cod_p373
codificacion.cod_p48esp
codificacion.cod_p49_p51
codificacion.cod_p52esp




/* ALTER TABLE codificacion.cod_p20esp
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p20esp set i001a_copia = i001a;
 */



ALTER TABLE codificacion.cod_p32esp
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p32esp set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p331
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p331 set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p332
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p332 set i001a_copia = i001a;



-- modifica la tabla cod_p333
ALTER TABLE codificacion.cod_p333
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p333 set i001a_copia = i001a;




-- modifica la tabla cod_p341
ALTER TABLE codificacion.cod_p341
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p341 set i001a_copia = i001a;



-- modifica la tabla cod_p352a
ALTER TABLE codificacion.cod_p352a
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p352a set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p353
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p353 set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p362a
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p362a set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p363
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p363 set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p372a
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p372a set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p373
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p373 set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p48esp
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p48esp set i001a_copia = i001a;




ALTER TABLE codificacion.cod_p49_p51
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p49_p51 set i001a_copia = i001a;



ALTER TABLE codificacion.cod_p52esp
ADD COLUMN i001a_copia varchar(8);

update codificacion.cod_p52esp set i001a_copia = i001a;



ALTER TABLE codificacion.cod_p48esp
ADD COLUMN p26 varchar(3) default 0;


----------------------------------------------------------------
codificacion.cod_p20esp
codificacion.cod_p32esp
codificacion.cod_p331
codificacion.cod_p332
codificacion.cod_p333
codificacion.cod_p341
codificacion.cod_p352a
codificacion.cod_p353
codificacion.cod_p362a
codificacion.cod_p363
codificacion.cod_p372a
codificacion.cod_p373
codificacion.cod_p48esp
codificacion.cod_p52esp



(select usucodificador codificador, '20. ---' variable, feccodificador::date fecha, count(*) total 
from codificacion.cod_p20esp 
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '32. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p32esp
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '331. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p331
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '332. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p332
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '333. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p333
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '341. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p341
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '352a. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p352a
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '353. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p353
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '362a. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p362a
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '363. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p363
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '372a. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p372a
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '373. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p373
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '48. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p48esp
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador codificador, '52. ---' variable, feccodificador::date fecha, count(*) total
from codificacion.cod_p52esp
where codigocodif <>'' and not codigocodif is null
group by usucodificador, feccodificador::date)

(select usucodificador_ocu codificador, '49. OCUPACION' variable, feccodificador_ocu::date fecha, count(*) total 
from codificacion.cod_p49_p51 
where codigocodif_ocu <>'' and not codigocodif_ocu is null
group by usucodificador_ocu, feccodificador_ocu::date)

UNION all

(select usucodificador_act codificador, '51. ACTIVIDAD' variable, feccodificador_act::date fecha, count(*) total 
from codificacion.cod_p49_p51 
where codigocodif_act <>'' and not codigocodif_act is null
group by usucodificador_act, feccodificador_act::date)


order by usucodificador, feccodificador::date





-----------------------------------------------------------------------------------------------------


select (case when x.id_pregunta isnull then 1 else 0 end) orden, x.id_pregunta,(case when x.pregunta isnull then 'T O T A L' else x.pregunta end) pregunta, x.respuesta, sum(tot) total from
		(select 'p49' id_pregunta, '49. Ocupación' pregunta,cec.respuesta_ocu respuesta, count(cec.respuesta_ocu) tot
		from codificacion.cod_p49_p51 cec
		where cec.estado_ocu<>'CODIFICADO' and cec.estado_ocu<>'VERIFICADO'
		group by cec.respuesta_ocu
		UNION ALL
		select 'p51', '51. Actividad Económica', cec.respuesta_act, count(cec.respuesta_act) tot
		from codificacion.cod_p49_p51 cec
		where cec.estado_act<>'CODIFICADO' and cec.estado_act<>'VERIFICADO'
		group by cec.respuesta_act
		UNION ALL
		select 'p48', '48. Las últimas 4 semanas:', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p48esp cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
			UNION ALL
		select 'p20', '20. Alguna persona que vivía con usted(es) en este hogar, ¿actualmente vive en otro país?', cec.respuesta, count(cec.respuesta) tot
		from codificacion.cod_p20esp cec
		where cec.estado<>'CODIFICADO' and cec.estado<>'VERIFICADO'
		group by cec.respuesta
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


        -- cosulta cod_p352a
        select * from codificacion.cod_p352a

        ------------------------------------
        -- consulta sql para crear una vista, si existe que sea reemplazada
 
 