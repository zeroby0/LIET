// [header - 2][payload - 24][hash - 6]
// [header] = [function_id][flags]
// [function_id] = [UXXXXXXX]
// [flags] = [U|Last_packet = 1|Packet_count = 6]

const sha1 = require('sha1');
const config = require('config');

const headerLength = config.get('packet.header_bytes');
const payloadLength = config.get('packet.payload_bytes');
const hashLength = config.get('packet.hash_bytes');

class Packet {

    constructor({ data, header, payload }) {
        this.setString({ data, header, payload });
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

    setString({ data, header, payload }) {
        if (data) {
            this.string = new Buffer(data, 'base64').toString('ascii');
        } else {
            this.string = Packet.generatePacket(header, payload);
            if (!this.isValid()) {
                console.error('Invalid Packed generated');
            }
        }
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

    getNumber() {
        const header = this.getHeader();
        const binary = header.charCodeAt(0);
        const number = binary & 0b01111111; // 127 is forbidden
        return number;
    }

    getPayload() {
        const packet = this.string;
        const headAndPayload = Packet.getFirstNBytes(packet, headerLength + payloadLength);
        return Packet.getLastNBytes(headAndPayload, payloadLength);
    }

    setRejected() {
        const replaceCharAt = (s, i, c) => {
            if (i > s.length - 1) return s;
            return s.substr(0, i) + c + s.substr(i + 1);
        };

        const header = this.getHeader();
        const payload = this.getPayload();

        const newheader = replaceCharAt(header, 0, '~');
        this.setString({ header: newheader, payload });
    }
}


module.exports = Packet;
