var mongoose = require('mongoose')
  , models = require('./schemas')
  , async = require('async');


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
            return cb(true, null, null);
        }
        findPistas(idCuadro, function(err, pistas) {
            cb(err, cuadros, pistas);
        });
    });
}

var findUserAndUrba = function(idUser, cb) {
    models.User.findById(idUser, function(err, user) {
        if(err) {
            return cb(true, null, null);
        }
        models.Urbanizacion.findById(user._idUrba, function(err, urba) {
            cb(err, user, urba);
        });
    });
}

var areThereHours = function(idPista, cb) {
    models.Hora.count({_idPista: idPista}, function(err, count) {
        return cb(err, count);
    });
}

var isNewDay = function isNewDay(idPista, cb) {
    var findPista = function findPista(callback) {
        models.Pista.findById(idPista, function(err, pista) {
            callback(err, pista._idCuadro);
        });
    };
    var checkDate = function checkDate(idCuadro, callback) {
        models.Cuadro.findById(idCuadro, function(err, cuadro) {
            var today = new Date();
            if(cuadro.lastDate === undefined)
                return callback(true, null);
            var lastDate = new Date(cuadro.lastDate);

            var hourArray = cuadro.start.split(':');
            var hour = hourArray[0];
            var minutes = hourArray[1];
            var seconds = hourArray[2];

            lastDate.setUTCDate(lastDate.getUTCDate() + 1);
            lastDate.setUTCHours(hour);
            lastDate.setUTCMinutes(minutes);
            lastDate.setUTCSeconds(seconds);

            callback(null, today > lastDate);
        });
    };
    var done = function done(err, isNewDay) {
        cb(err, isNewDay);
    };
    async.waterfall([findPista, checkDate], done);
}

// TO DO Unchecked!
var createHoras = function createHoras(idPista, dia, cb) {
    var findPista = function findPista(callback) {
        models.Pista.findById(idPista, function(err, pista) {
            callback(err, pista._idCuadro);
        });
    };
    var findCuadro = function findCuadro(idCuadro, callback) {
        models.Cuadro.findById(idCuadro, function(err, cuadro) {
            callback(err, cuadro);
        });
    };
    var done = function done(err, cuadro) {
        var startHour = cuadro.startHour;
        var limit = cuadro.limit;
        var duration = cuadro.duration;
        var fn = [];

        for(var i = 0, l = limit; i < l; i++) {
            var horaBefore = {hora: startHour + duration * limit, _idPista: idPista, dia: dia};
            var createHora = function createHora(callback) {
                models.Hora.create(horaBefore, function(err, hora) {
                    callback(err, hora);
                });
            }
            fn.push(createHora);
        }
        async.parallel(fn, function(err, results) {
            cb(err, results);
        });
    };
    async.waterfall([findPista, findCuadro], done);
}

var createHorasDia = function createHorasDia(idPista, cb) {
    var createHoy = function createHoy(callback) {
        createHoras(idPista, 'hoy', function(err, horas) {
            callback(err, horas);
        });
    };
    var createManana = function createManana(callback) {
        createHoras(idPista, 'manana', function(err, horas) {
            callback(err, horas);
        });
    };
    async.parallel({hoy: createHoy, manana: createManana}, function(err, horas) {
        cb(err, horas);
    });
}

var deleteHoras = function deleteHoras(idPista, dia, cb) {
    models.Hora.remove({_idPista: idPista, dia: dia}, function(err) {
        cb(err);
    });
}

var swapHoras = function swapHoras(idPista, cb) {
    models.Hora.update({dia: 'manana'}, {dia: 'hoy'}, function(err, numAffected, raw) {
        cb(err, numAffected, raw);
    });
}

exports.findUrbas = findUrbas;
exports.findCuadros = findCuadros;
exports.findPistas = findPistas;
exports.findPistasAndCuadros = findPistasAndCuadros;
exports.findUserAndUrba = findUserAndUrba;