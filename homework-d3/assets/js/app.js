
// Parameters to define the area of the graph
var svgWidth = 800;
var svgHeight = 520;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
//and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "noHealthInsurance";

// Functions used for updating x-scale and y-scale var upon click on axis label
function xScale(xData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(xData, d => d[chosenXAxis]) * 0.8,
      d3.max(xData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
};

function yScale(yData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(yData, d => d[chosenYAxis]) * 0.8,
      d3.max(yData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
  return yLinearScale;
};

// Retrieve data from the CSV file and execute everything below
d3.csv("data/data.csv").then(function(d3timesData) {
  
  // Parse data
  d3timesData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.noHealthInsurance = +data.noHealthInsurance;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // Create x and y scale function
  var xLinearScale = xScale(d3timesData, chosenXAxis);
  var yLinearScale = yScale(d3timesData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // Setup the tool tip
  var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) { 
      return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
    });
  svg.call(tool_tip);

  // Append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(d3timesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .classed("stateCircle", true)
    .on('mouseover', tool_tip.show)
    .on('mouseout', tool_tip.hide);

  // Appending a label to each data point
  var circlesLabelsGroup = chartGroup.append("text")
    .classed("stateText", true)
    .selectAll("tspan")
    .data(d3timesData)
    .enter()
    .append("tspan")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+3.5)
    .text(d => d.abbr);

  // Create group for 3 x-axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width/2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") //value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") //value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") //value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for 3 y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 10)
    .attr("dy", "1em")
    .attr("value", "noHealthInsurance") //value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var obeseLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 30)
    .attr("dy", "1em")
    .attr("value", "obesity") //value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left + 50)
    .attr("dy", "1em")
    .attr("value", "smokes") //value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function () {
      // Get value of selection
      var value = d3.select(this).attr("value");
      if (value != chosenXAxis) {

        // Replaces chosenXAxis with value
        chosenXAxis = value;

        // Updates x scale for new data
        xLinearScale = xScale(d3timesData, chosenXAxis);

        // Updates x axis with transition
        var bottomAxis = d3.axisBottom(xLinearScale);
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);

        // Updates circles with new x values
        circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => xLinearScale(d[chosenXAxis]));
        circlesLabelsGroup.transition()
          .duration(1000)
          .attr("x", d => xLinearScale(d[chosenXAxis]));

        // changes classes to change bold text
        if (chosenXAxis == "age") {
          ageLabel.classed("active", true).classed("inactive", false);
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", false).classed("inactive", true);
        } else if (chosenXAxis == "poverty") {
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", true).classed("inactive", false);
          incomeLabel.classed("active", false).classed("inactive", true);
        } else {
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", false).classed("inactive", true);
          incomeLabel.classed("active", true).classed("inactive", false);
        };
      };
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function () {
    // Get value of selection
    var value = d3.select(this).attr("value");
    if (value != chosenYAxis) {

      // Replaces chosenYAxis with value
      chosenYAxis = value;

      // Updates y scale for new data
      yLinearScale = yScale(d3timesData, chosenYAxis);

      // Updates y axis with transition
      var leftAxis = d3.axisLeft(yLinearScale);
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);

      // Updates circles with new y values
      circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => yLinearScale(d[chosenYAxis]));
      circlesLabelsGroup.transition()
        .duration(1000)
        .attr("y", d => yLinearScale(d[chosenYAxis])+3.5);

      // changes classes to change bold text
      if (chosenYAxis == "obesity") {
        healthcareLabel.classed("active", false).classed("inactive", true);
        obeseLabel.classed("active", true).classed("inactive", false);
        smokesLabel.classed("active", false).classed("inactive", true);
      } else if (chosenYAxis == "smokes") {
        healthcareLabel.classed("active", false).classed("inactive", true);
        obeseLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", true).classed("inactive", false);
      } else {
        healthcareLabel.classed("active", true).classed("inactive", false);
        obeseLabel.classed("active", false).classed("inactive", true);
        smokesLabel.classed("active", false).classed("inactive", true);
      };
    };
  });
});