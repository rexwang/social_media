var express         = require('express');
var http            = require('http');
var nodemailer      = require('nodemailer');
var MemoryStore     = require('connect').session.MemoryStore;
var app             = express();

var events          = require('events');
var eventDispatcher = new events.EventEmitter();
app.addEventListener = function (eventName, callback) {
  eventDispatcher.on( eventName, callback );
};
app.removeEventListener = function (eventName, callback) {
  eventDispatcher.removeListener( eventName, callback );
};
app.triggerEvent = function (eventName, eventOptions) {
  eventDispatcher.emit( eventName, eventOptions );
};

var dbPath          = 'mongodb://localhost/nodebackbone';
var fs              = require('fs');

// Create an http server
app.server          = http.createServer(app);

// Create a session store to share between methods
app.sessionStore    = new MemoryStore();

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the models
var models = {
  Account: require('./models/Account')(app, config, mongoose, nodemailer)
};

app.configure(function(){
  app.sessionSecret = 'SocialNet secret key';
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid',
    store: app.sessionStore
  }));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  // Using limit causes Express to cut off incoming requests after a certain
  // amount of data. This will help protect our application from distributed
  // denial of service attacks, which would arise if sessions were allowed to
  // post large requests that would otherwise bog down Express attempting to parse
  app.use(express.limit('1mb'));

  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)(app, models);
});

//app.get('/', routes.index);
app.get('/', function(req, res) {
  res.render('index.jade');
});



app.post('/contacts/find', function (req, res) {
  var searchStr = req.param('searchStr', null);
  if ( searchStr == null ) {
    res.send(400);
    return;
  }

  models.Account.findByString(searchStr, function onSearchDone (err, accounts) {
    if ( err || accounts.length == 0 ) {
      res.send(400);
    } else {
      res.send(accounts);
    }
  });
});

app.server.listen(3000);
console.log("SocialNet is listening to port 3000.");
