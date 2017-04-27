// const Packet = require('./packet');

class Server {
    constructor(port) {
        this.port = port;
    }

    sendPacket(packet) {
        console.log('tra ',packet.getString());
        this.port.write(String(packet.getString()));
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
            console.log(packet.getLayout());
            break;
        default:
            console.log('null packet');
            break;
        }
    }


}

module.exports = Server;