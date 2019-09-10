

import './spatioTemporalMetadata.css';

import React from 'react'
import { Card, TextField, Button, Grid } from "@material-ui/core";

import OwnMap, { ref } from "./Map"
import L from 'leaflet'
import { valid2 } from '../requiredMetadata/Form.js'



class SpatioTemporalMetadata extends React.Component {
  constructor(props) {
    super(props);
    var begin = props.metadata.temporal.begin
    begin = begin.substring(0, 10);
    var end = props.metadata.temporal.end
    end = end.substring(0, 10);
    this.state = {
      from: begin,
      to: end,
      drawn: true,
    };
  };

  handleChange = async (e, name) => {
    const updatedMetadata = JSON.parse(JSON.stringify(this.props.metadata));
    await this.setState({
      [name]: e.target.value
    })

    updatedMetadata.temporal.begin = this.state.from;
    updatedMetadata.temporal.end = this.state.to;

    var originalMetadata = this.props.originalMetadata
    originalMetadata.temporal.end = this.props.originalMetadata.temporal.end.substring(0, 10);
    originalMetadata.temporal.begin = this.props.originalMetadata.temporal.begin.substring(0, 10);
    if (JSON.stringify(updatedMetadata.temporal) !== JSON.stringify(originalMetadata.temporal)) {
      this.setChanged()
    }
    else {
      this.props.setChangedFalse("spatioTemporalChanged");
    }

    this.props.setMetadata(updatedMetadata, false);


  }

  handleClick = (e) => {
    this.props.goToErc()
  }

  handleSave = () => {
    this.props.setChangedFalse("all")
    this.props.setMetadata(this.props.metadata, true)
  }

  setChanged = () => {
    this.props.setChanged("spatioTemporalChanged")
  }

  setDrawn = (result) => {
    this.setState({drawn: result})
  }

  handleReset = () => {

    var begin = this.props.originalMetadata.temporal.begin
    begin = begin.substring(0, 10);
    var end = this.props.originalMetadata.temporal.end
    end = end.substring(0, 10);
    this.setState({
      from: begin,
      to: end,
      drawn: true,
    })

    var metadata = this.props.metadata

    metadata.temporal.begin = this.props.originalMetadata.temporal.begin
    metadata.temporal.end = this.props.originalMetadata.temporal.end
    metadata.spatial = this.props.originalMetadata.spatial
    this.props.setMetadata(metadata, false)

    this._editableFG = ref;
    var GeoJSON = this.getGeoJson()

    for (var i = 0; i < 4; i++) {
      GeoJSON.geometry.coordinates[0][i] = this.props.originalMetadata.spatial.union.bbox[i];
    }

    GeoJSON.geometry.coordinates[0][4] = this.props.originalMetadata.spatial.union.bbox[0];

    let leafletGeoJSON = new L.GeoJSON(GeoJSON);
    let leafletFG = this._editableFG.leafletElement;
    leafletFG.clearLayers()
    leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));

    this.props.setChangedFalse("spatioTemporalChanged");
  }


  getGeoJson = () => {
    return {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [180, 180],
            [180, -180],
            [-180, -180],
            [-180, 180],
            [180, 180]
          ]
        ]
      }
    }
  }

  render() {
    let to;
    return (
      <div id="form">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Card>
              <h1>Specify the spatial properties of your dataset(s):</h1>
              <OwnMap metadata={this.props.metadata} setMetadata={this.props.setMetadata} setChanged={this.setChanged} drawn={this.state.drawn} setDrawn={this.setDrawn} />
              <h1> Specify the temporal properties of your dataset(s):</h1>

              <TextField
                id="date"
                label="Begin"
                type="date"
                InputLabelProps={{
                  required: true,
                  shrink: true,
                }}
                value={this.state.from}
                onChange={(e) => this.handleChange(e, "from")}
              />

              <TextField
                id="date"
                label="End"
                type="date"
                InputLabelProps={{
                  required: true,
                  shrink: true,
                }}
                value={this.state.to}
                onChange={(e) => this.handleChange(e, "to")
                }
              />
            </Card>
          </Grid>
          <Grid item xs={2} >
            <Card style={{ "margin-top": "10%", position: "fixed" }}>
              <Button
                onClick={this.handleReset.bind(null)}
                type="button"
                disabled={!this.props.spatioTemporalChanged}
              >
                Reset
            </Button>
              <Button
                onClick={this.handleSave.bind(null)}
                type="submit"
                variant="contained"
                color="primary"
                disabled={!(this.props.spatioTemporalChanged || this.props.authorsChanged || this.props.changed) || !valid2}
              >
                Save
            </Button>
              <Button
                type="button"
                onClick={this.handleClick.bind(null)}
                disabled={this.props.candidate}>
                Go To ERC
             </Button>
            </Card>
          </Grid>
        </Grid>
      </div>


    );
  }
}

export default SpatioTemporalMetadata
