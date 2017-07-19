/*comments({
	id:ele.id,
	left:ele.left,
	top:ele.top
});
*/
function comments(e){//添加评论模块
	document.onclick=null;
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
	button.innerHTML='Comment';

	div.appendChild(input);
	div.appendChild(text);
	div.appendChild(button);
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
		// ajax();
	};
}

function comList(ev){//返回留言信息列表
	ajax({
		data:{
			// id:ev.targetNode.id
		},
		action:'findOne',
		succ:function(res){
			n=0;
			for (var i = 0; i < res.comments.length; i++) {
				var li = document.createElement('li');
				li.innerHTML=res.comments[i].name+': '+res.comments[i].comment;
				ul.appendChild(li);
			}
			div.appendChild(ul);
			temp.appendChild(div);
			document.querySelector('body').appendChild(temp);
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