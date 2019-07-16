import React, { Component } from 'react';
import { Input, makeStyles, Stepper, Step, StepLabel, StepContent, Button, Typography, Paper, Select, TextField, InputLabel } from "@material-ui/core";
import uuid from 'uuid/v1';

import './bindings.css';
import CodeView from '../../erc/CodeView/CodeView';

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
    },
}));

function getSteps() {
    return ['Result', 'Parameter', 'UI widget'];
}  

function getStepContent(step) {
    switch (step) {
      case 0:
        return 'Select a result';
      case 1:
        return 'Select a parameter';
      case 2:
        return 'Configure a UI widget';
      default:
        return 'Unknown step';
    }
  }

function VerticalLinearStepper(props) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [result, setResult] = React.useState({
        value: 'Figure 1',
      });
    const parameter = props.selectedParam;
  
    function handleNext() {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  
    function handleBack() {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
    }
  
    function handleReset() {
      setActiveStep(0);
    }

    function handleResultChange(e) {
        setResult({
            value: e.target.value,
        })
    }
  
    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel><h1>{label}</h1></StepLabel>
                        <StepContent>
                        <Typography><b>{getStepContent(index)}</b></Typography>
                            {activeStep === 0 ?
                                <Select
                                    native
                                    value={result.figure}
                                    onChange={handleResultChange}
                                    >
                                    <option value='Figure 1'>Figure 1</option>
                                    <option value='Figure 2'>Figure 2</option>
                                    <option value='Figure 3'>Figure 3</option>
                                </Select>
                                : ''}
                            {activeStep === 1 ?
                                <TextField
                                    id="outlined-name"
                                    label="Parameter"
                                    className={classes.textField}
                                    value={parameter}
                                    margin="normal"
                                    variant="outlined"
                                />: ''
                            }
                            <div className={classes.actionsContainer} style={{marginTop:'5%'}}>
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
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            bindings: [],
            id: props.compendium_id,
            computationalResult: {
                type: null,
                result: null,
            },
            port:5001,
            sourcecode: {
                file: props.mainfile,
                codeLines: null,
                parameter: [{
                    text: null,
                    name: null,
                    val: null,
                    codelines: null,
                    uiWidget: null,
                }]
            }
        }
    }

    componentDidMount() {

    }

    handleMouseUp(e){
        this.setState({
            sourcecode: {
                parameter: {
                    text: window.getSelection().getRangeAt(0).toString()
                }
            }
        })
    }

    handleFormSubmit(){

    }

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
                "codeLines": [{"start":30,"end":424}],
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

    setResult(result) {
        console.log(result.target.value)
        this.setState({
            computationalResult: {
                type: 'figure',
                result: 'Figure 3',
            }
        });
    }

    render() {
        return (
            <div>
                <div className="code" style={{width:'60%', marginBottom:'2%', float:'left'}} onMouseUp={this.handleMouseUp.bind(this)}>
                    <CodeView code={this.props.codefile.data}></CodeView>
                </div>
                <div>
                    <VerticalLinearStepper className="steps" setResult={this.setResult.bind(this)} selectedParam={this.state.sourcecode.parameter.text}></VerticalLinearStepper>
                </div>
            </div>
        );
    }
}

export default Bindings;