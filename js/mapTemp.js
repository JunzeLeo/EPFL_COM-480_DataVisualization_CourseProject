/* ******************** world temperature map settings ************************* */
// The worldMap_temperature
var marginMapTemp = {top: 20 , right: 20, bottom: 20, left: 20};   // top left is the origin of a svg, x leftward, y downward
var beginYearMapTemp = 1898, yearIndMapTemp = 0, playingMapTemp = true, mapTempDuration = 200, formatOut = d3.format(".2f"), timer;  // create timer object;
var svgMapTemp = d3.select("#mapTemp"),
    widthMapTemp = +svgMapTemp.attr("width"),
    heightMapTemp = +svgMapTemp.attr("height");

// Map and projection
var projection = d3.geoEquirectangular()
  .scale(75)
  .center([0,20])
  .translate([widthMapTemp / 2, heightMapTemp / 2]);

// Data (in map => key: value) and color scale
var dataMapTemp = d3.map();
var colorScaleMapTemp = d3.scaleLinear()
                          .domain([-2, 0, 2])
                          .range(['#76c9d4', "#cccccc", "red"]);
var tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden"),

    yearClock = d3.select('#clock')
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("top", (marginMapTemp.top) + "px")
                  .style("left",(marginMapTemp.left) + "px");

// Convert yearly temperature data to array 
function tempToArray(d){
  temprature = []
  for (var i in d){
    if (i !== "id"){
      temprature.push(+d[i])
    }
  }
  return temprature
}


/* ***************** world avg temperature line chart settings ********************* */
// The average temperature
var marginAvgTempLine = {top: 40 , right: 30, bottom: 35, left:45};   // top left is the origin of a svg, x leftward, y downward
var svgAvgTempLine    = d3.select("#worldAvgTemp"),
    widthAvgTempLine  = +svgAvgTempLine.attr("width") - marginAvgTempLine.left - marginAvgTempLine.right,
    heightAvgTempLine = +svgAvgTempLine.attr("height") - marginAvgTempLine.top - marginAvgTempLine.bottom;
svgAvgTempLine.append("g")
              .attr("transform", 
                    "translate(" + marginAvgTempLine.left + "," + marginAvgTempLine.top + ")");

// Define the scales of axises
var xAvgTempLineScale = d3.scaleLinear().range([marginAvgTempLine.left, widthAvgTempLine + marginAvgTempLine.left]);
var yAvgTempLineScale = d3.scaleLinear().range([heightAvgTempLine + marginAvgTempLine.top, marginAvgTempLine.top]);

// Plot the axises
var xAxisAvgTempLine = d3.axisBottom(xAvgTempLineScale).tickFormat(function(d) { return d;});
var yAxisAvgTempLine = d3.axisLeft(yAvgTempLineScale).ticks(5);

// Data (in map => key: value) and duration(to be updated)
var dataWorldAvgTemp = d3.map(), dataAvgTempDrawed = [], resumeAvgTempLine = false;

// Define a function to draw line
var drawWorldAvgTemp = d3.line()
    .x(function(d) { return xAvgTempLineScale(+d.keys()[0]); })
    .y(function(d) { return yAvgTempLineScale(d.values()[0][0]); });

// gridlines in x axis function
function draw_x_gridlines() { return d3.axisBottom(xAvgTempLineScale).ticks(6) }
function draw_y_gridlines() { return d3.axisLeft(yAvgTempLineScale).ticks(5) }


