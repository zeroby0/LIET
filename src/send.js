var device_id = '/dev/cu.wchusbserial1420';
var baud_rate = 9600;

var SerialPort = require('serialport');
var port = new SerialPort(device_id, {
	baudRate: baud_rate
});

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
});

port.on('error', function(err) {
  console.log('Port Error: ', err.message);
});

port.write('Hello\n');







