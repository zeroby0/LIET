var fs = require("fs");
const Packet = require('./packet');

class Server {
    constructor(port) {
        this.status = null;
        this.port = port;
        this.nextPacket = function () {};
    }

    parsePackets() {
        const ref = this.packetPool.getOcean();
        const ocean = Array(this.packetPool.currentDepth);
        let i = 0;
        for (i = 0; i < this.packetPool.currentDepth; i++) {
            const pkt = new Packet({ data: ref[i].getString });
            ocean[i] = pkt;
        }
        const fn = ocean[0].getHeader()[0];
        let str = '';
        for (i = 0; i < this.packetPool.currentDepth; i++) {
            str += ocean[i].getPayload();
        }

        fn(str);
    }

    static writeToFile(fileName, data) {
        fs.writeFile(fileName, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    sendFile(fileName) {
        let buffer = new Buffer(1024);
        fs.open(fileName, 'r+', (err, fd) => {
            if (err) {
                console.log(err);
            }
            const fileSizeInBytes = fs.statSync(fileName);
            fs.read(fd, buffer, 0, 24, (err, bytes) => {
                if (err) {
                    console.log(err);
                }

                if (bytes) > 0 {
                    const pkt = new Packet(head: 'da')
                }
            })


        });
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
