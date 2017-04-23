var q_defaultInfo={
		owrai:"",
		time:"",
		noti:false,
		run:false
	},
	q_info;

var room;

function postCmd(cmd) { room.postMessage(cmd); }

function q_availKW() { return $('#q_keyword').val().replace(/^\s+|\s+$/g,"")!=""; }

function q_chkTime() { return /^\d{1,2}(:\d{1,2})?$/.test($('#q_time').val())||$('#q_time').val()==""; }

function q_load(){
	chrome.storage.sync.get(null,save=>{
		q_info=q_defaultInfo;
		for(var k in save) if(k in q_info) q_info[k]=save[k];
		q_setForm();
	});
}

function q_saveKeyword(kw){
	q_setButton();
	chrome.storage.sync.set({owrai:(q_info.owrai=kw.replace(/^\s+|\s+$/g,""))});
}

function q_saveTime(t){ chrome.storage.sync.set({time:(q_info.time=t.replace(/^\s+|\s+$/g,""))}); }

function q_setButton(){
	$('#q_button').attr("class",q_availKW()&&q_chkTime()?"start":"");
}

function q_setForm(){
	$('.chkBox').each(function(){
		$(this).prop("checked",q_info[$(this).attr("name")]);
	});
	q_setFormAvail();
}

function q_setFormAvail(){
	$('#q_keyword').val(q_info.owrai);
	$('#q_time').val(q_info.time);
	$('#q_button').attr("class",q_info.run?"stop":(q_availKW()&&q_chkTime()?"start":""));
	$('.dis').prop("disabled",q_info.run);
}

function q_setRun(status){
	postCmd("Toggle");
	q_info.run=status;
	q_setFormAvail();
}

function q_toggle()//{ if(q_info.run||(q_availKW()&&q_chkTime())) q_setRun(!q_info.run); }
{
	chrome.tabs.executeScript(
		{code:"q_chk();"}); 
}

$(function(){
	room = chrome.extension.connect({ name:"GongQChatRoom" });
	room.onMessage.addListener(msg=>{
		var cmd=msg.split(" ",1)[0];
		var tail=msg.substr(cmd.length+1);
		switch(cmd){
			case "Stop":
				q_info.run=false;
				q_setFormAvail();
				break;
			default: break;
		}
	});

	$('.chkBox').change(function(){
		var obj={};
		q_info[$(this).attr("name")]=(obj[$(this).attr("name")]=$(this).prop("checked"));		
		chrome.storage.sync.set(obj);
	});

	$('#q_button').click(q_toggle);

	$('#q_time').bind({
		focus:function(){ $(this).attr("placeHolder",""); },
		focusout:function(){ $(this).attr("placeHolder","HH:mm"); },
		keydown:e=>{
			if($.inArray(e.keyCode,[8,9,13,27,46])!=-1 ||
				((e.ctrlKey==true||e.metaKey==true)&&(e.keyCode==65||e.keyCode==67)) ||
				(e.shiftKey==true&&e.keyCode==186) ||
				(e.keyCode>=35&&e.keyCode<=40))
					return;
			if((e.keyCode<48||e.keyCode>57)&&(e.keyCode<96||e.keyCode>105)) return false;
		},
		keyup:function(e){
			$('#time').attr("class",q_chkTime()?"":"red");
			q_setButton();
			if(q_chkTime()) q_saveTime($(this).val());
			if(e.keyCode==13) q_toggle();
		}
	});

	$('#q_keyword').bind({
		change:function(){ q_saveKeyword($(this).val()); },
		keyup:function(e){
			q_saveKeyword($(this).val());
			if(e.keyCode==13) q_toggle();
		}
	});

	$('#q_reset').click(()=>{
		if(!q_info.run)
			chrome.storage.sync.clear(()=>{
				var obj=(q_info=q_defaultInfo);
				obj["dataClearList"]=(q_clearList=q_defaultClearList);
				chrome.storage.sync.set(obj,q_setForm);
			});
	});

	//$(document).contextmenu(()=>{ return false; });

	q_load();
});