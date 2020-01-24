import React, { Component } from 'react'
import * as d3 from 'd3'
import './charts.css'
class LineChart extends Component {
    componentDidMount() {
        const data = [{ value: 2, label: new Date(2019, 5) }, { value: 3, label: new Date(2019, 6) }, { value: 4, label: new Date(2019, 7) }, { value: 5, label: new Date(2019, 8) }, { value: 8, label: new Date(2019, 9) }, { value: 7, label: new Date(2019, 10) }, { value: 3, label: new Date(2019, 11) }, { value: 20, label: new Date(2020, 0) }]
        const timer = setTimeout(() => {
            this.drawLineChart(data)
          }, 1000); 
    }

    drawLineChart(data) {
        console.log(this.refs.chart.clientHeight)
        var margin = { top: 20, right: 20, bottom: 20, left: 25 };
        const  height = this.refs.chart.clientHeight -margin.bottom -margin.top;
        const width = this.refs.chart.clientWidth -margin.left -margin.right;
        const svg = d3.select(this.refs.chart)
            .append("svg")
            .attr("width", width + 40)
            .attr("height", height + margin.bottom + margin.top)
            .style("border", "1px solid black")

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d) => { return d.value })])
            .range([height, margin.top]);

        var extent = d3.extent(data, function (d) { return d.label; })
        var max = extent[1]; // get the maximum date in the domain

        var newMax = new Date(max)
        newMax = new Date(newMax.setMonth(newMax.getMonth() + 1));
        extent[1] = newMax;

        const xScale = d3.scaleTime()
            .domain(extent)
            .rangeRound([margin.left, (width)])

        const xAxis = d3.axisBottom(xScale).ticks(d3.timeMonth.every(1))
        const yAxis = d3.axisLeft(yScale).ticks(4)

        var valueline = d3.line()
            .x(function (d) { console.log(xScale(d.value)); return xScale(d.label); })
            .y(function (d) { console.log(yScale(d.label)); return yScale(d.value); })

        svg.append("g").call(xAxis).attr("transform", "translate (0, " + height + ")");
        svg.append("g").call(yAxis).attr("transform", "translate(" + margin.left + ",0)");

        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);


    }

    render() {
        return (<div id={"g2"} style={{minWidth: "100%", minHeight: "100%"}} class="chart" ref="chart"></div>)
    }
}
export default LineChart