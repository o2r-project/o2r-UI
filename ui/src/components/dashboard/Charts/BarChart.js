import React, { Component } from 'react'
import * as d3 from 'd3'
import './charts.css'
class BarChart extends Component {
    componentDidMount() {
       
        const data = [{ value: 2, label: new Date(2019, 5) }, { value: 3, label: new Date(2019, 6) }, { value: 4, label: new Date(2019, 7) }, { value: 5, label: new Date(2019, 8) }, { value: 8, label: new Date(2019, 9) }, { value: 7, label: new Date(2019, 10) }, { value: 3, label: new Date(2019, 11) }, { value: 20, label: new Date(2020, 0) }]
        const timer = setTimeout(() => {
            this.drawBarChart(data)
          }, 1000); 
    }



    drawBarChart(data) {
        var margin = { top: 20, right: 20, bottom: 20, left: 25 };
        const canvasHeight = this.refs.chart.clientHeight -margin.bottom -margin.top;
        const canvasWidth = this.refs.chart.clientWidth - margin.bottom - margin.top;
        const width = canvasWidth / (data.length + 1) * 0.9;

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => { return d.value })])
            .range([canvasHeight, margin.top]);



        var extent = d3.extent(data, function (d) { return d.label; })
        var max = extent[1]; // get the maximum date in the domain

        var newMax = new Date(max)
        newMax = new Date(newMax.setMonth(newMax.getMonth() + 1));
        extent[1] = newMax;

        const xScale = d3.scaleTime()
            .domain(extent)
            .rangeRound([margin.left, (canvasWidth)])

        const color = d3.scaleLinear()
            .domain([d3.min(data, (d) => { return d.value }), d3.mean(data, (d) => { return d.value }), d3.max(data, (d) => { return d.value })])
            .range(["lightblue", "blue", "darkblue"]);
        const svgCanvas = d3.select(this.refs.chart)
            .append("svg")
            .attr("width", canvasWidth + 35)
            .attr("height", canvasHeight + margin.bottom + margin.top)
            .style("border", "1px solid black")
        svgCanvas.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("width", width)
            .attr("height", (datapoint) => canvasHeight - yScale(datapoint.value))
            .attr("fill", (d) => color(d.value))
            .attr("x", (datapoint) => { console.log(datapoint); return xScale(new Date(datapoint.label)) })
            .attr("y", (datapoint) => yScale(datapoint.value))
            .on("mouseover", function (d) {
                d3.select(this).style("fill", "red")
                    .append("svg:title")
                    .text((d) => { return d.value });
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", (d) => color(d.value));
            });

        svgCanvas.selectAll(".text")
            .data(data)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("class", "label")
            .attr("x", (function (d) { return (xScale(new Date(d.label)) + width / 2) }))
            .attr("y", (function (d) { return yScale(d.value) + 10; }))
            .attr("dy", ".75em")
            .text(function (d) { return d.value; });

        const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(1))
        const yAxis = d3.axisLeft(yScale).ticks(4)
        svgCanvas.append("g")
            .call(xAxis)
            .attr("transform", "translate(0," + canvasHeight + ")")

        svgCanvas.append("g")
            .call(yAxis)
            .attr("transform", "translate(" + margin.left + ",0)")

    }

    render() {
        return (<div id={"g1"} style={{minWidth: "100%", minHeight: "100%"}} class="chart" ref="chart"></div>)
    }
}
export default BarChart