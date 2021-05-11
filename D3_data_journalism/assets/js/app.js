// class activity day 3, level 9
var svgWidth = 960;
var svgHeight = 700;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// data
d3.csv("assets/data/data.csv").then(function(healthData) {
    // parse data
    healthData.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
    });
    // scales
    var xLinearScale = d3.scaleLinear()
      .domain([20, d3.max(healthData, d => d.age)])
      .range([0, width]);
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.smokes)])
      .range([height, 0]);
    // axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);
    // circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".9")
        .attr("class", "stateText")
        .attr("class", "stateCircle")
    var textgroup = chartGroup.selectAll("text.abbrtext")
        .data(healthData)
        .enter()
        .append("text")
        .attr("class", "abbrtext")
        .attr("x", d => xLinearScale(d["age"]))
        .attr("y", d => yLinearScale(d["smokes"]))
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("font-width", "bold")
        .attr("fill", "black")
        .text(d => d.abbr)
    // tool tip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>age: ${d.age}<br>smokes: ${d.smokes}`);
      });
    chartGroup.call(toolTip);
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
    // axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers");
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age");
  }).catch(function(error) {
    console.log(error);
  });
