

import './spatioTemporalMetadata.css';

import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, LeafletConsumer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'



class SpatioTemporalMetadata  {
  




  render() {
    const position = [52, 7.6]
    return (
      <div>
      <h1>Specify the spatial Propertys of your dataset</h1>
      <Map center={position} zoom={13}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
    <EditControl
      position='topright'
      onEdited={this._onEditPath}
      onCreated={this._onCreate}
      onDeleted={this._onDeleted}
      draw={{
        rectangle: false
      }}
    />
  
  </FeatureGroup>
      </Map>
      </div>

    )
  }
}
export default SpatioTemporalMetadata