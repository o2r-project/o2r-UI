import React from 'react';

import config from '../../../../../helpers/config'


class Download extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: config.baseUrl + "compendium/" + props.id + "/data/" + props.file
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.file !== prevProps.file) {
            this.setState({ url: config.baseUrl + "compendium/" + this.props.id + "/data/" + this.props.file })
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'left' }}>
                <br />
                <p style={{ display: 'inline' }}> The file is to large to show. But you can download it </p> <a href={this.state.url} > here </a>
            </div>
        )
    }
}

export default Download;