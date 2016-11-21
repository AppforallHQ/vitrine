module.exports = {
	number : function(str)
	{
		str = '' + str
		str = str.replace(/1/g, '۱');
		str = str.replace(/2/g, '۲');
		str = str.replace(/3/g, '۳');
		str = str.replace(/4/g, '۴');
		str = str.replace(/5/g, '۵');
		str = str.replace(/6/g, '۶');
		str = str.replace(/7/g, '۷');
		str = str.replace(/8/g, '۸');
		str = str.replace(/9/g, '۹');
		str = str.replace(/0/g, '۰');
		str = str.replace(/,/g, ',');
		
		return str;	
	},
	numberFormat:function(str)
	{
		str = ''+str;
		var sp = ',';
		var reg = /(\d+)(\d{3})/;
		while(reg.test(str))
		{
			str = str.replace(reg, "$1"+sp+"$2");
		}
		
		return str;
	}
	
}