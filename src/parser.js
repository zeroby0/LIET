const func = require('./parser_functions.js')

var parser_state = {
	serial: null,
	reset: this.reset(),
	status: 'online',
	handlerFn: null,
	handlerState: {},
}

exports.reset = function() {
	parser_state.online = 'online';
	parser_state.handlerFn = null;
	parser_state.handlerState = {};
}

// parser - online: data handled by parser
// parser - offline: data handled by handling function
exports.parser = function (state) {
	if( state.status === 'online' ){

		switch(state.data){
			case 'recv_file': 
				state.handlerFn = func.recvFile;
				state.status = 'offline';
				break;
			default:
				console.log('[Parser: Unknown command ] - ', data);
		}
		return;

	}
	state.handlerFn(state);
};