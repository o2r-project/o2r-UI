import React, { Component } from 'react';
import {
  makeStyles, Stepper, Step, StepLabel, StepContent,
  Button, Typography, Paper, Select, TextField, Radio, RadioGroup, FormControlLabel, FormControl
} from "@material-ui/core";

import httpRequests from '../../../helpers/httpRequests';
import CodeView from '../../erc/CodeView/CodeView';
import Manipulate from '../../erc/Manipulate/Manipulate';
import './bindings.css';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  connectorActive: {
    '& $connectorLine': {
      borderColor: theme.palette.secondary.main,
    },
  },
  connectorCompleted: {
    '& $connectorLine': {
      borderColor: theme.palette.primary.main,
    },
  },
  connectorDisabled: {
    '& $connectorLine': {
      borderColor: theme.palette.grey[100],
    },
  },
  connectorLine: {
    transition: theme.transitions.create('border-color'),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '100%',
  },
  numField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25%',
  },
}));

function getSteps() {
  return ['Specify the result', 'Identify the plot()-Function', 'Select the parameter', 'Configure a UI widget'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Select from the list below';
    case 1:
      return 'Select from the list below';
    case 2:
      return 'Select by marking the parameter in the code on the left';
    case 3:
      return 'Manipulate using a slider or radio buttons?';
    default:
      return 'Unknown step';
  }
}

