// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 60, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgScatter = d3.select("#urbForestTempScatter")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// Add X axis
var x = d3.scaleLinear()
  // .domain([0, 1]) // 5-105
  .domain([5, 105])
  .range([ 0, width ]);
svgScatter.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));


// Add Y axis
var y = d3.scaleLinear()
  // .domain([0, 1]) // 0-21
  .domain([0, 21])
  .range([ height, 0]);
svgScatter.append("g")
  .call(d3.axisLeft(y));

// labels and title
svgScatter.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (-width/12) +","+(height/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .text("Temperature (ºC)");

svgScatter.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height*1.13)+")")  // centre below axis
    .text("Urbanization (%)");
svgScatter.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top/4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Urbanization & Forest coverage");


var greyR = 3;
var rScale = 0.2;
var frameRate = 500;
var minYear = 1990;
var maxYear = 2013;
var colorTemp = "#8c4926"
var colorForest = "#2a7837"
var colorUrban = "#1c2787"
// Highlight
var highlight = function(d){
  looping = false;
  selected_country = d.country

  d3.selectAll(".dot")
    .transition()
    .duration(200)
    .style("fill", "lightgrey")
    .attr("r", greyR)

  d3.selectAll("." + selected_country)
    .transition()
    .duration(200)
    .style("fill", "green")
    .attr("r", function (d) { return d.forest*rScale; })

}

// remove highlight
var doNotHighlight = function(){
  looping = true;
  var xinner = d3.scaleLinear()
               .domain([5, 105])
               .range([ 0, width ]),

      yinner = d3.scaleLinear()
               .domain([0, 21])
               .range([ height, 0]);

  d3.selectAll(".dot")
    .transition()
    .duration(200)
    .attr("class", function (d) { return "dot " + d.country } )
    .attr("cx", function (d) { return xinner(d.urban); } )
    .attr("cy", function (d) { return yinner(d.temp); } )
    .attr("r", function (d) { return d.forest*rScale; })
    .style("fill", "green" )
    .style("opacity", 0.5)
}



var looping = true
function loopData (dataPath){

  // console.log(svgScatter.attr("transform"))

  var currentYear = minYear;
  var alldata = null;

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")

  // Read the data
  d3.csv(dataPath, function(data) {
    alldata = data
    data1 = data.filter(function(d) {return d.year == currentYear})
    // Add dots
    svgScatter.append('g')
      .selectAll("circle")
      .data(data1)
      .enter()
      .append("circle")
        .attr("class", function (d) { return "dot " + d.country } )
        .attr("cx", function (d) { return x(d.urban); } )
        .attr("cy", function (d) { return y(d.temp); } )
        .attr("r", function (d) { return d.forest*rScale; })
        .style("fill", "green" )
        .style("opacity", 0.5)
      .on("mouseover", function(d){ highlight(d); tooltip.text(d.country); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){ doNotHighlight(); return tooltip.style("visibility", "hidden");})
      .on("click", function(d){plotLineForScatter(d.country);})
  })

  plotLineForScatter("France")

  function updateGraph(){
    if(!looping){return;}
    currentYear += 1
    if(currentYear > maxYear+1){
      currentYear = minYear
    }

    // Add X axis
    var xinner = d3.scaleLinear()
                   .domain([5, 105])
                   .range([ 0, width ]),

        yinner = d3.scaleLinear()
                   .domain([0, 21])
                   .range([ height, 0]);

    data1 = alldata.filter(function(d) {return d.year == currentYear})
    svgScatter.selectAll("circle")
        .data(data1)
        .transition()
        .duration(frameRate)
        .attr("cx", function (d) { return xinner(d.urban); } )
        .attr("cy", function (d) { return yinner(d.temp); } )
        .attr("r", function (d) { return d.forest*rScale; })
  }
  var interval = setInterval(updateGraph, frameRate);
}

loopData("./data/ScatterData.csv")





var svgScatterLine;

