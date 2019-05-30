

import './spatioTemporalMetadata.css';

import React, { Component } from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'



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




class SpatioTemporalMetadata extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  };



  render() {
    
    return (
      <div>
      <h1>Specify the spatial Propertys of your dataset</h1>
      <OwnMap/>
      </div>

    );
  }
}

export default SpatioTemporalMetadata
