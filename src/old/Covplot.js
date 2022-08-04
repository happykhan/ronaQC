import { useEffect, useRef, React, useState } from "react";
import {
  select,
  scaleLinear,
  axisBottom,
  axisLeft,
  line,
  max,
  curveCardinal,
  zoom,
  zoomTransform,
} from "d3";

function Covplot({ coverage }) {
  const height = 500;
  const width = 700;
  const svgRef = useRef();
  const [currentZoomState, setCurrentZoomState] = useState();

  useEffect(() => {
    const svg = select(svgRef.current);

    const margin = 50;
    const plotHeight = height - margin;
    const plotWidth = width - margin;
    // Scales and line generator
    const xScale = scaleLinear()
      .domain([0, coverage.length - 1])
      .range([margin, plotWidth]);
    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }

    const yScale = scaleLinear()
      .domain([0, max(coverage)])
      .range([plotHeight, margin])
      .nice();
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);
    const lineGenerator = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll("path")
      .data([coverage])
      .join("path")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "blue");
    svg
      .append("text")
      .attr("transform", "translate(" + width / 2 + " ," + (height - 10) + ")")
      .style("text-anchor", "middle")
      .text("Genome position");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", height / 2)
      .attr("x", 200)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Coverage (X)");
    svg
      .select(".x-axis")
      .style("transform", "translateY(" + plotHeight + "px)")
      .call(xAxis);
    svg
      .select(".y-axis")
      .style("transform", "translateX(" + margin + "px)")
      .call(yAxis);

    // zoom
    const zoomBehaviour = zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([0, 0], [plotWidth, plotHeight])
      .on("zoom", () => {
        const zoomState = zoomTransform(svg.node());
        //  setCurrentZoomState(zoomState);
      });
    svg.call(zoomBehaviour);
  }, [currentZoomState, coverage]);

  return (
    <div>
      <svg ref={svgRef} height={height} width={width} overflow="visible">
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br />
    </div>
  );
}

export default Covplot;
