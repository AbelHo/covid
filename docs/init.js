// parse readme file for indexing

url = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/"
item = "epidemic/cases_malaysia.csv"

async function init(){
	let rq = await fetch("https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/README.md");
	let dat = await rq.text();

	let regexp = new RegExp(/\[`([^)]+)`\]\(([^)]+)\): ([^\n]+)/, 'g');
	list = [...dat.matchAll(regexp)]
	return list
}

list = init();

// dat = await init()
//const regexp = /\[`([^)]+)\`]/;
// const regexp = new RegExp(/\[`([^)]+)`\]/, 'g');

// regexp = new RegExp(/\[`([^)]+)`\]\(([^)]+)\): ([^\n]+)/, 'g');
// list = [...dat.matchAll(regexp)]
// list.forEach( a => {console.log(a[3]);} )

