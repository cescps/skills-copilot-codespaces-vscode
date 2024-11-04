// Create web server
// Load comments from file
// Return comments to client
// Save comments to file
// Update comments

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

// Variables
var comments = [];
var filename = 'comments.txt';

// Load comments from file
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) {
    console.log('Error loading comments from file: ' + filename);
  } else {
    comments = JSON.parse(data);
  }
});

// Create web server
http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var filename = path.join(process.cwd(), uri);
  var method = req.method;

  if (method === 'GET' && uri === '/comments') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(comments));
  } else if (method === 'POST' && uri === '/comments') {
    var body = '';
    req.on('data', function(chunk) {
      body += chunk;
    });
    req.on('end', function() {
      comments.push(JSON.parse(body));
      fs.writeFile(filename, JSON.stringify(comments), function(err) {
        if (err) {
          console.log('Error saving comments to file: ' + filename);
        }
      });
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(comments));
    });
  } else {
    fs.exists(filename, function(exists) {
      if (!exists) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found\n');
      } else {
        fs.readFile(filename, 'binary', function(err, file) {
          if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end(err + '\n');
          } else {
            res.writeHead(200);
            res.end(file, 'binary');
          }
        });
      }
    });
  }
}).listen(8080);

console.log('Server running at http://localhost:8080/');

// Update comments
function updateComments() {
  fs.writeFile(filename, JSON.stringify(comments), function(err) {
    if (err) {
      console.log('Error saving comments to file: ' + filename);