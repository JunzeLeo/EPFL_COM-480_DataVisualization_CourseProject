// set the dimensions and margins of the graph
var margin = {top: 60, right: 30, bottom: 60, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgScatter = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// var svgScatter = d3.select("#scatter")
    // widthSvgScatter = +svgScatter.attr("width"),
    // heightSvgScatter = +svgScatter.attr("height");
    // svgScatter.append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform",
    //           "translate(" + margin.left + "," + margin.top + ")");

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
    .text("Temperature (C)");
svgScatter.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height*1.13)+")")  // centre below axis
    .text("Urbanization (%)");
svgScatter.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top/4))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    // .style("text-decoration", "underline")
    .text("Urbanization & Forest coverage");

// legend


var greyR = 3;
var rScale = 0.2;
var frameRate = 500;
var minYear = 1990;
var maxYear = 2013;
// Highlight the specie that is hovered
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

// Highlight the specie that is hovered
var doNotHighlight = function(){
  looping = true;
  d3.selectAll(".dot")
    .transition()
    .duration(200)
    .attr("class", function (d) { return "dot " + d.country } )
    .attr("cx", function (d) { return x(d.urban); } )
    .attr("cy", function (d) { return y(d.temp); } )
    .attr("r", function (d) { return d.forest*rScale; })
    .style("fill", "green" )
    .style("opacity", 0.5)
}



var looping = true
function loopData (dataPath){
  // d3.selectAll("svg > *").remove();

  var currentYear = minYear;
  var alldata = null;

  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    // .style("background", "#fff")
    // .text("");

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
        .attr("r", function (d) { return d.forest*0.1; })
        .style("fill", "green" )
        .style("opacity", 0.5)
      .on("mouseover", function(d){ highlight(d); tooltip.text(d.country); return tooltip.style("visibility", "visible");})
      .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
      .on("mouseout", function(){ doNotHighlight(); return tooltip.style("visibility", "hidden");})
      .on("click", function(d){plotLineForScatter(d.country);})
  })

  function updateGraph(){
    if(!looping){return;}
    currentYear += 1
    if(currentYear > maxYear+1){
      currentYear = minYear
    }
    // console.log(currentYear);

    data1 = alldata.filter(function(d) {return d.year == currentYear})
    svgScatter.selectAll("circle")
        .data(data1)
        .transition()
        .duration(frameRate)
        // .delay(function(d, i) {return 1000} )
        .attr("cx", function (d) { return x(d.urban); } )
        .attr("cy", function (d) { return y(d.temp); } )
        .attr("r", function (d) { return d.forest*rScale; })

  }
  var interval = setInterval(updateGraph, frameRate);
}

loopData("new.csv")





var svgScatterLine;

function plotLineForScatter(country){
  if(svgScatterLine != null){
    // d3.selectAll("svg > *").remove();
    // svgScatterLine.selectAll("*").remove();
  }
  // Define the scales of axises
  var x = d3.scaleLinear().range([0, width]);
  var y0 = d3.scaleLinear().range([height, 0]);
  var y1 = d3.scaleLinear().range([height, 0]);

  // Plot the axises
  var xAxis = d3.axisBottom(x).tickFormat(function(d) { return d;});

  var yAxisLeft = d3.axisLeft(y0).ticks(5);

  var yAxisRight = d3.axisRight(y1).ticks(5);

  // Define two functions to draw two lines
  var valuelineForest = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y0(d.forest); });

  var valuelineUrban = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y1(d.urban); });

  var valuelineTemp = d3.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y1(d.temp); });

  svgScatterLine = d3.select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

  svgScatter.append("rect").attr("x",(2*width/3)).attr("y",(height/3)).attr("width", 6).attr("height", 6).style("fill", "green")
  svgScatter.append("rect").attr("x",(2*width/3)).attr("y",(height/3)).attr("width", 6).attr("height", 6).style("fill", "red")
  svgScatter.append("text").attr("x", (2*width/3)).attr("y", (height/3)).text("Forest coverage").style("font-size", "15px").attr("alignment-baseline","middle")
  svgScatter.append("text").attr("x", (2*width/3)).attr("y", (height/3)).text("Temperature").style("font-size", "15px").attr("alignment-baseline","middle")

  // Load the data
  d3.csv("normData.csv", function(error, alldata) {
    data = alldata.filter(function(d) {return d.country == country})
    data.forEach(function(d) {
        d.year = +d.year
        d.temp = +d.temp;
        d.forest = +d.forest;
        d.urban = +d.urban;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year;}));
    y0.domain([d3.min(data, function(d) {
		return Math.min(d.forest); }), d3.max(data, function(d) {
		return Math.min(d.forest); })]);
    y1.domain([d3.min(data, function(d) {
		return Math.min(d.urban); }), d3.max(data, function(d) {
		return Math.max(d.urban); })]);


    var focus = svgScatterLine.append("g");
    var lineUrban = focus.append("path")
	    .datum(data)
	    .attr("fill", "none")
	    .attr("stroke", "steelblue")
	    .attr("stroke-linejoin", "round")
	    .attr("stroke-linecap", "round")
	    .attr("stroke-width", 1.5)
	    .attr("d", valuelineUrban)

	  var totalLengthUrban = lineUrban.node().getTotalLength();

    lineUrban.attr("stroke-dasharray", totalLengthUrban)
      .attr("stroke-dashoffset", totalLengthUrban)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

	  var lineTemp = focus.append("path")
        .datum(data)
        .attr("fill", "none")
        .style("stroke", "red")
        // .attr("stroke", "green")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", valuelineTemp)

    var totalLengthTemp = lineTemp.node().getTotalLength();

    lineTemp.attr("stroke-dasharray", totalLengthTemp)
        .attr("stroke-dashoffset", totalLengthTemp)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);


    var lineForest = focus.append("path")
          .datum(data)
          .attr("fill", "none")
          .style("stroke", "green")
          // .attr("stroke", "green")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", valuelineForest)

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
        .style("fill", "steelblue")
        .call(yAxisLeft);

    svgScatterLine.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + " ,0)")
        .style("fill", "red")
        .call(yAxisRight);

    svgScatterLine.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(country);

	});

}
