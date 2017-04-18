const fs = require("fs");
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

function writeToFile(fileName, data) {
  fs.writeFile(fileName,data, function (err) {
    if(err) {
      console.log('Error in writeFile: ', err);
    }
    console.log('File Write completed');
  });
}

port.on('data', function(data) {
  writeToFile('output_test_file.txt', data);
});



