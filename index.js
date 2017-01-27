/**
 * This server just exists because Instagram API is so complicated to consume.
 */

var request = require('request');
var express = require('express');
var app = express();

// Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Implement an Instagram Bypass API
app.get('/api/:username', function (req, res) {
  var username = req.params.username;

  request('https://www.instagram.com/' + username + '/media/', 
    function(error, response, body) {
      if (!error) {
        res.json(JSON.parse(body));
      } else {
        res.json({
          "status": "error",
          "error": error
        });
      }
    }
  );
});

app.use(express.static('.'));

app.listen(3000, function () {
  console.log('Neighborhood Map listening on: http://localhost:3000');
});