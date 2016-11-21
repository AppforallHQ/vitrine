require('../lib/custom-date');

module.exports =
{
	index : function(req, res)
	{
		res.status(404);
		res.render({error:true, message : 'invalid URI'});
	}
}





