import React, { useEffect, useRef } from "react";
import * as d3 from "d3";



const getMax = (ampliconObj) => {
  let values = ampliconObj.map((o) => d3.max(o.coverage));

  return [d3.max(values)];
};

const AmpPlot = ({ amplicons, labels }) => {
  const height = 400;
  const width = 800;
  const margin = 100;
  const svgRef = useRef();


  // amplicons = ampliconsRand
  const indexList = labels ? labels :  Array.from({ length: amplicons[0].coverage.length }, (ele, index) =>
  (index).toString())
  

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const plotHeight = height - margin;
    const plotWidth = width - margin;
    const maxCoverage = getMax(amplicons);
    // Create X scale
    const xScale = d3
      .scaleBand()
      .range([margin, plotWidth])
      .domain(indexList)
      .padding(0.05);

    // Create Y scale

    const yScale = d3
      .scaleBand()
      .range([plotHeight, 0])
      .domain(amplicons.map((ele) => ele.name))
      .padding(0.05);

    // Create coverage scale

    const covScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateInferno)
      .domain([0, maxCoverage]);

    let ampl = amplicons.map((ele) =>
      ele.coverage.map((cov, index) => ({
        name: ele.name,
        index: indexList[index],
        cov,
      }))
    );
    ampl = ampl.reduce(
      (previousValue, currentValue) => previousValue.concat(currentValue),
      []
    );
    svg.selectAll("rect").remove();

    svg
      .selectAll("rect")
      .data(ampl, function (d) {
        return d.index + ":" + d.name;
      })
      .join("rect")
      .attr("x", function (d) {
        return xScale(d.index);
      })
      .attr("y", function (d) {
        return yScale(d.name);
      })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", function (d) {
        return covScale(d.cov);
      })
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8);

    const xAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(function(d,i){ return !(i%5)}));;
    svg
      .select(".x-axis")
      .style("transform", `translateY(${plotHeight}px)`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-90) translate(0, -5)")
    .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

      
    const yAxis = d3.axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${margin}px)`)
      .call(yAxis);

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + margin /2  + " ," + (plotHeight + 60) + ")"
      )
      .style("text-anchor", "middle")
      .text("Amplicon");
  }, [amplicons]);

  return (
    <div>
      <svg ref={svgRef} height={height} width={width} overflow="visible">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br />
    </div>
  );
};

export default AmpPlot;
