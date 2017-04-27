const SerialPort = require('serialport');
const EventEmitter = require('events');
const readline = require('readline');

const Server = require('./server');
const Packet = require('./packet');
// const DB = require('./database');

const rl = readline.createInterface(process.stdin, process.stdout);

class LIET extends EventEmitter {
    constructor(deviceId, baudRate) {
        super();

        this.port = new SerialPort(deviceId, {
            baudRate,
        });
        this.setPortEvents();
        this.setModuleEvents();
        this.server = new Server(this.port);
    }

    sendData(line) {
        const array = line.match(/.{1,24}/g);
        let i = 0;
        for (i = 0; i < array.length; i++) {
            this.sendPacket('ab', String(array[i]));
        }
        // console.log(array);
    }

    sendPacket(header, payload) {
        const packet = new Packet({ header, payload });
        console.log(packet.getLayout());
        this.server.sendPacket(packet);
    }

    onPacket(packet) {
        console.log(packet.getString());
        if (packet.isValid()) {
            this.server.parsePacket(packet);
        } else {
            console.log('invalid pkt recvd');
            // this.rejectPacket(packet);
        }
    }

    rejectPacket(packet) {
        packet.setRejected();
        this.server.sendPacket(packet);
    }

    setModuleEvents() {
        this.on('data_recieved', (data) => {
            const packet = new Packet({ data });
            console.log(packet.getLayout());
            this.onPacket(packet);
        });
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
            rl.prompt();
            rl.on('line', (line) => {
                if (line === 'exit') rl.close();
                this.sendData(line);
                rl.prompt();
            }).on('close', () => {
                process.exit(0);
            });
        });

        this.port.on('data', (data) => {
            console.log( new Buffer(data, 'base64').toString('ascii') );
            console.log(Buffer.byteLength(data));
            this.emit('data_recieved', data);
        });
    }
}

module.exports = LIET;
