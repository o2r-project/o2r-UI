import React from 'react';
import { Typography, Button, Tabs, Tab, Radio, RadioGroup, FormControlLabel, CircularProgress, Grid } from '@material-ui/core';

import httpRequests from '../../../helpers/httpRequests';
import FigureComparison from './FigureComparison/FigureComparison';
import SelectedSettings from './SelectedSettings/SelectedSettings';
import { search, removeHighlight } from '../MainView/MainView'
import OwnSlider from './Slider/Slider'
import './manipulate.css'
import config from '../../../helpers/config';

class Manipulate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bindings: props.bindings,
            binding: props.bindings[0],
            variant: "standart",
            params: this.getParams(props.bindings[0].sourcecode.parameter),
            fullUrl: '',
            settings: [],
            settingsText: [],
            text: "",
            index: 0,
            loading: false,
            processURL: false
        }

    }

    componentWillReceiveProps = () => this.setParameter.bind(this)

    runManipulateService() {
        const self = this;
        self.state.bindings.forEach((binding) => {
            httpRequests.runManipulationService(binding)
                .then(function (res) {
                    console.log(res)
                    self.setParameter();
                })
                .catch(function (res) {
                    console.log(res)
                })
        })
    }

    setParameter() {
        this.setState({ loading: true, processURL: true });
        let parameter = this.state.binding.sourcecode.parameter;
        let params = this.getParams(parameter)
        for (let i = 0; i < parameter.length; i++) {
            this.setState({
                [parameter[i].name]: parameter[i].val,
                params: params
            }, () => {
                setTimeout(() => {
                    this.buildFullUrl(this.state.binding);
                }, 1500);
            })
        }
    }

    buildFullUrl(binding) {
        this.setState({ loading: true, processURL: true });
        let url = config.baseUrl + 'compendium/' + binding.id + "/binding/" + binding.computationalResult.result.replace(/\s/g, '').toLowerCase() + '?';
        let settingsText = ""
        for (let i = 0; i < this.state.params.length; i++) {
            settingsText += " Parameter " + (i + 1) + ": " + this.state.params[i] + " = " + this.state[this.state.params[i]]
            url = url + 'newValue' + i + '=' + this.state[this.state.params[i]];
            if (i + 1 !== this.state.params.length) {
                url = url + '&';
            }
        }
        this.setState({
            fullUrl: url,
            text: settingsText,
            processURL: false
        })
    }

    imageLoaded = () => {
        this.setState({ loading: false })
    }

    getParams(parameter) {
        let params = [];
        for (let i = 0; i < parameter.length; i++) {
            params.push(parameter[i].name);
        }
        return params;
    }

    highlight = () => {
        for (var i in this.state.params) {
            search(this.state.params[i])
        }

    }

    componentDidMount = () => {
        this.runManipulateService();
        this.highlight();
        if (this.state.bindings.length > 5) {
            this.setState({ variant: "scrollable" })
        }
    }

    componentWillUnmount = () => removeHighlight();

    handleChange = name => (evt, newVal) => {
        if (this.state[name] !== newVal) {
            this.setState({
                [name]: newVal,
                loading: true
            }, () => {
                this.buildFullUrl(this.state.binding);
            });
        }
    }

    saveForComparison = () => {
        let state = this.state;
        let settings = state.settings;
        let include = true;
        settings.forEach((elem) => {
            elem === state.fullUrl ? include = false : include = true;
        });
        include ? state.settings.push(state.fullUrl) : console.log("already included");
        include ? state.settingsText.push(state.text) : console.log("");
        this.setState(state);
    }

    removeItem(index) {
        let items = this.state.settings;
        let texts = this.state.settingsText;
        items.splice(index, 1)
        texts.splice(index, 1)
        /** var filtered = items.filter(function (value, index, arr) {
             return value !== setting;
         });*/
        this.setState({
            settings: items,
            settingsText: texts
        });
    }

    setOriginalSettings(name) {
        this.setParameter()
        /**this.setState({
            value: 5
        })
        this.setState({
            [name]: 24,
        }, () => {
            alert("Sorry, this function isn't working, yet :(.")
            this.buildFullUrl(this.state.binding);
        });*/
    }

    changeFigure(e, newVal) {
        this.setState({
            index: newVal,
            binding: this.state.bindings[newVal],
        }, () => {
            this.setParameter();
            removeHighlight();
            this.highlight();
        })
        /*console.log(newVal)
        this.setState({
            binding: this.state.bindings[newVal],
            baseUrl: this.buildBaseUrl(this.state.bindings[newVal]),
            params: this.getParams(this.state.bindings[newVal].sourcecode.parameter),
        }, () => this.runManipulateService()
        );*/
    }

    render() {
        return (
            <div>
                {this.state.bindings.length > 1 ?
                    <Tabs
                        value={this.state.index}
                        onChange={this.changeFigure.bind(this)}
                        indicatorColor="primary"
                        textColor="primary"
                        variant={this.state.variant}
                        centered={this.state.bindings.length <= 5}
                    >
                        {this.state.bindings.map((binding, index) => (
                            <Tab label={binding.computationalResult.result} key={index} />
                        ))}
                    </Tabs>
                    : ''}
                <div className="view">
                    <Grid container>
                        <Grid item xs={8}>
                            {this.state.binding.sourcecode.parameter.map((parameter, index) => (
                                <div className="slider" key={index}>
                                    <Typography variant='caption'>
                                        {parameter.uiWidget.caption}
                                    </Typography>
                                    {parameter.uiWidget.type === 'slider'
                                        ?
                                        <OwnSlider value={this.state[parameter.name]} parameter={parameter} onChange={this.handleChange}
                                        />
                                        : ''}
                                    {parameter.uiWidget.type === 'radio'
                                        ? <RadioGroup aria-label="position" name="position" value={this.state[parameter.name]} onChange={this.handleChange(parameter.name)} row>
                                            {parameter.uiWidget.options.map((option, index) => (
                                                <FormControlLabel key={index}
                                                    value={option}
                                                    control={<Radio color="primary" />}
                                                    label={option}
                                                    checked={option == this.state[parameter.name]}
                                                />
                                            ))}
                                        </RadioGroup>
                                        : ''}

                                </div>

                            ))}
                        </Grid>
                        <Grid item xs={4} style={{ "min-height": "100px" }}>
                            <Button variant='contained' color='primary'
                                onClick={this.setOriginalSettings.bind(this)}
                            >
                                Original settings
                    </Button>
                            <br />
                            <br />
                            {this.state.loading ? <CircularProgress /> : ""}
                        </Grid>
                    </Grid>
                    <div className="image">
                        <Button variant="contained" color="primary" className="maniBtn"
                            onClick={this.saveForComparison.bind(this)}
                            disabled={this.state.settings.length === 2}
                        >
                            Save for comparison
                        </Button>
                        {this.state.settings.length > 0 ?
                            <SelectedSettings
                                settings={this.state.settingsText}
                                removeItem={this.removeItem.bind(this)} />
                            : ''}
                        <FigureComparison settings={this.state.settings} settingsText={this.state.settingsText} />
                        <br />
                        {this.state.processURL ? "" : <img src={this.state.fullUrl} alt="Image Loading Failed" onLoad={this.imageLoaded} onError={this.imageLoaded} />}
                    </div>
                </div>
            </div>
        )
    }
}

export default Manipulate;