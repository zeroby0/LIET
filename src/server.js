const Packet = require('./packet');

class Server {
    constructor(port) {
        this.port = port;
        this.nextPacket = function () {};
    }

    parsePacket(packet) {
        const header = packet.getHeader();
        const functionId = header[0];
        switch (functionId) {
        case 'd':
            console.log('Testing');
            break;
        default:
            console.log('null packet');
            break;
        }
    }

    onPacket(packet) {
        if (packet.isValid()) {
            if (packet.isAckPacket()) {
                this.markACK(packet);
                this.packetPool.moveForward();
                this.nextPacket();
            } else if (packet.isNACKPacket()) {
                this.resendPacket();
            } else {
                this.packetPool.drown(packet);
                this.markACK(packet);
                this.sendACK();
                this.packetPool.moveForward();
            }
        } else {
            this.markNACK(packet);
            this.sendNACK();
        }
    }

    markPKT(packet, fn) {
        const str = packet.getString();

        const hb1 = fn;
        const hb2 = str[1];

        const payload = packet.getPayload();

        const pkt = new Packet({ header: hb1 + hb2, payload });
        this.packetPool.setLatest(pkt);
    }

    markACK(packet) {
        this.markPKT(packet, 'a');
    }

    markNACK(packet) {
        this.markPKT(packet, 'b');
    }

    sendPacket(packet) {
        this.port.write(packet.getString());
    }

    resendPacket() {
        this.sendPacket(this.packetPool.getLatestPacket());
    }

    sendACK() {
        this.sendPacket(this.packetPool.getLatestPacket());
    }

    sendNACK() {
        this.sendPacket(this.packetPool.getLatestPacket());
    }

}

module.exports = Server;
