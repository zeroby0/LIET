const SerialPort = require('serialport');
const EventEmitter = require('events');

const Packet = require('./packet');
// const DB = require('./database');

class LIET extends EventEmitter {
    constructor(deviceId, baudRate, todo) {
        super();
        this.todo = todo;
        this.port = new SerialPort(deviceId, {
            baudRate,
        });
        this.setPortEvents();
        this.setModuleEvents();
    }

    setModuleEvents() {
        this.on('data_recieved', (data) => {
            const packet = new Packet({ data });
            LIET.onPacket(packet);
        });
    }

    sendPacket(header, payload) {
        const packet = new Packet({ header, payload });
        this.port.write(packet.getString());
    }

    static onPacket(packet) {
        if (packet.isValid()) {
            console.log('valid packet: ', packet.getLayout());
        } else {
            console.log('error: ', packet.getLayout());
        }
    }

    setPortEvents() {
        this.port.on('error', (err) => {
            console.error('Error occured : ', err.message);
        });

        this.port.open((err) => {
            if (err) {
                console.log('Error opening port: ', err.message);
            }
        });

        this.port.on('open', () => {
            console.log('Port opened');
            this.todo(this);
        });

        this.port.on('data', (data) => {
            this.emit('data_recieved', data);
        });
    }
}

module.exports = LIET;



