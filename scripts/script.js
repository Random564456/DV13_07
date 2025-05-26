d3.csv("data/summary_FCA.csv", d3.autoType).then(data => {
  const total = d3.sum(data, d => d.Count);

  const width = 400, height = 400, radius = Math.min(width, height) / 2;

  const svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.Category))
    .range(["#66c2a5", "#fc8d62", "#8da0cb"]);

  const pie = d3.pie()
    .value(d => d.Count);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius - 10);

  const pieData = pie(data);

  // Draw slices
  svg.selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.Category))
    .attr("stroke", "#fff")
    .style("stroke-width", "2px");

  // Add readable labels only for visible slices
  svg.selectAll("text")
    .data(pieData)
    .enter()
    .append("text")
    .filter(d => (d.data.Count / total) > 0.02) // only show if more than 2%
    .text(d => `${d.data.Category} (${Math.round((d.data.Count / total) * 100)}%)`)
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#000");
});
