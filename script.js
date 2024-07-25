d3.csv("global_temperature.csv").then(function(data) {
    // Parse the data
    data.forEach(d => {
      d.Year = +d.Year;
      d.Temperature = +d.Temperature;
    });
  
    // Scene 1: Introduction to global temperatures
    const scene1 = d3.select("#scene-1");
    scene1.append("h2").text("Global Temperature Rise");
    scene1.append("p").text("An overview of the rise in global temperatures over the past century.");
  
    // Scene 2: Visualization of temperature rise over decades
    const scene2 = d3.select("#scene-2");
    const margin = {top: 20, right: 30, bottom: 30, left: 40},
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;
  
    const svg = scene2.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);
  
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.Temperature), d3.max(data, d => d.Temperature)])
        .range([height, 0]);
  
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));
  
    svg.append("g")
        .call(d3.axisLeft(y));
  
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Temperature)));
  
    // Annotations for Scene 2
    svg.append("text")
        .attr("x", x(1940))
        .attr("y", y(0.5))
        .attr("class", "annotation")
        .text("Significant rise in 1940s");
  
    // Scene 3: Impact of temperature rise on different regions
    const scene3 = d3.select("#scene-3");
    scene3.append("h2").text("Impact on Different Regions");
    scene3.append("p").text("Explore the detailed data points for different regions.");
    
    // Add more visualizations and interactions for Scene 3 as needed
  
    // Add triggers and interactions for user exploration
  });
  