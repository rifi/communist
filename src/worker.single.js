//special case of worker only being called once, instead of sending the data
//we can bake the data into the worker when we make it.

function single(fun,data){
	if(typeof Worker === 'undefined'){
		return multiUse(fun).data(data);
	}
	var promise = c.deferred();
	var worker = makeWorker(['var _self={};\n_self.fun = ',fun,';\n\
	_self.cb=function(data,transfer){\n\
			!self._noTransferable?self.postMessage(data,transfer):self.postMessage(data);\n\
			self.close();\n\
		};\n\
		_self.result = _self.fun(',JSON.stringify(data),',_self.cb);\n\
		if(typeof _self.result !== "undefined"){\n\
			_self.cb(_self.result);\n\
		}']);
	worker.onmessage=function(e){
		promise.resolve(e.data);
	};
	worker.onerror=function(e){
		e.preventDefault();
		promise.reject(e.message);
	};
	return promise.promise;
}
