function change_tab(item, id){
	csv2plot(...item);
	try{
		document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} );
		document.getElementById(id).className='navbar_active';
	}
	catch(e){ console.log("No README.md for description!"); console.error(e);}
	document.getElementById("source_current").innerHTML=item[0]; document.getElementById("source_current").href=item[0]; document.getElementById("source_current").target="_blank";
}

async function change_tab2(item, id){
	df = await dfd.read_csv(item["url"]);
	try { df=df.set_index({key:"date"}); }
	catch(e) {
		console.error(e);
		// df=df.set_index({key:df.columns[0]});
	}
	layout = JSON.parse(JSON.stringify(layout_default))
	layout["title"] = item["description"];
	if (chart_type=="scatter"){ df.plot("graph").line({"layout": layout}); }
	else if (chart_type=="bar"){ df.plot("graph").bar({"layout": layout}); }
	

	try{
		document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} );
		document.getElementById(id).className='navbar_active';
	}
	catch(e){ console.log("No README.md for description!"); console.error(e);}
	document.getElementById("source_current").innerHTML=item["url"]; document.getElementById("source_current").href=item["url"]; document.getElementById("source_current").target="_blank";
}

function add_eventlistener(id, func, args){
	document.getElementById(id).addEventListener("click", function (event) {
		func(args, id)
		// func(arg); 
		// document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} )
		// document.getElementById(id).className='navbar_active';
	});
}