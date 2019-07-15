import React from 'react';
import httpRequests from '../../../helpers/httpRequests';
import { Slider, Typography} from '@material-ui/core';

class Manipulate extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            binding: props.metadata.interaction[0],
            baseUrl: this.buildBaseUrl(props.metadata.interaction[0]),
            params: this.getParams(props.metadata.interaction[0].sourcecode.parameter),
            fullUrl: this.buildFullUrl,
        }
    }

    runManipulateService() {
        const self = this;
        httpRequests.runManipulationService(self.state.binding)
            .then(function(res){
                let parameter = res.data.data.sourcecode.parameter;
                for (let i=0; i<parameter.length; i++) {
                    self.setState({
                        [parameter[i].name]:parameter[i].val,
                    })
                }
            })
            .catch(function(res){
                console.log(res)
            })
    }

    buildBaseUrl(binding) {
        return 'http://localhost:' + binding.port + '/' + binding.computationalResult.result.replace(/\s/g, '').toLowerCase() + '?';
    }

    buildFullUrl() {
        let url = this.state.baseUrl;
        for (let i=0; i<this.state.params.length;i++) {
            url = url + 'newValue' + i + '=' + this.state[this.state.params[i]];
            if (i+1!==this.state.params.length) {
                url = url +'&';   
            }
        }
        this.setState({
            fullUrl:url
        })
    }

    getParams(parameter) {
        let params = [];
        for( let i=0; i<parameter.length; i++ ) {
            params.push(parameter[i].name);
        }
        return params;
    }

    componentDidMount() {
        this.runManipulateService()
    }

    handleChange = name => (evt, newVal) => {
        this.setState({
            [name]: newVal,
        });
        this.buildFullUrl();
    }

    render () {
        return (
            <div style={{width:'80%', marginLeft: '10%', marginTop: '10%'}}>
            {this.state.binding.sourcecode.parameter.map(parameter => (
                    <div style={{marginTop:'5%'}}>                
                        <Typography variant='caption'>
                            {parameter.uiWidget.caption}
                        </Typography>
                        <Slider
                            onChange={this.handleChange(parameter.name)}
                            defaultValue={parameter.val}
                            aria-labelledby="discrete-slider-custom"
                            valueLabelDisplay="auto"
                            step={parameter.uiWidget.stepSize}
                            valueLabelDisplay="on"
                            min={parameter.uiWidget.minValue}
                            max={parameter.uiWidget.maxValue}
                            marks={[{value: parameter.uiWidget.minValue, label: parameter.uiWidget.minValue},{value: parameter.uiWidget.maxValue, label: parameter.uiWidget.maxValue}]}
                        /> 
                    </div>
                ))}
            <img src={this.state.fullUrl} />
            </div>
        )
    }
}

export default Manipulate;