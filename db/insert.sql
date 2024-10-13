    --OCUPACION
			--Llena respuesta_normalizada_ocu con las respuestas en minusculas
			update codificacion.cod_p49_p51_temp set respuesta_normalizada_ocu= lower(respuesta_ocu) where codigocodif_ocu is null and orden_ocu = 0;
			i:= 1; 
			j:=0;
			--El bucle realiza la correccion ortografica
			while i > 0	loop
				--Sustituye las palabras erradas
				update codificacion.cod_p49_p51_temp
				set respuesta_normalizada_ocu = replace(lower(respuesta_normalizada_ocu), lower(ceo.erradas), lower(ceo.corregidas)), 
				orden_ocu = orden_ocu+1
				from codificacion.cod_err_corr ceo 
				where (respuesta_normalizada_ocu ilike ('% '||ceo.erradas||' %') OR respuesta_normalizada_ocu ilike ('% '||ceo.erradas) OR respuesta_normalizada_ocu ilike (ceo.erradas||' %') or respuesta_normalizada_ocu ilike (ceo.erradas))
				and codigocodif_ocu is null
				and estado_norm_ocu=0
				and verificado=1
				and orden_ocu>=j;
				RAISE INFO 'a = %', i;
				--Revisa cuantos errores ortograficos existe
				select count(*) numeroi into r from codificacion.cod_err_corr ceo
				join codificacion.cod_p49_p51_temp cec 
				ON (cec.respuesta_normalizada_ocu ilike ('% '||ceo.erradas||' %') OR cec.respuesta_normalizada_ocu ilike ('% '||ceo.erradas) OR cec.respuesta_normalizada_ocu ilike (ceo.erradas||' %') or cec.respuesta_normalizada_ocu ilike (ceo.erradas))
				where codigocodif_ocu is null and orden_ocu > 0 and verificado=1;
				--ALmacena en i el numero de errores ortograficos que existe 
				i:= r.numeroi;
				j:=j+1;
			END LOOP;
			--Normaliza las respuestas quitando los acentos y los signos de puntuacion
			update codificacion.cod_p49_p51_temp set respuesta_normalizada_ocu=REGEXP_REPLACE(unaccent(respuesta_normalizada_ocu) ,'[^\w]{1,}','','g'), estado_norm_ocu=1 where codigocodif_ocu is null and verificado=1;
