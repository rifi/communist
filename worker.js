funcs={};
function cWorker(name, func){
	funcs[name]=func;
};
cWorker("_addLib",function(url){
	importScripts(url);
	return "Success";
});
self.onmessage = function(event) {
	var name = event.data[0];
	var p = event.data[1];
	var func = funcs[event.data[0]];
	var cb = event.data[2]
  	self.postMessage([cb,func(p)]);
};
