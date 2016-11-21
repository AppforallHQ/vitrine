module.exports = {
	digital : function(num)
	{
		num = Number(num);
		if(num<10)
		{
			num = "0"+num;
		}
		
		return num;	
	}
	
}