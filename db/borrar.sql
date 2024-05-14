select
	cec.usucodificador codificador,
	(
		case
			when cec.usucodificador isnull then 'TOTAL GENERAL'
			when not cec.usucodificador isnull
			and cv.pregunta isnull then 'TOTAL ' || cec.usucodificador
			else cec.usucodificador
		end
	) usucodificador,
	cec.id_pregunta,
	cv.pregunta,
	sum(
		case
			when not cec.codigocodif isnull
			or cec.codigocodif <> '' then 1
			else 0
		end
	) codificado,
	sum(
		case
			when cec.codigocodif isnull
			or cec.codigocodif = '' then 1
			else 0
		end
	) pendiente,
	count(*) total
from
	codificacion.cod_encuesta_codificacion cec
	join codificacion.cod_variables cv ON cec.id_pregunta = cv.id_pregunta
	and cv.estado = 'ACTIVO'
where
	(
		not cec.codigocodif isnull
		or cec.codigocodif <> ''
	)
	and usucodificador <> 'AUTOMATICO_NORMALIZADO'
	and usucodificador <> 'AUTOMATICO_NORMDOBLE'
GROUP BY
	ROLLUP (
		cec.usucodificador,
		(cec.id_pregunta, cv.pregunta)
	)
ORDER BY
	codificador,
	usucodificador,
	cec.id_pregunta,
	cv.pregunta 

-----------------------------------------------------------------------
update
	codificacion.cod_encuesta_codificacion cec
set
	respuesta_apoyo = x.respuesta2
from
(
		select
			cec.id_informante,
			cec.id_pregunta,
			(
				case
					when ee.id_pregunta = 453 then '01'
					when ee.id_pregunta = 454 then '02'
					when ee.id_pregunta = 455 then '03'
					when ee.id_pregunta = 456 then '04'
					when ee.id_pregunta = 457 then '05'
					when ee.id_pregunta = 458 then '06'
					when ee.id_pregunta = 459 then '07'
					when ee.id_pregunta = 460 then '08'
					when ee.id_pregunta = 461 then '09'
					else null
				end
			) respuesta2
		from
			codificacion.cod_encuesta_codificacion cec
			join enc_encuesta ee on cec.id_informante = ee.id_informante
			and ee.id_pregunta in (453, 454, 455, 456, 457, 458, 459, 460, 461)
			and (
				ee.respuesta1 is not null
				and ee.respuesta1 <> ''
			)
		where
			cec.id_pregunta = 108
	) x
where
	cec.id_informante = x.id_informante
	and cec.id_pregunta = x.id_pregunta



