import React, { useEffect, useRef, useState } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  axisLeft,
  max,
  scaleSequential,
  interpolateInferno,
} from "d3";

const randomCoverageArray = () => {
  return Array.from({ length: 97 }, () => Math.floor(Math.random() * 1000));
};

const getMax = (ampliconObj) => {
  let values = ampliconObj.map((o) => max(o.coverage));

  return [max(values)];
};

const AmpPlot = ({ amplicons }) => {
  const height = 400;
  const width = 800;
  const margin = 100;
  const svgRef = useRef();
  // const ampliconsRand = [
  //   { name: "1.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "2.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "3.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "4.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "5.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "6.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "7.mapped.bam", coverage: randomCoverageArray() },
  //   { name: "8.mapped.bam", coverage: randomCoverageArray() },
  // ];

  console.log(" Real amplicons", amplicons);
  const indexList = Array.from({ length: 97 }, (ele, index) =>
    (index + 1).toString()
  );
  const maxIndex = 97;
  const maxValue = amplicons.length;
  //  const maxCoverage = getMax(amplicons);
  const maxCoverage = 1;

  useEffect(() => {
    const svg = select(svgRef.current);
    const plotHeight = height - margin;
    const plotWidth = width - margin;

    // Create X scale
    const xScale = scaleBand()
      .range([margin, plotWidth])
      .domain(indexList)
      .padding(0.05);

    // Create Y scale

    const yScale = scaleBand()
      .range([plotHeight, 0])
      .domain(amplicons.map((ele) => ele.name))
      .padding(0.05);

    // Create coverage scale

    const covScale = scaleSequential()
      .interpolator(interpolateInferno)
      .domain([0, maxCoverage]);

    console.log(amplicons);
    let ampl = amplicons.map((ele) =>
      ele.coverage.map((cov, index) => ({
        name: ele.name,
        index: index.toString(),
        cov,
      }))
    );
    ampl = ampl.reduce(
      (previousValue, currentValue) => previousValue.concat(currentValue),
      []
    );

    console.log("AMPLS", ampl);
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

    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${plotHeight}px)`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-90)");
    const yAxis = axisLeft(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${margin}px)`)
      .call(yAxis);

    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + plotWidth / 2 + " ," + (plotHeight + 60) + ")"
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