function VerticalLinearStepper(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [result, setResult] = React.useState();
  const [widget, setWidget] = React.useState('slider');
  const [preview, setPreview] = React.useState(false);
  const [disabled, disable] = React.useState(true);
  const parameter = props.binding.sourcecode.parameter[0].text;
  const plot = props.binding.sourcecode.plotFunction;
  //bad hack:
  if (parameter !== null && disabled) {
    disable(false);
  }
  if (plot !== null && disabled) {
    disable(false);
  }

  function handlePlotChange(e) {
    disable(false);
  }

  function handleParameterChange(e) {
    disable(false);
  }

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    props.setStep(activeStep + 1);
    disable(true);
    if (activeStep === 3) {
      props.saveBinding();
    }
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    props.setStep(activeStep - 1);
    disable(false);
  }

  function handleReset() {
    setActiveStep(0);
    props.setStep(0)
  }

  function handleResultChange(e) {
    if (e.target.value === '') {
      disable(true);
      setResult(e.target.value);
    } else {
      setResult(e.target.value);
      props.setResult(e.target.value);
      disable(false);
    }
  }

  function handleWidgetChange(e) {
    setWidget(e.target.value);
  }

  function handleSlider(e, field) {
    props.setSlider(field, e.target.value);
  }

  function showPreview() {
    httpRequests.sendBinding(props.binding)
      .then(function (res) {
        console.log("created binding")
        httpRequests.runManipulationService(props.binding)
          .then(function (res2) {
            props.switchCodePreview();
          })
          .catch(function (res2) {
            console.log(res2)
          })
      })
      .catch(function (res) {
        console.log(res)
      })
    setPreview(true);
  }

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel><h3>{label}</h3></StepLabel>
            <StepContent>
              <Typography><b>{getStepContent(index)}</b></Typography>
              {activeStep === 0 ?
                <Select
                  native
                  value={result}
                  onChange={handleResultChange}
                >
                  <option value='' />
                  <option value='Figure 1'>Figure 1</option>
                  <option value='Figure 2'>Figure 2</option>
                  <option value='Figure 3'>Figure 3</option>
                </Select>
                : ''}
              {activeStep === 1 ?
                <TextField style={{width:'100%'}}
                  id="plotfunction"
                  label="plot() function"
                  className={classes.textField}
                  value={plot}
                  margin="normal"
                  variant="outlined"
                  onChange={handlePlotChange}
                  disabled
                />
                : ''}
              {activeStep === 2 ?
                <TextField
                  id="parameter"
                  label="Parameter"
                  className={classes.textField}
                  value={parameter}
                  margin="normal"
                  variant="outlined"
                  onChange={handleParameterChange}
                  disabled
                />
                : ''}
              {activeStep === 3 ?
                <div>
                  <div>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="position" name="position" value={widget} onChange={handleWidgetChange} row>
                        <FormControlLabel
                          value="slider"
                          control={<Radio color="primary" />}
                          label="Slider"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          value="radio"
                          control={<Radio color="primary" />}
                          label="Radio"
                          labelPlacement="start"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  {widget === 'slider' ?
                    <div>
                      <TextField
                        id="min"
                        label="Minimum value"
                        onChange={(e) => handleSlider(e, 'minValue')}
                        type="number"
                        className={classes.numField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        id="max"
                        label="Maximum value"
                        onChange={(e) => handleSlider(e, 'maxValue')}
                        type="number"
                        className={classes.numField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        id="step"
                        label="Step size"
                        onChange={(e) => handleSlider(e, 'stepSize')}
                        type="number"
                        className={classes.numField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                      />
                      <TextField
                        id="caption"
                        label="Caption"
                        onChange={(e) => handleSlider(e, 'caption')}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                        variant="outlined"
                      />
                      <Button variant="contained" color="primary"
                        onClick={showPreview}
                      >Preview</Button>
                    </div>
                    : <div>
                      radio
                        </div>
                  }
                </div>
                : ''}
              <div className={classes.actionsContainer} style={{ marginTop: '5%' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                  disabled={disabled}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );
}

class Bindings extends Component {
  constructor ( props ) {
      super ( props );
      this.state = {
        metadata:props.metadata,
        creationStep:0,
        bindings: [],
        binding:{
          id: props.compendium_id,
          computationalResult: {
            type: null,
            result: null,
          },
          port:5005,
          sourcecode: {
            file: props.metadata.mainfile,
            plotFunction: '',
            codelines: [{"start":30,"end":429}],
            parameter: [{
              text: '',
              name: '',
              val: '',
              codeline: null,
              uiWidget: {
                type: 'slider',
                minValue: null,
                maxValue: null,
                caption: null,
                stepSize: null,
              },
            }]
        },
      },
      codeview:true,
    }
  }

  handleMouseUp ( e ) {
    if (this.state.creationStep === 1) {
      this.setCode(window.getSelection().getRangeAt(0).toString());
    } else if (this.state.creationStep === 2) {
      this.setParameter(window.getSelection().getRangeAt(0).toString());
    }
  }

  setResult ( result ) {
    if (result.indexOf("Figure") >= 0) {
      let state = this.state;
      state.binding.computationalResult = {
        type: 'figure',
        result: result,
      }
      this.setState(state);
    }
  }

  setStep ( step ) {
    this.setState({
      creationStep: step
    });
  }

  setParameter ( param ) {
    let text = param;
    let name = param.split('<-')[0].trim();
    let val = Number(param.split('<-')[1].trim());
    let state = this.state;
    state.binding.sourcecode.parameter[0].text = text;
    state.binding.sourcecode.parameter[0].name = name;
    state.binding.sourcecode.parameter[0].val = val;
    this.setState(state);
  }

  setCode ( code ) {
    let state = this.state;
    state.binding.sourcecode.plotFunction = code;
    this.setState(state);
  }

  setSlider ( key, val ) {
    let state = this.state;
    let newVal = val;
    if (!isNaN(newVal)) {
      newVal = Number(newVal)
    }
    state.binding.sourcecode.parameter[0].uiWidget[key] = newVal;
    this.setState(state);
  }

  saveBinding () {
    let state = this.state;
    state.metadata.interaction.push(this.state.binding);
    this.setState(state, this.props.updateMetadata(this.state.metadata));
  }

  switchCodePreview () {
    this.setState({
      codeview:!this.state.codeview,
    });
  }

  render() {
    console.log(this.state)
    return (
      <div style={{ height: '100%' }}>
        {this.state.codeview ?
          <div>
            <Typography>RMarkdown</Typography>
            <div className='codeView'
              onMouseUp={this.handleMouseUp.bind(this)}
            >
              <CodeView code={this.props.codefile.data} class/>
            </div>
          </div>
          : 
          <div>
            <Typography>Preview of the interactive figure</Typography>
            <div className='codeView'>
              <Manipulate binding={this.state.binding}></Manipulate>
              <Button variant="contained" color="primary"
                onClick={this.switchCodePreview.bind(this)}
                >
                Back to code
              </Button>
            </div>
          </div>
        }
        <div style={{ height: '100%', width: '100%'}}>
          <VerticalLinearStepper
            setResult={this.setResult.bind(this)}
            binding={this.state.binding}
            setStep={this.setStep.bind(this)}
            setSlider={this.setSlider.bind(this)}
            saveBinding={this.saveBinding.bind(this)}
            switchCodePreview={this.switchCodePreview.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Bindings;


/*
    getBindingJson(erc) {
        return {
            "id": erc.id,
            "computationalResult": {
                "type": "figure",
                "result": "Figure 3"
            },
            "port": 5001,
            "sourcecode": {
                "file": erc.metadata.o2r.mainfile,
                "codelines": [{"start":30,"end":424}],
                "parameter":
                    [{
                       "text":"velocity <- 0.5",
                       "name":"velocity",
                       "val":0.5,
                       "codeline":344,
                       "uiWidget":{
                          "type":"slider",
                          "minValue":0.1,
                          "maxValue":3.5,
                          "stepSize":0.1,
                          "caption":"Changing the velocity parameter affects damage costs"
                       }
                    },
                    {
                        "text":"duration <- 24",
                        "name":"duration",
                        "val":24,
                        "codeline":346,
                        "uiWidget":{
                           "type":"slider",
                           "minValue":1,
                           "maxValue":24,
                           "stepSize":1,
                           "caption":"Changing the duration parameter affects damage costs"
                        }
                     },
                     {
                        "text":"sediment <- 0.05",
                        "name":"sediment",
                        "val":0.05,
                        "codeline":345,
                        "uiWidget":{
                           "type":"slider",
                           "minValue":0.01,
                           "maxValue":1.0,
                           "stepSize":0.1,
                           "caption":"Changing the sediment parameter affects damage costs"
                        }
                     }
                    ],
                 "data":[
                    {
                       "file":"costs.csv",
                       "column":[
                          {
                             "name":"Costs",
                             "rows":"1-37"
                          }
                       ]
                    }
                 ]
            }
        }
    }
*/