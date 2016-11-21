var logClass = require('./').client;
var logServerClass = require('./').server;


// server test
var logserver = new logServerClass('tests')
return;


var log = new logClass('tests');

 


// basic
log.error('', {a : 1, b : '1', c : [1,2,3] } )
log.info('this is my test!')
log.warn('this is WARN....', {a:1})
log.warn('this is WARN....')


// timer
var i=0;
function add()
{
	i++;
	
	
	if( i == 30 || i == 150 ||  i == 250)
	{
		log.error('oops!', {num : i})
	}else
	{
		log.info('dummy timer', {num : i})
	}
	
	if(i < 1000)
		setTimeout(add,  Math.random() * 1000 ); // add item in random time
	else
		log.close();
}

add();

