import { useEffect, useRef, React } from "react"
import {select, scaleLinear, scaleLog, axisBottom, axisLeft,  line, max,  curveCardinal } from 'd3'


function Covplot({coverage}){
    const height = 500; 
    const width = 700; 
    const svgRef = useRef();
    console.log(coverage);
    useEffect(() => {
        const svg = select(svgRef.current);
            
        const margin = 50; 
        const plotHeight = height - margin; 
        const plotWidth = width - margin; 
        const xScale = scaleLinear()
             .domain([0, coverage.length])
             .range([margin, plotWidth]);
        const yScale = scaleLinear()
             .domain([0, max(coverage)])
             .range([0, plotHeight]);
        const xAxis = axisBottom(xScale);
        const yAxis = axisLeft(yScale);
        const myLine = line()
            .x((value, index) =>   xScale(index))
            .y(yScale)
            .curve(curveCardinal);
        svg.selectAll("path")
           .data([coverage])
           .join("path")
           .attr("d", value => myLine(value))
           .attr("fill", "none")
           .attr("stroke", "blue");
        svg.append("text")             
           .attr("transform",
                 "translate(" + (width/2) + " ," + 
                                (height) + ")")
           .style("text-anchor", "middle")
           .text("Genome position");
        svg.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", height /2 )
           .attr("x", 200 )
           .attr("dy", "1em")
           .style("text-anchor", "middle")
           .text("Coverage (X)");  
        svg.select(".x-axis").style("transform", "translateY("+ plotHeight + "px)").call(xAxis)
        svg.select(".y-axis").style("transform", "translateX("+ margin + "px)").call(yAxis)

      }, [coverage]);
        

    return (
        <div>
        {coverage.length}
        <svg ref={svgRef} height={height} width={width} overflow="visible">
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
        <br />

        </div>
    )


}

export default Covplot;