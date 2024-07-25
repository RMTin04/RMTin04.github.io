d3.csv("global_temperature.csv").then(function(data) {
    // Parse the data and compute annual averages
    data.forEach(d => {
      d.Year = +d.Year;
      d.Jan = +d.Jan;
      d.Feb = +d.Feb;
      d.Mar = +d.Mar;
      d.Apr = +d.Apr;
      d.May = +d.May;
      d.Jun = +d.Jun;
      d.Jul = +d.Jul;
      d.Aug = +d.Aug;
      d.Sep = +d.Sep;
      d.Oct = +d.Oct;
      d.Nov = +d.Nov;
      d.Dec = +d.Dec;
  
      // Calculate annual average, ignoring NaN values
      const monthlyTemps = [d.Jan, d.Feb, d.Mar, d.Apr, d.May, d.Jun, d.Jul, d.Aug, d.Sep, d.Oct, d.Nov, d.Dec];
      const validTemps = monthlyTemps.filter(t => !isNaN(t));
      d.AnnualAvg = d3.mean(validTemps);
    });
  
    // Filter out rows with missing data
    data = data.filter(d => !isNaN(d.AnnualAvg));
  
    console.log("Parsed Data:", data); // Check the parsed data in the console
  
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
        .domain([d3.min(data, d => d.AnnualAvg), d3.max(data, d => d.AnnualAvg)])
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
            .y(d => y(d.AnnualAvg)));
  
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
  