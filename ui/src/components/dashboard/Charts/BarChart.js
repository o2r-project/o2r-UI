import React, { Component } from 'react'
import * as d3 from 'd3'
class BarChart extends Component {
    componentDidMount() {
        const data = [2, 4, 2, 6, 8, 10, 12, 20, 6]
        this.drawBarChart(data)
    }

    drawBarChart(data) {
        const canvasHeight = 400
        const canvasWidth = 600
        const scale = d3.scaleLinear()
            .domain([0, Math.max(...data)])
            .range([0, 375]);
        const xRange= canvasWidth/data.length
        const svgCanvas = d3.select(this.refs.chart)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .style("border", "1px solid black")
        svgCanvas.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("width", xRange*0.9)
            .attr("height", (datapoint) => scale(datapoint))
            .attr("fill", "blue")
            .attr("x", (datapoint, iteration) => iteration * xRange)
            .attr("y", (datapoint) => canvasHeight - scale(datapoint))
    }

    render() {
        return (<div ref="chart"></div>)
    }
}
export default BarChart