const config = require('config');
const Packet = require('./packet');

class PacketPool {
    constructor() {
        this.depthOfOcean = config.get('protocol.ocean.depth');
        this.ocean = Array(this.depthOfOcean).fill(null);

        this.poolLength = config.get('protocol.pool.size');
        this.pool = Array(this.poolLength).fill(null);

        this.currentDepth = 0;
        this.marker = 0;
    }

    moveForward() {
        this.marker += 1;
        this.currentDepth += 1;
    }

    // packet will be drowned into ocean
    drown(packet) {
        const pkt = new Packet(packet.getString());
        this.ocean[this.currentDepth] = pkt;
    }

    setLatest(packet) {
        const pkt = new Packet({ data: packet.getString() });
        this.pool[this.marker] = pkt;
    }

    getLatest() {
        return this.pool[this.marker];
    }
}

module.exports = PacketPool;
