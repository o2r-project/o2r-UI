import L from 'leaflet'
import React from 'react'
import { Map, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'

let GeoJSON
let firstTime = true;
let editHandler
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

    forceRerender() {
        this.forceUpdate()
    }

    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }


    _onEdited = (layer) => {

        editHandler._disableLayerEdit(layer)
        editHandler._uneditedLayerProps[65].latlngs= layer._latlngs
        console.log("edited")
        var bounds;
        if (this.isEmpty(layer)) {
            return
        }

           GeoJSON = layer.toGeoJSON();
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
        //editHandler.revertLayers()
        editHandler._disableLayerEdit(layer)
        this.props.setState("editing", false)
        this.revertLayers();
    }

    revertLayers = () => {
        console.log(editHandler)
        const latlngs = editHandler._uneditedLayerProps[65].latlngs
        this._editableFG = ref;

        var GeoJSON = this.getGeoJson()
        

        const array = [[]]
        for(var latlng of latlngs[0]){
            const coordinates = [latlng.lng, latlng.lat]
            array[0].push(coordinates)
        }
        GeoJSON.geometry.coordinates = array;

        console.log(GeoJSON)

        let leafletGeoJSON = new L.GeoJSON(GeoJSON);
        let leafletFG = this._editableFG.leafletElement;
        leafletFG.clearLayers()
        leafletGeoJSON.eachLayer(layer => leafletFG.addLayer(layer));
    }
    _onCreated = (e) => {

        GeoJSON = e.layer.toGeoJSON();
        this.props.setState("drawn", true);
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
        console.log(editHandler)
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
        console.log(drawControl)
        editHandler = drawControl._toolbars.edit._modes.edit.handler;
        //editHandler.enable()

		// this.drawControl = drawControl;
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
                        onEdited={this._onEdited}
                        onCreated={this._onCreated}
                        onDeleted={this._onDeleted}
                        onEditStart={this._onEditStart}
                        onEditStop={this._onEditStop}
                        edit={this.props.drawn ? 
                            { featureGroup: this.state.drawnItems, remove: true } : 
                            { featureGroup: this.state.drawnItems, remove: false }}                     
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

            </Map>);
    }
}

export default OwnMap

