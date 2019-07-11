import React from 'react';
import httpRequests from '../../../helpers/httpRequests';
import { Slider, Typography} from '@material-ui/core';

class Manipulate extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            binding: props.metadata.interaction[0],
            widget: props.metadata.interaction[0].code.parameter.uiWidget,
            currentVal: props.metadata.interaction[0].code.parameter.initialValue,
            marks: [{
                    value: props.metadata.interaction[0].code.parameter.uiWidget.minValue,
                    label: props.metadata.interaction[0].code.parameter.uiWidget.minValue,
                  },
                  {
                    value: props.metadata.interaction[0].code.parameter.uiWidget.maxValue,
                    label: props.metadata.interaction[0].code.parameter.uiWidget.maxValue,
                  },],
            url: 'http://localhost:5001/figure3?newValue='+props.metadata.interaction[0].code.parameter.initialValue,
        }
    }

    runManipulateService() {
        const self = this;
        httpRequests.runManipulationService(self.props.metadata.interaction[0])
            .then(function(res){
                console.log(res)
                self.setState({
                    url: 'http://localhost:' + res.data.data.port + res.data.data.result.value.replace(/\s/g, '').toLowerCase() + 
                            '?newValue=' + res.data.code.parameter.initialValue,
                });
            })
            .catch(function(res){

            })
    }

    componentDidMount() {
        this.runManipulateService()
    }

    handleChange(evt, newVal) {
        if(newVal !== this.state.currentVal) {
            this.setState({
                url: 'http://localhost:5001/figure3?newValue=' + newVal,
            });
            console.log("update")
        }
    }

    render () {

        return (
            <div style={{width:'80%', marginLeft: '10%', marginTop: '10%'}}>
                {this.state.binding !== null ?
                    <div>                
                        <Slider
                            onChange={this.handleChange.bind(this)}
                            defaultValue={this.state.currentVal}
                            aria-labelledby="discrete-slider-custom"
                            valueLabelDisplay="auto"
                            step={this.state.widget.stepSize}
                            valueLabelDisplay="on"
                            min={this.state.widget.minValue}
                            max={this.state.widget.maxValue}
                            marks={this.state.marks}
                        />
                        <Typography id="discrete-slider" gutterBottom>
                            {this.state.widget.caption}
                        </Typography> 
                        <img src={this.state.url} />
                    </div> : ''
                }
            </div>
        )
    }
}

export default Manipulate;