import L from 'leaflet'
import React from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

let GeoJSON
let firstTime = true;
let editHandler;
let drawHandler;
let uneditedLayerProps;
export let ref;
export let ref2;


class OwnMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    };

    componentDidMount() {
        firstTime = true;
        ref2 = this.refs.map.leafletElement;
    }



    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    setUneditedLayerProps = (_uneditedLayerProps) =>{
        uneditedLayerProps = _uneditedLayerProps;
    }


    _onEdited = (layer) => {

        editHandler._disableLayerEdit(layer)

        var bounds;
        if (this.isEmpty(layer)) {
            return
        }

           GeoJSON = layer.toGeoJSON();

           uneditedLayerProps = GeoJSON;
            bounds = layer.getBounds();

        const metadata = this.props.metadata;

        var northEast = [bounds._northEast.lng, bounds._northEast.lat]
        var southEast = [bounds._southWest.lng, bounds._northEast.lat]
        var southWest = [bounds._southWest.lng, bounds._southWest.lat]
        var northWest = [bounds._northEast.lng, bounds._southWest.lat]



        metadata.spatial.union.bbox[0] = northEast
        metadata.spatial.union.bbox[1] = southEast
        metadata.spatial.union.bbox[2] = southWest
        metadata.spatial.union.bbox[3] = northWest
        metadata.spatial.union.bbox[4] = northEast
        metadata.spatial.union.geojson= {
            geometry:{
            type: "Polygon",
            coordinates: [metadata.spatial.union.bbox]
            }
          }
        this.props.setMetadata(metadata, false);
        this.setState({ GeoJSON: GeoJSON });
        this.props.setChanged();
        this.props.setState("editing", false)
    }

    _onCancel = (layer) => {
        editHandler._disableLayerEdit(layer)
        this.props.setState("editing", false)
        this.revertLayers();
    }

    revertLayers = () => {
        this._editableFG = ref;
        
        GeoJSON = uneditedLayerProps;

        let leafletGeoJSON = new L.GeoJSON(GeoJSON);
        let leafletFG = this._editableFG.leafletElement;
        leafletFG.clearLayers()
        leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
    }

    startCreate = () =>{
        let leafletFG = this._editableFG.leafletElement;
        this.props.setState("drawing", true);
        leafletFG.clearLayers();
        drawHandler.enable()
    }

    stopCreate= () => {
        drawHandler.disable()
    }

    _onCreated = (e) => {
        GeoJSON = e.layer.toGeoJSON();
        uneditedLayerProps = GeoJSON;
        this.props.setState("drawing", false);
        const metadata = this.props.metadata;

        metadata.spatial.union.bbox[0] = GeoJSON.geometry.coordinates[0][0];
        metadata.spatial.union.bbox[1] = GeoJSON.geometry.coordinates[0][1];
        metadata.spatial.union.bbox[2] = GeoJSON.geometry.coordinates[0][2];
        metadata.spatial.union.bbox[3] = GeoJSON.geometry.coordinates[0][3];
        metadata.spatial.union.bbox[4] = GeoJSON.geometry.coordinates[0][0]
        metadata.spatial.union.geojson= {
            geometry:{
            type: "Polygon",
            coordinates: [metadata.spatial.union.bbox]
            }
          }
        this.props.setMetadata(metadata, false);
        this.props.setChanged();
    }

    _onEditStart = (layer) => {
        editHandler._enableLayerEdit(layer)
        this.props.setState("editing", true)
    }

    _onDeleted = (e) => {
        this.props.setState("drawn", false);
        const metadata = this.props.metadata;

        metadata.spatial.union.bbox[0] = [181, 181]
        metadata.spatial.union.bbox[1] = [-181, 181]
        metadata.spatial.union.bbox[2] = [-181, -181]
        metadata.spatial.union.bbox[3] = [181, -181]
        metadata.spatial.union.geojson = null;
        this.props.setMetadata(metadata, false);
        this.props.setChanged();
    }

    _onMounted = drawControl => {
        drawHandler = drawControl._toolbars.draw._modes.rectangle.handler;
        editHandler = drawControl._toolbars.edit._modes.edit.handler;
	};

    _onFeatureGroupReady = (ref) => {

        if (!firstTime) {
            return;
        }
        this._editableFG = ref;
        GeoJSON = this.getGeoJson()
        const metadata = this.props.metadata;

        for (var i = 0; i < 4; i++) {
            GeoJSON.geometry.coordinates[0][i] = metadata.spatial.union.bbox[i];
        }

        uneditedLayerProps = GeoJSON;

        //GeoJSON.geometry.coordinates[0][4] = metadata.spatial.union.bbox[0];
        const fg=this.state.drawnItems
        let leafletGeoJSON = new L.GeoJSON(GeoJSON);
        let leafletFG = this._editableFG.leafletElement;
        leafletGeoJSON.eachLayer(layer => {leafletFG.addLayer(layer);});
        this.setState({drawnItems: fg})
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
                        [180, 180],
                        [180, -180],
                        [-180, -180],
                        [-180, 180],
                    ]
                ]
            }
        }
    }



    render() {
        const position = [52, 7.6]

        return (
            <Map center={position} zoom={1} ref="map">
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FeatureGroup ref={(reactFGref) => { this._onFeatureGroupReady(reactFGref); ref = reactFGref }}>
                    <EditControl
                        onMounted={this._onMounted}
                        position='topright'
                        onCreated={this._onCreated}                  
                        draw={{circle: false,
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

export default OwnMap

