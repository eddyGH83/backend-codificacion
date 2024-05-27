const { Pool } = require('pg');

// const con = new Pool({
// 	user: "postgres",
// 	host: "localhost",
// 	password: "6180158",
// 	database: "db_ac2021",
// 	port: "5432",
// });

/*const con = new Pool({
	user: "rgutierreza",
	host: "10.10.10.44",
	password: "b8QLYI9R71Kb",
	database: "db_transcripcion",
	port: "5422",
});*/

/* const con = new Pool({
	user: "ngonzales",
	host: "10.32.0.109",
	password: "1T7h4BoTaElB",
	database: "db_transcripcion",
	port: "5432",
}); */


// conexion: EEUU
/* const con = new Pool({
	user: "postgres",
	host: "localhost",
	password: "pg*",
	database: "db_cien2",
	port: "5432",
});
 */
// Produccion
/* const con = new Pool({
	user: "epaco",
	host: "10.32.0.119",
	password: "maced8jG8658",
	database: "db_transcripcion_ce",
	port: "5432",
}); */

const con = new Pool({
	user: "epaco",
	host: "10.32.0.119",
	password: "maced8jG8658",
	database: "db_digitalizacion",
	port: "5432",
});

/* const con = new Pool({
	user: "postgres",
	host: "localhost",
	password: "toor",
	database: "db_transcripcion_ce",
	port: "5432",
}); */

/* const con = new Pool({
	user: "postgres",
	host: "localhost",
	password: "toor",
	database: "db_digitalizacion",
	port: "5432",
}); */

module.exports = con;