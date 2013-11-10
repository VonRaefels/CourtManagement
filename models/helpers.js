var mongoose = require('mongoose'),
    models = require('./schemas');


var findUrbas = function(cb) {
    models.Urbanizacion.find(function(err, urbas) {
        cb(err, urbas);
    });
}

var findCuadros = function(idUrba, cb) {
    models.Cuadro.find({_idUrba: idUrba}, function(err, cuadros) {
        cb(err, cuadros);
    });
}

var findCuadro = function(idCuadro, cb) {
    models.Cuadro.findOne(idCuadro, function(err, cuadro) {
        cb(err, cuadro);
    });
}

var findPistas = function(idCuadro, cb) {
    models.Pista.find({_idCuadro: idCuadro}, function(err, pistas)  {
        cb(err, pistas);
    });
}

var findPistasAndCuadros = function(idUrba, idCuadro, cb) {
    findCuadros(idUrba, function(err, cuadros) {
        if(err) {
            cb(true, null, null);
        }else {
            findPistas(idCuadro, function(err, pistas) {
                cb(err, cuadros, pistas);
            });
        }
    });
}

var findUserAndUrba = function(idUser, cb) {
    models.User.findById(idUser, function(err, user) {
        if(err) {
            cb(true, null, null);
        }else {
            models.Urbanizacion.findById(user._idUrba, function(err, urba) {
                cb(err, user, urba);
            });
        }
    });
}


exports.findUrbas = findUrbas;
exports.findCuadros = findCuadros;
exports.findPistas = findPistas;
exports.findPistasAndCuadros = findPistasAndCuadros;
exports.findUserAndUrba = findUserAndUrba;