const LIET = require('./src/LIET.js');

const deviceId = '/dev/cu.wchusbserial1420';
const baudRate = 57600;


let todo = function (liet) {
	let inst = {
		name: 'Aravind',
		number: 524,
		array: [1,2,3,'ara', 4,5]
	} 
	liet.sendInstruction(inst);
	console.log('Sent instruction');
}

const liet = new LIET(deviceId, baudRate, todo);

// liet.sendInstruction("Hello World");

