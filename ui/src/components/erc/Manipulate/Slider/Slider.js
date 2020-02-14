import React from 'react';
import { Slider } from '@material-ui/core';
class OwnSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }

    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.value !== prevProps.value) {
          this.setState({value: this.props.value});
        }
      }

    render() {
        return (
            <Slider
                onChange={this.props.onChange(this.props.parameter.name)}
                defaultValue={this.props.value}
                value={this.state.value}
                valueLabelDisplay="on"
                aria-labelledby="discrete-slider-custom"
                step={this.props.parameter.uiWidget.stepSize}
                min={this.props.parameter.uiWidget.minValue}
                max={this.props.parameter.uiWidget.maxValue}
                marks={[{ value: this.props.parameter.uiWidget.minValue, label: this.props.parameter.uiWidget.minValue },
                { value: this.props.parameter.uiWidget.maxValue, label: this.props.parameter.uiWidget.maxValue }]}
            />)
        }
    }

export default OwnSlider;