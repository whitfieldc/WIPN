var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require('./db.js');

var port = Number(process.env.PORT || 3000);
//load config for rethink
var config = require('./config.js');

http.listen(port);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.use(express.static('public'));

r.connect(config.rethinkdb)
.then(function(conn){
  io.on('connection', function(socket){

    r.table('seats')
    .orderBy({index:'created'})
    .coerceTo('array')
    .run(conn)
    .then(function(seats){
      seats.forEach(function(seat){
        socket.emit('seat', seat);
      });
    });

    r.table('seats')
    .changes().run(conn)
    .then(function(cursor){
      cursor.each(function(err, row){
        socket.emit('seat', row.new_val);
      }, function(){
        console.log("finished");
      });
    });

    socket.on('seat', function(data){
      r.table('seats').insert({
        note: data.note,
        lat: data.lat,
        lon: data.lon,
        created: (new Date()).getTime()
      }).run(conn);
    });

  });
});