//Date.now = function()
Date.prototype.getUTCTime = function()
{
	var z = this.getMonth()
	z = (z > 3 && z <8) ? 4 : 3;
	var d = this.getTime() + ( z * 1000*60*60 ) + ( 30 * 1000*60 )  // 3:30 Tehran's Timezone
	return d;
};