const file = require('./file.js');

exports.recvFile = function (data, pstate) {
	pstate.handlerState.stage = 'recv-recv_file';
	return file.recvFile;
}

exports.sendFile = function(data, pstate) {
	pstate.handlerState.stage = ''
}