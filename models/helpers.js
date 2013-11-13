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

var findPistaById = function findPistaById(idPista, callback) {
    models.Pista.findById(idPista, function(err, pista) {
        callback(err, pista);
    });
}

var areThereHours = function(idPista, cb) {
    models.Hora.count({_idPista: idPista}, function(err, count) {
        return cb(err, count > 0);
    });
}

var isNewDay = function isNewDay(idPista, cb) {
    var findPista = function findPista(callback) {
        findPistaById(idPista, function(err, pista) {
            callback(err, pista._idCuadro);
        });
    };
    var checkDate = function checkDate(err, idCuadro) {
        if(err) return cb(true, null);
        models.Cuadro.findById(idCuadro, function(err, cuadro) {
            var today = new Date();
            if(cuadro.lastDate === undefined)
                return cb(true, null);
            var lastDate = cuadro.lastDate;
            var startHour = cuadro.startHour;

            lastDate.setDate(lastDate.getDate() + 1);
            lastDate.setHours(startHour.getHours());
            lastDate.setMinutes(startHour.getMinutes());

            cb(null, today > lastDate);
        });
    };
    async.waterfall([findPista], checkDate);
}

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
    var doCreateHoras = function doCreateHoras(cuadro, callback) {
        var startHour = cuadro.startHour;
        var limit = cuadro.limit;
        var duration = cuadro.duration;
        var fnArr = [];

        for(var i = 1, l = limit; i <= l; i++) {
            var newDate = new Date(startHour.getTime() + duration * i * 60000);
            var horaString = String('00' + newDate.getHours()).slice(-2) + ':'
                            + String('00' + newDate.getMinutes()).slice(-2);
            (function(horaString) {
                var createHora = function createHora(callback) {
                    models.Hora.create({hora: horaString, dia: dia, _idPista: idPista}, function(err, hora) {
                        callback(err, hora);
                    });
                }
                fnArr.push(createHora);
            })(horaString);
        }
        async.parallel(fnArr, function(err, horas) {
            callback(err, horas, cuadro);
        });
    };
    var updateDate = function updateDate(err, horas, cuadro) {
        if (err) return (true, null);
        updateCuadroHour(cuadro, function(err, _cuadro) {
            cb(err, horas);
        });
    };
    async.waterfall([findPista, findCuadro, doCreateHoras], updateDate);
}

var updateCuadroHour = function updateCuadroHour(cuadro, cb) {
    var id = cuadro._id || cuadro;
    var today = new Date();
    models.Cuadro.findOneAndUpdate({_id: id}, {lastDate: today}, function(err , cuadro) {
        cb(err, cuadro);
    });
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
exports.createHoras = createHorasDia;
exports.isNewDay = isNewDay;