
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , lessMiddleware = require('less-middleware')
  , path = require('path')
  , pubDir = path.join(__dirname, 'public')
  , passport = require('passport')
  , PistasStrategy = require('./routes/strategy')
  , mongoose = require('mongoose')
  , models = require('./models/schemas')
  , helpers = require('./models/helpers');

var app = module.exports = express.createServer();


passport.use(new PistasStrategy(function(user, done) {
  var data = {name: user.name, password: user.password, _idUrba: user._idUrba};
  models.User.findOne(data, function(err, _user) {
      if(err || !_user) {
        done(true, null);
      } else {
        done(null, _user);
      }
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  helpers.findUserAndUrba(id, function(err, user, urba) {
    if(err) {
      done(true, null);
    }else {
      user.urba = urba;
      done(null, user);
    }
  });
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: '1234' }));
  app.use(lessMiddleware({
      src: pubDir + '/less',
      dest: pubDir + '/css',
      prefix: '/css',
      force: true,
      debug: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);

  app.use(express.static(pubDir));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var auth = function auth(options) {
  return function _auth(req, res, next){
    if(req.user) {
      next();
    }else {
      res.redirect(options.failureRedirect);
    }
  }
}


// Routes
// TO DO Get urbas
app.get('/api/pistas/:id/horas', auth({failureRedirect: '/api/unathorized'}), api.getHoras);
app.get('/api/cuadros/:id/pistas', auth({failureRedirect: '/api/unathorized'}), api.getPistas);
app.get('/api/user', auth({failureRedirect: 'api/unathorized'}), api.getUser);
app.get('/api/unathorized', api.unathorized);
app.post('/api/horas/:id', auth({failureRedirect: 'api/unathorized'}), api.postHora);

app.post('/login', api.login);
app.get('/', auth({failureRedirect: '/login'}), routes.index);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/cuadros/:id', auth({failureRedirect: '/login'}), routes.cuadro);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});


