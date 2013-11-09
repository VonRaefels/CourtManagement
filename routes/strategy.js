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
        username: req.body.username,
        password: req.body.password,
        urba: req.body.urba
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