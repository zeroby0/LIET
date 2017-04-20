const LIET = require('./src/LIET.js');

const deviceId = '/dev/cu.wchusbserial1420';
const baudRate = 57600;


function todo(liet) {
    const inst = {
        name: 'Aravind',
        number: 524,
    };
    liet.sendInstruction(inst);
    console.log('Sent instruction');
}

new LIET(deviceId, baudRate, todo);

// liet.sendInstruction("Hello World");

