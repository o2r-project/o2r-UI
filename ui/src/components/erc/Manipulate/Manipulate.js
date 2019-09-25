import React from 'react';
import { Slider, Typography, Button, Tabs, Tab, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';

import httpRequests from '../../../helpers/httpRequests';
import FigureComparison from './FigureComparison/FigureComparison';
import SelectedSettings from './SelectedSettings/SelectedSettings';
import {search, removeHighlight} from '../MainView/MainView'
import './manipulate.css'
import config from '../../../helpers/config';

class Manipulate extends React.Component {

    constructor( props ) {
        super ( props );
        this.state={
            bindings: props.bindings,
            binding: props.bindings[0],
            params: this.getParams(props.bindings[0].sourcecode.parameter),
            fullUrl: '',
            settings:[],
            index:0,
        }
        this.setParameter = this.setParameter.bind(this);
    }

    runManipulateService () {
        const self = this;
        self.state.bindings.forEach((binding)=>{
            httpRequests.runManipulationService(binding)
            .then(function(res){
                console.log(res)
                self.setParameter();
            })
            .catch(function(res){
                console.log(res)
            })
        })
    }

    setParameter () {
        let parameter = this.state.binding.sourcecode.parameter;
        for (let i=0; i<parameter.length; i++) {
            this.setState({
                [parameter[i].name]:parameter[i].val,
            }, () => {
                setTimeout(()=>{
                    this.buildFullUrl(this.state.binding);
                },1500);
            })
        }
    }

    buildFullUrl ( binding ) {
        let url = config.baseUrl + 'compendium/' + binding.id + "/binding/" + binding.computationalResult.result.replace(/\s/g, '').toLowerCase() + '?';
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

    highlight = () =>
    {
        for(var i in this.state.params){
            search(this.state.params[i])
        }

    }

    componentDidMount = () => {
        console.log(search)
        this.runManipulateService();
        this.highlight();
    console.log(search)}

    handleChange = name => ( evt, newVal ) => {
        this.setState({
            [name]: newVal,
        }, () => {
            this.buildFullUrl(this.state.binding);
        });
    }

    saveForComparison = () => {
        let state = this.state;
        let settings = state.settings;
        let include = true;
        settings.forEach( (elem) => {
            elem === state.fullUrl ? include = false : include = true;
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

    setOriginalSettings ( name ) {
        this.setState({
            [name]: 24,
        }, () => {
            alert("Sorry, this function isn't working, yet :(.")
            this.buildFullUrl(this.state.binding);
        });
    }

    changeFigure ( e, newVal ) {
        this.setState({
            index: newVal,
            binding: this.state.bindings[newVal],
        }, ()=> {this.setParameter();
        removeHighlight();
        this.highlight();})
        /*console.log(newVal)
        this.setState({
            binding: this.state.bindings[newVal],
            baseUrl: this.buildBaseUrl(this.state.bindings[newVal]),
            params: this.getParams(this.state.bindings[newVal].sourcecode.parameter),
        }, () => this.runManipulateService()
        );*/
    }

    render () {
        console.log(this.state.fullUrl)
        return (
            <div>
                {this.state.bindings.length>1 ?
                    <Tabs
                    value={this.state.index}
                    onChange={this.changeFigure.bind(this)}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    >
                    {this.state.bindings.map((binding, index) => (
                        <Tab label={binding.computationalResult.result} key={index}/>
                    ))}
                    </Tabs>
                : ''}
                <div className="view">
                    <Button variant='contained' color='primary'
                        onClick={this.setOriginalSettings.bind(this, "duration")}
                    >
                        Original settings
                    </Button>
                    {this.state.binding.sourcecode.parameter.map((parameter, index) => (
                        <div className="slider" key={index}>                
                            <Typography variant='caption'>
                                {parameter.uiWidget.caption}
                            </Typography>
                            {parameter.uiWidget.type === 'slider' 
                            ?<Slider
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
                            :''}
                            {parameter.uiWidget.type === 'radio' 
                            ?<RadioGroup aria-label="position" name="position" value={this.state[parameter.name]} onChange={this.handleChange(parameter.name)} row>
                                {parameter.uiWidget.options.map((option, index) => (
                                    <FormControlLabel key={index}
                                        value={option}
                                        control={<Radio color="primary" />}
                                        label={option}
                                        //checked={parameter.val === Number(option)}
                                  />
                                ))}
                            </RadioGroup> 
                            :''}

                        </div>
                    ))}
                    <div className="image">
                        <img src={this.state.fullUrl} alt="" />
                        <Button variant="contained" color="primary" className="maniBtn"
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
                </div>
            </div>
        )
    }
}

export default Manipulate;