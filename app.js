
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
  , PistasStrategy = require('./routes/strategy');

var app = module.exports = express.createServer();


passport.use(new PistasStrategy(function(user, done) {
    if(user.username == 'test') {
        done(null, user);
    }else {
      done(true, null);
    }
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  done(null, {username: 'test', password: 'test123', urba: '1'});
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



// Routes
app.get('/api/pistas/:id/horas/', passport.authorize('pistas', {failureRedirect: '/api/unathorized'}), api.getHoras);
app.get('/api/cuadro', passport.authorize('pistas', {failureRedirect: '/api/unathorized'}), api.getPistas);
app.get('/api/unathorized', api.unathorized);

app.post('/login', api.login);
app.get('/', function(req, res) { res.redirect('/login')});
app.get('/login', routes.login);
app.get('/cuadro', passport.authorize('pistas', {failureRedirect: '/login'}), routes.cuadro);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
