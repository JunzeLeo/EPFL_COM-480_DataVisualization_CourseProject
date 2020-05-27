/* ******************** world temperature map settings ************************* */
// The worldMap_temperature
var marginMapTemp = {top: 20 , right: 20, bottom: 20, left: 20};   // top left is the origin of a svg, x leftward, y downward
var beginYearMapTemp = 1990, yearIndMapTemp = 0, playingMapTemp = false, mapTempDuration = 200;
var svgMapTemp = d3.select("#worldMap_temperature"),
    widthMapTemp = +svgMapTemp.attr("width"),
    heightMapTemp = +svgMapTemp.attr("height");

// Map and projection
var projection = d3.geoMercator()
  .scale(55)
  .center([0,20])
  .translate([widthMapTemp / 2, heightMapTemp / 2]);

// Data (in map => key: value) and color scale
var dataMapTemp = d3.map();
var colorScaleMapTemp = d3.scaleLinear()
                          .domain([-2, 0, 2])
                          .range(['blue', "yellow", "red"]);

var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

var yearClock = d3.select('#clock')
      .style("position", "absolute")
      .style("z-index", "10")
      .style("top", (marginMapTemp.top) + "px")
      .style("left",(marginMapTemp.left) + "px")

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

// Convert yearly data to array of Dict
function tempToDictArray(d){
  dictArray = []
  for (var i in d){
    if (i !== "id"){
      dictArray.push(d3.map().set(i, +d[i]))
    }
  }
  return dictArray
}



/* ***************** world avg temperature line chart settings ********************* */
// The average temperature
var marginAvgTempLine = {top: 20 , right: 100, bottom: 30, left: 35};   // top left is the origin of a svg, x leftward, y downward
var svgAvgTempLine    = d3.select("#worldAverageTemperature"),
    widthAvgTempLine  = +svgAvgTempLine.attr("width") - marginAvgTempLine.left,
    heightAvgTempLine = +svgAvgTempLine.attr("height") - marginAvgTempLine.top;
svgAvgTempLine.append("g")
              .attr("transform", 
                    "translate(" + marginAvgTempLine.left + "," + marginAvgTempLine.top + ")");

// Define the scales of axises
var xAvgTempLineScale = d3.scaleLinear().range([marginAvgTempLine.left, widthAvgTempLine]);
var yAvgTempLineScale = d3.scaleLinear().range([heightAvgTempLine, marginAvgTempLine.top]);
var yAvgTempLineScale2= d3.scaleLinear().range([heightAvgTempLine, marginAvgTempLine.top]);

// Plot the axises
var xAxisAvgTempLine = d3.axisBottom(xAvgTempLineScale).tickFormat(function(d) { return d;});
var yAxisAvgTempLine = d3.axisLeft(yAvgTempLineScale).ticks(5);
var yAxisAvgTempLine2= d3.axisRight(yAvgTempLineScale2).ticks(5); 

// Data (in map => key: value) and duration(to be updated)
var dataCountryCarbon = d3.map(), dataCountryForest = d3.map();

// Define a function to draw line
var drawWorldAvgTemp = d3.line()
    .x(function(d) { return xAvgTempLineScale(+d.keys()[0]); })
    .y(function(d) { return yAvgTempLineScale(d.values()[0]); });

var drawWorldAvgTemp2 = d3.line()
    .x(function(d) { return xAvgTempLineScale(+d.keys()[0]); })
    .y(function(d) { return yAvgTempLineScale2(d.values()[0]); });

// gridlines in x axis function
function draw_x_gridlines() { return d3.axisBottom(xAvgTempLineScale).ticks(5) }
function draw_y_gridlines() { return d3.axisLeft(yAvgTempLineScale).ticks(5)}


