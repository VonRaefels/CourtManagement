var helpers = require('../models/helpers');

exports.cuadro = function(req, res) {
    var idCuadro = req.params.id;
    var idUrba = req.user._idUrba;
    var user = req.user;
    helpers.findPistasAndCuadros(idUrba, idCuadro, function(err, cuadros, pistas) {
        if(err) {
            return res.send(500, {error: 'Could not retrieve pistas or cuadros'});
        }
        findCuadroInArray(cuadros, idCuadro, function(cuadro) {
            res.render('cuadro', {cuadros: cuadros, active: cuadro, pistas: pistas, user: user});
        });
    });
}

exports.index = function(req, res) {
    var idUrba = req.user._idUrba;
    var user = req.user;
    helpers.findCuadros(idUrba, function(err, cuadros) {
        if(err) {
            return res.send(500, {error: 'Could not retrieve cuadros'});
        }
        res.render('index', {cuadros: cuadros, active: '', user: user});
    });
}

function findCuadroInArray(cuadros, idCuadro, cb) {
    cuadros.forEach(function(cuadro, index) {
        if(cuadro._id == idCuadro) {
            return cb(cuadro);
        }
    });
}

exports.login = function(req, res) {
    helpers.findUrbas(function(err, urbas) {
        if(err) {
            return res.send(500, {error: 'Could not retrieve urbas'});
        }
        res.render('login', {urbas: urbas});
    });
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/login');
}