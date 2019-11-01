import React from 'react';
import { tsBooleanKeyword } from '@babel/types';

class Download extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: "/api/v1/compendium/" + props.id + "/data/" + props.file
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.file !== prevProps.file) {
            this.setState({ url: "/api/v1/compendium/" + this.props.id + "/data/" + this.props.file })
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'left' }}>
                <br/>
                <p style={{ display: 'inline' }}> The file is to large to show. But you can download it </p> <a href={this.state.url} > here </a>
            </div>
        )
    }
}

export default Download;