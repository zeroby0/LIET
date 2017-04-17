var SerialPort = require('serialport');
var device_id = '/dev/cu.usbmodem1421';
var baud_rate = 9600;

var Readline = SerialPort.parsers.Readline;
var port = new SerialPort(device_id, {
	baudRate: baud_rate
});

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
});

port.on('error', function(err) {
  console.log('Error: ', err.message);
});


// port.on('data', function(data) {
// 	console.log(data);
// });

var parser = port.pipe(new Readline());

parser.on('data', function (data) {
	console.log(data);
});







