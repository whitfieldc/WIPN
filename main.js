var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
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
});

http.listen(3000, function(){
    console.log('listening on 3000');
});
