var config = require('./config.js');
var q = require('q')

var r = require('rethinkdb');
require('rethinkdb-init')(r);


r.init(config.rethinkdb, [
  {
    name: 'seats',
    indexes: ['created']
  }
]).then(function(conn){
  r.conn = conn;
  r.conn.use((config.rethinkdb).db)
});

module.exports = r;