var passport = require('passport');
    helpers = require('../models/helpers');


exports.getHoras = function(req, res) {
    var idPista = req.param('id');
    helpers.areThereHours(idPista, function(err, areThereHours) {
        if(err) return res.send(500, {error: 'Could not retrieve horas'});
        if(areThereHours) {
            helpers.isNewDay(idPista, function(err, isNewDay) {
                if(err) return (true, null);
                if(isNewDay) {
                    helpers.changeHoras(idPista, function(err, horas) {
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

exports.getCuadro = function(req, res) {
    var idCuadro = req.param('id');
    var data = [{_id: 1, nombre: "Pista A"}, {_id: 2, nombre: "Pista B"}, {_id: 3, nombre: "Pista C"}];
    res.json(data);
}

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
