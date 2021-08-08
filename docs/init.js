/* #~ GLOBAL VARIABLE LIST
url
category
list2
df
-- ndf
-- index_name
*/
// parse readme file for indexing
//~ import from listener.js
url = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main"
// url = "https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main"
// item = "epidemic/cases_malaysia.csv"

if (window.location.search){
	let urlSearchParams = new URLSearchParams(window.location.search);
	let params = Object.fromEntries(urlSearchParams.entries());
	if (params.url){
		url = params.url
	}
}

if (window.location.hash){
	hashparams = new URLSearchParams(window.location.hash.slice(1))
	hash_dict = Object.fromEntries(hashparams.entries());
	if (hash_dict["chart_type"]) {	chart_type = hash_dict["chart_type"] }
	else { chart_type = "line"}
}
else { chart_type = "line"}
console.log("checkbox_"+chart_type)
document.getElementById("checkbox_"+chart_type).checked=true



async function init_fetch(){
	let rq = await fetch(url+"/README.md");
	let dat = await rq.text();

	if (rq.status==200){
		let regexp = new RegExp(/\[`([^)]+).csv`\]\(([^)]+)\): ([^\n]+)/, 'g');
		list = [...dat.matchAll(regexp)]
		// list.forEach( a => {console.log(a[1]);} )
		list2 = {}; list.forEach( a => { list2[a[1]] = {"url":url+a[2], "description":a[3]}; } )
	}
	else{
		list2={"index":{"url": url, "description":"raw csv"}};
		list=[];
	}
	
	return list //ToFix return list2 as well
}

function generateTabs_base(list, nav_prefix='nav_tab_', hash_name="topic"){
	hashparams = new URLSearchParams(window.location.hash.slice(1))
	let out = ''
	// const nav_prefix = 'nav_tab_'

	list.forEach( a => {
		hashparams.set(hash_name, a);
		out+='<li id="'+nav_prefix+ a +'""><a href="#'+hashparams.toString()+'">'+a+'</a></li>';
	} )
	return out
}

function generateTabs(list, nav_prefix='nav_tab_', hash_name="topic"){
	hashparams = new URLSearchParams(window.location.hash.slice(1))

	let out = ''
	// const nav_prefix = 'nav_tab_'

	list.forEach( a => { 
		hashparams.set(hash_name, a[1])
		out+='<li id='+nav_prefix+ a[1] +'><a href="#'+hashparams.toString()+'">'+a[1]+'</a></li>'; 
	} )
	return out
}

async function init(){
	let list = await init_fetch();
	// list2 = {}
	// list.forEach( a => { list2[a[1]] = {"url":url+a[2], "description":a[3]}; } )

	const nav_prefix = 'nav_tab_'
	document.getElementById('nav_top').innerHTML='<ul id="nav_top1">'+generateTabs(list)+'</ul>'
	list.forEach( a => {add_eventlistener(nav_prefix+ a[1], change_tab, [ list2[a[1]]["url"],undefined,undefined,list2[a[1]]["description"], nav_prefix+a[1]]);} )

	if (window.location.hash){ change_tab( [ list2[window.location.hash.slice(1)]["url"],undefined,undefined,list2[window.location.hash.slice(1)]["description"] ] , nav_prefix+window.location.hash.slice(1));}
	else {
		const firstkey = Object.keys(list2)[0];
		change_tab( [ list2[firstkey]["url"],undefined,undefined,list2[firstkey]["description"] ], nav_prefix+firstkey);
	}

}

async function init2(){
	let list = await init_fetch();
	// list2 = {}
	// list.forEach( a => { list2[a[1]] = {"url":url+a[2], "description":a[3]}; } )

	const nav_prefix = 'nav_tab_'
	const nav_id = 'nav_top'
	document.getElementById(nav_id).innerHTML='<ul id="'+nav_id+'_ul">'+generateTabs(list)+'</ul>'

	if (list.length!=0){
		Object.keys(list2).forEach( 
			a => {add_eventlistener(nav_prefix+ a, change_tab2, list2[a], nav_prefix+a);} 
		)
	}

	// #~ parse hash values
	hashparams = new URLSearchParams(window.location.hash.slice(1))
	hash_dict = Object.fromEntries(hashparams.entries());

	let hash_name = "topic"
	if (hash_dict[hash_name]){
		change_tab2( {"url":list2[hash_dict[hash_name]]["url"], "description":list2[hash_dict[hash_name]]["description"] } , nav_prefix+hash_dict[hash_name]);
	}
	else {
		const firstkey = Object.keys(list2)[0];
		change_tab2( list2[firstkey], nav_prefix+firstkey);
	}

	// #~ check embed
	if (hash_dict["embed"]=="true"){ hideall("hidden") }

}

init2();

// list = init();
// console.log(list)
// list.forEach( a => {console.log(a[1]);} )

// dat = await init()
//const regexp = /\[`([^)]+)\`]/;
// const regexp = new RegExp(/\[`([^)]+)`\]/, 'g');

// regexp = new RegExp(/\[`([^)]+)`\]\(([^)]+)\): ([^\n]+)/, 'g');
// list = [...dat.matchAll(regexp)]
// list.forEach( a => {console.log(a[3]);} )

