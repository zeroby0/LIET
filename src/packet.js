const sha1 = require('sha1');
const config = require('config');

const headerLength = config.get('packet.header_bytes');
const payloadLength = config.get('packet.payload_bytes');
const hashLength = config.get('packet.hash_bytes');

class Packet {

    constructor({ data, header, payload }) {
        if (data) {
            this.string = new Buffer(data, 'base64').toString('ascii');
        } else {
            this.string = Packet.generatePacket(header, payload);
            if (!this.isValid()) {
                console.error('Invalid Packed generated');
            }
        }
    }

    static generatePacket(header, payload) {
        const rightPad = (s, c, n) => s + c.repeat(n - s.length);

        const paddedPayload = rightPad(payload, ' ', payloadLength);
        const bodyHash = sha1(header + paddedPayload);
        const hash = Packet.getFirstNBytes(bodyHash, hashLength);
        return header + paddedPayload + hash;
    }

    static getFirstNBytes(data, numberOfBytes) {
        return data.substring(0, numberOfBytes);
    }

    static getLastNBytes(data, numberOfBytes) {
        const dataSize = Buffer.byteLength(data);
        return data.substring(dataSize - numberOfBytes);
    }

    getLayout() {
        return  '[' + this.getHeader()  + ']' +
                '[' + this.getPayload() + ']' +
                '[' + this.getHash()    + ']';
    }

    getString() {
        return this.string;
    }

    generateHash() {
        const hashableData = this.getHeader() + this.getPayload();
        const hash = sha1(hashableData);
        return Packet.getFirstNBytes(hash, hashLength);
    }

    isValid() {
        const headerSizeValid = (this.getHeader().length === headerLength);
        const payloadSizevalid = (this.getPayload().length === payloadLength);
        const hashSizeValid = (this.getHash().length === hashLength);

        const allSizesValid = headerSizeValid && payloadSizevalid && hashSizeValid;

        const hashRecieved = this.getHash();
        const hashCalculated = this.generateHash();

        const hashesMatch = (hashRecieved === hashCalculated);

        return allSizesValid && hashesMatch;
    }

    getHeader() {
        const packet = this.string;
        return Packet.getFirstNBytes(packet, headerLength);
    }

    getHash() {
        const packet = this.string;
        return Packet.getLastNBytes(packet, hashLength);
    }

    getPayload() {
        const packet = this.string;
        const headAndPayload = Packet.getFirstNBytes(packet, headerLength + payloadLength);
        return Packet.getLastNBytes(headAndPayload, payloadLength);
    }
}


module.exports = Packet;
