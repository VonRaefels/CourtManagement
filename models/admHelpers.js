var models = require('./schemas')
    , PAGE_SIZE = 5;

var paginateUsers = function(opts, cb) {
    var options = opts;
    var callback = cb;
    if(typeof opts == 'function') {options = {};  callback = opts;}
    var page = options.page || 1;
    delete options.page;
    var resultsPerPage = PAGE_SIZE;
    var skipFrom = (page * resultsPerPage) - resultsPerPage;
    models.User.find(options)
                            .skip(skipFrom)
                            .limit(resultsPerPage)
                            .populate('_urba')
            .exec(function(err, users) {
                callback(err, users);
          });
};



exports.paginateUsers = paginateUsers;



