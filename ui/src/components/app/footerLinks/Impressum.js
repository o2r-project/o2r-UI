import React, { Component } from "react";

class Impressum extends Component {
    render() {
        return (
            <div>
                <h1>Impressum</h1>
                <h2>Contact</h2>
                <div>
                    Westfälische Wilhelms-Universität Münster<br/> 
                    Institut für Geoinformatik - o2r Project Team<br/>
                    Heisenbergstraße 2<br/>
                    D-48149 Münster<br/><br/>
                    Phone: +49 (251) 83-33 962<br/><br/>
                    Email: o2r.team@uni-muenster.de
                </div>
                <h2>Notice of Liability</h2>
                <div flex="50">
                    Although we check the content carefully, we cannot accept responsibility for the content of external links. 
                    The linked sites’ carriers are responsible for their sites’ content.
                </div>
            </div>
        );
    }
}

export default Impressum;