/* ******************** start animation ************************* */
function drawCountryAxis(countryName)
{

  svgAvgTempLine.selectAll("g").remove()


  // Scale the range of the data
  yAxisCarbon = []
  for (var j in dataCountryCarbon.get(countryName)){
    // console.log(dataCountryCarbon.get(countryName)[j])
    yAxisCarbon.push(dataCountryCarbon.get(countryName)[j].values()[0])
    }
  yAxisCarbon.push(d3.min(yAxisCarbon)/1.01 - 0.01)
  yAxisCarbon.push(d3.max(yAxisCarbon)*1.01 + 0.01)

  yAxisForest = []
  for (var j in dataCountryForest.get(countryName)){
    yAxisForest.push(dataCountryForest.get(countryName)[j].values()[0])
    }
  yAxisForest.push(d3.min(yAxisForest)/1.1 - 0.02)
  yAxisForest.push(d3.max(yAxisForest)*1.1 + 0.02)

  xAvgTempLineScale.domain(d3.extent(dataCountryCarbon.get("CHN"), function(d) {return d.keys()[0]}));
  yAvgTempLineScale.domain(d3.extent(yAxisCarbon));
  yAvgTempLineScale2.domain(d3.extent(yAxisForest));

  // Add the axises
  svgAvgTempLine.append("g")          
                .attr("class", "x axis")
                .attr("transform", "translate(0," + heightAvgTempLine + ")")
                .call(xAxisAvgTempLine);

  svgAvgTempLine.append("g")
                .attr("class", "y axis")
                .style("stroke", "red")
                .attr("transform", "translate(" + marginAvgTempLine.left + ",0)")
                .call(yAxisAvgTempLine); 

  svgAvgTempLine.append("g")       
                .attr("class", "y axis2")  
                .style("stroke", "green")
                .attr("transform", "translate(" + widthAvgTempLine + " ,0)") 
                .call(yAxisAvgTempLine2);


  // add gridlines
  svgAvgTempLine.append("g")     
                .attr("class", "grid")
                .attr("transform", "translate(0," + heightAvgTempLine + ")")
                .call(draw_x_gridlines()
                .tickSize(-heightAvgTempLine + marginAvgTempLine.top)
                .tickFormat("")
  )

  svgAvgTempLine.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(" + marginAvgTempLine.left + ",0)")
                .call(draw_y_gridlines()
                .tickSize(-widthAvgTempLine + marginAvgTempLine.left)
                .tickFormat("")
  )
}

function drawCoutryData(countryName){
  
  drawCountryAxis(countryName)

  svgAvgTempLine.selectAll("path.line").remove()

  var arrayOfMap = dataCountryCarbon.get(countryName)
  var arrayOfMap2= dataCountryForest.get(countryName)
  // console.log(arrayOfMap)

  var worldAvgTempline = svgAvgTempLine.append("g")
                  .append("path")
                  .datum(arrayOfMap)
                  .attr("class", "line")
                  .attr("fill", "none")
                  .attr("stroke", "red")
                  .attr("stroke-linejoin", "round")
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1.5)
                  .attr("d", drawWorldAvgTemp);

  var worldAvgTempline2 = svgAvgTempLine.append("g")
                  .append("path")
                  .datum(arrayOfMap2)
                  .attr("class", "line")
                  .attr("fill", "none")
                  .style("stroke", "green")
                  .attr("stroke-linejoin", "round")
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1.5)
                  .attr("d", drawWorldAvgTemp2)

  var totalLenAvgWrdTemp = worldAvgTempline.node().getTotalLength();
  // console.log(totalLenAvgWrdTemp)
  worldAvgTempline.attr("stroke-dasharray", totalLenAvgWrdTemp)
                 .attr("stroke-dashoffset", totalLenAvgWrdTemp)
                 .transition()
                 .duration(1000)
                 .ease(d3.easeLinear)
                 .attr('stroke-dashoffset', 0);

  var totalLenAvgWrdTemp2 = worldAvgTempline2.node().getTotalLength();
  worldAvgTempline2.attr("stroke-dasharray", totalLenAvgWrdTemp2)
                   .attr("stroke-dashoffset", totalLenAvgWrdTemp2)
                   .transition()
                   .duration(1000)
                   .ease(d3.easeLinear)
                   .attr('stroke-dashoffset', 0);

}


