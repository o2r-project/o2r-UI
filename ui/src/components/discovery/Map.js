//import L, { geoJSON } from 'leaflet'
import React from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

let GeoJSON
let firstTime = true;
export let ref;
export let ref2;
export let ref3


class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    componentDidMount() {
        firstTime = true;
        console.log(this.refs)
        ref2 = this.refs.map.leafletElement;
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    _onEdited = (e) => {

        var bounds
        if (this.isEmpty(e.layers._layers)) {
            return
        }

        e.layers.eachLayer((layer) => {
            bounds = layer.getBounds();
            GeoJSON = layer.toGeoJSON();

        });
        console.log(GeoJSON)

        this.props.setState("coordinates", GeoJSON.geometry, true);
    }

    _onCreated = (e) => {

        GeoJSON = e.layer.toGeoJSON();
        this.props.setState("drawn", true);
        this.props.setState("coordinates", GeoJSON.geometry, true)
    }


    _onDeleted = (e) => {
        this.props.setState("drawn", false);
      
        this.props.setState("coordinates", null, true);
    }


    render() {
        const position = [52, 7.6]

        return (
            <Map center={position} zoom={1} ref="map">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup ref={(fg) => ref= fg}>
                    <EditControl
                        position='topright'
                        onEdited={this._onEdited}
                        onCreated={this._onCreated}
                        onDeleted={this._onDeleted}
                        edit={this.props.drawn ? { remove: true } : { remove: false }}
                        draw={this.props.drawn ? {
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
                <FeatureGroup ref={(fg) => ref3= fg}>

                </FeatureGroup>

            </Map>);
    }
}

export default OwnMap