function plotLineForScatter(country){
  if(svgScatterLine != null){
    svgScatterLine.selectAll("path.line").remove();
    svgScatterLine.selectAll("text.title").remove();
  }
  else
  {
    svgScatterLine = d3.select("#urbForestTempLine")
                       .attr("width", width + margin.left + margin.right)
                       .attr("height", height + margin.top + margin.bottom)
                       .append("g")
                       .attr("transform",
                             "translate(" + margin.left + "," + margin.top + ")");
  }

  // Define the scales of axises
  var x = d3.scaleLinear().range([0, width]);
  var y0 = d3.scaleLinear().range([height, 0]);
  // var y1 = d3.scaleLinear().range([height, 0]);

  // Plot the axises
  var xAxis = d3.axisBottom(x).tickFormat(function(d) { return d;});

  var yAxisLeft = d3.axisLeft(y0).ticks(5);

  function draw_x_gridlines() { return d3.axisBottom(x).ticks(13) }

  // Define two functions to draw two lines
  var valuelineForest = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y0(d.forest); });

  var valuelineUrban = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y0(d.urban); });
      // .y(function(d) { return y1(d.urban); });

  var valuelineTemp = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y0(d.temp); });
      // .y(function(d) { return y1(d.temp); });

  // console.log(width, height)

  svgScatterLine.append("rect").attr("x",(width*0.6)).attr("y",(height*0.00)).attr("width", 6).attr("height", 6).style("fill", colorForest)
  svgScatterLine.append("rect").attr("x",(width*0.6)).attr("y",(height*0.05)).attr("width", 6).attr("height", 6).style("fill", colorTemp)
  svgScatterLine.append("rect").attr("x",(width*0.6)).attr("y",(height*0.1)).attr("width", 6).attr("height", 6).style("fill", colorUrban)
  svgScatterLine.append("text").attr("x", (width*0.66)).attr("y", (height*0.01)).text("Forest coverage").style("font-size", "12px").attr("alignment-baseline","middle")
  svgScatterLine.append("text").attr("x", (width*0.66)).attr("y", (height*0.06)).text("Temperature (normalized)").style("font-size", "12px").attr("alignment-baseline","middle")
  svgScatterLine.append("text").attr("x", (width*0.66)).attr("y", (height*0.11)).text("Urbanization").style("font-size", "12px").attr("alignment-baseline","middle")


  // Load the data
  d3.csv("./data/normScatterData.csv", function(error, alldata) {
    data = alldata.filter(function(d) {return d.country == country})
    data.forEach(function(d) {
        d.year = +d.year
        d.temp = +d.temp*100;
        d.forest = +d.forest;
        d.urban = +d.urban*100;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year;}));
    y0.domain([0,105]);

    var focus = svgScatterLine.append("g");
    var lineUrban = focus.append("path")
	    .datum(data)
      .attr("class", "line")
	    .attr("fill", "none")
	    .attr("stroke", colorUrban)
	    .attr("stroke-linejoin", "round")
	    .attr("stroke-linecap", "round")
	    .attr("stroke-width", 2)
	    .attr("d", valuelineUrban)

	  var totalLengthUrban = lineUrban.node().getTotalLength();

    lineUrban.attr("stroke-dasharray", totalLengthUrban)
      .attr("stroke-dashoffset", totalLengthUrban)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

	  var lineTemp = focus.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("fill", "none")
        .style("stroke", colorTemp)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", valuelineTemp)
        .attr("class", "line")

    var totalLengthTemp = lineTemp.node().getTotalLength();

    lineTemp.attr("stroke-dasharray", totalLengthTemp)
        .attr("stroke-dashoffset", totalLengthTemp)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);


    var lineForest = focus.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("fill", "none")
          .style("stroke", colorForest)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 2)
          .attr("d", valuelineForest)
          .attr("class", "line")

    var totalLengthForest = lineForest.node().getTotalLength();

    lineForest.attr("stroke-dasharray", totalLengthForest)
      .attr("stroke-dashoffset", totalLengthForest)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    // Add the axises
    svgScatterLine.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgScatterLine.append("g")
        .attr("class", "y axis")
        .call(yAxisLeft);

    // add gridlines
    svgScatterLine.append("g")     
                  .attr("class", "grid")
                  .style("fill", "gray")
                  .style("opacity", 0.5)
                  .attr("transform", "translate(" + 0 + "," + (height) + ")")
                  .call(draw_x_gridlines()
                  .tickSize(-height)
                  .tickFormat("")
    )

    svgScatterLine.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/4))
        .attr("class", "title")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(country);

    svgScatterLine.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-width/12) +","+(height/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("%");
    svgScatterLine.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height*1.13)+")")  // centre below axis
        .text("Year");


	});

}
