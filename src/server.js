// const Packet = require('./packet');

class Server {
    constructor(port) {
        this.port = port;
    }

    sendPacket(packet) {
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
            console.log('null packet');
            break;
        }
    }


}

module.exports = Server;