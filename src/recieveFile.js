const util = require('./util.js');
const sendindData = ' ]<--- recieveFile | ';
const recievingData = ' ]---> recieveFile | ';

function writeToFile(fileName, data) {
  fs.writeFile(fileName,data, function (err) {
    if(err) {
      console.log('Error in writeFile: ', err);
    }
    console.log('File Write completed');
  });
}

function saveFileName(state){
	state.handlerState.fileName = state.data;
  console.log(' ]---> recieveFile | file_name : ', state.data);
}

function askForCycleCount(port){
  port.write('cycle_count?', function () {
    console.log(sendindData, 'cycle_count?');
  });
}



exports.recieveFile = function(state) {
  if(state.handlerState.status === 'handshake'){
    switch(state.data){
      case 'file_name':
        saveFileName(state);
        askForCycleCount(state.port);
        break;
      case 'cyc'
    }
  }

}