/*comments({
	id:ele.id,
	left:ele.left,
	top:ele.top
});
*/
function comments(cont){
	if (!cont.id) {
		console.log(cont.id);
		return;
	}
	var settings={
		id:undefined,
		left:0,
		top:0
	};
	for(var attr in cont){
		if (cont.hasOwnProperty(attr)) {
			settings[attr] = cont[attr];
		}
	}
	var temp = document.createElement('div');
	temp.id = 'commentBox';
	temp.innerHTML= "<input type='text'><input type='button' value='Comment'>";
	ajax({
		data:{
			action:'findOne',
			parent:settings.id
		},
		succ:function(res){
			for (var i = 0; i < res.comments.length; i++) {
				var li = document.createElement('li');
				li.innerHTML = res.comments[i];
				temp.appendChild(li);
			}
		}
	});
}

function ajax(json){
	var settings={
		url:'/login',
		method:'post',
		data:{},
		dataType:'json',
		succ:function(){},
		fail:function(){}
	};
	for(var attr in json){
		if (json.hasOwnProperty(attr)) {
			settings[attr]=json[attr];
		}
	}
	var att=[];
	for(var attr in settings.data){
		att.push(attr+'='+settings.data[attr]);
	}
	settings.data = att.join('&');
	var ajax = new XMLHttpRequest();
	if (settings.method.toLocaleLowerCase()==='get') {
		ajax.open(settings.method, settings.url+'?'+settings.data+'&'+new Date().getTime(), true);
		ajax.send();
	}else{
		ajax.open(settings.method, settings.url, true);
		ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		ajax.send(settings.data);
	}

	if (typeof ajax.onload === 'undefined') {
		ajax.onreadystatechange = ready;
	}else{
		ajax.onload = ready;
	}
	function ready(){
		if (ajax.readyState ==4 && ajax.status == 200) {
			switch (settings.dataType.toLocaleLowerCase()) {
				case 'string':
					settings.succ(ajax.responseText);
					break;
				case 'json':
					settings.succ(JSON.parse(ajax.responseText));
					break;
				case 'xml':
					settings.succ(ajax.responseXML);
					break;
			}
		}else {
			settings:fail(ajax.status);
		}
	}
}