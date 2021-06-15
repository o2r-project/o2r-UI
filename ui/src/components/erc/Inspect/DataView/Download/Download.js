import React from 'react';



class Download extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: config.baseUrl + "compendium/" + props.id + "/data/" + props.file // eslint-disable-line
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.file !== prevProps.file) {
            this.setState({ url: config.baseUrl + "compendium/" + this.props.id + "/data/" + this.props.file }) // eslint-disable-line
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <br />
                <p style={{ display: 'inline', textAlign: "center" }}> The file can not be displayed, because it is not supported or too large. However you can download it </p> <a href={this.state.url} > here </a>
            </div>
        )
    }
}

export default Download;