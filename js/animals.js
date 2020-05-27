var margin = {top: 60, right: 30, bottom: 60, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);
var xAxis = d3.axisBottom(x).tickFormat(function(d) { return d;});
var yAxisLeft = d3.axisLeft(y).ticks(5);

var svgAnimals = d3.select("#animals")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                          .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var svgSpecies = d3.select("#species")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                          .attr("transform","translate(" + margin.left + "," + margin.top + ")");

var colorCR = "#f7436d"
var colorEN = "#e08036"
var colorVU = "#f0e246"
svgAnimals.append("rect").attr("x",(width*0.1)).attr("y",(height*0.05)).attr("width", 8).attr("height", 8).style("fill", colorCR)
svgAnimals.append("rect").attr("x",(width*0.1)).attr("y",(height*0.09)).attr("width", 8).attr("height", 8).style("fill", colorEN)
svgAnimals.append("rect").attr("x",(width*0.1)).attr("y",(height*0.13)).attr("width", 8).attr("height", 8).style("fill", colorVU)
svgAnimals.append("text").attr("x", (width*0.16)).attr("y", (height*0.06)).text("Critically endangered").style("font-size", "12px").attr("alignment-baseline","middle")
svgAnimals.append("text").attr("x", (width*0.16)).attr("y", (height*0.1)).text("Endangered").style("font-size", "12px").attr("alignment-baseline","middle")
svgAnimals.append("text").attr("x", (width*0.16)).attr("y", (height*0.14)).text("Vunerable").style("font-size", "12px").attr("alignment-baseline","middle")


function plotAnimals(){

  svgAnimals.selectAll("path.line").remove();


  // Load the data
  d3.csv("../com-480-project-zalda/data/animals.csv", function(error, data) {
    // data = alldata.filter(function(d) {return d.country == country})
    data.forEach(function(d) {
        d.year = +d.year
        d.CR = +d.CR;
        d.EN = +d.EN;
        d.VU = +d.VU;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year;}));
    y.domain([0, d3.max(data, function(d) {return Math.max(d.CR); })]);

    // Define functions to draw lines
    var valuelineCR = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.CR); });
    var valuelineEN = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.EN); });
    var valuelineVU = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.VU); });
    var	valueAreaCR = d3.area()
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.EN); })
        .y1(function(d) { return y(d.CR); });
    var	valueAreaEN = d3.area()
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.VU); })
        .y1(function(d) { return y(d.EN); });
    var	valueAreaVU = d3.area()
        .x(function(d) { return x(d.year); })
        .y0(height)
        .y1(function(d) { return y(d.VU); });


    var focus = svgAnimals.append("g");

    var lineCR = focus.append("path")
                      .datum(data)
                      .attr("fill", "none")
                      .attr("stroke", colorCR)
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 2)
                      .attr("d", valuelineCR)
                      .attr("class", "line")
    var totalLengthCR = lineCR.node().getTotalLength();
    lineCR.attr("stroke-dasharray", totalLengthCR)
          .attr("stroke-dashoffset", totalLengthCR)
          .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var lineVU = focus.append("path")
        .datum(data)
        .attr("fill", "none")
        .style("stroke", colorVU)
        // .attr("stroke", "green")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2)
        .attr("d", valuelineVU)
        .attr("class", "line")
    var totalLengthVU = lineVU.node().getTotalLength();
    lineVU.attr("stroke-dasharray", totalLengthVU)
        .attr("stroke-dashoffset", totalLengthVU)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);

    var lineEN = focus.append("path")
          .datum(data)
          .attr("fill", "none")
          .style("stroke", colorEN)
          // .attr("stroke", "green")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 2)
          .attr("d", valuelineEN)
          .attr("class", "line")
    var totalLengthEN = lineEN.node().getTotalLength();
    lineEN.attr("stroke-dasharray", totalLengthEN)
      .attr("stroke-dashoffset", totalLengthEN)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var areaCR = svgAnimals.append("path")
        .datum(data)
        .attr("class", "areaCR")
        .attr("d", valueAreaCR);
    var totalSizeCR = areaCR.node().getTotalLength();
    areaCR.attr("stroke-dasharray", totalSizeCR)
      .attr("stroke-dashoffset", totalSizeCR)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var areaEN = svgAnimals.append("path")
        .datum(data)
        .attr("class", "areaEN")
        .attr("d", valueAreaEN);
    var totalSizeEN = areaEN.node().getTotalLength();
    areaEN.attr("stroke-dasharray", totalSizeEN)
      .attr("stroke-dashoffset", totalSizeEN)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var areaVU = svgAnimals.append("path")
        .datum(data)
        .attr("class", "areaVU")
        .attr("d", valueAreaVU);
    var totalSizeVU = areaVU.node().getTotalLength();
    areaVU.attr("stroke-dasharray", totalSizeVU)
      .attr("stroke-dashoffset", totalSizeVU)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);


    svgAnimals.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(0))
            .attr("x2", 0).attr("y2", y(1000))

    // Add the axises
    svgAnimals.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgAnimals.append("g")
        .attr("class", "y axis")
        .call(yAxisLeft);

    svgAnimals.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Threatened animals");

    svgAnimals.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-width*0.12) +","+(height/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Number of species")
        .style("font-size", "12px");
    svgAnimals.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height*1.13)+")")  // centre below axis
        .text("Year")
        .style("font-size", "12px");


  });

}