---------------------------------------------------
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('rau', 'guz', 'raug', 'e10adc3949ba59abbe56e057f20f883e', '5465135', NULL, 'A', 'epaco', '2024-04-09 17:31:38.635', NULL, NULL, 46, 6, 'null', 6);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Rainer', 'Gutierrez Argandoña', 'rainergua2', 'e10adc3949ba59abbe56e057f20f883e', '67325140', NULL, 'I', 'rainergua', '2023-03-24 16:05:04.784', 'rainergua2', '2024-04-09 18:02:28.405', 4, 1, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Luis', 'Saisa', 'luissaisa', 'e10adc3949ba59abbe56e057f20f883e', '123456', NULL, 'I', 'rainergua', '2023-04-05 17:48:48.258', NULL, '2023-04-24 17:41:18.792', 5, 1, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Luis', 'Saisa', 'luissaisa', 'e10adc3949ba59abbe56e057f20f883e', '123654789', NULL, 'I', 'luissaisa', '2023-04-06 16:15:37.429', NULL, '2023-05-24 16:41:03.551', 7, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Juan Carlos', 'Aparicio Suarez', 'japaricio', 'e10adc3949ba59abbe56e057f20f883e', '68095555', NULL, 'I', 'rainergua', '2023-04-24 17:04:15.207', NULL, '2023-05-24 16:41:06.925', 1, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Rainer', 'Gutierrez', 'rainerguacodif', 'e10adc3949ba59abbe56e057f20f883e', '67325246', NULL, 'I', 'rainergua', '2023-04-24 18:31:28.689', NULL, '2023-05-24 16:41:12.821', 8, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Pico', 'Paco Suarez', 'psuarez', 'e10adc3949ba59abbe56e057f20f883e', '79536365', NULL, 'I', 'rainergua', '2023-04-24 18:32:43.554', NULL, '2023-05-24 16:41:17.125', 9, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Julian Roberto', 'Arce Ortiz', 'jrarceo', 'e10adc3949ba59abbe56e057f20f883e', '68095555', NULL, 'I', 'rainergua', '2023-03-23 14:51:23.568', NULL, '2023-05-24 16:41:23.374', 3, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('eddy', 'paco mamani', 'epaco', 'e10adc3949ba59abbe56e057f20f883e', '2546789', NULL, 'A', 'luissaisa', '2023-04-06 10:58:36.556', NULL, '2023-08-22 18:04:42.622', 6, 1, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Mirko', 'Perez Suxo', 'mirkoperez', 'e10adc3949ba59abbe56e057f20f883e', '68253568', NULL, 'I', 'rainergua', '2023-04-28 14:53:55.627', NULL, '2023-05-24 16:41:31.715', 10, 5, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Juan', 'Suarez Perez', 'juanperez', 'e10adc3949ba59abbe56e057f20f883e', '79522001', NULL, 'I', 'rainergua', '2023-04-28 14:54:54.794', NULL, '2023-05-24 16:41:34.284', 11, 5, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Juan Carlos', 'Suarez Perez', 'juansuarez', 'e10adc3949ba59abbe56e057f20f883e', '680755230', NULL, 'I', 'leorosas', '2023-05-25 14:37:16.567', NULL, '2023-05-25 14:37:27.089', 13, 2, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('José Hernan', 'Yujra', 'jyujrasup', 'e10adc3949ba59abbe56e057f20f883e', '69870488', NULL, 'A', 'leorosas', '2023-05-25 17:28:38.196', 'jyujrasup', '2023-06-12 09:09:06.735', 16, 5, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Rainer', 'Gutierrez Argandoña', 'rainergua', 'e10adc3949ba59abbe56e057f20f883e', '67325245', 'foto.png', 'A', 'postgres', '2023-03-23 14:41:24.803', 'leorosas', '2023-05-30 18:17:05.064', 2, 1, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Flavia Lisett', 'Mendoza Quiroz', 'fmendoza', 'e10adc3949ba59abbe56e057f20f883e', '69799337', NULL, 'I', 'elluscosup', '2023-08-23 11:27:29.472', NULL, '2023-08-23 11:28:47.686', 20, 6, NULL, 18);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Heraldo Edmundo', 'Nina Cortez', 'hnina', 'e10adc3949ba59abbe56e057f20f883e', '77249483', NULL, 'I', 'elluscosup', '2023-08-23 11:26:03.441', NULL, '2023-08-23 11:31:23.850', 19, 6, NULL, 18);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Leonardo', 'Rosas Paco', 'leorosas', 'e10adc3949ba59abbe56e057f20f883e', '78023564', NULL, 'I', 'rainergua', '2023-04-28 14:55:47.976', NULL, '2023-08-23 15:23:10.941', 12, 5, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Juan Carlos', 'Perez Suarez', 'juanperez', 'e10adc3949ba59abbe56e057f20f883e', '68235456', NULL, 'I', 'rainergua', '2023-05-25 14:40:06.554', NULL, '2023-08-23 15:23:23.407', 14, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Justina', 'Coro', 'jcorojt', 'e10adc3949ba59abbe56e057f20f883e', '12345678', NULL, 'A', 'rainergua', '2023-08-24 11:27:53.277', NULL, NULL, 26, 4, NULL, 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Mabel', 'Butrón', 'mbutroncod', 'e10adc3949ba59abbe56e057f20f883e', '68069306', NULL, 'A', 'leorosas', '2023-05-25 14:42:17.235', 'mbutronsup', '2023-08-24 11:45:05.632', 15, 6, NULL, 17);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Mabel', 'Butron', 'mbutronsup', 'e10adc3949ba59abbe56e057f20f883e', '68069306', NULL, 'A', 'leorosas', '2023-06-12 15:52:09.208', 'undefined', '2023-08-24 11:54:06.186', 17, 5, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Rolando', 'Vargas Benito', 'rvargascod', 'e10adc3949ba59abbe56e057f20f883e', '77788670', NULL, 'A', 'elluscosup', '2023-08-23 11:30:34.409', 'undefined', '2023-08-25 08:56:34.626', 22, 6, NULL, 18);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Heraldo Edmundo', 'Nina Cortez', 'hninacod', 'e10adc3949ba59abbe56e057f20f883e', '77249483', NULL, 'A', 'elluscosup', '2023-08-23 11:31:31.946', 'undefined', '2023-08-25 08:58:30.318', 23, 6, NULL, 18);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('José Hernan', 'Yujra Magnani', 'jyujraesp', 'e10adc3949ba59abbe56e057f20f883e', '69870489', NULL, 'A', 'rainergua', '2023-08-25 10:24:51.659', 'undefined', '2023-08-25 10:32:07.863', 27, 3, NULL, 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Mabel', 'Butrón', 'mbutronesp', 'e10adc3949ba59abbe56e057f20f883e', '68069306', NULL, 'A', 'rainergua', '2023-08-25 18:55:01.259', 'undefined', '2023-08-25 18:56:20.234', 28, 3, NULL, 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Estela', 'Llusco Higorre', 'elluscosup', 'e10adc3949ba59abbe56e057f20f883e', '123456', NULL, 'A', 'rainergua', '2023-08-23 10:47:06.521', 'undefined', '2023-08-29 09:09:53.247', 18, 5, 'primero', 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Heraldo Edmundo', 'Nina Cortez', 'hninasup', 'e10adc3949ba59abbe56e057f20f883e', '456789123', NULL, 'I', 'jyujraesp', '2023-09-05 15:13:19.452', NULL, '2023-09-05 17:21:51.921', 32, 5, 'primero', 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Flavia Lisett', 'Mendoza Quiroz', 'fmendozasup', 'e10adc3949ba59abbe56e057f20f883e', '77777777', NULL, 'I', 'jyujraesp', '2023-09-05 15:12:17.616', NULL, '2023-09-05 17:22:02.955', 31, 5, 'primero', 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Miflin Rosario', 'Morales Acebey', 'mmoralessup', 'e10adc3949ba59abbe56e057f20f883e', '987654321', NULL, 'I', 'jyujraesp', '2023-09-05 14:58:36.720', NULL, '2023-09-05 17:21:38.741', 30, 5, 'primero', 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Maribel Tania', 'Ibañez Reaza', 'mibañezsup', 'e10adc3949ba59abbe56e057f20f883e', '123456', NULL, 'I', 'jyujraesp', '2023-09-05 14:57:15.242', NULL, '2023-09-05 17:21:46.230', 29, 5, 'primero', 0);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Maribel Tania', 'Ibañez Reaza', 'mibañezjt', 'e10adc3949ba59abbe56e057f20f883e', '79132268', NULL, 'A', 'rainergua', '2023-08-23 15:30:11.304', 'jyujraesp', '2023-09-05 17:24:30.403', 25, 5, 'primero', NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Miflin Rosario', 'Morales Acebey', 'mmoralesjt', 'e10adc3949ba59abbe56e057f20f883e', '123456', NULL, 'A', 'rainergua', '2023-08-23 15:26:55.649', 'jyujraesp', '2023-09-05 17:24:43.433', 24, 5, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('Flavia Lisett', 'Mendoza Quiroz', 'fmendozacod', 'e10adc3949ba59abbe56e057f20f883e', '69799337', NULL, 'A', 'elluscosup', '2023-08-23 11:28:56.864', 'undefined', '2023-09-06 09:37:48.366', 21, 6, NULL, 18);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('sdfs', 'fsdf', '3453453', 'e10adc3949ba59abbe56e057f20f883e', '45345', NULL, 'A', 'epaco', '2024-04-09 12:15:04.914', NULL, NULL, 40, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('dasd', 'asdasd', '5sdfs', 'e10adc3949ba59abbe56e057f20f883e', '345345', NULL, 'A', 'epaco', '2024-04-09 12:15:04.914', NULL, NULL, 38, 6, NULL, NULL);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('hhh', 'yyy', 'xxxx', 'e10adc3949ba59abbe56e057f20f883e', '64564', NULL, 'A', 'epaco', '2024-04-09 12:15:04.913', NULL, NULL, 39, 5, 'PRIMERO', 6);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('rrrr', 'fdfsdfs', 'dfsdfs', 'e10adc3949ba59abbe56e057f20f883e', '34535', NULL, 'A', 'epaco', '2024-04-09 12:15:04.925', NULL, NULL, 41, 6, NULL, 6);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('lourdes', 'machicado cardoso', 'lmachicado', 'e10adc3949ba59abbe56e057f20f883e', '3453453', NULL, 'A', 'epaco', '2024-04-09 12:16:01.990', NULL, NULL, 42, 5, 'PRIMERO', 6);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('ana', 'cano', 'acano', 'e10adc3949ba59abbe56e057f20f883e', '3453453', NULL, 'A', 'epaco', '2024-04-09 15:32:20.986', NULL, NULL, 43, 6, 'null', 6);
INSERT INTO cod_usuario
(nombres, apellidos, login, "password", telefono, imagen, "estado", usucre, fecre, usumod, fecmod, id_usuario, rol_id, turno, cod_supvsr)
VALUES('jose', 'castro', 'jcastro', 'e10adc3949ba59abbe56e057f20f883e', '87987897', NULL, 'A', 'epaco', '2024-04-09 15:33:03.773', NULL, NULL, 44, 7, '', NULL);


---------------------------------------------------------------







INSERT INTO codificacion.cod_rol
(rol_descripcion, rol_codigo, menu)
VALUES('ADMINISTRADOR DEL SISTEMA', 'ADM', '[ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "items": [ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "routerLink": [ "/dashboard" ] } ] }, { "label": "Diccionarios", "icon": "pi pi-fw pi-book", "items": [ { "label": "Catálogos", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/catalogos" ] }, { "label": "Corrector", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/corrector" ] }, { "label": "Matriz OcAcEc", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/matriz-ocupacion-actividad-economica" ] } ] }, { "label": "Asignación", "icon": "pi pi-fw pi-arrows-h", "items": [ { "label": "Asignar Carga - Cod.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-codificacion" ] }, { "label": "Asignar Carga - Sup.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-supervision" ] } ] }, { "label": "Codificación", "icon": "pi pi-fw pi-check-square", "items": [ { "label": "Codificación", "icon": "pi pi-fw pi-check", "routerLink": [ "/codificacion" ] } ] }, { "label": "Supervisión", "icon": "pi pi-fw pi-eye", "items": [ { "label": "Supervisar Codificación", "icon": "pi pi-fw pi-check", "routerLink": [ "/codificacion/supervisar-codificacion" ] } ] }, { "label": "Gestion de datos", "icon": "pi pi-fw pi-database", "items": [ { "label": "ODBC", "icon": "pi pi-fw pi-sort-alt", "routerLink": [ "/odbc" ] } ] }, { "label": "Reportes", "icon": "pi pi-fw pi-search", "items": [ { "label": "Reportes", "icon": "pi pi-fw pi-table", "routerLink": [ "/reportes" ] } ] }, { "label": "Gestion de usuarios", "icon": "pi pi-fw pi-cog", "items": [ { "label": "Usuarios", "icon": "pi pi-fw pi-user-edit", "routerLink": [ "/usuarios" ] } ] } ]');
INSERT INTO codificacion.cod_rol
(rol_descripcion, rol_codigo, menu)
VALUES('RESPONSABLE ESPECIALISTA DE CODIFICACIÓN', 'RESP/ESP', '[ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "items": [ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "routerLink": [ "/dashboard" ] } ] }, { "label": "Diccionarios", "icon": "pi pi-fw pi-book", "items": [ { "label": "Catálogos", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/catalogos" ] }, { "label": "Corrector", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/corrector" ] }, { "label": "Matriz OcAcEc", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/matriz-ocupacion-actividad-economica" ] } ] }, { "label": "Asignación", "icon": "pi pi-fw pi-arrows-h", "items": [ { "label": "Asignar Carga - Sup.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-supervision" ] } ] }, { "label": "Supervisión", "icon": "pi pi-fw pi-eye", "items": [ { "label": "Supervisar Codificación", "icon": "pi pi-fw pi-check", "routerLink": [ "/codificacion/supervisar-codificacion" ] } ] }, { "label": "Gestión de datos", "icon": "pi pi-fw pi-database", "items": [ { "label": "ODBC", "icon": "pi pi-fw pi-sort-alt", "routerLink": [ "/odbc" ] } ] }, { "label": "Reportes", "icon": "pi pi-fw pi-search", "items": [ { "label": "Reportes", "icon": "pi pi-fw pi-table", "routerLink": [ "/reportes" ] } ] }, { "label": "Gestion de usuarios", "icon": "pi pi-fw pi-cog", "items": [ { "label": "Usuarios", "icon": "pi pi-fw pi-user-edit", "routerLink": [ "/usuarios" ] } ] } ]');
INSERT INTO codificacion.cod_rol
(rol_descripcion, rol_codigo, menu)
VALUES('JEFE DE TURNO', 'JT', '[ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "items": [ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "routerLink": [ "/dashboard" ] } ] }, { "label": "Asignación", "icon": "pi pi-fw pi-arrows-h", "items": [ { "label": "Asignar Carga - Cod.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-codificacion" ] }, { "label": "Asignar Carga - Sup.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-supervision" ] } ] }, { "label": "Reportes", "icon": "pi pi-fw pi-search", "items": [ { "label": "Reportes", "icon": "pi pi-fw pi-table", "routerLink": [ "/reportes" ] } ] }, { "label": "Gestion de usuarios", "icon": "pi pi-fw pi-cog", "items": [ { "label": "Usuarios", "icon": "pi pi-fw pi-user-edit", "routerLink": [ "/usuarios" ] } ] } ]');
INSERT INTO codificacion.cod_rol
(rol_descripcion, rol_codigo, menu)
VALUES('SUPERVISOR DE CODIFICACIÓN', 'SUP','[ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "items": [ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "routerLink": [ "/dashboard" ] } ] }, { "label": "Asignación", "icon": "pi pi-fw pi-arrows-h", "items": [ { "label": "Asignar Carga - Cod.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-codificacion" ] } ] }, { "label": "Supervisión", "icon": "pi pi-fw pi-eye", "items": [ { "label": "Supervisar Codificación", "icon": "pi pi-fw pi-check", "routerLink": [ "/codificacion/supervisar-codificacion" ] } ] }, { "label": "Reportes", "icon": "pi pi-fw pi-search", "items": [ { "label": "Reportes", "icon": "pi pi-fw pi-table", "routerLink": [ "/reportes" ] } ] }, { "label": "Gestión de usuarios", "icon": "pi pi-fw pi-cog", "items": [ { "label": "Usuarios", "icon": "pi pi-fw pi-user-edit", "routerLink": [ "/usuarios" ] } ] } ]');
INSERT INTO codificacion.cod_rol
(rol_descripcion, rol_codigo, menu)
VALUES('TÉCNICO EN CODIFICACIÓN', 'COD','[ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "items": [ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "routerLink": [ "/dashboard" ] } ] }, { "label": "Diccionarios", "icon": "pi pi-fw pi-book", "items": [ { "label": "Catálogos", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/catalogos" ] }, { "label": "Corrector", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/corrector" ] }, { "label": "Matriz OcAcEc", "icon": "pi pi-fw pi-bookmark", "routerLink": [ "/diccionarios/matriz-ocupacion-actividad-economica" ] } ] }, { "label": "Asignación", "icon": "pi pi-fw pi-arrows-h", "items": [ { "label": "Asignar Carga - Cod.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-codificacion" ] }, { "label": "Asignar Carga - Sup.", "icon": "pi pi-fw pi-sort-numeric-down", "routerLink": [ "/codificacion/asignar-carga-supervision" ] } ] }, { "label": "Codificación", "icon": "pi pi-fw pi-check-square", "items": [ { "label": "Codificación", "icon": "pi pi-fw pi-check", "routerLink": [ "/usuCodificador" ] } ] }, { "label": "Supervisión", "icon": "pi pi-fw pi-eye", "items": [ { "label": "Supervisar Codificación", "icon": "pi pi-fw pi-check", "routerLink": [ "/codificacion/supervisar-codificacion" ] } ] }, { "label": "Gestion de datos", "icon": "pi pi-fw pi-database", "items": [ { "label": "ODBC", "icon": "pi pi-fw pi-sort-alt", "routerLink": [ "/odbc" ] } ] }, { "label": "Reportes", "icon": "pi pi-fw pi-search", "items": [ { "label": "Reportes", "icon": "pi pi-fw pi-table", "routerLink": [ "/reportes" ] } ] }, { "label": "Gestion de usuarios", "icon": "pi pi-fw pi-cog", "items": [ { "label": "Usuarios", "icon": "pi pi-fw pi-user-edit", "routerLink": [ "/usuarios" ] } ] } ]');
INSERT INTO codificacion.cod_rol
(rol_descripcion, rol_codigo, menu)
VALUES('TECNICO DE CONTINGENCIA', 'CONT','[ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "items": [ { "label": "Dashboard", "icon": "pi pi-fw pi-microsoft", "routerLink": [ "/dashboard" ] } ] }, { "label": "Gestion de datos", "icon": "pi pi-fw pi-database", "items": [ { "label": "ODBC", "icon": "pi pi-fw pi-sort-alt", "routerLink": [ "/odbc" ] } ] } ]');







INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(57, 117, '1400819', '00000000', 507, '9', '  ....Primaria ...4..........', NULL, NULL, 'VENDEDORA DE PUESTO', '...Trabajadora(or) familiar sin remuneración..', 'VENDEDORA', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendedoradepuesto', '02', 'vendedora', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(28, 99, '2057814', '00000000', 363, '34', '  ........Licenciatura ....5..', NULL, NULL, 'DUOITOKO', '..Empleadora(or) u socia(o)...', NULL, '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'duoitoko', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(18, 94, '2057804', '00000000', 324, '025', '  ........Licenciatura ..3....', NULL, NULL, 'VENTA DE CONDIMENTO', 'Trabajador(a) por cuenta propia.....', 'CONDIMENTOS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'ventadecondimento', '02', 'condimentos', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(19, 96, '2057810', '00000000', 337, '52', '  ........Licenciatura ....5..', NULL, NULL, 'ATENCION DE INTERNET', 'Trabajador(a) por cuenta propia.....', 'SERVICIO DE INTERNET', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'atenciondeinternet', '02', 'serviciodeinternet', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(20, 96, '2057810', '00000000', 338, '52', '  ........Licenciatura ....5..', NULL, NULL, 'PROFESORA DE PRIMARIA', '.Empleada(o) u obrera(o)....', 'ENSEÑANZA NIVEL PRIMARiO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'profesoradeprimaria', '02', 'ensenanzanivelprimario', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(21, 96, '2057810', '00000000', 339, '33', '  ........Licenciatura ....5..', NULL, NULL, 'CONSULTOR LINEA', '.Empleada(o) u obrera(o)....', 'SERVICIO DE CONSULTORIA', '.Fuera de la vivienda pero en el mismo municipio..', 'LA PAZ', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'consultorlinea', '02', 'serviciodeconsultoria', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(22, 96, '2057810', '00000000', 340, '32', '  ........Licenciatura ....5..', NULL, NULL, 'ADMINISTRACION', '.Empleada(o) u obrera(o)....', 'ADMINISTRACION', '.Fuera de la vivienda pero en el mismo municipio..', 'LA PAZ', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'administracion', '02', 'administracion', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(23, 96, '2057810', '00000000', 341, '28', '  ........Licenciatura ....5..', NULL, NULL, 'ENTRENADOR PERSONAL', 'Trabajador(a) por cuenta propia.....', 'SERVICIO DE SALUD', '.Fuera de la vivienda pero en el mismo municipio..', 'LA PAZ', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'entrenadorpersonal', '02', 'serviciodesalud', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(24, 96, '2057810', '00000000', 342, '27', '  ........Licenciatura ....5..', NULL, NULL, 'DJ', 'Trabajador(a) por cuenta propia.....', 'ENTRETENIMIENTO', '.Fuera de la vivienda pero en el mismo municipio..', 'LA PAZ', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'dj', '02', 'entretenimiento', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(25, 97, '2057811', '00000000', 345, '44', '  .........Maestria .2.', NULL, NULL, 'CONTRATACIONGS', '..Empleadora(or) u socia(o)...', 'ESTAOISTICA S', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'contrataciongs', '02', 'estaoisticas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(38, 107, '4797702', '00000000', 426, '46', '  .....Secundaria ....5......', '.NO', 'ACRICOLA', 'ACRICOLA', '.....', NULL, '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'acricola', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(26, 98, '2057813', '00000000', 353, '48', '  ........Licenciatura ....5..', NULL, NULL, 'APOYO EN ADQUISICIONES Y CONTRATACIONE', '.Empleada(o) u obrera(o)....', 'ESTADISTICA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'apoyoenadquisicionesycontratacione', '02', 'estadistica', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(27, 99, '2057814', '00000000', 362, '68', '  ...Medio ...4.......', NULL, NULL, 'COMERCIANTE', 'Trabajador(a) por cuenta propia.....', 'BOZORHI LOS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comerciante', '02', 'bozorhilos', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(29, 100, '1400801', '00000000', 369, '25', '  .....Secundaria 1..........', NULL, NULL, 'ALBAÑIL', 'Trabajador(a) por cuenta propia.....', 'ALBAÑIL', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'albanil', '02', 'albanil', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(30, 101, '4797160', '00000000', 380, '36', '  ........Licenciatura ....5..', NULL, NULL, 'TECNICO ELECTRONICO', 'Trabajador(a) por cuenta propia.....', 'SERVICIO DE SEGURIDAD ELECTRONICA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'tecnicoelectronico', '02', 'serviciodeseguridadelectronica', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(31, 101, '4797160', '00000000', 381, '33', '  ........Licenciatura ....5..', NULL, NULL, 'TNGENIFRO INFOKMHIL CO', '.Empleada(o) u obrera(o)....', 'DESARROLLO DE SOFTWARE', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'tngenifroinfokmhilco', '02', 'desarrollodesoftware', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(33, 103, '1400807', '00000000', 393, '50', '  ....Primaria ..3...........', NULL, NULL, 'COMERCIANTE', 'Trabajador(a) por cuenta propia.....', 'VENTA DE GELATINAS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comerciante', '02', 'ventadegelatinas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(34, 106, '1400809', '00000000', 417, '34', '  .....Secundaria .2.........', '.NO', NULL, 'CONSTRUCCION', '.Empleada(o) u obrera(o)....', 'ALBAÑIL', '..En otro municipio.', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'construccion', '02', 'albanil', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(35, 106, '1400809', '00000000', 418, '33', '  ....Primaria .....6........', NULL, NULL, 'CONSTRUCCION', '.Empleada(o) u obrera(o)....', 'ALBAÑIL', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'construccion', '02', 'albanil', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(36, 106, '1400809', '00000000', 421, '72', 'Ninguno 1  ..........', NULL, NULL, 'AYUDANTE DE COCINA', '.Empleada(o) u obrera(o)....', 'AYUDANTE DE COCINA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'ayudantedecocina', '02', 'ayudantedecocina', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(37, 107, '4797702', '00000000', 425, '40', '  ....Primaria ....5.........', '.NO', NULL, 'COMERCIANTE', '.....', 'COMERCIANTE', '..En otro municipio.', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comerciante', '02', 'comerciante', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(39, 107, '4797702', '00000000', 431, '14', '  .....Secundaria ..3........', NULL, NULL, 'INDEPENDIENTE', '.....', 'F', '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'independiente', '02', 'f', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(40, 107, '4797702', '00000000', 432, '13', '  .....Secundaria ..3........', NULL, NULL, 'OBRERO DE CONSTRUCCION', '.Empleada(o) u obrera(o)....', NULL, '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'obrerodeconstruccion', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(41, 108, '2794222', '00000000', 433, '47', '  . Basico .2............', NULL, NULL, 'VENDEDORA DE CHICHARON DE POLLO', 'Trabajador(a) por cuenta propia.....', 'VENDEDORA DE CHICHARRON DE POLLO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendedoradechicharondepollo', '02', 'vendedoradechicharrondepollo', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(42, 110, '1334927', '00000000', 449, '40', '  .....Secundaria .....6.....', NULL, NULL, 'ALBAÑIL', '.Empleada(o) u obrera(o)....', 'CONSTRUCTOR DE CASAS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'albanil', '02', 'constructordecasas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(43, 110, '1334927', '00000000', 450, '45', '  ..Intermedio ..3........', NULL, NULL, 'COMERCIANTE', 'Trabajador(a) por cuenta propia.....', 'VENTA DE ROPA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comerciante', '02', 'ventaderopa', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(44, 112, '1334923', '00000000', 465, '31', '  .....Secundaria 1..........', NULL, NULL, 'ALBAÑIL', '.Empleada(o) u obrera(o)....', NULL, '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'albanil', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(32, 102, '1334934', '4797702', 385, '11', '  .....Secundaria 1..........', NULL, NULL, 'ACRICOLA', '.....', NULL, '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'acricola', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(45, 112, '1334923', '00000000', 466, '30', '  ....Primaria ....5.........', NULL, NULL, 'COME RCIN NTE', 'Trabajador(a) por cuenta propia.....', NULL, '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comercinnte', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(46, 112, '1334923', '00000000', 468, '11', '  ....Primaria ....5.........', '.NO', NULL, NULL, '.....', 'S', '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '02', 's', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(47, 113, '1400818', '00000000', 473, '33', '  .....Secundaria 1..........', NULL, NULL, 'COCINERA', 'Trabajador(a) por cuenta propia.....', 'PREPARADO DE COMIDA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'cocinera', '02', 'preparadodecomida', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(48, 114, '1334925', '00000000', 481, '50', '  . Basico ..3...........', NULL, NULL, 'OBRERO', '.Empleada(o) u obrera(o)....', 'CONSTRUCTOR DE CASAS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'obrero', '02', 'constructordecasas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(49, 114, '1334925', '00000000', 482, '24', '  .....Secundaria .....6.....', NULL, NULL, 'OBRERO', '.Empleada(o) u obrera(o)....', 'CONSTRUCTOR DE CASAS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'obrero', '02', 'constructordecasas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(50, 114, '1334925', '00000000', 483, '30', '  .....Secundaria .....6.....', NULL, NULL, 'COMERCIANTE', 'Trabajador(a) por cuenta propia.....', 'VENTA DE ABARROTES', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comerciante', '02', 'ventadeabarrotes', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(51, 115, '4797199', '00000000', 489, '47', '  ........Licenciatura ....5..', NULL, NULL, 'FUNCIONARIO PUBLICO', '.Empleada(o) u obrera(o)....', 'SERVICIO ADMINISTRATIVO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'funcionariopublico', '02', 'servicioadministrativo', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(52, 115, '4797199', '00000000', 490, '47', '  .......Tecnico Superior ..3...', NULL, NULL, 'ASISTENTE ADMINISTRATIVO DE U.', '.Empleada(o) u obrera(o)....', 'SERVICIO ADMINISTRATIVO EN EDUCACION', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'asistenteadministrativodeu', '02', 'servicioadministrativoeneducacion', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(53, 115, '4797199', '00000000', 493, '20', '  .......Tecnico Superior .2....', NULL, NULL, 'CONSTRUCCION', '.Empleada(o) u obrera(o)....', 'CONSTRUCCION DE CASAS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'construccion', '02', 'construcciondecasas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(54, 116, '1334912', '00000000', 498, '18', 'Ninguno 1  ..........', NULL, NULL, 'VENTA DE COMIDA', 'Trabajador(a) por cuenta propia.....', 'VENTA DE COMIDA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'ventadecomida', '02', 'ventadecomida', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(55, 117, '1400819', '00000000', 505, '38', '  ...Medio ...4.......', NULL, NULL, 'COMERCIANTE', 'Trabajador(a) por cuenta propia.....', 'VENTA PRODUCTOS MENORES ', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comerciante', '02', 'ventaproductosmenores', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(56, 117, '1400819', '00000000', 506, '14', '  .....Secundaria ..3........', NULL, NULL, 'VENOEUUK VE RUES TO', '...Trabajadora(or) familiar sin remuneración..', 'VENDEDORA', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'venoeuukveruesto', '02', 'vendedora', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(58, 118, '1334990', '00000000', 516, '28', '  ....Primaria ..3...........', NULL, NULL, 'VENDEDOR ROPA', 'Trabajador(a) por cuenta propia.....', 'VENTA DE ROPA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendedorropa', '02', 'ventaderopa', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(59, 119, '1400817', '00000000', 522, '19', '  .....Secundaria .....6.....', NULL, NULL, 'EMPLEADA', '.Empleada(o) u obrera(o)....', 'EMBASADO DESAL', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'empleada', '02', 'embasadodesal', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(60, 119, '1400817', '00000000', 523, '17', '  ..Intermedio ..3........', NULL, NULL, 'EMNLEHLK', '.Empleada(o) u obrera(o)....', 'EMBASADO DE SAL', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'emnlehlk', '02', 'embasadodesal', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(61, 121, '1334916', '00000000', 537, '24', '  ....Primaria .......8......', '.NO', NULL, 'AMADE CASA', 'Trabajador(a) por cuenta propia.....', 'LABOR DE CASA', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'amadecasa', '02', 'labordecasa', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(63, 126, '1400827', '00000000', 569, '67', '  ....Primaria ..3...........', NULL, NULL, 'VENDEDOR EN PUESTO', 'Trabajador(a) por cuenta propia.....', 'VENTA DE VERDURA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendedorenpuesto', '02', 'ventadeverdura', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(64, 127, '1400802', '00000000', 577, '23', '  .....Secundaria .....6.....', NULL, NULL, 'VENTA DE RORA', '.Empleada(o) u obrera(o)....', 'VENTA DE ROPA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'ventaderora', '02', 'ventaderopa', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(65, 127, '1400802', '00000000', 578, '21', '  .....Secundaria .....6.....', NULL, NULL, 'ATENCION MESERA EN RESTAURANT', '.Empleada(o) u obrera(o)....', 'CAJERA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'atencionmeseraenrestaurant', '02', 'cajera', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(66, 128, '1334933', '00000000', 585, '29', '  .....Secundaria ....5......', NULL, 'I', 'LAVANDERA DE ROPA', 'Trabajador(a) por cuenta propia.....', NULL, 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'lavanderaderopa', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(68, 132, '1334918', '00000000', 609, '33', '  .....Secundaria .....6.....', NULL, NULL, 'VENTA EN PUESTO', 'Trabajador(a) por cuenta propia...Trabajadora(or) familiar sin remuneración..', 'VENDEDORA', '.Fuera de la vivienda pero en el mismo municipio..', 'ORVRO', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'ventaenpuesto', '02', 'vendedora', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(69, 134, '1334917', '00000000', 618, '24', '  ......Tecnico Medio .2....', NULL, NULL, 'REPARTIDOR CERVEZA', '.Empleada(o) u obrera(o)....', 'REPARTIDOR CERVEZA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'repartidorcerveza', '02', 'repartidorcerveza', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(70, 134, '1334917', '00000000', 620, '20', '  .....Secundaria .....6.....', NULL, NULL, 'VENDEOOR DE COMIDA', 'Trabajador(a) por cuenta propia.....', 'VENDEDOR DE COMIDA', '.Fuera de la vivienda pero en el mismo municipio.En otro municipio.', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendeoordecomida', '02', 'vendedordecomida', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(71, 135, '1400825', '00000000', 625, '52', '  .....Secundaria ..3........', NULL, NULL, 'VENDEDORA EH PUESTO', 'Trabajador(a) por cuenta propia.....', 'RELLENJS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendedoraehpuesto', '02', 'rellenjs', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(72, 136, '1400815', '00000000', 633, '62', '  .....Secundaria .....6.....', NULL, NULL, 'TOOGKH0', 'Trabajador(a) por cuenta propia.....', 'SACAR FOTOS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'toogkh0', '02', 'sacarfotos', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(73, 136, '1400815', '00000000', 634, '58', '  ...Medio ...4.......', NULL, NULL, 'GASTRONOMIA', 'Trabajador(a) por cuenta propia.....', 'PREPARADO DE COMIDAS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'gastronomia', '02', 'preparadodecomidas', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(74, 137, '1400826', '00000000', 641, '23', '  .....Secundaria .....6.....', NULL, NULL, 'CHOFER ', '.Empleada(o) u obrera(o)....', 'TRANSPORTE PUBLICO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'chofer', '02', 'transportepublico', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(75, 138, '1400828', '00000000', 649, '44', '  .....Secundaria .....6.....', '.NO', 'DEDICA COMERCIO', 'VENDEDORA DE PRODUCTO', 'Trabajador(a) por cuenta propia.....', 'VENDE POLLO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'vendedoradeproducto', '02', 'vendepollo', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(76, 138, '1400828', '00000000', 650, '22', '  .....Secundaria ....5......', NULL, NULL, 'PRENSADOR EN UN TALLER DE CHATARRA', '.Empleada(o) u obrera(o)....', 'VENTA DE CHATARRA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'prensadorenuntallerdechatarra', '02', 'ventadechatarra', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(9, 88, '2057809', '00000000', 273, '59', '  ...Medio ...4....Tecnico Superior 1...Licenciatura 1......', '.NO', NULL, 'CONTADOK', '.Empleada(o) u obrera(o)....', 'SERVICIOS', 'Dentro o junto a esta vivienda...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'contadok', '02', 'servicios', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(10, 88, '2057809', '00000000', 275, '53', '  .....Secundaria 1..........', NULL, NULL, 'EMPLEADA', 'Trabajador(a) por cuenta propia.....', 'S ZRVICIOS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'empleada', '02', 'szrvicios', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(62, 125, '1400824', '00000000', 561, '44', '  .....Secundaria .....6.....', NULL, NULL, 'CHOFER', '.Empleada(o) u obrera(o)....', 'SERVICIO DE TRANSPOR INTERNACIONAL', '...En otro país', 'CHILE', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'chofer', '02', 'serviciodetransporinternacional', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(77, 140, '1447825', '00000000', 657, '37', 'Ninguno 1 Curso de alfabetizacion 1  Inicial 1.2. Basico 1.2.3.4.5.Intermedio 1.2.3.Medio 1.2.3.4.Primaria 1.2.3.4.5.6.7.8.Secundaria 1.2.3.4.5.6.Tecnico Medio 1.2.Tecnico Superior 1.2.3.Licenciatura 1.2.3.4.5.Maestria 1.2.Doctorado 1.2.3.4', 'SI.NO', NULL, 'AGRICULTOK', 'Trabajador(a) por cuenta propia.Empleada(o) u obrera(o).Empleadora(or) u socia(o).Trabajadora(or) familiar sin remuneración.Trabajadora(or) del hogar.Cooperativista de producción', 'LECMERIA', 'Dentro o junto a esta vivienda.Fuera de la vivienda pero en el mismo municipio.En otro municipio.En otro país', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'agricultok', '02', 'lecmeria', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(78, 140, '1447825', '00000000', 658, '33', 'Ninguno 1 Curso de alfabetizacion 1  Inicial 1.2. Basico 1.2.3.4.5.Intermedio 1.2.3.Medio 1.2.3.4.Primaria 1.2.3.4.5.6.7.8.Secundaria 1.2.3.4.5.6.Tecnico Medio 1.2.Tecnico Superior 1.2.3.Licenciatura 1.2.3.4.5.Maestria 1.2.Doctorado 1.2.3.4', 'SI.NO', NULL, 'AGRICULTOKH', 'Trabajador(a) por cuenta propia.Empleada(o) u obrera(o).Empleadora(or) u socia(o).Trabajadora(or) familiar sin remuneración.Trabajadora(or) del hogar.Cooperativista de producción', 'L ECHEKIH', 'Dentro o junto a esta vivienda.Fuera de la vivienda pero en el mismo municipio.En otro municipio.En otro país', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'agricultokh', '02', 'lechekih', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(3, 80, '1264258', '8200000', 217, '31', 'Ninguno 1 Curso de alfabetizacion 1  Inicial 1.2. Basico 1.2.3.4.5.Intermedio 1.2.3.Medio 1.2.3.4.Primaria 1.2.3.4.5.6.7.8.Secundaria 1.2.3.4.5.6.Tecnico Medio 1.2.Tecnico Superior 1.2.3.Licenciatura 1.2.3.4.5.Maestria 1.2.Doctorado 1.2.3.4', 'SI.NO', 'Test 48', 'Test49', 'Trabajador(a) por cuenta propia.Empleada(o) u obrera(o).Empleadora(or) u socia(o).Trabajadora(or) familiar sin remuneración.Trabajadora(or) del hogar.Cooperativista de producción', 'Test 51', 'Dentro o junto a esta vivienda.Fuera de la vivienda pero en el mismo municipio.En otro municipio.En otro país', 'Test 52', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'test49', '02', 'test51', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(4, 80, '1264258', '8200000', 218, '29', '  ..........', NULL, '0648', '0649', '.....', '0651', '...', '0652', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, '0649', '02', '0651', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(5, 81, '1264257', '00000000', 225, '32', '  .....Secundaria ..3........', NULL, NULL, 'CONSTRUCTOR DE CASA', '.Empleada(o) u obrera(o)....', 'CONSTRUCTOR DE CASA', '.Fuera de la vivienda pero en el mismo municipio..', 'ORURO', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'constructordecasa', '02', 'constructordecasa', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(6, 81, '1264257', '00000000', 226, '36', '  ......Tecnico Medio .2....', NULL, NULL, 'AM A DE CASA', '....Trabajadora(or) del hogar.Cooperativista de producción', 'COMERCIANTE DE MERCADO', '.Fuera de la vivienda pero en el mismo municipio..', 'KANTUTA', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'amadecasa', '02', 'comerciantedemercado', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(7, 85, '2057815', '00000000', 257, '40', '  ........Licenciatura ....5..', NULL, NULL, 'ARLHIVISTD', '.Empleada(o) u obrera(o)....', 'SERUIDO R PUYLICO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'arlhivistd', '02', 'seruidorpuylico', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(8, 86, '2057812', '00000000', 265, '56', '  ........Licenciatura ....5..', '.NO', NULL, 'CONDUCTO E', 'Trabajador(a) por cuenta propia.....', 'CONDUCROZ', '.Fuera de la vivienda pero en el mismo municipio..', 'ZONA URBANA', NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'conductoe', '02', 'conducroz', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(17, 94, '2057804', '00000000', 323, '032', '  ........Licenciatura ....5..', NULL, NULL, 'EMPLEADO PUBLICO', '.....', NULL, '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'empleadopublico', '02', NULL, NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(16, 94, '2057804', '00000000', 322, '058', '  . Basico 1.............', NULL, NULL, 'COMERCIONTE', 'Trabajador(a) por cuenta propia.....', 'CONDIMENTOS', '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'comercionte', '02', 'condimentos', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(67, 128, '1334933', '00000000', 588, '11', '  ....Primaria .....6........', '.NO', NULL, NULL, '.....', ' 1', '...', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '02', '1', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(11, 89, '2057801', '00000000', 281, '034', '  .........Maestria 1..', NULL, NULL, 'CONSULTOR EN PROYECTO SECTOR PUBLICO', '.Empleada(o) u obrera(o)....', 'SERVICIO DE CONSULTORIA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'consultorenproyectosectorpublico', '02', 'serviciodeconsultoria', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(12, 90, '2057802', '00000000', 289, '31', '  ........Licenciatura ....5..', NULL, NULL, 'MECANICO', 'Trabajador(a) por cuenta propia.....', 'MANTENIMIENTO', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'mecanico', '02', 'mantenimiento', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(13, 91, '2057808', '00000000', 297, '45', '  ........Licenciatura 1......', NULL, NULL, 'CONSULTOR EN LINEA', '.Empleada(o) u obrera(o)....', 'SERVICIOS', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'consultorenlinea', '02', 'servicios', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(14, 91, '2057808', '00000000', 298, '40', '  ........Licenciatura 1......', NULL, NULL, 'DOCENTE', '.Empleada(o) u obrera(o)....', 'ENSEÑANZA', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'docente', '02', 'ensenanza', NULL, NULL, NULL, 0, 0);
INSERT INTO codificacion.cod_p49_p51
(id_p49_p51, secuencial, i00, i001a, nro, p26, p41, p45, p48esp, p49, p50, p51, p52, p52esp, codigocodif_ocu, codigocodif_v1_ocu, codigocodif_v2_ocu, "estado", usucre, feccre, usucodificador, feccodificador, usuverificador, fecverificador, usuverificador2, fecverificador2, respuesta_normalizada_ocu, departamento, respuesta_normalizada_act, codigocodif_act, codigocodif_v1_act, codigocodif_v2_act, orden_ocu, orden_act)
VALUES(15, 92, '2057805', '00000000', 305, '45', '  ........Licenciatura ....5..', NULL, NULL, 'CONTADOR', '.Empleada(o) u obrera(o)....', 'TECNICO ADMINISTRATIV0', '.Fuera de la vivienda pero en el mismo municipio..', NULL, NULL, NULL, NULL, 'ELABORADO', 'admin', '2024-05-11 23:08:34.483', NULL, NULL, NULL, NULL, NULL, NULL, 'contador', '02', 'tecnicoadministrativ0', NULL, NULL, NULL, 0, 0);
