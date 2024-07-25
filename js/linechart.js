const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3.select("#line-chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// time parsers/formatters
const parseTime = d3.timeParse("%Y");
const formatTime = d3.timeFormat("%Y");
// for tooltip
const bisectDate = d3.bisector(d => d.year).left;

// add the line for the first time
g.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-width", "3px");

// axis labels
const xLabel = g.append("text")
  .attr("class", "x axisLabel")
  .attr("y", HEIGHT + 50)
  .attr("x", WIDTH / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Time");
const yLabel = g.append("text")
  .attr("class", "y axisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -75)
  .attr("x", -150)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Value");

// scales
const x = d3.scaleTime().range([0, WIDTH]);
const y = d3.scaleLinear().range([HEIGHT, 0]);

// axis generators
const xAxisCall = d3.axisBottom();
const yAxisCall = d3.axisLeft().ticks(6);

// axis groups
const xAxis = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);
const yAxis = g.append("g")
  .attr("class", "y axis");

// event listeners
$("#Country-select").on("change", update2);
$("#var-select").on("change", update2);

// add jQuery UI slider
$("#date-line").slider({
  range: true,
  max: parseTime("2022").getTime(),
  min: parseTime("1980").getTime(),
  step: 31536000, // one year
  values: [
    parseTime("1980").getTime(),
    parseTime("2022").getTime()
  ],
  slide: (event, ui) => {
    $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
    $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
    update2();
  }
});

// Load and prepare data
let filteredData = {};

d3.json("data/data1.json").then(data => {
  data.forEach(item => {
    if (!filteredData[item.Country]) {
      filteredData[item.Country] = [];
    }

    Object.keys(item).forEach(key => {
      if (key.startsWith("F") && key.length === 5) {
        let year = key.slice(1);
        let value = item[key];

        if (value !== null) {
          filteredData[item.Country].push({
            year: parseTime(year),
            value: Number(value)
          });
        }
      }
    });
  });

  // run the visualization for the first time
  update2();
});

// Update function
function update2() {
  const t = d3.transition().duration(1000);

  // filter data based on selections
  const Country = $("#Country-select").val();
  const sliderValues = $("#date-line").slider("values");
  const dataTimeFiltered = filteredData[Country].filter(d => {
    return (d.year >= sliderValues[0] && d.year <= sliderValues[1]);
  });

  // update scales
  x.domain(d3.extent(dataTimeFiltered, d => d.year));
  y.domain([d3.min(dataTimeFiltered, d => d.value), d3.max(dataTimeFiltered, d => d.value)]);

  // update axes
  xAxisCall.scale(x);
  xAxis.transition(t).call(xAxisCall);
  yAxisCall.scale(y);
  yAxis.transition(t).call(yAxisCall);

  // clear old tooltips
  d3.select(".focus").remove();
  d3.select(".overlay").remove();

  /******************************** Tooltip Code ********************************/

  const focus = g.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", HEIGHT);

  focus.append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", WIDTH);

  focus.append("circle")
    .attr("r", 7.5);

  focus.append("text")
    .attr("x", 15)
    .attr("dy", ".31em");

  g.append("rect")
    .attr("class", "overlay")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove);

  drawAnnotation3();

  function mousemove() {
    const x0 = x.invert(d3.mouse(this)[0]);
    const i = bisectDate(dataTimeFiltered, x0, 1);
    const d0 = dataTimeFiltered[i - 1];
    const d1 = dataTimeFiltered[i];
    const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr("transform", `translate(${x(d.year)}, ${y(d.value)})`);
    focus.select("text").text(d.value);
    focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.value));
    focus.select(".y-hover-line").attr("x2", -x(d.year));
  }

  function drawAnnotation3() {
    const annotation = svg.append('g');
    annotation.append('text')
      .attr('x', 10)
      .attr('y', 20)
      .classed('annotation', true)
      .text('Which country will have a better performance in the future?');
    annotation.append('line')
      .attr('x1', 400)
      .attr('x2', 700)
      .attr('y1', 20)
      .attr('y2', 50)
      .classed('annotation', true);
  }

  /******************************** Tooltip Code ********************************/

  // Path generator
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value));

  // Update our line path
  g.select(".line")
    .transition(t)
    .attr("d", line(dataTimeFiltered));

  // Update y-axis label
  yLabel.text("Value");
}