/* ******************** start animation ************************* */
function setWorldTempMap()
{
  // Load external data and boot
  d3.queue()
    .defer(d3.json, "./data/world.geojson")
    .defer(d3.csv, "./data/countryAvgTemp.csv", function(d) { dataMapTemp.set(d.id, tempToArray(d)) })
    .defer(d3.csv, "./data/worldAvgTemp.csv", function(d) { dataWorldAvgTemp.set(d.id, tempToArray(d)) })
    .await(ready);

  function ready(error, topo) {

  // Define interactions
    let mouseOverMap = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(50)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 1)
        // .style("stroke", "black")

      tooltip.text(d.properties['name'] +": "+ formatOut(d.total) + "ºC")
             .style("visibility", "visible")

      // console.log(d.total)
    }

    let mouseLeaveMap = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(50)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(50)
        // .style("stroke", "transparent")
      tooltip.style("visibility", "hidden");
    }

    let mouseMoveMap = function(d){
      tooltip.style("top", (d3.event.pageY-10)+"px")
             .style("left",(d3.event.pageX+10)+"px")
             .text(d.properties['name'] +": "+ formatOut(d.total) + "ºC")
             .style("visibility", "visible")
    }

    let mouseClickMap = function(d) {
      // console.log(d.properties['name'])

    }

    // What happens when the mouse move -> show the annotations at the right positions.
    function mouseoverLine() {
      if (dataAvgTempDrawed.length > 0){
        focus.style("opacity", 1)
        focusText.style("opacity",1)
      }
    }

    function mousemoveLine() {
    if (dataAvgTempDrawed.length > 0){

      if(focus.style("opacity") == 0){
        mouseoverLine()
      }

      // recover coordinate we need
      var x0 = xAvgTempLineScale.invert(d3.mouse(this)[0]);
      var i = bisect(dataAvgTempDrawed, x0, 1);

      // if the figure is not accomplished while the mouse is at right side, show the latest data
      if(i >= dataAvgTempDrawed.length){
        i = dataAvgTempDrawed.length-1
      }
      selectedData = dataAvgTempDrawed[i]
      
      if (typeof selectedData !== 'undefined'){
        focus
          .attr("cx", xAvgTempLineScale(selectedData.year))
          .attr("cy", yAvgTempLineScale(selectedData.temp))
        focusText
          .html( selectedData.year + ": " + d3.format(".1f")(selectedData.temp) + "&#8451")
          .attr("x", xAvgTempLineScale(selectedData.year)-15)
          .attr("y", yAvgTempLineScale(selectedData.temp)-15)
        } 
      }
    }

    function mouseoutLine() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
    }


    // console.log(dataMapTemp)
    // console.log(dataWorldAvgTemp)

    // Draw line chart
    // Scale the range of the data
    xAvgTempLineScale.domain(d3.extent(dataWorldAvgTemp.keys(), function(d) {return +d;}));
    yAvgTempLineScale.domain(d3.extent(dataWorldAvgTemp.values(), function(d) {return d[0];}));

    // Add the axises
    svgAvgTempLine.append("g")          
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + (heightAvgTempLine + marginAvgTempLine.top) +")")
                  // .style("fill", "red")
                  .call(xAxisAvgTempLine);

    svgAvgTempLine.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(" + marginAvgTempLine.left + ",0)")
                  // .style("fill", "steelblue")
                  .call(yAxisAvgTempLine); 

    // add labels
    svgAvgTempLine.append("text")
                  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                  .attr("transform", "translate("+ marginAvgTempLine.left/3 +","+((heightAvgTempLine + marginAvgTempLine.top + marginAvgTempLine.bottom)/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                  .text("ºC");

    svgAvgTempLine.append("text")
                  .attr("x", (widthAvgTempLine/2 + marginAvgTempLine.left))
                  .attr("y", (heightAvgTempLine + marginAvgTempLine.top + marginAvgTempLine.bottom) )
                  .attr("text-anchor", "middle")
                  .style("font-size", "16px")
                  .text("Year");

    svgAvgTempLine.append("text")
                .attr("class", "title")
                .attr("x", (widthAvgTempLine/2 + marginAvgTempLine.left))
                .attr("y", (marginAvgTempLine.top/2) )
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("World average temperature");

    // add gridlines
    svgAvgTempLine.append("g")     
                  .attr("class", "grid")
                  .attr("transform", "translate(" + 10 + "," + (heightAvgTempLine + marginAvgTempLine.top) + ")")
                  .call(draw_x_gridlines()
                  .tickSize(-heightAvgTempLine)
                  .tickFormat("")
    )

    // svgAvgTempLine.append("g")
    //               .attr("class", "grid")
    //               .attr("transform", "translate(" + marginAvgTempLine.left + "," + 0 + ")")
    //               .call(draw_y_gridlines()
    //               .tickSize(-widthAvgTempLine)
    //               .tickFormat("")
    // )

    // This allows to find the closest X index of the mouse:
    var bisect = d3.bisector(function(d) { return d.year; }).left;

    // Create the circle that travels along the curve of chart
    var focus = svgAvgTempLine
      .append('g')
      .append('circle')
      .style("fill", "none")
      .attr("class", "focus")
      .attr("stroke", "black")
      .attr('r', 5)
      .style("opacity", 0)

    // Create the text that travels along the curve of chart
    var focusText = svgAvgTempLine
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("class", "focusText")
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

    svgAvgTempLine
      .append('rect')
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('width', widthAvgTempLine)
      .attr('height', heightAvgTempLine)
      .on('mouseover', mouseoverLine)
      .on('mousemove', mousemoveLine)
      .on('mouseout', mouseoutLine);


    // Draw the map
    svgMapTemp.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        thisTemp = dataMapTemp.get(d.properties.name);
        if (typeof(thisTemp) === "undefined"){
          return "#808080";
        }
        else{
          d.total = thisTemp[yearIndMapTemp];
          return colorScaleMapTemp(d.total);
        }  
        
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .attr("code", function(d){ return d.id } )
      .style("opacity", .8)
      .on("mouseover", mouseOverMap )
      .on("mouseleave", mouseLeaveMap )
      .on("mousemove", mouseMoveMap )
      .on("click", mouseClickMap )

    svgMapTemp.append("text")
              .attr("class", "title")
              .attr("x", (widthAvgTempLine/2 + marginAvgTempLine.left))
              .attr("y", (marginAvgTempLine.top/2 + 20) )
              .attr("text-anchor", "middle")
              .style("font-size", "16px")
              .text("Country-wise warming");

    playMapandLine()
  }
}


