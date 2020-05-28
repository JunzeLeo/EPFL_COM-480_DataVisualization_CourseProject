/* ******************** world temperature map settings ************************* */
// The worldMap_temperature
var marginMapTempCO2 = {top: 20 , right: 20, bottom: 20, left: 20};   // top left is the origin of a svg, x leftward, y downward
var beginYearMapTempCO2 = 1990, yearIndMapTempCO2 = 0, playingMapTempCO2 = false, mapTempDurationCO2 = 200, timerCO2;  // create timerCO2 object;
var svgMapTempCO2 = d3.select("#mapCO2"),
    widthMapTempCO2 = +svgMapTempCO2.attr("width"),
    heightMapTempCO2 = +svgMapTempCO2.attr("height");

// Map and projection
var projectionCO2 = d3.geoEquirectangular()
  .scale(75)
  .center([0,20])
  .translate([widthMapTempCO2 / 2, heightMapTempCO2 / 2]);

// Data (in map => key: value) and color scale
var dataMapTempCO2 = d3.map();
var colorScaleMapTempCO2 = d3.scaleLinear()
                          .domain([-2, 0, 2])
                          .range(['#17e890', "#cccccc", "red"]);

var tooltipCO2 = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")

var yearClockCO2 = d3.select('#clockCO2')
      .style("position", "absolute")
      .style("z-index", "10")
      .style("top", (marginMapTempCO2.top) + "px")
      .style("left",(marginMapTempCO2.left) + "px")

// Convert yearly temperature data to array
function dataToArray(d){
  carbon = []
  for (var i in d){
    if (i !== "id"){
      carbon.push(+d[i])
    }
  }
  return carbon
}

// Convert yearly data to array of Dict
function dataToDictArray(d){
  dictArrayForest = []
  for (var i in d){
    if (i !== "id"){
      dictArrayForest.push(d3.map().set(i, +d[i]))
    }
  }
  return dictArrayForest
}



/* ***************** world avg temperature line chart settings ********************* */
// The average temperature
var marginAvgTempLineCO2 = {top: 60 , right: 40, bottom: 35, left: 40};   // top left is the origin of a svg, x leftward, y downward
var svgAvgTempLineCO2    = d3.select("#mapCO2Line"),
    widthAvgTempLineCO2  = +svgAvgTempLineCO2.attr("width") - marginAvgTempLineCO2.left - marginAvgTempLineCO2.right,
    heightAvgTempLineCO2 = +svgAvgTempLineCO2.attr("height") - marginAvgTempLineCO2.top - marginAvgTempLineCO2.bottom;
svgAvgTempLineCO2.append("g")
              .attr("transform",
                    "translate(" + marginAvgTempLineCO2.left + "," + marginAvgTempLineCO2.top + ")");

// Define the scales of axises
var xAvgTempLineScaleCO2 = d3.scaleLinear().range([marginAvgTempLineCO2.left, widthAvgTempLineCO2+marginAvgTempLineCO2.left]);
var yAvgTempLineScaleCO2 = d3.scaleLinear().range([heightAvgTempLineCO2+marginAvgTempLineCO2.top, marginAvgTempLineCO2.top]);
var yAvgTempLineScale2CO2= d3.scaleLinear().range([heightAvgTempLineCO2+marginAvgTempLineCO2.top, marginAvgTempLineCO2.top]);

// Plot the axises
var xAxisAvgTempLineCO2 = d3.axisBottom(xAvgTempLineScaleCO2).tickFormat(function(d) { return d;});
var yAxisAvgTempLineCO2 = d3.axisLeft(yAvgTempLineScaleCO2).ticks(5);
var yAxisAvgTempLine2CO2= d3.axisRight(yAvgTempLineScale2CO2).ticks(5);

// Data (in map => key: value) and duration(to be updated)
var dataCountryCarbon = d3.map(), dataCountryForest = d3.map();

// Define a function to draw line
var drawWorldAvgTempCO2 = d3.line()
    .x(function(d) { return xAvgTempLineScaleCO2(+d.keys()[0]); })
    .y(function(d) { return yAvgTempLineScaleCO2(d.values()[0]); });

var drawWorldAvgTemp2CO2 = d3.line()
    .x(function(d) { return xAvgTempLineScaleCO2(+d.keys()[0]); })
    .y(function(d) { return yAvgTempLineScale2CO2(d.values()[0]); });

// gridlines in x axis function
function draw_x_gridlines() { return d3.axisBottom(xAvgTempLineScaleCO2).ticks(13) }
function draw_y_gridlines() { return d3.axisLeft(yAvgTempLineScaleCO2).ticks(5)}


