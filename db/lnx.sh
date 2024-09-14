:: archivo postgresql para configurar la zona horaria
:: en la base de datos de postgresql (zona horaria Bolivia)

@echo off

:: Variables de configuración
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=tu_base_de_datos
set DB_USER=tu_usuario
set DB_PASSWORD=tu_contraseña
set TIMEZONE=America/La_Paz

:: Exportar la contraseña para que psql no la solicite
set PGPASSWORD=%DB_PASSWORD%

:: Comando para configurar la zona horaria
psql -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -U %DB_USER% -c "ALTER DATABASE %DB_NAME% SET timezone TO '%TIMEZONE%';"

:: Limpiar la variable de contraseña
set PGPASSWORD=

echo Zona horaria configurada a %TIMEZONE% para la base de datos %DB_NAME%.