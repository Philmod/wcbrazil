module.exports = function(server, options) {
  function getmem(){
    return Math.round(process.memoryUsage().rss / 1024 / 1024);
  }
  var interval = options.interval || 30000
    , maxMemory = options.maxMemory || 512
    , mem = getmem();

  function report(){
    var newmem = getmem()
      , change = newmem - mem
      , warn = change > 8
      , memory = newmem + 'Mb'
      , info = '(jumped by ' + change + ' Mb, was ' + mem + ' Mb)';

    if(newmem > maxMemory) {
      console.error("Process using more than "+maxMemory+"MB, exiting");
      process.exit(1);
    }

    console.log('MEMORY [' + (warn ? 'warn' : 'debug') + '] : ', memory, (warn ? info : ''));

    mem = newmem;
  }
  setInterval(report, interval);
};
