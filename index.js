const config = require('config');
const LIET = require('./src/LIET.js');

const deviceId = config.get('project.device_id');
const baudRate = config.get('project.baud_rate');

const altId = '/dev/cu.wchusbserial1420';

function todo(liet) {
    liet.sendPacket('ab', 'Aravind');
}

if (process.argv.length == 2) {
    new LIET(deviceId, baudRate, todo);
} else if (process.argv.length == 3) {
    new LIET(altId, baudRate, todo);
}

// liet.sendInstruction("Hello World");

