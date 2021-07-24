// parse readme file for indexing

url = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/"
item = "epidemic/cases_malaysia.csv"

rq = await fetch("https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/README.md");
const dat = await rq.text();

//const regexp = /\[`([^)]+)\`]/;
// const regexp = new RegExp(/\[`([^)]+)`\]/, 'g');
regexp = new RegExp(/\[`([^)]+)`\]\(([^)]+)\): ([^\n]+)/, 'g');
list = [...dat.matchAll(regexp)]
// list.forEach( a => {console.log(a[3]);} )

