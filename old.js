// const parser = require('./src/parser.js');

// var SerialPort = require('serialport');

// var port = new SerialPort(device_id, {
//   baudRate: baud_rate,
// });

// port.open(function (err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message);
//   }
// });

// port.on('error', function(err) {
//   console.log('Port Error: ', err.message);
// });

// var instruction = {
// 	count: 0,
// 	data: ''
// }

// function saveCycleCount(instruction, data){
// 	instruction.count = parseInt(data, 10);
// }

// function askForInstruction(port){
// 	port.write('start-sending');
// }

// function saveInstructionData(instruction, data){
// 	instruction.data = instruction.data + data;
// }

// function decrementInstructionCount(instruction){
// 	instruction.count = instruction.count - 1;
// }

// port.on('data', function(data) {
	
// 	data = new Buffer(data, 'base64').toString('ascii');
// 	console.log('data recv: ', data);
// 	if(data === 'SEND_INSTRUCTION')
	
// 	switch(instruction.count) {
// 		case 0:
// 			saveCycleCount(instruction, data);
// 			port.flush(function() {
// 				console.log('flushed count');
// 			});
// 			// askForInstruction(port);
// 			// port.drain(function() {
// 			// 	port.flush();
// 			// });
// 			break;
// 		default:
// 			saveInstructionData(instruction, data);
// 			decrementInstructionCount(instruction);
// 			if(instruction.count == 0){parser.parser(instruction.data);}
// 			break;
// 	}
// });

// function send(data){
// 	var number_of_cycles = Math.ceil(Buffer.byteLength(data)/32.0).toString();
// 	port.write(number_of_cycles, function() {
// 		console.log('written');
// 		port.drain(function() {
// 			console.log('drained');
// 			port.flush( function() {
// 				console.log('flushed');
// 			});
// 		})
// 	});

// 	port.write(data);

// }


// class LIET {
// 	constructor(port){
// 		this.port = port;
// 		this.port.on('error', function(err) {
// 		  console.log('Port Error: ', err.message);
// 		});
// 		this.port.open(function (err) {
// 		  if (err) {
// 		    return console.log('Error opening port: ', err.message);
// 		  }
// 		});
// 		this.port.on('open', function(){
// 			console.log('Port open');
// 		});
// 	}
// }