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

exports.findUrbas = findUrbas;
exports.findCuadros = findCuadros;
exports.findPistas = findPistas;
exports.findPistasAndCuadros = findPistasAndCuadros;