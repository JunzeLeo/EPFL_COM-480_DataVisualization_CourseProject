/* ******************** world temperature map settings ************************* */
// The worldMap_temperature
var beginYearMapTemp = 1898, yearIndMapTemp = 0, playingMapTemp = false, mapTempDuration = 200;
var svgMapTemp = d3.select("#worldMap_temperature"),
    widthMapTemp = +svgMapTemp.attr("width"),
    heightMapTemp = +svgMapTemp.attr("height");

// Map and projection
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([widthMapTemp / 2, heightMapTemp / 2]);

// Data (in map => key: value) and color scale
var dataMapTemp = d3.map();
var colorScaleMapTemp = d3.scaleLinear()
                   .domain([-2, 0, 2])
                   .range(['blue', "yellow", "red"]);

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
var marginAvgTempLine = {top: 20 , right: 100, bottom: 30, left: 25};   // top left is the origin of a svg, x leftward, y downward
var svgAvgTempLine    = d3.select("#worldAverageTemperature"),
    widthAvgTempLine  = +svgAvgTempLine.attr("width") - marginAvgTempLine.left,
    heightAvgTempLine = +svgAvgTempLine.attr("height") - marginAvgTempLine.top;
svgAvgTempLine.append("g")
              .attr("transform", 
                    "translate(" + marginAvgTempLine.left + "," + marginAvgTempLine.top + ")");

// Define the scales of axises
var xAvgTempLineScale = d3.scaleLinear().range([marginAvgTempLine.left, widthAvgTempLine]);
var yAvgTempLineScale = d3.scaleLinear().range([heightAvgTempLine, marginAvgTempLine.top]);

// Plot the axises
var xAxisAvgTempLine = d3.axisBottom(xAvgTempLineScale).tickFormat(function(d) { return d;});
var yAxisAvgTempLine = d3.axisLeft(yAvgTempLineScale).ticks(5);

// Data (in map => key: value) and duration(to be updated)
var dataWorldAvgTemp = d3.map(), resumeAvgTempLine = false;

// Define a function to draw line
var drawWorldAvgTemp = d3.line()
    .x(function(d) { return xAvgTempLineScale(+d.keys()[0]); })
    .y(function(d) { return yAvgTempLineScale(d.values()[0][0]); });

// gridlines in x axis function
function draw_x_gridlines() { return d3.axisBottom(xAvgTempLineScale).ticks(5) }
function draw_y_gridlines() { return d3.axisLeft(yAvgTempLineScale).ticks(5)}


/* ******************** start animation ************************* */
function setWorldTempMap()
{
  // Load external data and boot
  d3.queue()
    .defer(d3.json, "world.geojson")
    .defer(d3.csv, "countryAvgTemp.csv", function(d) { dataMapTemp.set(d.id, tempToArray(d)) })
    .defer(d3.csv, "worldAvgTemp.csv", function(d) { dataWorldAvgTemp.set(d.id, tempToArray(d)) })
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
        // .style("stroke", "black")

      console.log(d.total)
    }

    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(50)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(50)
        // .style("stroke", "transparent")
    }

    let mouseClick = function(d) {
      console.log(d.properties['name'])

    }

    console.log(dataMapTemp)
    console.log(dataWorldAvgTemp)

    // Draw line chart
    // Scale the range of the data
    xAvgTempLineScale.domain(d3.extent(dataWorldAvgTemp.keys(), function(d) {return +d;}));
    yAvgTempLineScale.domain(d3.extent(dataWorldAvgTemp.values(), function(d) {return d[0];}));

    // Add the axises
    svgAvgTempLine.append("g")          
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + heightAvgTempLine + ")")
                  // .style("fill", "red")
                  .call(xAxisAvgTempLine);

    svgAvgTempLine.append("g")
                  .attr("class", "y axis")
                  .attr("transform", "translate(" + marginAvgTempLine.left + ",0)")
                  // .style("fill", "steelblue")
                  .call(yAxisAvgTempLine); 

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
        .on("click", mouseClick )
  }
}


function sequenceAvgTempLine(){
  var arrayOfMap = [];

  for (var i in dataWorldAvgTemp.keys()){
    if ( i != yearIndMapTemp-1 - resumeAvgTempLine && i != yearIndMapTemp-1 && i != yearIndMapTemp ){
      continue;
    }
    console.log(i,yearIndMapTemp)
    arrayOfMap.push(d3.map().set(+dataWorldAvgTemp.keys()[i], dataWorldAvgTemp.values()[i]))
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
  
  console.log(totalLenAvgWrdTemp)
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
            if( yearIndMapTemp < dataMapTemp.get("China").length-1 ) {  
                yearIndMapTemp +=1;              
            } 
            else {
                yearIndMapTemp = 0;              // or reset it to zero
                svgAvgTempLine.selectAll("path.line").remove();
            }

            sequenceWorldTempMap();                // update the representation of the map 
            sequenceAvgTempLine();                 // update the representation of the line chart

            d3.select('#clock').html(beginYearMapTemp + yearIndMapTemp);  // update the clock
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

        d3.select("#worldAverageTemperature")  // stop the line chart
          .selectAll("*")
          .transition()
          .duration(0)
          .ease(d3.easeLinear);
        resumeAvgTempLine = true;
      }
  });
}


function init() {

  setWorldTempMap();
  animateWorldTempMap();

}

window.onload = init();  // magic starts here
