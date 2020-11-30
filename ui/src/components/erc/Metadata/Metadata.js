import React from 'react';
import { List, ListItem, ListItemText, Button } from '@material-ui/core';
import { Map, TileLayer, Polygon } from 'react-leaflet'


import { withRouter } from 'react-router-dom';
let ref2;

class Metadata extends React.Component {

    constructor(props) {
        super(props);
        this.metadata = this.props.erc.metadata.o2r
    }

    componentDidMount() {
        ref2 = this.refs.map.leafletElement;
        ref2.fitBounds([this.metadata.spatial.union.bbox[0], this.metadata.spatial.union.bbox[2]])
        document.title = "Metadata | ERC " + this.props.id + " | o2r Demoserver"
    }

    goToErc = (id) => {
        this.props.history.push({
            pathname: '/erc/' + id,
        });
        window.location.reload(true);
    }


    render() {
        const positions = [this.metadata.spatial.union.bbox[0], this.metadata.spatial.union.bbox[1], this.metadata.spatial.union.bbox[2], this.metadata.spatial.union.bbox[3]]
        return (
            <>
                <div style={{ width: "90%", marginLeft: "5%", textAlign: "justify" }}>
                    <h2>Metadata of compendium:</h2>
                    <span><b>Title: </b>{this.metadata.title}</span> <br />
                    <p> <span style={{ "font-weight": "bold" }}> Created on: </span> {this.props.erc.created.substr(0, 10)} {this.props.erc.created.substr(11, 5)}  <br />
                        <span style={{ "font-weight": "bold" }}> by: </span> {this.props.erc.user} </p>
                    <span ><b>Description: </b>{this.metadata.description}</span> <br /> <br />
                    <span><b>Authors:</b></span><br />
                    <table style={{ marginLeft: "2%" }}>
                        {this.metadata.creators.map((item, i) => {
                            return (<tr key={i}><td style={{ width: "33%" }}>{item.name}</td><td>{item.affiliation}</td></tr>)
                        })}
                    </table> <br />
                    <span ><b>Publication Date: </b>{this.metadata.publication_date}</span> <br /> <br />
                    <span ><b>Display File: </b>{this.metadata.displayfile}</span> <br /> <br />
                    <span ><b>Main File: </b>{this.metadata.mainfile}</span> <br /> <br />
                    <span ><b>License: </b></span> <br />
                    <span style={{ marginLeft: "2%" }}><b>Code: </b>{this.metadata.license.code}</span> <br />
                    <span style={{ marginLeft: "2%" }}><b>Data: </b>{this.metadata.license.data}</span> <br />
                    <span style={{ marginLeft: "2%" }}><b>Text: </b>{this.metadata.license.text}</span> <br /> <br />

                    <span ><b>Spatial extend:</b></span> <br />
                    <Map center={[50.2, 7.6]} zoom={13} ref="map">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Polygon
                            positions={positions}
                        />
                    </Map>
                    <br />
                    <span ><b>Temporal extend: </b>From {this.metadata.temporal.begin.substr(0, 10)} to {this.metadata.temporal.end.substr(0, 10)}</span> <br />
                    {this.props.erc.substituted ?
                    <>
                        <span><b>Subsituted ERC:</b></span>
                        <p>
                            Substitution is the combination of a base compendium, "base" for short, and an overlay compendium, or "overlay".
                            A user can choose files from the overlay to replace files of the base.

                            Substituted Files:
                        </p>
                        <List>
                            {this.props.substitution.substitutionFiles.map((item) => (
                                <>
                                    <ListItem>
                                        <ListItemText primary={"The base File \"" + item.base + "\" was substituted by the overlay File \"" + item.overlay + '"'} />
                                    </ListItem>
                                </>
                            ))}
                        </List>
                        <Button onClick={() => this.goToErc(this.props.substitution.base)} color="primary">
                            Check out base ERC
                        </Button>
                        <Button onClick={() => this.goToErc(this.props.substitution.overlay)} color="primary">
                            Check out overlay ERC
                        </Button> </>: ""
                    }
                </div>
                <br /><br /><br />
            </>
        )
    }
}

export default withRouter(Metadata);
