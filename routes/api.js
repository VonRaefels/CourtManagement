var passport = require('passport');
    helpers = require('../models/helpers');


exports.getHoras = function(req, res) {
    var id = req.param('id');
    var horas = [{_id: 1, hora: "07:30", reserva: "74", dia: "hoy"}, {_id: 2, hora: "09:00", dia: "hoy"}
    , {_id: 3, hora: "10:30", dia: "hoy"}, {_id: 4, hora: "12:00", dia: "hoy"}
    , {_id: 5, hora: "13:30", reserva: "23", dia: "hoy"}
    , {_id: 6, hora: "15:00", dia: "hoy"}, {_id: 7, hora: "16:30", dia: "hoy"}
    , {_id: 8, hora: "18:00", reserva: "12", dia: "hoy"}
    , {_id: 9, hora: "19:30", dia: "hoy"}, {_id: 10, hora: "21:00", dia: "hoy"}, {_id: 11, hora: "10:30", dia: "hoy"}
    , {_id: 12, hora: "07:30", reserva: "74", dia: "mañana"}, {_id: 13, hora: "09:00", dia: "mañana"}
    , {_id: 14, hora: "10:30", dia: "mañana"}, {_id: 15, hora: "12:00", dia: "mañana"}
    , {_id: 16, hora: "13:30", reserva: "23", dia: "mañana"}
    , {_id: 17, hora: "15:00", dia: "mañana"}, {_id: 18, hora: "16:30", dia: "mañana"}
    , {_id: 19, hora: "18:00", reserva: "12", dia: "mañana"}
    , {_id: 20, hora: "19:30"}, {_id: 21, hora: "21:00", dia: "mañana"}, {_id: 22, hora: "10:30", dia: "mañana"}];


    res.json(horas);
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
            res.send(500, {error: 'Could not retrieve cuadros'});
        }else {
            res.json(cuadros);
        }
    });
}

exports.login = function(req, res, next) {
    passport.authenticate('pistas', function(err, user, info) {
        if(err == null) {
            req.login(user, function(err) {
                res.json({error: !!err});
            });
        }else {
            res.json({error: !!err});
        }
    })(req, res, next);
}

exports.unathorized = function(req, res) {
    res.json({error: '401 Unathorized'});
}