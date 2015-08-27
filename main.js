var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('./config.js');

var r = require('rethinkdb');

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/seats', function(req, res){
    res.json({"hello":"goodbye"});
});

io.on('connection', function(socket){
    console.log('connection established');

    socket.on('disconnect', function(){
        console.log('connection wiped');
    });

    socket.on('seat post', function(seatObj){
      io.emit('seat post', seatObj)
    })
});

var port = Number(process.env.PORT || 3000)

http.listen(port, function(){
    console.log('listening on 3000');
});
