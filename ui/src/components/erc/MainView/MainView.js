import React from 'react';
import Iframe from 'react-iframe';

import './mainview.css';

class MainView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const url = this.props.filePath;
        return (
            <Iframe url={url} className="iframe"/>
        )
  }
}

export default MainView;