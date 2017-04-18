const util = require('./util.js');




function sendRecvFile(pu) {
	util.writeAndDrain(pu.port, 'recv_file', function () {
		console.log('<--- send_file | recv_file');
	});
}

function sendFileName(pu)
// <--- recv_file
// ---> ready
// <--- file_name
// ---> get_file
// <--- cycle_count
// <--- file_0
// <--- file_1
// ...
exports.sendFile = function (file_name, pu) {
	state = pu.handlerState;
	switch(state.stage): {
		case 'send'
	}
}