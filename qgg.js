function findPar(obj){
	return obj.attr("contenteditable")=="true"?obj:findPar(obj.parent());
}

function q_chk(){
	console.log("run");
	chrome.storage.sync.get("owrai",kw=>{
		$('span:contains('+kw.owrai+')').each(function(){
			if($(this).attr("data-text")=="true"){
				var e=$.Event("keydown");
				e.keyCode=13;
				e.which=13;
				var par=findPar($(this));
				alert(par.attr("class"));
				par.trigger(e);
			}
		});
		//chrome.runtime.sendMessage({daimai:(document.documentElement.innerHTML.indexOf(kw.owrai)==-1)}))}
	})}
//sg_chk();
//document.addEventListener("click",()=>chrome.runtime.sendMessage({yuudwoi:true}));