const Loki = require('lokijs');

const DB_PATH = '../data/db.json';

class DB {
    constructor() {
        this.db = new Loki(DB_PATH);
        this.packet_counter = 0;
        this.packets = this.db.addCollection('packets', { indices: ['number'] });
    }

    resetCounter() {
        this.packet_counter = 0;
    }

    savePacket() {
    }


}

module.exports = DB;
