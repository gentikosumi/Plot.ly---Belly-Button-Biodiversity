
// Function to pull names from json file and add them in the filter




var drawChart = function(x_data, y_data, hoverText, metadata) {


    var metadata_panel = d3.select("#sample-metadata");
    metadata_panel.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        metadata_panel.append("p").text(`${key}: ${value}`);
    });
  
    var trace = {
        x: y_data.slice(0,10),
        y: x_data.slice(0,10),
        text: hoverText.slice(0,10),
        type: 'bar',
        orientation: 'h'
    };
  
    var data = [trace];

    var layout = 
  
    Plotly.newPlot('bar', data);
  
    var trace2 = {
        x: x_data,
        y: y_data,
        text: hoverText,
        mode: 'markers',
        marker: {
            size: y_data,
            color: x_data,
            colorscale: "Earth"
        }
    };
    var layout = {
        showlegend: false,
        height: 600,
        width: 1200
      };
  
    var data2 = [trace2];
  
    Plotly.newPlot('bubble', data2, layout);
  
  

  // BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);
  // Enter a speed between 0 and 180
  var level = data.WFREQ;

  // Trig to calc meter point
  var degrees = 180 - (level*20),
       radius = .7;
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
  
  var data = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'},
    { values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
    rotation: 90,
    text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
              '1-2', '0-1', ''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['#84B589','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                           'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                           '#F4F1E4','#F8F3EC', 'rgba(255, 255, 255, 0)',]},
    labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
    '1-2', '0-1', ''],
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

    title: 'Belly Button Wash Frequency',
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };
  Plotly.newPlot('gauge', data, layout);

}
  
  var populateDropdown = function(names) {
  
    var selectTag = d3.select("#selDataset");
    var options = selectTag.selectAll('option').data(names);
  
    options.enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });
  
  };
  
  var optionChanged = function(newValue) {
  
    d3.json("data/samples.json").then(function(data) {
  
    sample_new = data["samples"].filter(function(sample) {
  
        return sample.id == newValue;
  
    });
    
    metadata_new = data["metadata"].filter(function(metadata) {
  
        return metadata.id == newValue;
  
    });
    
    
    x_data = sample_new[0]["otu_ids"];
    // x_data = xRandomData.sort((v1,v2)=>v2.xRandomData-v1.xRandomData);
    
    y_data = sample_new[0]["sample_values"];
    // y_data = yRandomData.sort((v1,v2)=>v2.yRandomData-v1.yRandomData);

    hoverText = sample_new[0]["otu_labels"];
    
    // console.log(data);
    // console.log(sample);
    // console.log(metadata);



    console.log(x_data);
    console.log(y_data);
    console.log(hoverText);
    
    drawChart(x_data, y_data, hoverText, metadata_new[0]);
    });
  };
  
  d3.json("data/samples.json").then(function(data) {
  
    //Populate dropdown with names
    populateDropdown(data["names"]);
  
    //Populate the page with the first value
    x_data = data["samples"][0]["otu_ids"];
    y_data = data["samples"][0]["sample_values"];
    hoverText = data["samples"][0]["otu_labels"];
    metadata = data["metadata"][0];
  
    //Draw the chart on load
    drawChart(x_data, y_data, hoverText, metadata);
  
  
  });
