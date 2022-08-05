import React, { useEffect, useRef, useState } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  axisLeft,
  line,
  max,
  curveCardinal,
  zoom,
  zoomTransform,
  scaleLinear,
  maxIndex,
} from "d3";
import { ConstructionOutlined } from "@mui/icons-material";

const getCovAve = (coverage, perChunk = 100) => {
  const result = coverage.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);

  let ave = result.map((arr) => {
    return arr.reduce((partialSum, a) => partialSum + a, 0);
  });

  ave = ave.map((val, index) => {
    return { i: perChunk * index, val: val / perChunk };
  });
  return ave;
};

const getMax = (coverageObj) => {
  let index = coverageObj.map((o) => o.i);
  let values = coverageObj.map((o) => o.val);

  return [max(index), max(values)];
};

const Covplot = ({ coverage }) => {
  const height = 400;
  const width = 600;
  const margin = 50;
  const chunksize = 500;
  const svgRef = useRef();
  const coverageRand = Array.from({ length: 30000 }, () =>
    Math.floor(Math.random() * 1000)
  );
  const covAve = getCovAve(coverage, chunksize);
  const [maxIndex, maxValue] = getMax(covAve);
  useEffect(() => {
    const svg = select(svgRef.current);
    const plotHeight = height - margin;
    const plotWidth = width - margin;
    const xScale = scaleLinear()
      .domain([0, maxIndex])
      .range([margin, plotWidth])
      .nice();
    const yScale = scaleLinear()
      .domain([0, maxValue])
      .range([plotHeight, 0])
      .nice();

    svg
      .selectAll(".rect")
      .data(covAve)
      .join("rect")
      .attr("x", (row) => xScale(row.i))
      .attr("y", (row) => yScale(row.val))
      .attr("width", 5)
      .attr("height", 5)
      .attr("stroke", "black")
      .attr("fill", "#69a2b2");
    svg
      .append("rect")
      .attr("x", margin)
      .attr("y", yScale(10))
      .attr("width", plotWidth - margin)
      .attr("height", 0.5)
      .attr("stroke", "red")
      .attr("fill", "red");
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${plotHeight}px)`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
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
      .text("Genome location");
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + margin / 4 + " ," + plotHeight / 2 + ") rotate(-90)"
      )
      .style("text-anchor", "middle")
      .text("Coverage");
  }, [coverageRand]);

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

export default Covplot;
