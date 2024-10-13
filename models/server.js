const express = require('express')
const cors = require('cors');

// ia, para el file-excel
path = require('path');

class Server {
    constructor() {
        this.app = express()
        // Aumentar el límite de tamaño del cuerpo de la solicitud
        this.app.use(express.json({ limit: '900mb' })); // Para solicitudes JSON
        this.app.use(express.urlencoded({ limit: '900mb', extended: true })); // Para solicitudes URL-encoded


        // ia, para el file-excel, ruta absoluta a la carpeta 'file-excel'
        const rutaAbsolutaFileExcel = path.resolve(__dirname, '../odbc-excel');
        console.log('Ruta Absoluta a file-excel:', rutaAbsolutaFileExcel);


        // ia, para el file-excel, para Configurar Express para servir archivos estáticos desde 'file-excel'
        this.app.use('/odbc-excel', express.static(rutaAbsolutaFileExcel));

        this.port = process.env.PORT;

        // Middelwares
        this.middelwares();

        //Ruras de mi aplicacion
        this.routes();

        // Verificar la memoria del heap cada 10 segundos
        // this.checkHeapMemory();

    }

    middelwares() {
        //CORS
        this.app.use(cors());
        //todo se cambiara a Json
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public'));
    }


    routes() {
        this.app.use('/api/diccionarios', require('../routes/diccionarios.routes'));
        this.app.use('/api/usuarios', require('../routes/usuarios.routes'));
        this.app.use('/api/login', require('../routes/login.routes'));
        this.app.use('/api/codificacion', require('../routes/codificacion.routes'));
        this.app.use('/api/reportes', require('../routes/reportes.routes'));
        this.app.use('/api/automatica', require('../routes/automatica.routes'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }


    /* checkHeapMemory() {
        setInterval(() => {
            const memoryUsage = process.memoryUsage();
            console.log(`Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
            console.log(`RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`);
        }, 10000); // Cada 10 segundos
    } */


}

module.exports = Server;