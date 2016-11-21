require("mootools");
var celeri = require("celeri");
var event = require('events').EventEmitter;
require('custom-date');

var AbstractService = new Class({
	Implements: [event,Options],
	initialize:function(options)
	{
		this.setOptions(options);
		this.emit("init");
		celeri.option({
		    command: 'execute :options',
		    description: 'Call the execute method of command with json arguments'
		}, function(data) {
			var options = JSON.decode(data.options)
			this.setOptions(options);
			this.execute();

		}.bind(this));

		//parse the command line args
		celeri.parse(process.argv);
	},
	execute:function()
	{
		this.emit("beforeExecute");
	},
	exit:function()
	{
		this.emit("exit");
		this.options = null;
		process.exit(0);
	}
});


AbstractService.MESSAGE = 'message';
AbstractService.EVENT_READY = 'ready';
AbstractService.EVENT_ERROR = 'error';
AbstractService.EVENT_INIT = 'init';
AbstractService.EVENT_CLOSE = 'close';

//exports.AbstractService = AbstractService;
module.exports = AbstractService;