function change_tab(item, id){
	csv2plot(item);
	document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} )
	document.getElementById(id).className='navbar_active';
}

function add_eventlistener(id, func, arg){
	document.getElementById(id).addEventListener("click", function (event) {
		change_tab(arg, id)
		// func(arg); 
		// document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} )
		// document.getElementById(id).className='navbar_active';
	});
}