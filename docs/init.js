// parse readme file for indexing

url = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/"
item = "epidemic/cases_malaysia.csv"

async function init_fetch(){
	let rq = await fetch("https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/README.md");
	let dat = await rq.text();

	let regexp = new RegExp(/\[`([^)]+).csv`\]\(([^)]+)\): ([^\n]+)/, 'g');
	list = [...dat.matchAll(regexp)]
	list.forEach( a => {console.log(a[1]);} )
	return list
}

function generateTabs(list){
	let out = ''
	list.forEach( a => { out+='<li><a href="#'+a[1]+'">'+a[1]+'</a></li>';} )
	return out
}

async function init(){
	let list = await init_fetch();
	document.getElementById('nav_top').innerHTML='<ul>'+generateTabs(list)+'</ul>'
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

