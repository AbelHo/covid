// <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

// console.log(window.location.host)
// url = "https://raw.githubusercontent.com/MoH-Malaysia/covid19-public/main/"
// item = "mysejahtera/checkin_malaysia.csv"
// param = ""

// div_chart = "graph"

chart_type = 'scatter';//bar

function csv2data(allRows) {

  console.log(allRows);
  y={}
  params = Object.keys(allRows[0])//.forEach(key => {console.log(key, row[key]);});
  Object.keys(allRows[0]).forEach(key => { y[key]=[];});

  //var x = [], y = [];

  for (var i=0; i<allRows.length; i++) {
    row = allRows[i];
    // x.push( row['datetime'] );
    Object.keys(row).forEach(key => { y[key].push(row[key]);});
    // y.push( row[param] );
    // if (param=="")
    // { Object.keys(row).forEach(key => { y[key].push(row[key]);}); }
  }
  //console.log( 'X',x, 'Y',y );

  return y;//{"x": x, "y":y}
};

async function csv2plot(url, div_chart_id="graph", xkey=undefined, title=url) {
  console.log(url)
  rq = await fetch(url)
  data = await rq.text()

  data = await csv2data( Plotly.d3.csv.parse(data) )
  if (xkey===undefined){
    if ("datetime" in data)
      { xkey="datetime"; }
    else if ("date" in data)
      { xkey="date"; }
  }
  makePlotly_multi(xkey,Object.assign({},data),title,div_chart_id)

  // Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/2014_apple_stock.csv", function(data){ processData(data) } );
};




function makeplot(sensor, param, div_chart_id) {
   console.log(url+sensor+".csv")
   Plotly.d3.csv(url+sensor+".csv", function(data){ processData(data, sensor, param, div_chart_id) } );
  // Plotly.d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/2014_apple_stock.csv", function(data){ processData(data) } );
};
  
function processData(allRows, sensor, param, div_chart_id) {

  console.log(allRows);
  if (param=="")
    { y={}; }
  else
    { y=[]; }
  params = Object.keys(allRows[0])//.forEach(key => {console.log(key, row[key]);});
  Object.keys(allRows[0]).forEach(key => { y[key]=[];});

  var x = [];//, y = [], standard_deviation = [];

  for (var i=0; i<allRows.length; i++) {
    row = allRows[i];
    x.push( row['datetime'] );
    if (param=="")
      { Object.keys(row).forEach(key => { y[key].push(row[key]);}); }
    else
      { y.push( row[param] ); }

  }
  console.log( 'X',x, 'Y',y, 'SD');//,standard_deviation );
  if (param=="")
    {  makePlotly_multi( "datetime", y , sensor+' sensor', div_chart_id); }
  else
    { makePlotly( x, y,  sensor+' sensor->'+param, div_chart_id); }

  console.log(y)
}

function makePlotly( x, y, title, div_chart_id){
  // var plotDiv = document.getElementById("plot");
  var traces = [{
    x: x, 
    y: y,
    // name: param
  }];

  Plotly.newPlot(div_chart_id, traces, 
    {title: title});
};

// xkey: key of x-axis data in (y)
// y: object with each key as y-axis with array of data
// sensor: grapht title
function makePlotly_multi( xkey, data , title, div_chart_id){
  // xkey = "datetime"
  // var plotDiv = document.getElementById("plot");
  y = data;
  var traces = []
  // var traces = [{
  //   x: x, 
  //   y: y,
  //   name: param
  // }];
  x = y[xkey]
  delete y[xkey]
  Object.keys(y).forEach(key => { 
    traces.push({
        x: x, 
        y: y[key],
        name: key,
        type: chart_type
      });
    // y[key]=[];
  });

  Plotly.newPlot(div_chart_id, traces, 
    {
      title: title,
      xaxis: {
        rangeselector: {
          buttons: [{ count: 1, label: '1h', step: 'hour', stepmode: 'backward' },
            { count: 1, label: '1d', step: 'day', stepmode: 'backward' },
            { count: 7, label: '1w', step: 'day', stepmode: 'backward' },
            { count: 1, label: '1m', step: 'month', stepmode: 'backward' },
            { count: 3, label: '3m', step: 'month', stepmode: 'backward' },
            { count: 6, label: '6m', step: 'month', stepmode: 'backward' },
            { count: 1, label: '1y', step: 'year', stepmode: 'backward' },
            { count: 1, label: 'YTD', step: 'year', stepmode: 'todate' },
            {step: 'all'} ]
        },
        rangeslider: {autorange: true}
    },
    barmode: 'stack'
  }
  );
};

