function change_tab(item, id){
	csv2plot(...item);
	try{
		document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} );
		document.getElementById(id).className='navbar_active';
	}
	catch(e){ console.log("No README.md for description!"); console.error(e);}
	document.getElementById("source_current").innerHTML=item[0]; document.getElementById("source_current").href=item[0]; document.getElementById("source_current").target="_blank";
}

function add_eventlistener(id, func, args){
	document.getElementById(id).addEventListener("click", function (event) {
		change_tab(...args, id)
		// func(arg); 
		// document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} )
		// document.getElementById(id).className='navbar_active';
	});
}