var passport = require('passport');
    helpers = require('../models/helpers')
    , models = require('../models/schemas')
    , admHelpers = require('../models/admHelpers');


exports.getHoras = function(req, res) {
    var idPista = req.param('id');
    helpers.areThereHours(idPista, function(err, areThereHours) {
        if(err) return res.send(500, {error: 'Could not retrieve horas'});
        if(areThereHours) {
            helpers.daysPassed(idPista, function(err, days) {
                console.log(days);
                if(err || !days) return (true, null);
                if(days >= 1 && days < 2) {
                    helpers.changeHoras(idPista, function(err, horas) {
                        if(err) return res.send(500, {error: 'Could not retrieve horas'});
                        res.json(horas);
                    });
                }else if(days >= 2) {
                    helpers.resetHoras(idPista, function(err, horas) {
                        if(err) return res.send(500, {error: 'Could not retrieve horas'});
                        res.json(horas);
                    });
                }else {
                    helpers.findHoras(idPista, function(err, horas) {
                        if(err) return res.send(500, {error: 'Could not retrieve horas'});
                        res.json(horas);
                    })
                }
            });
        }else {
            helpers.createHorasDia(idPista, function(err, horas) {
                if(err) {
                    return res.send(500, {error: 'Could not retrieve horas'});
                }
                return res.json(horas);
            });
        }
    });
};

exports.getCuadros = function(req, res) {
    var idUrba = req.param('id');
    helpers.getCuadros(idUrba, function(err, cuadros) {
        if(err) {
            return res.send(500, {error: 'Could not retrieve cuadros'});
        }
        res.json(cuadros);
    });
}

exports.login = function(req, res, next) {
    passport.authenticate('pistas', function(err, user, info) {
        if(err == null) {
           return req.login(user, function(err) {
                res.json({error: !!err});
            });
        }
        res.json({error: !!err});
    })(req, res, next);
}

exports.unathorized = function(req, res) {
    res.json({error: '401 Unathorized'});
}

var horaActions = {}

horaActions['reservar'] = function reservar(req, res) {
    var idHora = req.param('id');
    var user = req.user;
    helpers.puedeReservar(user, idHora, function(err, puede) {
        if(err) return res.send(500, {error: 'Could not do reserva'});
        if(!puede) {
            return res.json({max: true});
        }
        models.Hora.findOneAndUpdate({_id: idHora, _idUser: undefined},
            {_idUser: user._id, reserva: user.name}, function(err, hora) {
            if(err) return res.send(500, {error: 'Could not do reserva'});
            if(!hora) return res.send(500, {error: 'Could not do anulacion'});
            res.json(hora);
        });
    })

}

horaActions['anular'] = function anular(req, res) {
    var idHora = req.param('id');
    var user = req.user;
    models.Hora.findById(idHora, function(err, hora) {
        if(!hora) return res.send(500, {error: 'Could not do anulacion'});
        hora._idUser = undefined;
        hora.reserva = undefined;
        hora.save(function(err, hora) {
            if(err) return res.send(500, {error: 'Could not do anulacion'});
            res.json(hora);
        });
    });
}

exports.postHora = function(req, res) {
    var action = req.param('action');
    var fn = horaActions[action];
    if(fn === undefined) return res.send(500, {error: 'Unkown action for hora: ' + action});
    fn(req, res);
}

exports.getUser = function(req, res) {
    var reqUser = req.user;
    helpers.findUser(reqUser._id, function(err, user) {
        if(err) return res.send(500, {error: 'Could not find user'});
        res.json(user);
    });
}


exports.findUsers = function(req, res) {
    var query = req.query;
    admHelpers.paginateUsers(query, function(err, users) {
        if(err) return res.send(500, {error: 'Could not retrieve users'});
        res.json(users);
    });
}