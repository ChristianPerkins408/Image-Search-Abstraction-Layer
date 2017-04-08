var express = require('express');
var app = express();

require('dotenv').config({ silent: true });
var bodyParser = require('body-parser');
var api = require('./api/search.js');
var router = require('./routes/index.js');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

  console.log("We are connected to the database!");

  api(app, db);

  router(app, db);

  app.listen(port, function() {

    console.log('Node.js listening on port ' + port);

  });

});
