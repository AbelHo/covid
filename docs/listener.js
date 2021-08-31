/* #~ GLOBAL VARIABLE LIST
category
df
-- ndf
-- index_name
*/

function change_tab(item, id){
	csv2plot(...item);
	try{
		document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} );
		document.getElementById(id).className='navbar_active';
	}
	catch(e){ console.log("No README.md for description!"); console.error(e);}
	document.getElementById("source_current").innerHTML=item[0]; document.getElementById("source_current").href=item[0]; document.getElementById("source_current").target="_blank";
}

async function change_tab2(item, id, category_header="state"){
	graph_id="graph";
	df = await dfd.read_csv(item["url"]);
	try { 
		if ("datetime" in df)
	      { df=df.set_index({key:"datetime"}); index_name="datetime"}
	    else if ("date" in df)
	      { df=df.set_index({key:"date"}); index_name="date"}
	    else if ("Date" in df)
	      { df=df.set_index({key:"Date"}); index_name="Date"}
	    else if ("Datetime" in df)
	      { df=df.set_index({key:"Datetime"}); index_name="Datetime"}
	    else if ("time" in df)
	      { df=df.set_index({key:"time"}); index_name="time"}
	    else if ("Time" in df)
	      { df=df.set_index({key:"Time"}); index_name="Time"}
	  	else
  		  { console.log("can't auto detect index"); index_name=undefined; }
		
	}
	catch(e) {
		console.error("Error: can't auto detect index")
		console.error(e);
		// df=df.set_index({key:df.columns[0]});
	}
	layout = JSON.parse(JSON.stringify(layout_default))
	layout["title"] = item["description"] + "  [last updated: "+df.index[df.index.length-1]+"]";

	try{
		document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} );
		document.getElementById(id).className='navbar_active';
	}
	catch(e){ console.log("No README.md for description!"); console.error(e);}
	document.getElementById("source_current").innerHTML=item["url"]; document.getElementById("source_current").href=item["url"]; document.getElementById("source_current").target="_blank";

	// #~ if category exist
	// let category="state"
	ndf = check_category(df, category_header)
	if (ndf){
		console.log("Category Exist!")
		
		// layout = JSON.parse(JSON.stringify(layout_default))
		// layout["title"] = item["description"];//+"  ("+category+")";
		// ndf[category].plot(graph_id).line({"layout": layout})

		const nav_prefix = 'nav_tab2_'
		const nav_id = 'nav_top2'
		document.getElementById("div_selector_category").innerHTML='<nav id="'+nav_id+'"><ul id="'+nav_id+'_ul">'+generateTabs_base(Object.keys(ndf), nav_prefix, "category_"+category_header)+'</ul></nav>'
		Object.keys(ndf).forEach( a =>{
			document.getElementById(nav_prefix+a).addEventListener("click", function (event) {
				category = a
				document.getElementById(nav_prefix+a).parentNode.childNodes.forEach( b => {document.getElementById(b.id).className="";} );
				document.getElementById(nav_prefix+a).className='navbar_small_active';
				plotDanfo(ndf[category], graph_id, chart_type, layout)
				// ndf[a].plot(graph_id).line({"layout": layout});
			}); 
		})

		hashparams = new URLSearchParams(window.location.hash.slice(1))
		hash_dict = Object.fromEntries(hashparams.entries());
		category = hash_dict["category_"+category_header]
		if (!category){ category = Object.keys(ndf)[0] }

		document.getElementById(nav_prefix+category).className='navbar_small_active';
		plotDanfo(ndf[category], graph_id, chart_type, layout)
		// ndf[category].plot(graph_id).line({"layout": layout})

		// Object.keys(ndf).forEach( a => {add_eventlistener(nav_prefix+ a, change_tab, [ list2[a["url"],undefined,undefined,list2[a["description"], nav_prefix+a);} )
	}
	else{ 
		document.getElementById("div_selector_category").innerHTML='';
		plotDanfo(df, graph_id, chart_type, layout)
		// if (chart_type=="scatter"){ df.plot(graph_id).line({"layout": layout}); }
		// else if (chart_type=="bar"){ df.plot(graph_id).bar({"layout": layout}); }
	}
	document.getElementById('checkbox_percentage').checked=false
}

function add_eventlistener(id, func, args){
	document.getElementById(id).addEventListener("click", function (event) {
		func(args, id)
		// func(arg); 
		// document.getElementById(id).parentNode.childNodes.forEach( a => {document.getElementById(a.id).className="";} )
		// document.getElementById(id).className='navbar_active';
	});
}





// #~ helpers
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
function check_category(df, category="state"){
	// category = "state"
	if (df.columns.includes(category)){
		let items = removeDuplicate(df[category].data)

		ndf={}
		items.forEach( item => {
		// item = "Johor"
		console.log(item)
		ndf[item] = df.query({ column: category, is: "==", to: item })
		ndf[item].drop( {columns: [category], inplace: true} )
		//ndf[item] = ndf[item].drop( {columns: [category]} )

		col_namechange={}
		ndf[item].columns.forEach( a=>{ col_namechange[a]=item+'_'+a } )
		ndf[item] = ndf[item].rename({ mapper: col_namechange });

		/////  try {ndf[item].rename({ mapper: col_namechange, inplace: true });}
		/////  catch(err){}
		})

		// ndf[Object.keys(ndf)[0]].plot(graph_id).line({"layout": layout_default})
		return ndf
	}
	return false
}


// #~ for embedding, hide all
function hideall(classname_of_hide="hidden"){
	[...document.getElementById('root').children].forEach( a=> { a.classList.add(classname_of_hide);} )
	document.getElementById("graphs").classList.remove(classname_of_hide)
}
function unhideall(classname_of_hide="hidden"){
	[...document.getElementById('root').children].forEach( a=> { a.classList.remove(classname_of_hide);} )
}

// #~ buggy
function copyToClipboard (text) {
  if (navigator.clipboard) { // default: modern asynchronous API
    return navigator.clipboard.writeText(text);
  } else if (window.clipboardData && window.clipboardData.setData) {     // for IE11
    window.clipboardData.setData('Text', text);
    return Promise.resolve();
  } else {
    // workaround: create dummy input
    const input = h('input', { type: 'text' });
    input.value = text;
    document.body.append(input);
    input.focus();
    input.select();
    document.execCommand('copy');
    input.remove();
    return Promise.resolve();
  }
}

function textToClipboard (text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function copyurlToEmbed(embed_var="embed"){
	if (window.location.hash){
		hashparams = new URLSearchParams(window.location.hash.slice(1))
		hashparams.set(embed_var, "true");
		textToClipboard(window.location.origin+window.location.pathname+window.location.search+"#"+hashparams.toString());
	}
	else{
		textToClipboard(window.location.href+"#"+embed_var+"=true")
	}
}
