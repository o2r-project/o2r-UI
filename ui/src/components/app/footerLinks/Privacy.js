import React, { Component } from "react";
//import config from '../../../helpers/config';

class Privacy extends Component {

    componentDidMount(){
      document.title = "Privacy" + config.title; // eslint-disable-line

    }

    render() {
        return (
        <div>
            <h3>Privacy Policy</h3>
            <h4 id="userdata">User Data</h4>
            <p>
                o2r stores following <strong>user data</strong> in its database:
                <ul>
                    <li>ORCID id</li>
                    <li>username</li>
                    <li>user level</li>
                    <li>date of last login</li>
                </ul>
                In addition, Executable Research Compendia (ERC) also inlcude the following personal information of each author:
                <ul>
                    <li>Name</li>
                    <li>Affiliation</li>
                    <li>Email address</li>
                    <li>ORCID id</li>
                </ul>
                As ERCs are stored on Zenodo, this information will be stored there, too, but otherwise not shared with any third party.
            </p>
            <p>If you want us to delete your data, please contact o2r.team@uni-muenster.de</p>
            <h4 id="cookies">Cookies</h4>
            <p>
	            o2r uses a <strong>session cookie</strong>. This cookie stores a unique reference to a session (including auth details, if the user is authenticated via ORCID).
            </p>
            <h4 id="login">Login</h4>
            <p>
	            o2r uses <a href="https://oauth.net/2/" title="About OAuth 2.0">OAuth 2.0</a> to provide a login via <strong><a href="http://orcid.org/" title="ORCID website">ORCID</a></strong>. More information about the ORCID privacy policy <a href="http://orcid.org/content/orcid-privacy-policy#Information_we_collect" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
            <p>
	            ORCID is known to cause issues when using ghostery and other tacking control software. More information <a href="http://support.orcid.org/forums/175591-orcid-ideas-forum/suggestions/5534995-allow-login-to-orcid-org-without-google-analytics" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
        </div>
        );
    }
}

export default Privacy;