/* ******************** start animation ************************* */
function drawCountryAxis(countryName, countFullName)
{

  svgAvgTempLineCO2.selectAll("g").remove()
  svgAvgTempLineCO2.selectAll("text.title").remove()

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

  xAvgTempLineScaleCO2.domain(d3.extent(dataCountryCarbon.get("CHN"), function(d) {return d.keys()[0]}));
  yAvgTempLineScaleCO2.domain(d3.extent(yAxisCarbon));
  yAvgTempLineScale2CO2.domain(d3.extent(yAxisForest));

  // Add the axises
  svgAvgTempLineCO2.append("g")
                .attr("class", "x axis")
                .style("stroke", "white")
                .attr("transform", "translate(0," + (heightAvgTempLineCO2 + marginAvgTempLineCO2.top) + ")")
                .call(xAxisAvgTempLineCO2);

  svgAvgTempLineCO2.append("g")
                .attr("class", "y axis")
                .style("stroke", "red")
                .attr("transform", "translate(" + marginAvgTempLineCO2.left + ",0)")
                .call(yAxisAvgTempLineCO2);

  svgAvgTempLineCO2.append("g")
                .attr("class", "y axis2")
                .style("stroke", "#17e890")
                .attr("transform", "translate(" + (widthAvgTempLineCO2+marginAvgTempLineCO2.left) + " ,0)")
                .call(yAxisAvgTempLine2CO2);

  // add labels
  svgAvgTempLineCO2.append("text")
                .style("stroke", "white")
                .style("fill", "white")
                .style("font", "16px times")
                .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ 11 +","+((heightAvgTempLineCO2 + marginAvgTempLineCO2.top + marginAvgTempLineCO2.bottom)/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                .text("CO2 emission (ton/capita)");

  svgAvgTempLineCO2.append("text")
                  .style("stroke", "white")
                  .style("fill", "white")
                  .style("font", "16px times")
                  .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                  .attr("transform", "translate("+ (marginAvgTempLineCO2.left+widthAvgTempLineCO2+marginAvgTempLineCO2.right - 5) +","+((heightAvgTempLineCO2 + marginAvgTempLineCO2.top + marginAvgTempLineCO2.bottom)/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
                  .text("Forest coverage(%)");

  svgAvgTempLineCO2.append("text")
                .style("stroke", "white")
                .style("fill", "white")
                .style("font", "16px times")
                .attr("x", (widthAvgTempLineCO2/2 + marginAvgTempLineCO2.left))
                .attr("y", (heightAvgTempLineCO2 + marginAvgTempLineCO2.top + marginAvgTempLineCO2.bottom) )
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Year");

  svgAvgTempLineCO2.append("text")
                .attr("class", "title")
                .style("stroke", "white")
                .style("fill", "white")
                .attr("x", (widthAvgTempLineCO2/2 + marginAvgTempLineCO2.left))
                .attr("y", (marginAvgTempLineCO2.top/2) )
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Forest Coverage v.s. CO2 emission of")
                .style("font-size", "14px")
                .append('svg:tspan')
                .attr('x', 0)
                .attr('dy', 20)
                .attr("x", (widthAvgTempLineCO2/2 + marginAvgTempLineCO2.left))
                .attr("y", (marginAvgTempLineCO2.top/2) )
                .text(countFullName)
                .style("font-size", "14px");

  // add gridlines
  svgAvgTempLineCO2.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + (heightAvgTempLineCO2 + marginAvgTempLineCO2.top) + ")")
                .call(draw_x_gridlines()
                .tickSize(-heightAvgTempLineCO2)
                .tickFormat("")
  )

  // svgAvgTempLineCO2.append("g")
  //               .attr("class", "grid")
  //               .attr("transform", "translate(" + marginAvgTempLineCO2.left + ",0)")
  //               .call(draw_y_gridlines()
  //               .tickSize(-widthAvgTempLineCO2 + marginAvgTempLineCO2.left)
  //               .tickFormat("")
  // )
}

function drawCoutryData(countryName, countryFullName){

  drawCountryAxis(countryName, countryFullName)

  svgAvgTempLineCO2.selectAll("path.line").remove()

  var arrayOfMap = dataCountryCarbon.get(countryName)
  var arrayOfMap2= dataCountryForest.get(countryName)
  // console.log(arrayOfMap)

  var worldAvgTempline = svgAvgTempLineCO2.append("g")
                  .append("path")
                  .datum(arrayOfMap)
                  .attr("class", "line")
                  .attr("fill", "none")
                  .attr("stroke", "red")
                  .attr("stroke-linejoin", "round")
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1.5)
                  .attr("d", drawWorldAvgTempCO2);

  var worldAvgTempline2 = svgAvgTempLineCO2.append("g")
                  .append("path")
                  .datum(arrayOfMap2)
                  .attr("class", "line")
                  .attr("fill", "none")
                  .style("stroke", "#17e890")
                  .attr("stroke-linejoin", "round")
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1.5)
                  .attr("d", drawWorldAvgTemp2CO2)

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


function setWorldTempMapCO2()
{
  // Load external data and boot
  d3.queue()
    .defer(d3.json,"./data/world.geojson")
    .defer(d3.csv, "./data/country_carbon_norm.csv", function(d) { dataMapTempCO2.set(d.id, dataToArray(d)) })
    .defer(d3.csv, "./data/country_carbon_nonorm.csv", function(d) { dataCountryCarbon.set(d.id, dataToDictArray(d)) })
    .defer(d3.csv, "./data/country_forest.csv", function(d) { dataCountryForest.set(d.id, dataToDictArray(d)) })
    .await(readyCO2);

  function readyCO2(error, topo) {

  // Define interactions
    let mouseOver = function(d) {
      d3.selectAll(".CountryCO2")
        .transition()
        .duration(50)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 1)

      // console.log(d)
      tooltipCO2.text(d.properties['name'] +": "+ formatOut(d.totalCO2))
             .style("visibility", "visible")
             .style("color", "white")

        // .style("stroke", "black")

      // console.log(d.totalCO2)
    }

    let mouseLeave = function(d) {
      d3.selectAll(".CountryCO2")
        .transition()
        .duration(50)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(50)

      tooltipCO2.style("visibility", "hidden");
                // .style("stroke", "transparent")
    }

    let mousemove = function(d){
      tooltipCO2.style("top", (d3.event.pageY-10)+"px")
             .style("left",(d3.event.pageX+10)+"px")
             .text(d.properties['name'] +": "+ formatOut(d.totalCO2))
             .style("color", "white")
    }

    let mouseClick = function(d) {
      drawCoutryData(d.id, d.properties['name'])
    }

    // console.log(dataMapTempCO2)
    // console.log(dataCountryCarbon)

    drawCoutryData("USA", "United States")

    // Draw the map
    svgMapTempCO2.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projectionCO2)
      )
      // set the color of each country
      .attr("fill", function (d) {
        thisTempCO2 = dataMapTempCO2.get(d.id);
        if (typeof(thisTempCO2) === "undefined"){
          return "#808080";
        }
        else{
          d.totalCO2 = thisTempCO2[yearIndMapTempCO2];
          return colorScaleMapTempCO2(d.totalCO2);
        }
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "CountryCO2" } )
      .attr("code", function(d){ return d.id } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("mousemove", mousemove )
      .on("click", mouseClick )

    svgMapTempCO2.append("text")
            .attr("class", "title")
            .style("stroke", "white")
            .style("fill", "white")            
            .attr("x", (widthAvgTempLineCO2/2 + marginAvgTempLineCO2.left))
            .attr("y", (marginAvgTempLineCO2.top/2 + 20) )
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Country-wise CO2 Emission");

      playingMapAnimation()
  }
}


