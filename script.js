//this became useless because i just coded it in the html... ik its bad practice im sorry :<

d3.csv("global_temperature.csv").then(function(data) {
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
  
      const monthlyTemps = [d.Jan, d.Feb, d.Mar, d.Apr, d.May, d.Jun, d.Jul, d.Aug, d.Sep, d.Oct, d.Nov, d.Dec];
      const validTemps = monthlyTemps.filter(t => !isNaN(t));
      d.AnnualAvg = d3.mean(validTemps);
    });
  
    data = data.filter(d => !isNaN(d.AnnualAvg));
  
    console.log("Parsed Data:", data); // Check the parsed data in the console
  
    const scene1 = d3.select("#scene-1");
    scene1.append("h2").text("Global Temperature Rise");
    scene1.append("p").text("An overview of the rise in global temperatures over the past century.");
  
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
  
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
  
    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(d.AnnualAvg))
        .attr("r", 3)
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html("Year: " + d.Year + "<br/>" + "Avg Temp: " + d.AnnualAvg.toFixed(2))
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition().duration(500).style("opacity", 0);
        });
  
    svg.append("text")
        .attr("x", x(1940))
        .attr("y", y(0.5))
        .attr("class", "annotation")
        .text("Significant rise in 1940s")
        .on("click", function() {
            alert("Detailed information about the 1940s temperature rise.");
        });
  
    const scene3 = d3.select("#scene-3");
    scene3.append("h2").text("Impact on Different Regions");
    scene3.append("p").text("Explore the detailed data points for different regions.");
    
    const yearSlider = document.getElementById('yearSlider');
    const yearValue = document.getElementById('yearValue');
  
    yearSlider.addEventListener('input', function() {
        yearValue.innerHTML = this.value;
        const filteredData = data.filter(d => d.Year <= this.value);
        updateChart(filteredData);
    });
  
    function updateChart(filteredData) {
        svg.select("path")
            .datum(filteredData)
            .attr("d", d3.line()
                .x(d => x(d.Year))
                .y(d => y(d.AnnualAvg)));
  
        const circles = svg.selectAll("circle")
            .data(filteredData);
  
        circles.enter().append("circle")
            .merge(circles)
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d.AnnualAvg))
            .attr("r", 3)
            .attr("fill", "steelblue");
  
        circles.exit().remove();
    }
  });
  
  document.getElementById('scene1-button').addEventListener('click', function() {
      d3.select("#scene-1").style("display", "block");
      d3.select("#scene-2").style("display", "none");
      d3.select("#scene-3").style("display", "none");
  });
  
  document.getElementById('scene2-button').addEventListener('click', function() {
      d3.select("#scene-1").style("display", "none");
      d3.select("#scene-2").style("display", "block");
      d3.select("#scene-3").style("display", "none");
  });
  
  document.getElementById('scene3-button').addEventListener('click', function() {
      d3.select("#scene-1").style("display", "none");
      d3.select("#scene-2").style("display", "none");
      d3.select("#scene-3").style("display", "block");
  });
  