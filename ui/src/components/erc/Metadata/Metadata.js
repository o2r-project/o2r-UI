import React from 'react';
import { List, ListItem, ListItemText, Button } from '@material-ui/core';
import { Map, TileLayer, Polygon } from 'react-leaflet';
//import config from '../../../helpers/config';


import { withRouter } from 'react-router-dom';
import languageCodes from '../../../helpers/isoCodes_639-1.json'
import licensesData from '../../../helpers/licenses.json'
import Doilogo from '../../../assets/img/DOI_logo.svg.png';

let ref2;

class Metadata extends React.Component {

    constructor(props) {
        super(props);
        this.metadata = this.props.erc.metadata.o2r
        this.licenses= []
        for (var i in licensesData) {
            this.licenses.push(licensesData[i])
        }
        this.textLicenseIndex = Array.from(this.licenses, x => x.id).indexOf(this.metadata.license.text) 
        this.codeLicenseIndex = Array.from(this.licenses, x => x.id).indexOf(this.metadata.license.code)
        this.dataLicenseIndex = Array.from(this.licenses, x => x.id).indexOf(this.metadata.license.data)
        console.log(Array.from(this.licenses, x => x.id))
    }

    componentDidMount() {
        ref2 = this.refs.map.leafletElement;
        ref2.fitBounds([this.metadata.spatial.union.bbox[0], this.metadata.spatial.union.bbox[2]])
        document.title = "Metadata | ERC " + this.props.erc.id + config.title; // eslint-disable-line
    }

    goToErc = (id) => {
        this.props.history.push({
            pathname: '/erc/' + id,
        });
        window.location.reload(true);
    }


    render() {
        const positions = [this.metadata.spatial.union.bbox[0], this.metadata.spatial.union.bbox[1], this.metadata.spatial.union.bbox[2], this.metadata.spatial.union.bbox[3]]
        const languages = this.metadata.languages ? languageCodes.filter(language => this.metadata.languages.includes(language.code)).map(language => language.full).toString().replace(/,/g, ", ") : null;
        const keywords  = this.metadata.keywords ? this.metadata.keywords.toString().replace(/,/g, ", ") : null; 

        return (
            <>
                <div style={{ width: "90%", marginLeft: "5%", textAlign: "justify" }}>
                    <h2>Metadata of compendium:</h2>
                    <span id="title"><b>Title: </b>{this.metadata.title}</span> <br />
                    <p> <span style={{ "font-weight": "bold" }}> Created on: </span> {this.props.erc.created.substr(0, 10)} {this.props.erc.created.substr(11, 5)}  <br />
                        <span style={{ "font-weight": "bold" }}> by: </span>
                        <a href ={"https://orcid.org/"+this.props.erc.user} target="_blank" >
<img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
{this.props.erc.user}
</a> </p>
                    <span ><b>Description: </b>{this.metadata.description}</span> <br /> <br />
                    <span><b>Authors:</b></span><br />
                    <table style={{ marginLeft: "2%" }}>
                        {this.metadata.creators.map((item, i) => {
                            return (<tr key={i}><td style={{ width: "33%" }}>{item.orcid?<a target="_blank" href ={"https://orcid.org/"+ item.orcid} >
                            {item.name} <img alt="ORCID logo" src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png" width="16" height="16" />
                            </a>: item.name }</td><td>{item.affiliation}</td></tr>)
                        })}
                    </table> <br />
                    <span ><b>Publication Date: </b>{this.metadata.publication_date}</span> <br /> <br />
                    <span ><b>Display File: </b>{this.metadata.displayfile}</span> <br /> <br />
                    <span ><b>Main File: </b>{this.metadata.mainfile}</span> <br /> <br />
                    <span ><b>License: </b></span> <br />
                    <span style={{ marginLeft: "2%" }}><b>Code: </b> {this.codeLicenseIndex > 0 ? <a target="_blank" href ={this.licenses[this.codeLicenseIndex].url}>{this.metadata.license.code}</a> : this.metadata.license.code}</span> <br />
                    <span style={{ marginLeft: "2%" }}><b>Data: </b>{this.dataLicenseIndex > 0 ? <a target="_blank" href ={this.licenses[this.dataLicenseIndex].url}>{this.metadata.license.data}</a> : this.metadata.license.data}</span> <br />
                    <span style={{ marginLeft: "2%" }}><b>Text: </b>{this.textLicenseIndex > 0 ? <a target="_blank" href ={this.licenses[this.textLicenseIndex].url}>{this.metadata.license.text}</a> : this.metadata.license.text}</span> <br /><br />
                    <span> <b>DOI: </b><a target="_blank" href={"https://doi.org/" + this.metadata.identifier.doi}><img src={Doilogo} height={20} width={20} alt="DOI"/> {this.metadata.identifier.doi} </a></span><br />
                    <span> <b>Languages: </b>{languages}</span><br />
                    <span> <b>Keywords: </b>{keywords}</span><br />
                    <br />

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
                    <span ><b>Temporal extend: </b>From {this.metadata.temporal.begin? this.metadata.temporal.begin.substr(0, 10):""} to {this.metadata.end ? this.metadata.temporal.end.substr(0, 10) : ""}</span> <br />
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
