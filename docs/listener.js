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

	// #~ if category exist
	ndf = check_category(df, "state")
	if (ndf){
		console.log("Category Exist!")
		category = Object.keys(ndf)[0]
		layout = JSON.parse(JSON.stringify(layout_default))
		
		layout["title"] = item["description"];//+"  ("+category+")";
		ndf[category].plot("graph").line({"layout": layout})
	}

}

function add_eventlistener(id, func, args){
	document.getElementById(id).addEventListener("click", function (event) {
		func(args, id)
		// func(arg); 
		// document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} )
		// document.getElementById(id).className='navbar_active';
	});
}





// helper
function removeDuplicate(myArray){
	// let myArray = ['a', 'b', 'a', 'b', 'c', 'e', 'e', 'c', 'd', 'd', 'd', 'd']
	let myArrayWithNoDuplicates = myArray.reduce(function (accumulator, currentValue) {
	  if (accumulator.indexOf(currentValue) === -1) {
	    accumulator.push(currentValue)
	  }
	  return accumulator
	}, [])

	console.log(myArrayWithNoDuplicates)
	return myArrayWithNoDuplicates
}


// #~ check for string categories
function check_category(df, col="state"){
	// col = "state"
	if (df.columns.includes(col)){
		let items = removeDuplicate(df[col].data)

		ndf={}
		items.forEach( item => {
		// item = "Johor"
		console.log(item)
		ndf[item] = df.query({ column: col, is: "==", to: item })
		ndf[item].drop( {columns: [col], inplace: true} )
		//ndf[item] = ndf[item].drop( {columns: [col]} )

		col_namechange={}
		ndf[item].columns.forEach( a=>{ col_namechange[a]=item+'_'+a } )
		ndf[item] = ndf[item].rename({ mapper: col_namechange });

		/////  try {ndf[item].rename({ mapper: col_namechange, inplace: true });}
		/////  catch(err){}
		})

		// ndf[Object.keys(ndf)[0]].plot("graph").line({"layout": layout_default})
		return ndf
	}
	return false
}
