
var sagent = require('superagent');
var promise = require('promise');


var loader= module.exports = {
	load: function (file)
	{
		var prom = new promise(function (resolve, reject)
		{
			sagent.get(file, function (res)
			{
				if(res.error)
				{
					reject(res.error);
				}
				else
				{
					resolve(res);
				}
			});
		});
		return prom;
	}

};