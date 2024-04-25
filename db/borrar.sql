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



