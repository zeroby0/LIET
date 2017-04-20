const Util = require('./util');

class parser {
    static parse(data) {
        console.log('Parser: instructon - ', data);
        const recievedhash = Util.getHash(data, 6);
        const json = Util.getData(data, 6);
        const calculatedHash = Util.calcHash(json, 6);
        
        const instructon = JSON.parse(json);

        console.log('hash recvd: ', recievedhash);
        console.log('hash calcd: ', calculatedHash);
        console.log('instructon: ', instructon, '\n\n');
    }

}

module.exports = parser;
