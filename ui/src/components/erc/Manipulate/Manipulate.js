import React from 'react';
import { Slider, Typography} from '@material-ui/core';
import uuid from 'uuid/v1';

import httpRequests from '../../../helpers/httpRequests';

class Manipulate extends React.Component {

    constructor( props ) {
        super ( props );
        this.state={
            binding: props.binding,
            baseUrl: this.buildBaseUrl(props.binding),
            params: this.getParams(props.binding.sourcecode.parameter),
            fullUrl: '',
        }
    }

    runManipulateService () {
        const self = this;
        httpRequests.runManipulationService(self.state.binding)
            .then(function(res){
                let parameter = res.data.data.sourcecode.parameter;
                for (let i=0; i<parameter.length; i++) {
                    self.setState({
                        [parameter[i].name]:parameter[i].val,
                    }, () => {
                        setTimeout(()=>{
                            self.buildFullUrl();
                        },1500);
                    })
                }
            })
            .catch(function(res){
                console.log(res)
            })
    }

    buildBaseUrl ( binding ) {
        return 'http://localhost:' + binding.port + '/' + binding.computationalResult.result.replace(/\s/g, '').toLowerCase() + '?';
    }

    buildFullUrl () {
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

    getParams ( parameter ) {
        let params = [];
        for( let i=0; i<parameter.length; i++ ) {
            params.push(parameter[i].name);
        }
        return params;
    }

    componentDidMount () {
        this.runManipulateService()
    }

    handleChange = name => ( evt, newVal ) => {
        this.setState({
            [name]: newVal,
        }, () => {
            this.buildFullUrl();
        });
    }

    render () {
        console.log(this.state.fullUrl)
        return (
            <div style={{width:'80%', marginLeft: '10%'}}>
                {this.state.binding.sourcecode.parameter.map(parameter => (
                    <div style={{marginTop:'5%'}} key={uuid()}>                
                        <Typography variant='caption'>
                            {parameter.uiWidget.caption}
                        </Typography>
                        <Slider
                            onChange={this.handleChange(parameter.name)}
                            defaultValue={parameter.val}
                            value={this.state[parameter.name]}
                            aria-labelledby="discrete-slider-custom"
                            valueLabelDisplay="on"
                            step={parameter.uiWidget.stepSize}
                            min={parameter.uiWidget.minValue}
                            max={parameter.uiWidget.maxValue}
                            marks={[{value: parameter.uiWidget.minValue, label: parameter.uiWidget.minValue},
                                    {value: parameter.uiWidget.maxValue, label: parameter.uiWidget.maxValue}]}
                        /> 
                    </div>
                ))}
                <img src={this.state.fullUrl} />
            </div>
        )
    }
}

export default Manipulate;