function setWorldTempMap()
{
  // Load external data and boot
  d3.queue()
    .defer(d3.json,"world.geojson")
    .defer(d3.csv, "country_carbon_norm.csv", function(d) { dataMapTemp.set(d.id, tempToArray(d)) })
    .defer(d3.csv, "country_carbon_nonorm.csv", function(d) { dataCountryCarbon.set(d.id, tempToDictArray(d)) })
    .defer(d3.csv, "country_forest.csv", function(d) { dataCountryForest.set(d.id, tempToDictArray(d)) })
    .await(ready);

  function ready(error, topo) {

  // Define interactions
    let mouseOver = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(50)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 1)

      tooltip.text(d.properties['name'])
             .style("visibility", "visible")

        // .style("stroke", "black")

      // console.log(d.total)
    }

    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(50)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(50)

      tooltip.style("visibility", "hidden");
        // .style("stroke", "transparent")
    }

    let mousemove = function(d){
      tooltip.style("top", (d3.event.pageY-10)+"px")
             .style("left",(d3.event.pageX+10)+"px")
    }

    let mouseClick = function(d) {
      drawCoutryData(d.id)
    }

    // console.log(dataMapTemp)
    // console.log(dataCountryCarbon)

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
          thisTemp = dataMapTemp.get(d.id);
          if (typeof(thisTemp) === "undefined"){
            d.total = 0;
          }
          else{
            d.total = thisTemp[yearIndMapTemp];
          }  
          return colorScaleMapTemp(d.total);
        })
        .style("stroke", "transparent")
        .attr("class", function(d){ return "Country" } )
        .attr("code", function(d){ return d.id } )
        .style("opacity", .8)
        .on("mouseover", mouseOver )
        .on("mouseleave", mouseLeave )
        .on("mousemove", mousemove )
        .on("click", mouseClick )
  }
}


function sequenceWorldTempMap() {
  
    d3.selectAll('.Country').transition()    //select all the countries and prepare for a transition to new values
      .duration(100)                         // give it a smooth time period for the transition
      .attr('fill', function(d) {
          thisTemp = dataMapTemp.get(d.id);
          if (typeof(thisTemp) === "undefined"){
            d.total = 0;
          }
          else{
            d.total = thisTemp[yearIndMapTemp];
          }  
          // console.log(d.properties.name, d.total)

        return colorScaleMapTemp(d.total);  // the end color value
      })
}


function animateWorldTempMap() {

  var timer;  // create timer object

  d3.select('#play')  
    .on('click', function() {
      // if the map will play, set a JS interval to repeate the map
      if( playingMapTemp == false ) {  
          timer = setInterval( function() {   
            if( yearIndMapTemp < dataMapTemp.get("CHN").length-1 ) {  
                yearIndMapTemp +=1;              
            } 
            else {
                yearIndMapTemp = 0;              // or reset it to zero
            }

            sequenceWorldTempMap();                // update the representation of the map 
            // sequenceAvgTempLine();                 // update the representation of the line chart

            yearClock.html(beginYearMapTemp + yearIndMapTemp);  // update the clock
            },
          mapTempDuration);
      
          d3.select(this).html('stop');   // change the button label to stop
          playingMapTemp = true;          // change the status of the animation
      } 
      // else if is currently playingMapTemp
      else {    
        clearInterval(timer);           // stop the animation by clearing the interval
        d3.select(this).html('play');   // change the button label to play
        playingMapTemp = false;         // change the status again
      }
  });
}


function init() {

  setWorldTempMap();
  animateWorldTempMap();

}

window.onload = init();  // magic starts here
