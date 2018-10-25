// from data.js
var tableData = data;

// Select the table where results are shown
var tbody = d3.select("tbody");

// Loop Through `data` and update the table #ufo-table with the collected information
tableData.forEach((ufo) => {
    var row = tbody.append("tr");
    Object.entries(ufo).forEach(([key, value]) => {
      var cell = tbody.append("td");
      cell.text(value);
    });
  });

// Select the filter button
var filterButton = d3.select("#filter-btn");

// Complete the click handler for the form
filterButton.on("click", function() {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Clean tbody before updating with the filtered data
    d3.selectAll("td").remove()
  
    // Select the input element and get its value property
    var inputDateTime = d3.select("#datetime").property("value");
    var inputCity = d3.select("#city").property("value");
    var inputState = d3.select("#state").property("value");
    var inputCountry = d3.select("#country").property("value");
    var inputShape = d3.select("#shape").property("value");
  
    var filtered_tableData = tableData

    // Use the form input to filter the data by datetime
    if (inputDateTime != "") {
        var filtered_tableData = filtered_tableData.filter(function(ufo) {
            return ufo.datetime === inputDateTime;
        });
    }

    // Use the form input to filter the data by city
    if (inputCity != "") {
        var filtered_tableData = filtered_tableData.filter(function(ufo) {
            return ufo.city === inputCity;
        });
    }

    // Use the form input to filter the data by state
    if (inputState != "") {
        var filtered_tableData = filtered_tableData.filter(function(ufo) {
            return ufo.state === inputState;
        });
    }

    // Use the form input to filter the data by country
    if (inputCountry != "") {
        var filtered_tableData = filtered_tableData.filter(function(ufo) {
            return ufo.country === inputCountry;
        });
    }

    // Use the form input to filter the data by shape
    if (inputShape != "") {
        var filtered_tableData = filtered_tableData.filter(function(ufo) {
            return ufo.shape === inputShape;
        });
    }
    
    // Print results in the console
    console.log(filtered_tableData)

    // Loop Through the filtered data and update the table #ufo-table with the collected information
    filtered_tableData.forEach((ufo) => {
        var row = tbody.append("tr");
        Object.entries(ufo).forEach(([key, value]) => {
            var cell = tbody.append("td");
            cell.text(value);
        });
    });
  
  });