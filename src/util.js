exports.writeAndDrain = function (port, data, callBack){
  port.write(data, function() {
    port.drain(callBack);
  });
}