import React from 'react';
import httpRequests from '../../../helpers/httpRequests';
import { Slider, Typography} from '@material-ui/core';

class Manipulate extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            binding: null,
            widget: null,
            currentVal: null,
        }
    }

    getBinding() {
        const self = this;
        httpRequests.getFile("compendium/" + this.props.id + "/data/binding.json")
            .then(function(res) {
                console.log(res)
                self.setState({
                    binding:res.data[0],
                    widget:res.data[0].sourcecode[0].parameter[0].uiWidget,
                    currentVal:res.data[0].sourcecode[0].parameter[0].initialValue,
                });
            })
            .catch(function(res) {

            })
    }

    componentDidMount() {
        this.getBinding()
    }

    handleChange(evt, newVal) {
        if(newVal !== this.state.currentVal) {
            this.setState({
                currentVal: newVal,
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
                            defaultValue={this.state.widget.initialValue}
                            step={this.state.widget.stepSize}
                            valueLabelDisplay="on"
                            min={this.state.widget.minValue}
                            max={this.state.widget.maxValue}
                        />
                        <Typography id="discrete-slider" gutterBottom>
                            {this.state.widget.caption}
                        </Typography> 
                    </div> : ''
                }
            </div>
        )
    }
}

export default Manipulate;