function plotSpecies(Species){

  svgSpecies.selectAll("*").remove();


  svgSpecies.append('image')
    .attr('xlink:href', "../img/"+Species+".jpg")
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0.8)


  dataPath = "../com-480-project-zalda/data/" + Species + ".csv"

  // Load the data
  d3.csv(dataPath, function(error, data) {
    // data = alldata.filter(function(d) {return d.country == country})
    data.forEach(function(d) {
        d.year = +d.year
        d.CR = +d.CR;
        d.EN = +d.EN;
        d.VU = +d.VU;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year;}));
    y.domain([0, d3.max(data, function(d) {return Math.max(d.CR) + Math.max(d.EN)+ Math.max(d.VU); })]);

    // Define functions to draw lines
    var valuelineCR = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.CR + d.EN + d.VU); });
    var valuelineEN = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.EN + d.VU); });
    var valuelineVU = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.VU); });
    var	valueAreaCR = d3.area()
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.EN+d.VU); })
        .y1(function(d) { return y(d.CR + d.EN + d.VU); });
    var	valueAreaEN = d3.area()
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.VU); })
        .y1(function(d) { return y(d.EN +d.VU); });
    var	valueAreaVU = d3.area()
        .x(function(d) { return x(d.year); })
        .y0(height)
        .y1(function(d) { return y(d.VU); });


    var focus = svgSpecies.append("g");

    var lineCR = focus.append("path")
                      .datum(data)
                      .attr("class", "line")
                      .attr("fill", "none")
                      .attr("stroke", colorCR)
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 2)
                      .attr("d", valuelineCR)

    // console.log(data)
    var totalLengthCR = lineCR.node().getTotalLength();
    lineCR.attr("stroke-dasharray", totalLengthCR)
          .attr("stroke-dashoffset", totalLengthCR)
          .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var lineVU = focus.append("path")
                      .datum(data)
                      .attr("fill", "none")
                      .style("stroke", colorVU)
                      // .attr("stroke", "green")
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 2)
                      .attr("d", valuelineVU)
                      .attr("class", "line")
    var totalLengthVU = lineVU.node().getTotalLength();
    lineVU.attr("stroke-dasharray", totalLengthVU)
          .attr("stroke-dashoffset", totalLengthVU)
          .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var lineEN = focus.append("path")
                      .datum(data)
                      .attr("fill", "none")
                      .style("stroke", colorEN)
                      // .attr("stroke", "green")
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 2)
                      .attr("d", valuelineEN)
                      .attr("class", "line")
    var totalLengthEN = lineEN.node().getTotalLength();
    lineEN.attr("stroke-dasharray", totalLengthEN)
          .attr("stroke-dashoffset", totalLengthEN)
          .transition()
              .duration(2000)
              .attr('stroke-dashoffset', 0);

    var areaCR = svgSpecies.append("path")
        .datum(data)
        .attr("class", "areaCR")
        .attr("d", valueAreaCR);
    var totalSizeCR = areaCR.node().getTotalLength();
    areaCR.attr("stroke-dasharray", totalSizeCR)
      .attr("stroke-dashoffset", totalSizeCR)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var areaEN = svgSpecies.append("path")
        .datum(data)
        .attr("class", "areaEN")
        .attr("d", valueAreaEN);
    var totalSizeEN = areaEN.node().getTotalLength();
    areaEN.attr("stroke-dasharray", totalSizeEN)
      .attr("stroke-dashoffset", totalSizeEN)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);

    var areaVU = svgSpecies.append("path")
        .datum(data)
        .attr("class", "areaVU")
        .attr("d", valueAreaVU);
    var totalSizeVU = areaVU.node().getTotalLength();
    areaVU.attr("stroke-dasharray", totalSizeVU)
      .attr("stroke-dashoffset", totalSizeVU)
      .transition()
          .duration(2000)
          .attr('stroke-dashoffset', 0);


    svgSpecies.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(0))
            .attr("x2", 0).attr("y2", y(1000))

    // Add the axises
    svgSpecies.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgSpecies.append("g")
        .attr("class", "y axis")
        .call(yAxisLeft);

    svgSpecies.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top/4))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(Species);

    svgSpecies.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-width*0.12) +","+(height/2) +")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Number of species")
        .style("font-size", "12px");
    svgSpecies.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height*1.13)+")")  // centre below axis
        .text("Year")
        .style("font-size", "12px");


  });

}



plotAnimals();
plotSpecies("Mammals");
