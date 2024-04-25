process.env.PORT = process.env.PORT || 3002;
process.env.NODE_ENV = 'production';
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.SEED = process.env.SEED || 'desarrollo';
// process.env.PGUSER = "postgres";
// process.env.PGHOST = "localhost";
// process.env.PGPASSWORD = "6180158";
// process.env.PGDATABASE = "db_eh2020";
// process.env.PGPORT = 5432;

process.env.PGUSER = "app_censo";
process.env.PGHOST = "10.10.10.39";
process.env.PGPASSWORD = "app_censo";
process.env.PGDATABASE = "db_ac2021";
process.env.PGPORT = 5432;
