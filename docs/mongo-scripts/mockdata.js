//!mongo [name].js

DB_NAME = "CourtManagement";
DB_LOCATION = "localhost:27017";

var connection = new Mongo(DB_LOCATION);
db = connection.getDB(DB_NAME);

db.Urbanizacion.remove();
db.User.remove();
db.Cuadro.remove();
db.Pista.remove();

var idUrbas = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
var idUsers = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
var idCuadros = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()]
var idPistas = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];


db.Urbanizacion.save({_id: idUrbas[0], name: "Las Matas"});
db.Urbanizacion.save({_id: idUrbas[1], name: "Las Matas 2"});
db.Urbanizacion.save({_id: idUrbas[2], name: "Las Rozas"});
db.Urbanizacion.save({_id: idUrbas[3], name: "Alcobendas"});
db.Urbanizacion.save({_id: idUrbas[4], name: "Moratalaz"});

db.User.save({_id: idUsers[0], _idUrba: idUrbas[0], name: '74', password: '12345'});
db.User.save({_id: idUsers[1], _idUrba: idUrbas[0], name: '74', password: '12345'});
db.User.save({_id: idUsers[2], _idUrba: idUrbas[1], name: '74', password: '12345'});
db.User.save({_id: idUsers[3], _idUrba: idUrbas[2], name: '74', password: '12345'});
db.User.save({_id: idUsers[4], _idUrba: idUrbas[2], name: '74', password: '12345'});
db.User.save({_id: idUsers[5], _idUrba: idUrbas[3], name: '74', password: '12345'});

db.Cuadro.save({_id: idCuadros[0], _idUrba: idUrbas[0], name: 'Tenis', start: '07:00:00'});
db.Cuadro.save({_id: idCuadros[1], _idUrba: idUrbas[0], name: 'Padel', start: '07:00:00'});
db.Cuadro.save({_id: idCuadros[2], _idUrba: idUrbas[0], name: 'Squash', start: '07:00:00'});
db.Cuadro.save({_id: idCuadros[3], _idUrba: idUrbas[1], name: 'Tenis', start: '07:00:00'});
db.Cuadro.save({_id: idCuadros[4], _idUrba: idUrbas[2], name: 'Tenis', start: '07:00:00'});

db.Pista.save({_id: idPistas[0], _idCuadro: idCuadros[0], name: 'Pista Norte'});
db.Pista.save({_id: idPistas[1], _idCuadro: idCuadros[0], name: 'Pista Sur'});
db.Pista.save({_id: idPistas[2], _idCuadro: idCuadros[0], name: 'Pista Cristal'});
db.Pista.save({_id: idPistas[3], _idCuadro: idCuadros[1], name: 'Pista Este'});
db.Pista.save({_id: idPistas[4], _idCuadro: idCuadros[1], name: 'Pista Norte'});
db.Pista.save({_id: idPistas[5], _idCuadro: idCuadros[2], name: 'Pista Este'});
db.Pista.save({_id: idPistas[6], _idCuadro: idCuadros[2], name: 'Pista A'});
db.Pista.save({_id: idPistas[7], _idCuadro: idCuadros[3], name: 'Pista B'});
