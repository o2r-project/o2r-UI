import React from 'react';
import { Slider, Typography, Button } from '@material-ui/core';
import uuid from 'uuid/v1';

import httpRequests from '../../../helpers/httpRequests';
import FigureComparison from './FigureComparison/FigureComparison';
import SelectedSettings from './SelectedSettings/SelectedSettings';

class Manipulate extends React.Component {

    constructor( props ) {
        super ( props );
        this.state={
            binding: props.binding,
            baseUrl: this.buildBaseUrl(props.binding),
            params: this.getParams(props.binding.sourcecode.parameter),
            fullUrl: '',
            settings:[],
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

    componentDidMount = () => this.runManipulateService();

    handleChange = name => ( evt, newVal ) => {
        this.setState({
            [name]: newVal,
        }, () => {
            this.buildFullUrl();
        });
    }

    saveForComparison = () => {
        let state = this.state;
        let settings = state.settings;
        let include = true;
        settings.forEach( function (elem) {
            elem === state.fullUrl ? include = false : '';
        });
        include ? state.settings.push(state.fullUrl) : console.log("already included");
        this.setState(state);
    }

    removeItem ( setting ) {
        let items = this.state.settings;
        var filtered = items.filter(function(value, index, arr){
            return value !== setting;
        });
        this.setState({
            settings: filtered
        });
    }

    render () {
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
                <img src={this.state.fullUrl} alt="" />
                <Button variant="contained" color="primary" 
                    onClick={this.saveForComparison.bind(this)}
                    disabled={this.state.settings.length===2}
                >
                    Save for comparison
                </Button>
                {this.state.settings.length>0 ?
                    <SelectedSettings 
                        settings={this.state.settings}
                        removeItem={this.removeItem.bind(this)} />                
                :''}
                <FigureComparison settings={this.state.settings} />
            </div>
        )
    }
}

export default Manipulate;