

import './spatioTemporalMetadata.css';

import L from 'leaflet'
import React from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { Card, CardContent, TextField } from "@material-ui/core";




let GeoJSON
let firstTime = true;
class OwnMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: props.metadata,
      drawn: true,
      GeoJSON: null
    };
  };

  _onEdited = (e) => {


    e.layers.eachLayer((layer) => {

      GeoJSON = layer.toGeoJSON();

    });

    const metadata = this.state.metadata;

    metadata.spatial.union.bbox[0] = GeoJSON.geometry.coordinates[0][0];
    metadata.spatial.union.bbox[1] = GeoJSON.geometry.coordinates[0][1];
    metadata.spatial.union.bbox[2] = GeoJSON.geometry.coordinates[0][2];
    metadata.spatial.union.bbox[3] = GeoJSON.geometry.coordinates[0][3];
    this.props.setMetadata(metadata);


    this.setState({ GeoJSON: GeoJSON });


  }

  _onCreated = (e) => {

    GeoJSON = e.layer.toGeoJSON();
    this.setState({ drawn: true, GeoJSON: GeoJSON });
    const metadata = this.state.metadata;

    metadata.spatial.union.bbox[0] = GeoJSON.geometry.coordinates[0][0];
    metadata.spatial.union.bbox[1] = GeoJSON.geometry.coordinates[0][1];
    metadata.spatial.union.bbox[2] = GeoJSON.geometry.coordinates[0][2];
    metadata.spatial.union.bbox[3] = GeoJSON.geometry.coordinates[0][3];
    this.props.setMetadata(metadata);



  }

  _onDeleted = (e) => {
    this.setState({ drawn: false, GeoJSON: null });
    const metadata = this.state.metadata;

    metadata.spatial.union.bbox[0] = [181, 181]
    metadata.spatial.union.bbox[1] = [-181, 181]
    metadata.spatial.union.bbox[2] = [-181, -181]
    metadata.spatial.union.bbox[3] = [181, 181]
    this.props.setMetadata(metadata);
  }

  _onFeatureGroupReady = (ref) => {

    if (!firstTime) {
      return;
    }
    this._editableFG = ref;
    let leafletGeoJSON = new L.GeoJSON(this.getGeoJson());
    let leafletFG = this._editableFG.leafletElement;
    leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
    firstTime = false;

  }

  getGeoJson = () => {
    return {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              180,
              180
            ],
            [
              180,
              -180
            ],
            [
              -180,
              -180
            ],
            [
              -180,
              180
            ],
            [
              180,
              180
            ]
          ]
        ]
      }
    }
  }



  render() {
    const position = [52, 7.6]

    return (
      <Map center={position} zoom={1}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup ref={(reactFGref) => { this._onFeatureGroupReady(reactFGref); }}>
          <EditControl
            position='topright'
            onEdited={this._onEdited}
            onCreated={this._onCreated}
            onDeleted={this._onDeleted}
            edit={this.state.drawn ? { remove: true } : { remove: false }}
            draw={this.state.drawn ? {
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
              rectangle: false,
              point: false,
              polygon: false
            } :
              {
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
                rectangle: true,
                point: false,
                polygon: false
              }} />

        </FeatureGroup>

      </Map>);
  }
}



let to;
class SpatioTemporalMetadata extends React.Component {
  constructor(props) {
    super(props);
    var begin = props.metadata.temporal.begin
    begin = begin.substring(0, 10);
    var end = props.metadata.temporal.end
    end = end.substring(0, 10);
    this.state = {
      from: begin,
      to: end
    };
  };

  handleChange = (e, name) => {
    this.setState({
      [name]: e.target.value
    })

    const updatedMetadata = this.props.metadata;

    if (name === "from") {
      updatedMetadata.temporal.beginn = e.target.value;
    }
    else {
      updatedMetadata.temporal.end = e.target.value;
    }

    this.props.setMetadata(updatedMetadata, false);

  }



  render() {
    let to;
    return (
      <div id="form">
        <Card>
          <h1>Specify the spatial properties of your dataset(s):</h1>
          <OwnMap metadata={this.props.metadata} setMetadata={this.props.setMetadata} />
          <h1> Specify the temporal properties of your dataset(s):</h1>

          <TextField
            id="date"
            label="Beginn"
            type="date"
            //defaultValue={this.props.metadata.temporal.beginn}
            //className={classes.textField}
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
            //defaultValue={this.props.metadata.temporal.end}
            //className={classes.textField}
            InputLabelProps={{
              required: true,
              shrink: true,
            }}
            value={this.state.to}
            onChange={(e) => this.handleChange(e, "to")
            }
          />
        </Card>
      </div>


    );
  }
}

export default SpatioTemporalMetadata
