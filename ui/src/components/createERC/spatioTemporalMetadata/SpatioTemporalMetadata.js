import './spatioTemporalMetadata.css';

import React from 'react'
import { Card, TextField, Button, Grid, CardContent } from "@material-ui/core";
import OwnMap, { ref, ref2 } from "./Map"
import L from 'leaflet'
import { valid2 } from '../requiredMetadata/Form.js'
import httpRequests from '../../../helpers/httpRequests';


class SpatioTemporalMetadata extends React.Component {
  constructor(props) {
    super(props);
    var begin = props.metadata.temporal.begin
    if (begin) begin = begin.substring(0, 10);
    var end = props.metadata.temporal.end
    if (end) end = end.substring(0, 10);
    this.state = {
      from: begin,
      to: end,
      drawing: false,
      editing: false,
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
    if (originalMetadata.temporal.end) originalMetadata.temporal.end = this.props.originalMetadata.temporal.end.substring(0, 10);
    if (originalMetadata.temporal.begin) originalMetadata.temporal.begin = this.props.originalMetadata.temporal.begin.substring(0, 10);
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

  setPropsState = (state, result) => {
    console.log(state)
    this.setState({ [state]: result })
  }

  handleReset = () => {

    var begin = this.props.originalMetadata.temporal.begin
    if (begin) {
      begin = begin.substring(0, 10);
    }
    else {
      begin = "";
    }
    var end = this.props.originalMetadata.temporal.end
    if (end) { end = end.substring(0, 10); }
    else {
      end = "";
    }
    this.setState({
      from: begin,
      to: end,
      drawing: false,
      editing: false,
    })

    var metadata = this.props.metadata

    metadata.temporal.begin = this.props.originalMetadata.temporal.begin
    metadata.temporal.end = this.props.originalMetadata.temporal.end
    metadata.spatial = this.props.originalMetadata.spatial
    this.props.setMetadata(metadata, false)
    this.setGeojson(this.props.originalMetadata.spatial.union.bbox)
    this.props.setChangedFalse("spatioTemporalChanged");


  }

  setGeojson(bbox) {
    var metadata = this.props.metadata;
    this.refs.child.stopCreate();


    metadata.spatial.union.bbox = bbox;

    metadata.spatial.union.geojson = {
      geometry: {
        type: "Polygon",
        coordinates: [bbox]
      }
    }
    console.log(metadata)
    this.props.setMetadata(metadata, false)

    this._editableFG = ref;
    var GeoJSON = this.getGeoJson()

    for (var i = 0; i < 4; i++) {
      GeoJSON.geometry.coordinates[0][i] = bbox[i];
    }

    GeoJSON.geometry.coordinates[0][4] = bbox[0];

    this.refs.child.setUneditedLayerProps(GeoJSON);

    this.setState({ editing: false, drawing: false })

    let leafletGeoJSON = new L.GeoJSON(GeoJSON);
    let leafletFG = this._editableFG.leafletElement;
    leafletFG.clearLayers()
    leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
    var northeast = [GeoJSON.geometry.coordinates[0][0][1], GeoJSON.geometry.coordinates[0][0][0]]
    var southwest = [GeoJSON.geometry.coordinates[0][2][1], GeoJSON.geometry.coordinates[0][2][0]]
    ref2.fitBounds([northeast, southwest])
    this.setChanged()
  }




  handleSearch = async () => {
    const query = this.state.search
    const self = this;
    try {
      httpRequests.geocodingRequest(query)
        .then(function (res) {
          console.log(res)
          if (res.data.features.length == 0) { alert("No result found"); return; }
          const resultBBox = res.data.features[0].bbox
          if (!resultBBox) { alert("No result found"); return; }
          const bbox = []
          bbox.push([resultBBox[2], resultBBox[3]])
          bbox.push([resultBBox[2], resultBBox[1]])
          bbox.push([resultBBox[0], resultBBox[1]])
          bbox.push([resultBBox[0], resultBBox[3]])
          bbox.push([resultBBox[2], resultBBox[3]])
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

  startEdit = () => {
    let editingLayer
    ref2.eachLayer((layer) => { if (layer._latlngs) { editingLayer = layer } })
    this.refs.child._onEditStart(editingLayer);
  }

  saveEdit = () => {
    let editingLayer
    ref2.eachLayer((layer) => { if (layer._latlngs) { editingLayer = layer } })
    this.refs.child._onEdited(editingLayer);
  }

  cancelEdit = () => {
    let editingLayer
    ref2.eachLayer((layer) => { if (layer._latlngs) { editingLayer = layer } })
    this.refs.child._onCancel(editingLayer);
  }

  drawPolygon = () => {
    this.refs.child.startCreate();
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
    return (
      <div id="form">
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Card>
              <CardContent>
                <h3>Specify the spatial properties of your dataset(s) to make your work better discoverable:</h3>
                {/*<h4>You have two options: 1. Search for an Address/Region/Country, which will be displayed on the Map. 2. Edit the Polygon in the Map or draw a new one.</h4>
                1. Search for Address/Region/Country
              <TextField id="search" value={this.state.search}
                  onChange={(e) => this.handleChange(e, "search")} />
                <Button onClick={this.handleSearch.bind(null)}
                  style={{ "margin": "10px" }}
                  type="button"
                  variant="contained"
                  color="primary"> Search </Button>
                <br />*/}
              <Button onClick={this.startEdit.bind(null)}
                  style={{ "margin": "10px" }}
                  disabled={this.state.editing || this.state.drawing}
                  type="button"
                  variant="contained"
                  color="primary"> Start Editing </Button>
                <Button onClick={this.saveEdit.bind(null)}
                  style={{ "margin": "10px" }}
                  disabled={!this.state.editing}
                  type="button"
                  variant="contained"
                  color="primary"> Stop Editing </Button>
                <Button onClick={this.cancelEdit.bind(null)}
                  style={{ "margin": "10px" }}
                  disabled={!this.state.editing}
                  type="button"
                  variant="contained"
                  color="primary"> Cancel Editing </Button>
              <Button onClick={this.drawPolygon.bind(null)}
                  style={{ "margin": "10px" }}
                  disabled={this.state.editing}
                  type="button"
                  variant="contained"
                  color="primary"> Draw a new bbox </Button>
                <br />
              <Button onClick={this.handleGeoJsonWorld.bind(null)}
                  style={{ "margin": "10px" }}
                  type="button"
                  variant="contained"
                  color="primary"> The ERC is important for the whole World </Button>
                <OwnMap ref="child" metadata={this.props.metadata} setMetadata={this.props.setMetadata} setChanged={this.setChanged} setState={this.setPropsState} />
                <h1> Specify the temporal properties of your dataset(s):</h1>

                <TextField
                  id="date"
                  label="Begin"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{marginLeft: "5px", marginRight: "100px"}}
                  value={this.state.from}
                  onChange={(e) => this.handleChange(e, "from")}
                />

                <TextField
                  id="date"
                  label="End"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={this.state.to}
                  onChange={(e) => this.handleChange(e, "to")
                  }
                />
              </CardContent>
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
                disabled={!(this.props.spatioTemporalChanged || this.props.authorsChanged || this.props.changed) || !valid2 || this.state.editing || this.state.drawing}
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
            <div id={"errorMessage"}>
              {!valid2 ? "Required Metadata is not valid" : ""} <br />
              {this.state.editing ? "Please stop or cancel the editing of the bbox" : ""}
              {this.state.drawing ? "Please finish drawing a new bbox" : ""}
            </div>

          </Grid>
        </Grid>
      </div>


    );
  }
}

export default SpatioTemporalMetadata
