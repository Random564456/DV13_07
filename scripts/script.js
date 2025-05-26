d3.csv("data_1/summary_FCA.csv", d3.autoType).then((data) => {
  const total = d3.sum(data, (d) => d.Count);

  const width = 350,
    height = 350,
    radius = Math.min(width, height) / 2;

  const svg = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.Category))
    .range(["#00A6D8", "#FED403", "#8da0cb"]);

  const pie = d3.pie().value((d) => d.Count);

  const arc = d3
    .arc()
    .innerRadius(40)
    .outerRadius(radius - 10);

  const arc2 = d3
    .arc()
    .innerRadius(40)
    .outerRadius(radius);

  const pieData = pie(data);

  // Draw slices
  svg
    .selectAll("path")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data.Category))
    .attr("stroke", "#fff")
    .style("stroke-width", "2px")
    .attr("id", (d) => d.data.Category);

  // Add readable labels only for visible slices
  svg
    .selectAll("text")
    .data(pieData)
    .enter()
    .append("text")
    .filter((d) => d.data.Count / total > 0.02) // only show if more than 2%
    .text(
      (d) =>
        `${parseFloat((d.data.Count / total) * 100).toFixed(
          1
        )}%`
    )
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .style("text-anchor", "middle")
    .style("font-family", "Inter")
    .style("font-size", "15px")
    .style("font-weight", "600")
    .style("fill", "#FFFFFF");


  const finesElement = document.querySelector("#Fines");
  if (finesElement) {
    // hover over
    finesElement.addEventListener("mouseover", () => {
      // Increases the size of the text in the slice
      svg
        .selectAll("text")
        .transition()
        .duration(800)
        .style("font-size", "20px");

      // Increases the size of the slice 
      svg.select('#Fines')
        .transition()
        .duration(1000)
        .attr('d', arc2)

      // Changes background colour on table 
       document.querySelectorAll("#fines-row td").forEach(td => {
        td.style.background = "rgba(0, 166, 255, 0.3)"
        td.style.fontSize = "18px";
    });

    });


    // hover off
    finesElement.addEventListener("mouseleave", () => {
      svg
        .selectAll("text")
        .transition()
        .duration(800)
        .style("font-size", "15px");
      svg.select('#Fines')
        .transition()
        .duration(1000)
        .attr('d', arc)

        document.querySelectorAll("#fines-row td").forEach(td => {
        td.style.background = ""
        td.style.fontSize = "";
    });
    });
  } else {
    console.warn("No element found with class '.Fines'");
  }

  
});
