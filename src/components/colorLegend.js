export const colorLegend = (selection, props) => {
  const { covScale, circleRadius, spacing, textOffset, maxCoverage } = props;

  const groups = selection
    .selectAll("g")
    .data([
      0,
      maxCoverage * 0.25,
      maxCoverage * 0.5,
      maxCoverage * 0.75,
      maxCoverage,
    ]);
  const groupsEnter = groups.enter().append("g").attr("class", "tick");
  groupsEnter
    .merge(groups)
    .attr("transform", (d, i) => `translate(0, ${i * spacing})`);
  groups.exit().remove();

  groupsEnter
    .append("circle")
    .merge(groups.select("circle"))
    .attr("r", circleRadius)
    .attr("fill", covScale);
  console.log(maxCoverage);
  groupsEnter
    .append("text")
    .merge(groups.select("text"))
    .text((d) => `${Math.round(d * 100)}%`)
    .attr("dy", "0.32em")
    .attr("x", textOffset);
};
