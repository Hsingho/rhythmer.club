/*
mod(e, list, callback)
	e 			->	e			| 	event infomation
	list 		->	Boolean		|	if ul elements should exist
	callback	->	function	|	callback(name, msg)

Callback of update msg:
		function (name, msg) {
			ajax({
				url:'/update',
				data:{
					_id:thisID,
					comments:JSON.stringify({"name":name,"message":msg})
				},
				succ:function(res){
					console.log(res);
					alert('Success!');
				}
			});
		}
Callback of save msg:
		function (name, msg){
			ajax({
				url:'/save',
				data:{
					'name': name,
					'message': msg
				},
				succ:function(res){
					console.log(res);
					alert('Success!');
				}
			})
		}
*/
function mod(e, title, callback, setEle){
	var body = document.querySelector('body'),
		temp = document.createElement('section'),
		div = document.createElement('div'),
		h3 = document.createElement('h3');
		input = document.createElement('input'),
		text = document.createElement('textarea'),
		button = document.createElement('button');
	var thisID = e.target.getAttribute('comID');
	var l = e.clientX,
		t = e.clientY;

	temp.onclick = function(e){
		event.cancelBubble = true;
		if (e.target === temp) {
			body.removeChild(temp);
			temp.onclick = null;
			setEle && move(setEle);
		}
	};
	/*Submit button event creating*/
	button.onclick = function(){
		event.cancelBubble = true;
		if (!input.value) {
			alert('Please Enter Your Name!');
			return;
		}
		if (!text.value) {
			alert('Please Enter Your Message!');
			return;
		}
		callback && callback(input.value, text.value);
	};


	temp.id = 'comments';
	div.className = 'comment';
	h3.innerHTML = title;
	input.type = 'text';
	input.name = 'name';
	input.placeholder = 'Please Enter Your Name';
	input.tabIndex = 1;
	text.name = 'comments';
	text.placeholder = 'Please Enter Your Message';
	text.tabIndex = 2;
	button.innerHTML = 'GO';
	button.tabIndex = 3;

	div.appendChild(h3);
	div.appendChild(input);
	div.appendChild(button);
	div.appendChild(text);

	if (setEle) {
		var ul = document.createElement('ul');
		if (commentsAll[thisID].length) {
			for (var i = commentsAll[thisID].length-1; i>=0; i--){
				var li = document.createElement('li');
				li.innerHTML = '【'+(i+1)+'】'+commentsAll[thisID][i].name+"：“"+commentsAll[thisID][i].message+"”";
				ul.appendChild(li);
			}
		}else{
			ul.innerHTML = '<li>暂无留言 =_=!</li>';
		}
		div.appendChild(ul);
	}
	temp.appendChild(div);
	body.appendChild(temp);

	l = l+400>window.innerWidth ? l-400 : l;
	t = t+div.offsetHeight>window.innerHeight ? window.innerHeight-div.offsetHeight : t;
	div.style.left = l + 'px';
	div.style.top = t + 'px';

	input.focus();
}


function ajax(json){
	var settings={
		url:'/find',
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