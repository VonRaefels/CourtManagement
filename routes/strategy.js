"use strict";

var passport = require('passport')
, util = require('util');

function PistasStrategy(verify) {
    this.name = 'pistas';
    this.verify = verify;
    passport.Strategy.call(this);

}

util.inherits(PistasStrategy, passport.Strategy);

PistasStrategy.prototype.authenticate = function(req, options) {
    var user = {
        name: req.body.name,
        password: req.body.password,
        _urba: req.body._urba
    }
    , _this = this;

    this.verify(user, function(err, resident, info) {
        if(err) {
            _this.fail(err);
        } else {
            _this.success(resident);
        }
    });
}

function XAdmStrategy(verify) {
    this.name = 'xadm';
    this.verify = verify;
    passport.Strategy.call(this);
}

util.inherits(XAdmStrategy, passport.Strategy);

XAdmStrategy.prototype.authenticate = function(req, options) {
    var user = {
        name: req.body.username,
        password: req.body.password
    }
    , _this = this;

    this.verify(user, function(err, resident, info) {
        if(err) {
            _this.fail(err);
        } else {
            _this.success(resident);
        }
    });
}

exports.PistasStrategy = PistasStrategy;
exports.XAdmStrategy = XAdmStrategy;