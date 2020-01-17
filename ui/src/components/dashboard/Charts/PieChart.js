import React, { Component } from 'react'
import * as d3 from 'd3'
class PieChart extends Component {
    componentDidMount() {
        const data = [{ value: 2, label: new Date(2019, 5) }, { value: 3, label: new Date(2019, 6) }, { value: 4, label: new Date(2019, 7) }, { value: 5, label: new Date(2019, 8) }, { value: 8, label: new Date(2019, 9) }, { value: 7, label: new Date(2019, 10) }, { value: 3, label: new Date(2019, 11) }, { value: 20, label: new Date(2020, 0) }]
        this.drawPieChart(data)
    }

    drawPieChart(data) {
        var margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const height = 400 - margin.left - margin.right
        const width = 600 - margin.bottom - margin.top;
        var radius = Math.min(width, height) / 2 - 70
        const svg= d3.select(this.refs.chart)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
            .style("border", "1px solid black")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        const color = d3.scaleLinear()
            .domain([d3.min(data, (d) => { return d.value }), d3.mean(data, (d) => { return d.value }), d3.max(data, (d) => { return d.value })])
            .range(["lightblue", "blue", "darkblue"]);

        var pie = d3.pie()
            .value(function (d) { console.log(d); return d.value.value; })
        var data_ready = pie(d3.entries(data))

        console.log(data_ready)

        const arc = d3.arc()
        .innerRadius(70)
        .outerRadius(radius)
    

        svg.selectAll('whatever')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function (d) { return (color(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        svg.selectAll("g")
            .data(data_ready)
            .enter()
            .append("text")
            .attr("transform", function(d) {
            console.log(d)
            var _d = arc.centroid(d);
            _d[0] *= 1.5;	//multiply by a constant factor
            _d[1] *= 1.5;	//multiply by a constant factor
            return "translate(" + _d + ")";
          })
          .attr("dy", ".50em")
          .style("text-anchor", "middle")
          .text(function(d) {
            return d.value;
          });
            
        svg.selectAll("g")
        .data(data_ready)
        .enter()
        .append("text")
           .attr("text-anchor", "middle")
             .attr('font-size', '4em')
             .attr('y', 20)
           .text(data.length);
    }

    render() {
        return (<div ref="chart"></div>)
    }
}
export default PieChart