// const parserFunctions = require('./parser_functions.js')

exports.parser = function (data) {
	// asdata = new Buffer(data, 'base64').toString('ascii');
	// azdata = new Buffer(asdata, 'base64').toString('ascii');
	// console.log('recvd encded ',data);
	// console.log('recvd decoed ',asdata);
	// console.log('recvd ddddecoed ',azdata);
	// var instruction = JSON.parse(azdata);
	// console.log(asdata);
	// console.log(instruction);	
	console.log(data);
	console.log(Buffer.byteLength(data, 'utf8'));
};