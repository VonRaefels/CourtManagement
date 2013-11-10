//!mongo [name].js

DB_NAME = "CourtManagement";
DB_LOCATION = "localhost:27017";


var connection = new Mongo(DB_LOCATION);
db = connection.getDB(DB_NAME);
db.createCollection("Urbanizacion");
db.createCollection("User");
db.createCollection("Cuadro");
db.createCollection("Pista");


