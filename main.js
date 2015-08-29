var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//load config for rethink
var config = require('./config.js');

var r = require('rethinkdb');

var port = Number(process.env.PORT || 3000)

var startApp = function(){
    http.listen(port, function(){
    console.log('listening on 3000');
    });
}

function handleError(res) {
    return function(error) {
        res.send(500, {error: error.message});
    }
}

var createConnection = function(req, res, next){
    r.connect(config.rethinkdb).then(function(conn){
        req._rdbConn = conn;
        next();
    }).error(handleError(res));
}

var closeConnection = function(req, res, next){
    req._rdbConn.close();
}
app.use(express.static('public'));

//create conn to DB
app.use(createConnection);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/seats', function(req, res){
    res.json({"hello":"goodbye"});
});


app.use(closeConnection);


r.connect(config.rethinkdb, function(err, conn){
    if (err){
        console.log("Couldn't open connection to initialize DB:");
        console.log(err.message);
        process.exit(1);
    }

    r.table('seats').indexWait('createdAt').run(conn).then(function(err, result){
        console.log("Table & index are available... (65)");
        startApp();
    }).error(function(err){
        r.dbCreate(config.rethinkdb.db).run(conn).finally(function(){
            return r.tableCreate('seats').run(conn);
        }).finally(function(){
            // console.log('creating index')
            return r.table('seats').indexCreate('createdAt').run(conn);
        }).finally(function(result){
            return r.table('seats').indexWait('createdAt').run(conn);
        }).then(function(result){
            console.log(result)
            console.log("Table & index are available...(75)");
            startApp();
            conn.close();
        }).error(function(err){
            if (err){
                console.log("Couldn't wait for completion of index");
                console.log(err);
                process.exit(1);
            }
            console.log("Table & index are available...(84)");
            startApp();
            conn.close();
        });
    });
});


io.on('connection', function(socket){
    console.log('connection established');

    socket.on('disconnect', function(){
        console.log('connection wiped');
    });

    // r.connect(config.get('rethinkdb'))
    //     .then(function(conn){

    //     })

    socket.on('seat post', function(seatObj){
      // io.emit('seat post', seatObj)
      r.table('seats').insert({
        note: seatObj.note,
        lat: seatObj.lat,
        lon: seatObj.lon
      }).run(r.conn);
    })
});






