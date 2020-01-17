import L, { geoJSON } from 'leaflet'
import React from 'react'
import { Map, TileLayer, FeatureGroup, Marker } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css';

export let ref;
export let ref2;



class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };




    render() {
        const position = [52, 7.6]

        return (
            <Map center={position} zoom={1} ref="map" zoom={4} maxZoom={18}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                    <Marker position={[49.8397, 24.0297]} />
                    <Marker position={[52.2297, 21.0122]} />
                    <Marker position={[51.5074, -0.0901]} />
                    </MarkerClusterGroup>
            </Map>);
    }
}

export default OwnMap