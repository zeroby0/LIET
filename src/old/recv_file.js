const util = require('./util.js');

function writeToFile(fileName, data) {
  fs.writeFile(fileName,data, function (err) {
    if(err) {
      console.log('Error in writeFile: ', err);
    }
    console.log('File Write completed');
  });
}

function sendReady(pu){
  util.writeAndDrain(pu.port, 'ready', function() {
    pu.handlerState.stage = 'sent-ready';
    console.log('<--- recv_file | ready')
  })
}

function recvFileName(data, pu){
  pu.handlerState.file_name = data;
  pu.handlerState.stage = 'recv-file_name';
  console.log('---> recv_file | file_name : ', data);
}

function sendGetFile(pu){
  util.writeAndDrain(pu.port, 'send_file', function() {
    pu.handlerState.stage = 'sent-get_file';
    console.log('<--- recv_file | send_file');
  });
}

function recvCycleCount(data,pu){
  pu.handlerState.cycle_count = data;
  pu.handlerState.stage = 'recv-cycle_count';
  console.log('---> recv_file | cycle_count : ', data);
}

function recvFileData(data,pu){
  if(pu.handlerState.cycle_count > 0){
    util.writeToFile(pu.handlerState.file_name, data);
    console.log('---> recv_file | file_data');
    pu.handlerState.cycle_count = pu.handlerState.cycle_count - 1;
    return;
  }
  pu.handlerState.stage = 'recv-file_data';
}

function finishTransfer(pu){
  util.writeAndDrain(pu.port, 'end_transmission', function () {
    console.log('<--- recv_file | end_transmission');
    pu.reset();
  });
}


// ---> recv_file
// <--- ready
// ---> file_name
// <--- get_file
// ---> cycle_count
// ---> file_data_0
// ---> file_data_1
// ...  data , parserUtils
exports.recvFile = function(data, pu) {
  state = pu.handlerState;
  switch(state.stage): {

    case 'recv-recv_file': // <--- recv_file
      sendReady(pu); // ---> ready
      break;
    case 'sent-ready':  
      recvFileName(data, pu); // <--- file_name
      sendGetFile(pu); // ---> get_file
      break;
    case 'sent-get_file':
      recvCycleCount(data, pu); // <--- cycle_count
      break;
    case 'recv-cycle_count':
      recvFileData(data,pu); // <--- file_data
      break;
    case 'recv-file_data':
      finishTransfer(pu);
      break;
    default:
      flagError(pu); // <--- _wtf_
      break;

  }
}