var mongoose = require('mongoose')
  , models = require('./schemas')
  , async = require('async');


var findUrbas = function(cb) {
    models.Urbanizacion.find(function(err, urbas) {
        cb(err, urbas);
    });
}

var findCuadros = function(idUrba, cb) {
    models.Cuadro.find({_urba: idUrba}).sort([['name', 'descending']]).exec(function(err, cuadros) {
        cb(err, cuadros);
    });
}

var findCuadro = function(idCuadro, cb) {
    models.Cuadro.findById(idCuadro, function(err, cuadro) {
        cb(err, cuadro);
    });
}

var findPistas = function(idCuadro, cb) {
    models.Pista.find({_idCuadro: idCuadro}).sort([['name', 'descending']]).exec(function(err, pistas)  {
        cb(err, pistas);
    });
}

var puedeReservar = function(user, idHora, cb) {
    var findPista = function(callback) {
        models.Hora.findById(idHora, function(err, hora) {
            if(err) return callback(true, null);
            models.Pista.findById(hora._idPista, function(err, pista) {
                callback(err, pista, hora);
            });
        });
    };

    var findPistas = function(pista, hora, callback) {
        models.Cuadro.findById(pista._idCuadro, function(err, cuadro) {
            if(err) return callback(true, null);
            models.Pista.find({_idCuadro: cuadro._id}, function(err, pistas) {
                callback(err, pistas, cuadro, hora);
            });
        })
    };

    var findUserHoras = function(pistas, cuadro, hora, callback) {
        var query = models.Hora.count({_idUser: user._id, dia: hora.dia});
        for (var i = pistas.length - 1; i >= 0; i--) {
            query = query.or([{_idPista: pistas[0]._id}]);
        };
        query.exec(function(err, count) {
            callback(err, count, cuadro);
        });
    };

    var done = function(err, count, cuadro) {
        if(err) return cb(true, false);
        cb(err, count < cuadro.max);
    };

    async.waterfall([findPista, findPistas, findUserHoras], done);
}

var findHoras = function findHoras(idPista, cb) {
    var horas = {};
    var hoy = [], manana = [];
    horas.hoy = hoy;
    horas.manana = manana;
    models.Hora.find({_idPista: idPista}, function(err, _horas) {
        if(err) return cb(true, null);
        _horas.forEach(function(hora) {
            if(hora.dia == 'hoy') {
                hoy.push(hora);
            }else {
                manana.push(hora);
            }
        });
        cb(null, horas);
    });
}

var findUser = function findUser(idUser, cb) {
    var doFindUser = function(callback) {
        findUserAndUrba(idUser, function(err, user, urba) {
            user.urba = urba;
            callback(err, user);
        });
    };

    var findReservas = function(user, callback) {
        models.Hora.find({_idUser: idUser}, function(err, horas) {
            if(horas != null) {
                user.horas = horas;
                delete user.password;
            }
            callback(err, user);
        });
    };

    var done = function(err, user) {
        cb(err, user);
    }
    async.waterfall([doFindUser, findReservas], done);
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
        if(err || !user) {
            return cb(true, null, null);
        }
        var jsonUser = user.toObject();
        models.Urbanizacion.findById(jsonUser._urba, function(err, urba) {
            cb(err, jsonUser, urba);
        });
    });
}

var findPistaById = function findPistaById(idPista, callback) {
    models.Pista.findById(idPista, function(err, pista) {
        callback(err, pista);
    });
}

var areThereHours = function areThereHours(idPista, cb) {
    models.Hora.count({_idPista: idPista}, function(err, count) {
        return cb(err, count > 0);
    });
}

var daysPassed = function daysPassed(idPista, cb) {
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

            lastDate.setDate(lastDate.getDate());
            lastDate.setHours(startHour.getHours());
            lastDate.setMinutes(startHour.getMinutes());

            cb(null, (today - lastDate) / 86400000);
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
            (function(newDate) {
                var createHora = function createHora(callback) {
                    models.Hora.create({hora: newDate, dia: dia, _idPista: idPista}, function(err, hora) {
                        callback(err, hora);
                    });
                }
                fnArr.push(createHora);
            })(newDate);
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
    models.Hora.update({_idPista: idPista, dia: 'manana'}, {dia: 'hoy'}, { multi: true }, function(err, numAffected, raw) {
        cb(err, numAffected, raw);
    });
}

var changeHoras = function changeHoras(idPista, cb) {
    var doDeleteHoras = function doDeleteHoras(callback) {
        deleteHoras(idPista, 'hoy', function(err) {
            callback(err);
        });
    }
    var doSwapHoras = function doSwapHoras(callback) {
        swapHoras(idPista, function(err, numAffected, raw) {
            callback(err);
        });
    }
    var doCreateHorasManana = function doCreateHorasManana(callback) {
        createHoras(idPista, 'manana', function(err, horas) {
            callback(err);
        });
    }
    var doFindHoras = function doFindHoras(err) {
        if(err) return cb(true, null);
        findHoras(idPista, function(_err, horas) {
            cb(_err, horas);
        });
    }

    async.waterfall([doDeleteHoras, doSwapHoras, doCreateHorasManana], doFindHoras);
}

var resetHoras = function resetHoras(idPista, cb) {
    var deleteHoras = function(callback) {
        models.Hora.remove({_idPista: idPista}, function(err) {
            callback(err);
        });
    }
    var doCreateHoras = function(err) {
        if(err) return cb(true, null);
        createHorasDia(idPista, function(err, horas) {
            return cb(err, horas);
        });
    }
    async.waterfall([deleteHoras], doCreateHoras);
}

exports.findUrbas = findUrbas;
exports.findCuadros = findCuadros;
exports.findPistas = findPistas;
exports.findPistasAndCuadros = findPistasAndCuadros;
exports.findUserAndUrba = findUserAndUrba;
exports.createHoras = createHorasDia;
exports.daysPassed = daysPassed;
exports.areThereHours = areThereHours;
exports.findHoras = findHoras;
exports.changeHoras = changeHoras;
exports.createHorasDia = createHorasDia;
exports.findUser = findUser;
exports.puedeReservar = puedeReservar;
exports.resetHoras = resetHoras;