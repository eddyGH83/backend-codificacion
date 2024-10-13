module.exports = {
    apps: [
    {
    name: "codificacion", // Nombre de la aplicación: pm2 restart codificacion
    script: "app.js", // Nombre del archivo que se ejecutará
    instances: 0, // 0: tomará el número de núcleos del procesador, -1: no se creará cluster, 1: se creará un solo proceso ... etc
    exec_mode: "cluster", // cluster: se creará un cluster, fork: se creará un proceso
    },
    ],
   };
/* 
COMANDOS UTILES:
Para instalar pm2: 
    npm install -g pm2

B A S I C O

Para iniciar la aplicación: 
    pm2 start app.js
Para ver las aplicaciones que se están ejecutando: 
    pm2 list
Para ver los logs de la aplicación: 
    pm2 logs codificacion
Para detener la aplicación: 
    pm2 stop codificacion
Para ver la configuración de la aplicación:
    pm2 show codificacion    



A V A N Z A D O
Para elimiar la configuracion de la aplicación:
    pm2 delete ecosystem.config.js 
Para una nueva configuracion de la aplicación:
    pm2 start ecosystem.config.js 
    pm2 save
pm2 start codificacion
pm2 restart codificacion
pm2 reload codificacion
pm2 stop codificacion
pm2 delete codificacion

*/