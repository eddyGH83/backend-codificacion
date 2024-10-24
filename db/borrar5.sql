UPDATE codificacion.cod_p32esp_temp3 SET cod_depto = x.mc_cod_depto
 FROM (
 	 SELECT cd.cod_depto_anterior, vm.mc_cod_depto FROM codificacion.cod_p32esp_temp3 cd
	 JOIN codificacion.vw_marco_cuestionarios_cod vm
	 ON cd.id_vivienda = vm.vb_id_vivienda AND  cd.id_persona = vm.vb_id_persona AND cd.i00::numeric =vm.vb_cuestionario -- limit 100
 ) x