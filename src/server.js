const Packet = require('./packet');

class Server {
    constructor(port) {
        this.status = null;
        this.port = port;
        this.nextPacket = function () {};
    }

    parsePackets() {
        
    }

    onPacket(packet) {
        if (packet.isValid()) {
            if (packet.isACKPacket()) {
                this.markACK(packet);
                this.packetPool.moveForward();
                this.nextPacket();
            } else if (packet.isNACKPacket()) {
                this.resendPacket();
            } else {
                this.status = null;
                this.packetPool.drown(packet);
                this.markACK(packet);
                this.sendACK();
                this.packetPool.moveForward();
                if (packet.isLastPacket()) {
                    this.parsePackets();
                    this.resetStream();
                }
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
        if (this.status === 'slave') {
            this.sendPacket(this.packetPool.getLatestPacket(1));
            this.status = null;
            return;
        }
        this.sendPacket(this.packetPool.getLatestPacket());
    }

    sendACK() {
        this.status = 'slave';
        this.sendPacket(this.packetPool.getLatestPacket());
    }

    sendNACK() {
        // this.status = 'slave';
        this.sendPacket(this.packetPool.getLatestPacket());
    }

}

module.exports = Server;
