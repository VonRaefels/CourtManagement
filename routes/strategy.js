var passport = require('passport')
, util = require('util');

function PistasStrategy(options, verify) {
    this.name = 'pistas';
    this.urba
    this.id = options.id;
    this.password = options.password;
    this.urba = options.urba;
    this.verify = verify;
}

util.inherits(PistasStrategy, passport.Strategy);

StrategyMock.prototype.authenticate = function authenticate(req) {
    var user = {
        id: this.id,
        password: this.password,
        urba: this.urba
    }
    , _this = this;
    this.verify(user, function(err, resident) {
        if(err) {
            _this.fail(err);
        } else {
            _this.success(resident);
        }
    });
}

module.exports = PistasStrategy;