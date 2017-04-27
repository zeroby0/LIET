const config = require('config');
const LIET = require('./src/LIET.js');

const deviceId = config.get('project.device_id');
const baudRate = config.get('project.baud_rate');
const altId = '/dev/cu.wchusbserial1420';

if (process.argv.length === 2) {
    new LIET(deviceId, baudRate);
} else if (process.argv.length === 3) {
    new LIET(altId, baudRate);
}

// liet.sendInstruction("Hello World");

