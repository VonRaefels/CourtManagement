"use strict";

var passport = require('passport')
, util = require('util');

function Strategy(verify) {
    this.name = 'pistas';
    this.verify = verify;
    passport.Strategy.call(this);

}

util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function(req, options) {
    var user = {
        name: req.body.name,
        password: req.body.password,
        _idUrba: req.body._idUrba
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

module.exports = Strategy;