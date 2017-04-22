const Packet = require('./packet');

class Server {
    constructor(port) {
        this.port = port;
        this.packetArray = [];
        this.count = 0;
    }

    incrementCount() {
        this.count += 1;
        if (this.count === 127) {
            this.count = 0;
        }
    }

    sendPacket(fnByte, payload, isLastPacket = false) {
        this.incrementCount();
        let numByte = String.fromCharCode(this.count);
        if (isLastPacket) {
            numByte = String.fromCharCode(parseInt(0b01111111, 10));
        }

        const packetString = fnByte + numByte + payload;
        const packet = new Packet(packetString);
        this.packetArray().splice(this.count, 0, packet);  //insert
        this.writePacket(packet);
    }

    writePacket(packet) {
        this.port.write(packet.getString());
    }

    parsePacket(packet) {
        const header = packet.getHeader();
        const functionId = header[0];
        switch (functionId) {
        case '~':
            console.log('packet rejected');
            break;
        case 'a':
            console.log('Testing');
            break;
        default:
            console.log('unknown command');
            break;
        }
    }


}

module.exports = Server;