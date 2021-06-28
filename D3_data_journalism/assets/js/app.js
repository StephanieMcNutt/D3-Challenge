// @TODO: YOUR CODE HERE!
var svgWidth = 860;
var svgHeight = 750;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(StateData) {

    // Parse Data
        StateData.forEach(function(data){
        data.poverty =+ data.poverty;
        data.healthcare =+ data.healthcare;
    })

    // Scale Functions
    var xlinearscale = d3.scaleLinear()
    .domain([8.5, d3.max(StateData,d=>d.poverty*1.2)])
    .range([0, width]);
    var ylinearscale = d3.scaleLinear()
    .domain([0,  d3.max(StateData,d=>d.healthcare*1.2)])
    .range([height, 0]);

    // Axis Functions
    var bottomAxis = d3.axisBottom(xlinearscale);
    var leftAxis = d3.axisLeft(ylinearscale);

    // Append Chart
    chartGroup.append("g")
    .attr("transform", `translate(0,${height}`)
    .call(bottomAxis)
    chartGroup.append("g")
    .call(leftAxis)

    // Make Circles
    var circleGroup = chartGroup.selectAll("circle").data(StateData).enter();
    circleGroup.append("circle")
    .attr("cx",d =>xlinearscale(d.poverty))
    .attr("cy",d =>ylinearscale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .on("mouseover", function(data, index){
        toolTip.show(data, this)
    })
    .on("mouseout", function(data, index){
        toolTip.hide(data, this)
    });
    circleGroup.append("text")
    .text(function(d){
        return d.abbr
    })
    .attr("dx", d => xlinearscale(d.poverty)- 5)
    .attr("dy", d => ylinearscale(d.healthcare)+10/2.5)
    .attr("font-size", "9")

    // Create Tool Tips
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -20])
    .html(function(d){
        return(` ${d.state} <br>${d.poverty} <br>${d.healthcare}`)
    })
     chartGroup.call(toolTip);

    // Labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Number of Billboard 100 Hits");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Hair Metal Band Hair Length (inches)");
  }).catch(function(error) {
    console.log(error);
  });
