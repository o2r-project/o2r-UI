

import './spatioTemporalMetadata.css';

import React, { Component } from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { Card, CardContent, TextField } from "@material-ui/core";
import { throwStatement } from '@babel/types';



let GeoJSON
class OwnMap extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      metadata:props.metadata,
      drawn: false,
      GeoJSON: null
    };
  };

  _onEdited = (e) => {

    
    e.layers.eachLayer( (layer) => {
    
      GeoJSON = layer.toGeoJSON();
      
    });
    

  }

  _onCreated = (e) => {
    this.setState({drawn: true});
      GeoJSON = e.layer.toGeoJSON();
          
     
  }

  _onDeleted = (e) => {
    this.setState({drawn: false});
      GeoJSON = null;
  }

  
  render() {
    const position = [52, 7.6]
  return(
    <Map center={position} zoom={13}>
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <FeatureGroup>
      <EditControl
        position='topright'
        onEdited={this._onEdited}
        onCreated={this._onCreated}
        onDeleted={this._onDeleted}
        edit = {this.state.drawn ? {remove: true}:{remove: false}}
        draw = {this.state.drawn ? {
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: false,
        rectangle: false,
        point: false,
        polygon: false}:
        {
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
          rectangle: false,
          point: false,
          polygon: {
            allowIntersection: false,
            showArea: true
          }}}/>

    </FeatureGroup>

  </Map>);
}
}



let to;
class SpatioTemporalMetadata extends React.Component {
  constructor(props){
    super(props);
    var begin= props.metadata.temporal.begin
    begin = begin.substring(0,10);
    var end = props.metadata.temporal.end
    end = end.substring(0,10);
    console.log(begin)
    this.state = {
      from: begin,
      to: end
    };
  };

handleChange= (e, name) =>
{
this.setState({
  [name]: e.target.value
})

const updatedMetadata = this.props.metadata;

if (name==="from")
{
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
      <OwnMap/>
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
