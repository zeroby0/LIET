var device_id = '/dev/cu.wchusbserial1420';
var baud_rate = 9600;

// const parser = require('./src/parser.js');

var SerialPort = require('serialport');

var port = new SerialPort(device_id, {
  baudRate: baud_rate,
});




port.on('error', function(err) {
  console.log('Port Error: ', err.message);
});

port.on('data', function (data){
	// parser.parser(data);
	console.log(new Buffer(data, 'base64').toString('ascii'))

});

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
});