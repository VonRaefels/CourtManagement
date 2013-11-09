
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , lessMiddleware = require('less-middleware')
  , path = require('path')
  , pubDir = path.join(__dirname, 'public')

var app = module.exports = express.createServer();

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
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(lessMiddleware({
      src: pubDir + '/less',
      dest: pubDir + '/css',
      prefix: '/css',
      force: true,
      debug: true
  }));
  app.use(express.static(pubDir));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/api/pistas/:id/horas/', api.getHoras);
app.get('/api/cuadro', api.getPistas);
app.post('/api/login', api.logIn);
app.get('/', routes.login);
app.get('/cuadro', routes.cuadro);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
