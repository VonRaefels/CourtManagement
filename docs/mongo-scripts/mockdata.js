//!mongo [name].js

DB_NAME = "CourtManagement";
DB_LOCATION = "localhost:27017";

var connection = new Mongo(DB_LOCATION);
db = connection.getDB(DB_NAME);

db.Urbanizacion.remove();
db.User.remove();
db.Cuadro.remove();
db.Pista.remove();
db.Hora.remove()

var startHour = new Date();
startHour.setHours('08');
startHour.setMinutes('00');


var idUrbas = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
var idUsers = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];
var idCuadros = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()]
var idPistas = [ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId(), ObjectId()];


db.Urbanizacion.save({_id: idUrbas[0], name: "Levitt Gardens, Las Rozas"});
db.Urbanizacion.save({_id: idUrbas[1], name: "Las Matas 2"});
db.Urbanizacion.save({_id: idUrbas[2], name: "Las Rozas"});
db.Urbanizacion.save({_id: idUrbas[3], name: "Alcobendas"});
db.Urbanizacion.save({_id: idUrbas[4], name: "Moratalaz"});

db.User.save({_id: idUsers[0], _urba: idUrbas[0], name: '74', password: '12345'});
db.User.save({_id: idUsers[1], _urba: idUrbas[0], name: '12', password: '12345'});
db.User.save({_id: idUsers[2], _urba: idUrbas[0], name: '13', password: '12345'});
db.User.save({_id: idUsers[3], _urba: idUrbas[0], name: '14', password: '12345'});
db.User.save({_id: idUsers[4], _urba: idUrbas[0], name: '15', password: '12345'});
db.User.save({_id: idUsers[5], _urba: idUrbas[0], name: '16', password: '12345'});
db.User.save({_id: idUsers[6], _urba: idUrbas[0], name: '0', password: '1', xadm: true});


db.Cuadro.save({_id: idCuadros[0], _urba: idUrbas[0], name: 'Tenis', startHour: startHour, duration: 60, limit: 15, max: 1});
db.Cuadro.save({_id: idCuadros[1], _urba: idUrbas[0], name: 'Padel', startHour: startHour, duration: 90, limit: 10, max: 1});
db.Cuadro.save({_id: idCuadros[2], _urba: idUrbas[1], name: 'Squash', startHour: startHour, duration: 90, limit: 10, max: 1});
db.Cuadro.save({_id: idCuadros[3], _urba: idUrbas[1], name: 'Tenis', startHour: startHour, duration: 90, limit: 10, max: 1});
db.Cuadro.save({_id: idCuadros[4], _urba: idUrbas[2], name: 'Tenis', startHour: startHour, duration: 90, limit: 10, max: 1});

db.Pista.save({_id: idPistas[0], _idCuadro: idCuadros[0], name: 'Pista 1'});
db.Pista.save({_id: idPistas[1], _idCuadro: idCuadros[0], name: 'Pista 2'});
db.Pista.save({_id: idPistas[2], _idCuadro: idCuadros[1], name: 'Pista A'});
db.Pista.save({_id: idPistas[3], _idCuadro: idCuadros[1], name: 'Pista B'});
db.Pista.save({_id: idPistas[5], _idCuadro: idCuadros[1], name: 'Pista C'});
db.Pista.save({_id: idPistas[6], _idCuadro: idCuadros[1], name: 'Pista D'});