function sequenceAvgTempLine(){
  
  var arrayOfMap = [];
  
  for (var i in dataWorldAvgTemp.keys()){
    if ( i != yearIndMapTemp-1 - resumeAvgTempLine && i != yearIndMapTemp-1 && i != yearIndMapTemp ){
      continue;
    }
    arrayOfMap.push(d3.map().set(+dataWorldAvgTemp.keys()[i], dataWorldAvgTemp.values()[i]))

    // data to draw focus
    var tempDict = new Object();
    tempDict['year'] = +dataWorldAvgTemp.keys()[i]
    tempDict['temp'] = dataWorldAvgTemp.values()[i][0];
    dataAvgTempDrawed.push(tempDict)
  }
  resumeAvgTempLine = false

  var worldAvgTempline = svgAvgTempLine.append("g")
                  .append("path")
                  .datum(arrayOfMap)
                  .attr("class", "line")
                  .attr("fill", "none")
                  .attr("stroke", "steelblue")
                  .attr("stroke-linejoin", "round")
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1.5)
                  .attr("d", drawWorldAvgTemp);

  var totalLenAvgWrdTemp = worldAvgTempline.node().getTotalLength();
  
  // console.log(totalLenAvgWrdTemp)
  worldAvgTempline.attr("stroke-dasharray", totalLenAvgWrdTemp)
                 .attr("stroke-dashoffset", totalLenAvgWrdTemp)
                 .transition()
                 .duration(100)
                 .ease(d3.easeLinear)
                 .attr('stroke-dashoffset', 0);

}


function sequenceWorldTempMap() {
  
    d3.selectAll('.Country').transition()    //select all the countries and prepare for a transition to new values
      .duration(100)                         // give it a smooth time period for the transition
      .attr('fill', function(d) {
          thisTemp = dataMapTemp.get(d.properties.name);
          if (typeof(thisTemp) === "undefined"){
            return "#808080";
          }
          else{
            d.total = thisTemp[yearIndMapTemp];
            return colorScaleMapTemp(d.total);  // the end color value
          }          
      })
}


function playMapandLine(){

  timer = setInterval( function() {   
      if( yearIndMapTemp < dataMapTemp.get("China").length-1 ) {  
          yearIndMapTemp +=1;              
      } 
      else {
          yearIndMapTemp = 0;              // reset year conuter
          svgAvgTempLine.selectAll("path.line").remove();  // reset svg figure
          svgAvgTempLine.selectAll("circle.focus").style("opacity", 0)
          svgAvgTempLine.selectAll("text.focusText").style("opacity", 0)
          dataAvgTempDrawed.length = 0     // reset data for focus
      }

      sequenceWorldTempMap();                // update the representation of the map 
      sequenceAvgTempLine();                 // update the representation of the line chart

      yearClock.html(beginYearMapTemp + yearIndMapTemp);  // update the clock
    },
    mapTempDuration
  );

  playingMapTemp = true;          // change the status of the animation
}


function stopPlaying(){
  
  clearInterval(timer);           // stop the animation by clearing the interval
  playingMapTemp = false;         // change the status again

  d3.select("#worldAverageTemperature")  // stop the line chart
    .sel
    ectAll("*")
    .transition()
    .duration(0)
    .ease(d3.easeLinear);
  resumeAvgTempLine = true;

}


function animateWorldTempMap() {
  d3.select('#playTemp')  
    .on('click', function() {
      // if the map will play, set a JS interval to repeate the map
      if( playingMapTemp == false ) {  
        playMapandLine()
      } 
      // else if is currently playingMapTemp
      else {    
        stopPlaying()
      }
  });
}


function init() {

  setWorldTempMap();
  animateWorldTempMap();

}

window.onload = init();  // magic starts here
