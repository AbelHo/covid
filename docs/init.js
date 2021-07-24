// parse readme file for indexing
//~ import from listener.js
url = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main"
// url = "https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main"
// item = "epidemic/cases_malaysia.csv"

if (window.location.search){
	urlSearchParams = new URLSearchParams(window.location.search);
	params = Object.fromEntries(urlSearchParams.entries());
	if (params.url){
		url = params.url
	}
}



async function init_fetch(){
	let rq = await fetch(url+"/README.md");
	let dat = await rq.text();

	let regexp = new RegExp(/\[`([^)]+).csv`\]\(([^)]+)\): ([^\n]+)/, 'g');
	list = [...dat.matchAll(regexp)]
	// list.forEach( a => {console.log(a[1]);} )
	list2={}; list.forEach( a => { list2[a[1]] = {"item":a[2], "description":a[3]}; } )
	return list
}

function generateTabs(list){
	let out = ''
	const nav_prefix = 'nav_tab_'

	list.forEach( a => { out+='<li id='+nav_prefix+ a[1] +'><a href="#'+a[1]+'">'+a[1]+'</a></li>'; } )
	return out
}

async function init(){
	let list = await init_fetch();
	const nav_prefix = 'nav_tab_'
	document.getElementById('nav_top').innerHTML='<ul id="nav_top1">'+generateTabs(list)+'</ul>'
	list.forEach( a => {add_eventlistener(nav_prefix+ a[1], csv2plot, url+a[2]);} )
	list2 = {}
	list.forEach( a => { list2[a[1]] = {"item":a[2], "description":a[3]}; } )

	if (window.location.hash){ change_tab(url+list2[window.location.hash.slice(1)]["item"], nav_prefix+window.location.hash.slice(1));}
	else { change_tab(url+list2[Object.keys(list2)[0]]["item"], nav_prefix+Object.keys(list2)[0]);}

}

init();

// list = init();
// console.log(list)
// list.forEach( a => {console.log(a[1]);} )

// dat = await init()
//const regexp = /\[`([^)]+)\`]/;
// const regexp = new RegExp(/\[`([^)]+)`\]/, 'g');

// regexp = new RegExp(/\[`([^)]+)`\]\(([^)]+)\): ([^\n]+)/, 'g');
// list = [...dat.matchAll(regexp)]
// list.forEach( a => {console.log(a[3]);} )

