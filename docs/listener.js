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
	try { 
		if ("datetime" in df)
	      { df=df.set_index({key:"datetime"}); }
	    else if ("date" in df)
	      { df=df.set_index({key:"date"}); }
	    else if ("Date" in df)
	      { df=df.set_index({key:"Date"}); }
	    else if ("Datetime" in df)
	      { df=df.set_index({key:"Datetime"}); }
	    else if ("time" in df)
	      { df=df.set_index({key:"time"}); }
	    else if ("Time" in df)
	      { df=df.set_index({key:"Time"}); }
	  	else
  		  { console.log("can't auto detect index") }
		
	}
	catch(e) {
		console.error("Error: can't auto detect index")
		console.error(e);
		// df=df.set_index({key:df.columns[0]});
	}
	layout = JSON.parse(JSON.stringify(layout_default))
	layout["title"] = item["description"];

	try{
		document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} );
		document.getElementById(id).className='navbar_active';
	}
	catch(e){ console.log("No README.md for description!"); console.error(e);}
	document.getElementById("source_current").innerHTML=item["url"]; document.getElementById("source_current").href=item["url"]; document.getElementById("source_current").target="_blank";

	// #~ if category exist
	let col="state"
	ndf = check_category(df, col)
	if (ndf){
		console.log("Category Exist!")
		
		layout = JSON.parse(JSON.stringify(layout_default))
		
		layout["title"] = item["description"];//+"  ("+category+")";
		// ndf[category].plot("graph").line({"layout": layout})

		const nav_prefix = 'nav_tab2_'
		const nav_id = 'nav_top2'
		document.getElementById("div_selector_category").innerHTML='<nav id="'+nav_id+'"><ul id="'+nav_id+'_ul">'+generateTabs_base(Object.keys(ndf), nav_prefix, "category_"+col)+'</ul></nav>'
		Object.keys(ndf).forEach( a =>{
			document.getElementById(nav_prefix+a).addEventListener("click", function (event) {
				document.getElementById(nav_prefix+a).parentNode.childNodes.forEach( b => {document.getElementById(b.id).className="";} );
				document.getElementById(nav_prefix+a).className='navbar_small_active';
				ndf[a].plot("graph").line({"layout": layout});
			}); 
		})

		hashparams = new URLSearchParams(window.location.hash.slice(1))
		hash_dict = Object.fromEntries(hashparams.entries());
		category = hash_dict["category_"+col]
		if (!category){ category = Object.keys(ndf)[0] }

		document.getElementById(nav_prefix+category).className='navbar_small_active';
		ndf[category].plot("graph").line({"layout": layout})

		// Object.keys(ndf).forEach( a => {add_eventlistener(nav_prefix+ a, change_tab, [ list2[a["url"],undefined,undefined,list2[a["description"], nav_prefix+a);} )
	}
	else{ 
		document.getElementById("div_selector_category").innerHTML='';
		if (chart_type=="scatter"){ df.plot("graph").line({"layout": layout}); }
		else if (chart_type=="bar"){ df.plot("graph").bar({"layout": layout}); }
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
