var paginate = require('mongoose-paginate')
    , models = require('./schemas');

var paginateUsers = function(opts, cb) {
    var options = opts;
    var callback = cb;
    if(typeof opts == 'function') {options = {};  callback = opts;}
    models.User.find(options).populate('_idUrba')
            .exec(function(err, users) {
                callback(err, users);
          });
};



exports.paginateUsers = paginateUsers;