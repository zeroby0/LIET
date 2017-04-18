var device_id = '/dev/cu.wchusbserial1410';
var baud_rate = 9600;

const parser = require('./src/parser.js');

var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;  // parser: only from 5.x of nodeserial

var port = new SerialPort(device_id, {
  baudRate: baud_rate,
});


port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
});



port.on('error', function(err) {
  console.log('Port Error: ', err.message);
});

parser.setPort(port);


state = {
	status: 'online',
}

port.on('data', function (data){
	state.data = data;
	parser.parser(state);
});

