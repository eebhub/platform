var Tail, app, connect, fileName, io, socketio, tail;

connect = require('connect');

socketio = require('socket.io');

Tail = require('tail').Tail;

app = connect.createServer(connect["static"]('views')).listen(9099);

io = socketio.listen(app);


console.log("Server listening on port 9099...");


io.sockets.on('connection', function(socket) {
  console.log("CONNECT!");

  socket.on('randomNumber', function(value){
	tail = new Tail("http://128.118.67.241/openstudio/outputs/ENERGYPLUS/idf/Simulation_"+value+".idf/EnergyPlusPreProcess/EnergyPlus-0/stdout");
	console.log("**********" + value);
	
	tail.on('line', function(data) {
  return io.sockets.emit('new-data', {
    channel: 'stdout',
    value: data
  });
});
});

  return socket.emit('new-data', {
    channel: 'stdout',
    value: ""
  });
});
