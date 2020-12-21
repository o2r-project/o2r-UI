import React, { Component } from "react";

import httpRequests from '../../helpers/httpRequests';
import { Button, Slider, FormControlLabel, Checkbox, Grid, Paper, TextField, LinearProgress} from '@material-ui/core';
import L from 'leaflet'
import prepareQuery from './/queryBuilder'
import OwnMap, { ref, ref2 } from "./Map"
import ResultList from './resultList'

import './discovery.css'


class Discovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ERC: [],
            expanded: null,
            keyword: null,
            libraries: null,
            search: null,
            erc: 0,
            marks: [],
            from: null,
            to: null,
            temporal: [],
        }
    }

    componentDidMount() { this.searchCompendia(); this.calculateDateRange() }

    calculateDateRange = () => {
        const result = []
        const self = this
        httpRequests.complexSearch(prepareQuery())
            .then(function (res) {

                for (var erc of res.data.hits.hits) {
                    result.push(erc._source)
                }
                let min;
                let max;
                if (result.length > 0) {
                    min = new Date(result[0].metadata.o2r.temporal.begin);
                    max = new Date(result[0].metadata.o2r.temporal.end);
                }
                else {
                    let date = new Date("2020-3-2")
                    max = new Date(date)
                    date.setFullYear(date.getUTCFullYear() - 5)
                    min = new Date(date)
                }

                for (var date of result) {
                    if (date.metadata && !(date.metadata.o2r.temporal.begin === null)) {
                        var tmp_begin = new Date(date.metadata.o2r.temporal.begin);
                        var tmp_bg_year = JSON.parse(tmp_begin.getUTCFullYear());
                        var tmp_bg_month = JSON.parse(tmp_begin.getUTCMonth() + 1);
                        if (tmp_bg_month.length === 1) tmp_bg_month = '0' + tmp_bg_month;
                        tmp_begin = new Date(tmp_bg_year + '-' + tmp_bg_month);

                        var tmp_end = new Date(date.metadata.o2r.temporal.end);
                        var tmp_en_year = JSON.parse(tmp_end.getUTCFullYear());
                        var tmp_en_month = JSON.parse(tmp_end.getUTCMonth() + 2);
                        if (tmp_en_month.length === 1) tmp_en_month = '0' + tmp_en_month;
                        tmp_end = new Date(tmp_en_year + '-' + tmp_en_month);

                        if (tmp_begin < min) min = tmp_begin;
                        if (tmp_end > max) max = tmp_end;

                    }
                }
                self.calculateMarks(min, max)
            });
    }




    searchCompendia = () => {
        this.setState({ open: true })
        const self = this;
        httpRequests.complexSearch(prepareQuery(this.state.keyword, this.state.coordinates, this.state.from, this.state.to, null, null, this.state.libraries))
            .then(function (res) {
                console.log(res)
                const result = []
                for (var erc of res.data.hits.hits) {
                    result.push(erc._source)
                }
                self.setState({ ERC: result, open: false });
            })
            .catch(function (res) {
                console.log(res)
            })
    }

    calculateMarks = (min, max) => {
        const marks = []
        let steps = (max.getUTCFullYear() - min.getUTCFullYear()) / 5 + 1;
        const labels = min.getUTCMonth();
        console.log(labels)
        let minDate = new Date(min)
        let changeDate = new Date(minDate)
        let maxDate = new Date(max)
        const maxDate2 = new Date(maxDate)
        maxDate.setUTCMonth(maxDate.getUTCMonth() - 1);
        marks.push({ value: minDate.getTime(), label: (minDate.getUTCMonth() + 1) + "/" + minDate.getUTCFullYear() })
        while (changeDate < maxDate) {
            // always use first of month for slider
            changeDate.setUTCMonth(changeDate.getUTCMonth() + steps);

            const date = new Date(changeDate).getTime()
            const mark = { value: date }
            if (changeDate.getUTCMonth() === labels) {
                mark.label = (changeDate.getUTCMonth() + 1) + "/" + changeDate.getUTCFullYear()
            }
            marks.push(mark);
        }
        marks.push({ value: maxDate2.getTime(), label: (maxDate2.getUTCMonth() + 1) + "/" + maxDate2.getUTCFullYear() })
        this.setState({ marks, temporal: [minDate.getTime(), maxDate2.getTime()] })
    }

    handleChange = async (e, name, search) => {
        const value = name === "libraries" ? e.target.checked : e.target.value
        if (this.state[name] === value) return;
        this.setState({
            [name]: value
        }, () => { if (search) { this.searchCompendia() } })
    }

    handleSliderChange = (e, value) => {
        if (this.state.temporal === value) return;
        this.setState({
            temporal: value,
            from: new Date(value[0]),
            to: new Date(value[1])
        }, () => { this.searchCompendia() })
    }

    setPropsState = (state, result, search) => {
        this.setState({ [state]: result }, () => { if (search) { this.searchCompendia() } })
    }

    setGeojson = async (bbox) => {

        const GeoJSON = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                bbox[0],
                                bbox[1],
                                bbox[2],
                                bbox[3],
                                bbox[0],
                            ]
                        ]
                    }
                }
            ]
        }

        let leafletGeoJSON = new L.GeoJSON(GeoJSON);
        let leafletFG = ref.leafletElement;
        leafletFG.clearLayers()
        leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
        var northeast = [GeoJSON.features[0].geometry.coordinates[0][0][1], GeoJSON.features[0].geometry.coordinates[0][0][0]]
        var southwest = [GeoJSON.features[0].geometry.coordinates[0][2][1], GeoJSON.features[0].geometry.coordinates[0][2][0]]
        ref2.fitBounds([northeast, southwest])
        this.setState({ coordinates: GeoJSON.features[0].geometry, drawn: true }, () => this.searchCompendia());
    }

    handleSearch = async () => {
        const query = this.state.search
        const self = this;
        try {
            httpRequests.geocodingRequest(query)
                .then(function (res) {
                    console.log(res)
                    const resultBBox = res.data.features[0].bbox
                    if (!resultBBox) { alert("No result found"); return; }
                    const bbox = []
                    bbox.push([resultBBox[2], resultBBox[3]])
                    bbox.push([resultBBox[2], resultBBox[1]])
                    bbox.push([resultBBox[0], resultBBox[1]])
                    bbox.push([resultBBox[0], resultBBox[3]])
                    self.setGeojson(bbox)
                })
        }
        catch (err) { console.log(err) }
    }

    handleGeoJsonWorld = () => {
        const bbox = [
            [180, 180],
            [180, -180],
            [-180, -180],
            [-180, 180],
        ]
        this.setGeojson(bbox)
    }

    goToErc = (erc) => {
        this.props.history.push({
            pathname: '/erc/' + erc.compendium_id,
            state: { data: erc.metadata.o2r }
        });
    }

    valuetext = (value) => {
        const date = new Date(value)
        const text = date.getUTCMonth() + 1 + '/' + date.getUTCFullYear()
        return text;
    }

    handleReset = () => {
        this.setState({
            coordinates: null,
            drawn: false,
            search: "",
            keyword: "",
            libraries: false,
            from: null,
            to: null,
            temporal: [this.state.marks[0].value, this.state.marks[this.state.marks.length - 1].value]
        }, () => this.searchCompendia())
        let leafletFG = ref.leafletElement;
        leafletFG.clearLayers()
        ref2.fitBounds([[-180, -90], [180, 90]])
    }

    render() {
        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={8} >
                        <Paper>
                            <div style={{ padding: "50px", paddingTop: "0px" }}>
                                <Button onClick={this.handleReset.bind(null)}
                                    style={{ "margin": "10px", float: "right" }}
                                    type="button"
                                    variant="contained"
                                    color="primary">
                                    Clear Search
                                </Button>
                                <TextField
                                    type="search"
                                    label="Keyword Search"
                                    fullWidth
                                    value={this.state.keyword}
                                    onChange={(e) => this.handleChange(e, "keyword", true)}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.libraries}
                                            onChange={(e) => this.handleChange(e, 'libraries', true)}
                                            color="primary"
                                        />
                                    }
                                    label="Only search for libraries"
                                />

                                <h4> Spatial Search </h4>
                                <TextField id="search" value={this.state.search}
                                    onChange={(e) => this.handleChange(e, "search")} />
                                <Button onClick={this.handleSearch.bind(null)}
                                    style={{ "margin": "10px" }}
                                    type="button"
                                    variant="contained"
                                    color="primary"> Search </Button>
                                <Button onClick={this.handleGeoJsonWorld.bind(null)}
                                    style={{ "margin": "10px" }}
                                    type="button"
                                    variant="contained"
                                    color="primary"> Search for the whole World </Button>
                                <OwnMap setState={this.setPropsState} drawn={this.state.drawn} />
                                <br />
                                <h4> Temporal Search </h4>
                                <br />
                                <br />
                                <Slider
                                    value={this.state.temporal}
                                    marks={this.state.marks}
                                    step={null}
                                    min={this.state.marks[0] ? this.state.marks[0].value : 0}
                                    max={this.state.marks[0] ? this.state.marks[this.state.marks.length - 1].value : 100}
                                    onChange={this.handleSliderChange}
                                    valueLabelDisplay="on"
                                    aria-labelledby="range-slider"
                                    valueLabelFormat={this.valuetext}
                                />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={4}>
                        <h4>Results: </h4>
                        {this.state.open ? <div style={{ minHeight: "20px" }}><LinearProgress /></div> : <div style={{ minHeight: "20px" }}> </div>}
                        {this.state.ERC.length > 0 ?
                            <>
                                <ResultList ercs={this.state.ERC} goToErc={this.goToErc}></ResultList>
                            </> : "No Results found"}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Discovery;