function sequenceWorldTempMapCO2() {

    d3.selectAll('.CountryCO2').transition()    //select all the countries and prepare for a transition to new values
      .duration(100)                         // give it a smooth time period for the transition
      .attr('fill', function(d) {
          thisTempCO2 = dataMapTempCO2.get(d.id);
          if (typeof(thisTempCO2) === "undefined"){
            d.totalCO2 = 0;
            return "#808080";
          }
          else{
            d.totalCO2 = thisTempCO2[yearIndMapTempCO2];
            return colorScaleMapTempCO2(d.totalCO2);  // the end color value
          }        
      })
}


function playingMapAnimation(){

  timerCO2 = setInterval( function() {
    if( yearIndMapTempCO2 < dataMapTempCO2.get("CHN").length-1 ) {
        yearIndMapTempCO2 +=1;
    }
    else {
        yearIndMapTempCO2 = 0;        // or reset it to zero
    }

    sequenceWorldTempMapCO2();        // update the representation of the map
    // sequenceAvgTempLine();         // update the representation of the line chart

    yearClockCO2.html(beginYearMapTempCO2 + yearIndMapTempCO2);  // update the clock
    },
  mapTempDurationCO2);

  playingMapTempCO2 = true;          // change the status of the animation
}


function stopMapAnimation(){

  clearInterval(timerCO2);           // stop the animation by clearing the interval
  playingMapTempCO2 = false;         // change the status again
}


function animateWorldTempMapCO2() {

  d3.select('#playCO2')
    .on('click', function() {
      // if the map will play, set a JS interval to repeate the map
      if( playingMapTempCO2 == false ) {
        playingMapAnimation()
      }
      // else if is currently playingMapTempCO2
      else {
        stopMapAnimation()
      }
  });
}


function initCO2() {

  setWorldTempMapCO2();
  animateWorldTempMapCO2();

}

window.onload = initCO2();  // magic starts here
