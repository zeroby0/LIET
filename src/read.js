// var device_id = '/dev/cu.usbmodem1421';  // change this. `ls /dev/`
var device_id = '/dev/cu.wchusbserial1410';
var baud_rate = 9600;


var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;  // parser: only from 5.x of nodeserial

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

// vanilla read
// port.on('data', function(data) {
// 	console.log(data);
// });


var parser = port.pipe(new Readline());
// read line. WARN: doesnt out put till a \n is recvd
parser.on('data', function (data) {
	console.log(data);
});