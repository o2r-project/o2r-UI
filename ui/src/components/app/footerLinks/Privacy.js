import React, { Component } from "react";

class Privacy extends Component {
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
            <p>If you want us to delete your data, please contact m.konkol@uni-muenster.de</p>
            <h4 id="cookies">Cookies</h4>
            <p>
	            o2r uses a <strong>session cookie</strong>. This cookie stores a unique reference to a session (including auth details, if the user is authenticated via ORCID iD).
            </p>
            <h4 id="login">Login</h4>
            <p>
	            o2r uses <a href="https://oauth.net/2/" title="About OAuth 2.0">OAuth 2.0</a> to provide a login via <strong><a href="http://orcid.org/" title="ORCID website">ORCID</a></strong>. More information about the ORCID privacy policy <a href="http://orcid.org/content/orcid-privacy-policy#Information_we_collect" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
            <p>
	            ORCID is known to cause issues when using ghostery and other tacking control software. More information <a href="http://support.orcid.org/forums/175591-orcid-ideas-forum/suggestions/5534995-allow-login-to-orcid-org-without-google-analytics" target="_blank" rel="noopener noreferrer">here</a>.
            </p>
            <h4 id="tracking">Tracking</h4>
            <p>
	            We use our own <a href="https://piwik.org/" title="Piwik website">Piwik</a> server to collect anonymous user statistics in a configuration that is conform with <a href="https://www.datenschutzzentrum.de/uploads/projekte/verbraucherdatenschutz/20110315-webanalyse-piwik.pdf" title="Datenschutzkonformes Webseitentracking mit Piwik">German privacy laws</a> and <a href="https://en.wikipedia.org/wiki/General_Data_Protection_Regulation" >GDPR</a>. <strong>We collect no personal data and do not share the visitor statistics with any third party.</strong> We only collect anonymised IPs (masking 3 bytes) to learn about the number of visitors on our site. The tracker honors the <a href="https://en.wikipedia.org/wiki/Do_Not_Track">Do Not Track (DNT)</a> header. If you do not want to be tracked, please use the option below. <em>If you are logged in</em>, we will store your user ID as part of the tracking data.
            </p>
            <iframe frameborder="no" width="600px" height="200px" src="https://o2r.uni-muenster.de/piwik/index.php?module=CoreAdminHome&action=optOut" title="uni"></iframe>
        </div>
        );
    }
}

export default Privacy;