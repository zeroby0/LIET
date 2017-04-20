const sha1 = require('sha1');

class util {
    static calcHash(data, length = 40) {
        const hash = sha1(data);
        return hash.substring(0, length);
    }

    static getHash(dataAndHash, hashLength = 6) {
        return dataAndHash.substr(dataAndHash.length - hashLength);
    }

    static getData(dataAndHash, hashLength = 6) {
        return dataAndHash.substring(0, dataAndHash.length - hashLength);
    }
}


module.exports = util;
