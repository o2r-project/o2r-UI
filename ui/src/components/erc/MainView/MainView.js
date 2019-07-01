import React from 'react';
import Iframe from 'react-iframe';

import './mainview.css';

class MainView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const url = "http://localhost/api/v1/compendium/jsEBA/data/" + this.props.fileName;
        return (
            <Iframe url={url} className="iframe"/>
        )
  }
}

export default MainView;