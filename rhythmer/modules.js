/*comments({
	id:ele.id,
	left:ele.left,
	top:ele.top
});
*/
function comments(e){//添加评论模块
	event.cancelBubble=true;
	var body = document.querySelector('body');
	var l = e.offsetX;
	var t = e.offsetY;
	l+400 > window.innerWidth ? l=l-400 : l = l;
	t+300 > window.innerHeight ? t=t-300 : t = t;

	var temp = document.createElement('section');
	var div = document.createElement('div');
	var input = document.createElement('input');
	var text = document.createElement('textarea');
	var button = document.createElement('button');
	
	temp.id = 'comments';
	div.style.left=l+'px';
	div.style.top = t+'px';
	input.type='text';
	input.name='name';
	input.placeholder='Please Enter Your Name';
	text.name='comments';
	text.placeholder='Enter Message';
	button.innerHTML='GO';

	div.appendChild(input);
	div.appendChild(button);
	div.appendChild(text);
	temp.appendChild(div);
	body.appendChild(temp);

	temp.onclick=function(e){
		event.cancelBubble = true;
		if (e.target === temp) {
			body.removeChild(temp);
			temp.onclick=null;
			document.onclick=comments;
		}
	};
	button.onclick=function(){
		event.cancelBubble = true;
		if (!input.value) {
			alert('Please Enter Your Name!');
			return;
		}
		if (!text.value) {
			alert('Please Enter Your Comments!');
			return;
		}
		ajax({
			url:'/save',
			data:{
				name:input.value,
				message:text.value,
				comments:{}
			},
			succ:function(){
				alert('Success!');
			}
		});
	};
}

function comList(e,setEle){//返回留言信息列表
	event.cancelBubble = true;

	var body = document.querySelector('body');
	var thisID = e.target.getAttribute('comID');
	var l = e.clientX;
	l+400 > window.innerWidth ? l=l-400 : l = l;

	var temp = document.createElement('section');
	var div = document.createElement('div');
	var input = document.createElement('input');
	var text = document.createElement('textarea');
	var button = document.createElement('button');
	
	temp.id = 'comments';
	div.style.left=l+'px';
	div.style.top = (window.innerHeight - 600)/2+'px';
	div.className = 'comment'
	input.type='text';
	input.name='name';
	input.placeholder='Please Enter Your Name';
	text.name='comments';
	text.placeholder='Enter Message';
	button.innerHTML='GO';

	div.appendChild(input);
	div.appendChild(button);
	div.appendChild(text);

	var ul = document.createElement('ul');
	if (commentsAll[thisID].length) {
		for (var i = commentsAll[thisID].length-1; i>=0 ; i--) {
			var li = document.createElement('li');
			li.innerHTML=commentsAll[thisID][i].name+': '+commentsAll[thisID][i].message;
			ul.appendChild(li);
		}
	}else{
		ul.innerHTML = '<li>暂无留言</li>';
	}
	div.appendChild(ul);

	temp.appendChild(div);
	body.appendChild(temp);

	temp.onclick=function(e){
		event.cancelBubble = true;
		if (e.target === temp) {
			body.removeChild(temp);
			temp.onclick=null;
			move(setEle);
		}
	};
	button.onclick=function(){
		event.cancelBubble = true;
		if (!input.value) {
			alert('Please Enter Your Name!');
			return;
		}
		if (!text.value) {
			alert('Please Enter Your Comments!');
			return;
		}
		ajax({
			url:'/update',
			data:{
				_id:thisID,
				comments:JSON.stringify({"name":input.value,"message":text.value})
			},
			succ:function(res){
				console.log(res);
				alert('Success!');
			}
		});
	};
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