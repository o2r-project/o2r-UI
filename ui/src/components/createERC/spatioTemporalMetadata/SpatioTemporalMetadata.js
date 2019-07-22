

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
      drawn: false,
    };
  };

  _onEdited = (e) => {

    
    e.layers.eachLayer( (layer) => {
    
      GeoJSON = layer.toGeoJSON();
      console.log(GeoJSON)
    });
    

  }

  _onCreated = (e) => {
    this.setState({drawn: true});
      GeoJSON = e.layer.toGeoJSON();
      console.log(GeoJSON)
      
     
  }

  _onDeleted = (e) => {
    this.setState({drawn: false});
      GeoJSON = null;
      console.log(GeoJSON)
  }

  
  render() {
    const position = [52, 7.6]
  console.log(this.state);
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
    this.state = {
      
    };
  };

  getInitialState = () => {
    return {
        textFieldValue: ''
    };
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
                        label="From"
                        type="date"
                        //defaultValue="2017-05-24"
                        //className={classes.textField}
                        InputLabelProps={{
                          required: true,
                        shrink: true,
                        }}
                        value={this.state.from}
                        onChange={(e) => this.setState({
                          from: e.target.value
                      })}
                    />
                
        <TextField
                        id="date"
                        label="To"
                        type="date"
                        //defaultValue="2017-05-24"
                        //className={classes.textField}
                        InputLabelProps={{
                        required: true,
                        shrink: true,
                        }}
                        value={this.state.to}
                        onChange={(e) => this.setState({
                          to: e.target.value
                      })}
                    />
                </Card>
      </div>


    );
  }
}

export default SpatioTemporalMetadata
