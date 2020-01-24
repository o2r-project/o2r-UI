import React, { Component } from 'react'
import * as d3 from 'd3'
import './charts.css'
class PieChart extends Component {
    componentDidMount() {
        const data = [{ value: 2, label: "Reproducibility Failed"}, { value: 3, label: "Successfull" }, { value: 4, label: "Execution Failed" }]
        const timer = setTimeout(() => {
            this.drawPieChart(data)
        }, 1000);
    }

    drawPieChart(data) {
        var margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const height = this.refs.chart.clientHeight - margin.bottom - margin.top;
        const width = this.refs.chart.clientWidth - margin.left - margin.right;
        var radius = Math.min(width, height) / 2 -50
        const svg = d3.select(this.refs.chart)
            .append("svg")
            .attr("width", width - 5)
            .attr("height", height + margin.bottom + margin.top)
            .style("border", "1px solid black")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var pie = d3.pie()
            .value(function (d) { return d.value.value; })
        var data_ready = pie(d3.entries(data))

        console.log(data_ready)
        const color = d3.scaleLinear()
            .domain([d3.min(data_ready, (d) => { return d.data.key }), d3.mean(data_ready, (d) => { return d.data.key }), d3.max(data_ready, (d) => { return d.data.key })])
            .range([d3.rgb(51, 153, 255), d3.rgb(0, 102, 255), d3.rgb(0, 0, 153)]);

        let total =0 ;
        data.map(d =>{
            total += d.value;
        })

        const arc = d3.arc()
            .innerRadius(radius*0.4)
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
            .attr("transform", function (d) {
                console.log(d)
                var _d = arc.centroid(d);
                _d[0];	//multiply by a constant factor
                _d[1];	//multiply by a constant factor
                return "translate(" + _d + ")";
            })
            .attr("dy", ".50em")
            .style("text-anchor", "middle")
            .style("background-color", "black")
            .style("fill", "white")
            .text(function (d) {
                return ((d.value/total *100).toFixed(1) + "%");
            });

        svg.selectAll("g")
            .data(data_ready)
            .enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr('font-size', '4em')
            .attr('y', 20)
            .text(total);

        svg.append("text")
            .attr("x", 0)
            .attr("y", (0 - height / 3))
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("text-decoration", "underline")
            .text(this.props.title);

        // again rebind for legend
        var legendG = svg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
            .data(pie(data))
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(" + (0 -width/8)  + "," + (i * 15 + radius +20) + ")"; // place each legend on the right and bump each one down 15 pixels
            })
            .attr("class", "legend");

        legendG.append("rect") // make a matching color rect
            .data(data_ready)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", function (d, i) {
                return color(d.data.key);
            });

        legendG.append("text") // add the text
            .data(data_ready)
            .text(function (d) {
                return d.data.value.label + "  ";
            })
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);
    }

    render() {
        return (<div class="chart" style={{ minWidth: "100%", minHeight: "100%" }} ref="chart"></div>)
    }
}
export default PieChart