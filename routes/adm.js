var passport = require('passport'),
    _ = require('underscore');

var xadmLinks = {};
xadmLinks['users'] = {name: 'Usuarios', href: '/xadm/users'};
xadmLinks['urbas'] = {name: 'Urbanizaciones', href: '/xadm/urbas'};

exports.xadmLogin = function(req, res) {
    res.render('xadm/xadm-login');
}

exports.xadmUsers = function(req, res) {
    res.render('xadm/xadm-users', {links: xadmLinks, active: 'users'});
}

exports.xadmUrbas = function(req, res) {
    res.render('xadm/xadm-urbas', {links: xadmLinks, active: 'urbas'});
}

exports.xlogin = function(req, res, next) {
    passport.authenticate('xadm', function(err, user, info) {
        if(!err) {
           return req.login(user, function(err) {
                res.redirect('/xadm');
            });
        }
        res.send(104, {error: 'Invalid credentials'});
    })(req, res, next);
}
