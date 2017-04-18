const util = require('./util.js');

function writeToFile(fileName, data) {
  fs.writeFile(fileName,data, function (err) {
    if(err) {
      console.log('Error in writeFile: ', err);
    }
    console.log('File Write completed');
  });
}

function saveFileName(data, meta){
	meta.fileName = data;
}

exports.recvFile = function(data, meta) {
  if(meta.offline)
	switch(data){
		case 'file_name':


	}
}