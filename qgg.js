function findPar(obj){
	var ev=$.Event("keydown", { which:13, keyCode:13 } ),
		ev2=$.Event("keyup", { which:13, keyCode:13 } );
	obj.trigger(ev);
	obj.trigger(ev2);
	if(obj==$(document)) return;
	findPar(obj.parent());
	//return obj.attr("contenteditable")=="true"?obj:findPar(obj.parent());
}

function q_chk(){
	console.log("run");
	chrome.storage.sync.get("owrai",kw=>{
		$('span:contains('+kw.owrai+')').each(function(){
			if($(this).attr("data-text")=="true"){
				console.log("event");
				//var ev=$.Event("keydown", { which:13, keyCode:13 } );
				//var par=findPar($(this));
				//alert(par.attr("class"));
				findPar($(this));
				//$(this).trigger(ev);//("submit");
			}
		});
		//chrome.runtime.sendMessage({daimai:(document.documentElement.innerHTML.indexOf(kw.owrai)==-1)}))}
	})}
//sg_chk();
//document.addEventListener("click",()=>chrome.runtime.sendMessage({yuudwoi:true}));