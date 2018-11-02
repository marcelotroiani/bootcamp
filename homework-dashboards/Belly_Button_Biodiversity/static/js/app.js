function buildMetadata(sample) {

  var url = `/metadata/${sample}`;

  // Display the sample metadata for each key,value pair
  d3.json(url).then(function(response) {
    console.log(response);
    d3.select("#sample-metadata").selectAll("ul").remove();
    var ul = d3.select("#sample-metadata").append("ul").attr("class", "list-unstyled");
    Object.entries(response).forEach(([key, value]) => {
      var cell = ul.append("li");
      cell.text(key + ": " + value);
    });

    // Build the Gauge Chart
    buildGauge(response.WFREQ);
  });
}

function buildCharts(sample) {

  var url = `/samples/${sample}`;

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {

    console.log(response);
    var sample_values = response.sample_values;
    var otu_ids = response.otu_ids;
    var otu_labels = response.otu_labels;

    // Data to build a Pie Chart for the top 10 samples in the sample date
    var trace_pie = {
      values: sample_values.slice(0, 10),
      labels: otu_ids.slice(0, 10),
      hovertext: otu_labels.slice(0, 10),
      type: "pie"
    };
    
    // Data to build a Bubble Chart using the sample data
    var trace_bubble = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    };

    var data_pie = [trace_pie];
    var data_bubble = [trace_bubble];

    // Layout and options for both pie and bubble charts
    var layout_pie = {
      title: "<b>Top 10 Samples Distribution</b>"
    };

    var layout_bubble = {
      title: "<b>Sample Values by OTU ID</b>",
      xaxis: {
        title: 'OTU ID'
      }
    };

    var options = {
      displayModeBar: false
    };

    // Plot both pie and bubble charts
    Plotly.newPlot("pie", data_pie, layout_pie, options);
    Plotly.newPlot("bubble", data_bubble, layout_bubble, options);
    
  });
}

function buildGauge(wref) {
  // Enter a speed between 0 and 180
  // Given WREF is between 0 and 9, we just need to multiply the value by 20
  var level = wref*20;

  // Trig to calc meter point
  var degrees = 180 - level,
    radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{
    type: 'scatter',
    x: [0], y: [0],
    marker: {size: 15, color:'850000'},
    showlegend: false,
    name: 'Scrubs per Week',
    text: wref,
    hoverinfo: 'text+name'
    },
    {
    values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {
      colors:['rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
              'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
              'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
              'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
              'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    title: '<b>Belly Button Washing Frequency</b>',
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot("gauge", data, layout, {displayModeBar: false});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
