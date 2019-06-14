import React, { Component } from 'react';
import { Card, CardContent, TextField, CardActions, IconButton, Button, MenuItem,  } from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';
import data from '../../../helpers/licenses.json'

import './requiredMetadata.css';

function openForm(){

}
function updateCard(){
 Yup.object()
}

function prepareLicense(){
    console.log(data);
    //httpRequests.getLicenses().then(function (result){console.log(result)})
}


function Authors(props) {
    const listItems = props.authors.authors.map((author) => {
        
        return (
            <Card key={author} id="authorcard">
                <CardContent>
                    <p>Max Power</p>
                    <p>Institute for Geoinformatics</p>
                    <p>0000 000 000 1</p>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-Label="Edit"
                    onClick={openForm}>
                        <i>Edit</i>
                    </IconButton>
                </CardActions>
                
                <Formik>
                <form onSubmit={updateCard}>
                    <input
                    type='text'
                    name='Name'/>
            
                </form>
        </Formik> 
            </Card>
        );

        
    });
    console.log(listItems);
    return listItems;
}

const licenses =[
    {
        value: 'AFL-3.0',
        label: 'Academic Free License 3.0 (AFL-3.0)'
    },
    {
        value: 'Against-DRM',
        label: 'Against DRM (Against-DRM) '
    },
    {
        value: 'CC-BY-4.0',
        label: 'Creative Commons Attribution 4.0 (CC-BY-4.0)'
    },
    {
        value: 'CC-BY-NC-4.0',
        label: 'Creative Commons Attribution-NonCommercial 4.0 (CC-BY-NC-4.0) '
    },
    {
        value: 'CC-BY-SA-4.0',
        label: 'Creative Commons Attribution Share-Alike 4.0 (CC-BY-SA-4.0)'
    },
    {
        value: 'CC0 1.0',
        label: 'CC0 1.0 (CC0-1.0)'
    },
    {
        value: 'DSL',
        label: 'Design Science License (DSL)'
    },
    {
        value: 'FAL-1.3',
        label: 'Free Art License 1.3 (FAL-1.3)'
    },
    {
        value: 'GFDL-1.3-no-cover-text-no invariant-sections',
        label: 'GNU Free Documentation License 1.3 with no cover texts and no invariant sections (GFDL-1.3-no-cover-text-no invariant-sections)'
    },
    {
        value: 'MirOS',
        label: 'MirOS Licence (MirOS)'
    },
    {
        value: 'NPOSL-3.0',
        label: 'Non-Profit Open Software License 3.0 (NPOSL-3.0)'
    },
    {
        value: 'OGL-Canada-2.0',
        label: 'Open Government License 2.0 (Canada) (OGL-Canada-2.0)'
    },
    {
        value: 'OGL-UK-1.0',
        label: 'Open Government Licence 1.0 (United Kingdom) (OGL-UK-1.0)'
    },
    {
        value: 'OGL-UK-2.0',
        label: 'Open Government Licence 2.0 (United Kingdom) (OGL-UK-2.0)'
    },
    {
        value: 'OGL-UK-3.0',
        label: 'Open Government Licence 3.0 (United Kingdom) (OGL-UK-3.0)'
    },
    {
        value: 'OSL-3.0',
        label: 'Open Software License 3.0 (OSL-3.0)'
    },
    {
        value: 'Talis',
        label: 'Talis Community License (Talis)'
    },
    {
        value: 'hesa-withrights',
        label: 'Higher Education Statistics Agency Copyright with data.gov.uk rights (hesa-withrights)'
    },
    {
        value: 'localauth-withrights',
        label: 'Local Authority Copyright with data.gov.uk rights (localauth-withrights)'
    },
    {
        value: 'other.at',
        label: 'Other (Attribution) (other-at)'
    },
    {
        value: 'other-open',
        label: ' Other (Open) (other-open) '
    },
    {
        value: 'other-pd',
        label: 'Other (Public Domain) (other-pd)'
    },
    {
        value: 'ukclickusepsi',
        label: 'UK Click Use PSI (ukclickusepsi)'
    },
    {
        value: 'ukcrown-withrights',
        label: 'UK Crown Copyright with data.gov.uk rights (ukcrown-withrights)'
    },
    {
        value: 'ukpsi',
        label: 'UK PSI Public Sector Information (ukpsi)'
    },

    

    

    
    
]
const validationSchema= Yup.object({
    title: Yup.string()
        .required('Titel is required'),
    abstract: Yup.string()
        .required('Abstract is required'),
    publicationDate: Yup.date().max(new Date, 'No Valid Date')
    .required("Date is require"),
    displayFile: Yup.string()
        .required('DisplayFile is required'),
    mainFile: Yup.string()
        .required('MainFile is required'),
    textLicenses: Yup.string()
        .required('Licenses is requires'),
    codeLicenses: Yup.string()
        .required('Licenses is requires'),
    dataLicenses: Yup.string()
        .required('Licenses is requires')
})



const Form = props =>{
    const{
        values: {title, abstract, publicationDate, displayFile, mainFile, textLicenses, dataLicenses, codeLicenses},
        errors,
        touched, 
        handleChange,
        isValid,
        setFieldTouched
    }=props
/** 
  const handleChange2 = name => event =>{
      console.log(props);
      this.setState{[name]: event.target.value})
    }*/

    const change= (name, e) => {
        e.persist();
        console.log(props);
        handleChange(e);
        setFieldTouched(name, true, false)
    }
    return(
        <form
        onSubmit={()=> {
            alert('submit');
        }}
        >
            <br/>
            <Card> 
                <h4>Title</h4>                   
    <TextField
        id="title"
        label="Required"
        style={{ margin: 8 }}
        placeholder="Title"
        fullWidth
        required
        helperText={touched.title ? errors.title : ""}
        error={touched.title && Boolean(errors.title)}
        value={title}
        onChange={change.bind(null, "title")}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
            shrink: true,
    }}/>
    </Card>
    <br/>
    <Card> 
    <h4>Abstract</h4>                   
    <TextField
        id="abstract"
        label="Required"
        style={{ margin: 8 }}
        placeholder="Abstract"
        fullWidth
        required
        helperText={touched.abstract ? errors.abstract : ""}
        error={touched.abstract && Boolean(errors.abstract)}
        value={abstract}
        onChange={change.bind(null, "abstract")}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
            shrink: true,
    }}/>
    </Card>
    <br/>
    <Card> 
    <h4>Publication Date</h4>                
    <TextField
        id="date"
        label="Publication date"
        type="date"
        style={{ margin: 8 }}
        required
        helperText={touched.publicationDate ? errors.publicationDate : ""}
        error={touched.publicationDate && Boolean(errors.publicationDate)}
        value={publicationDate}
        onChange={change.bind(null, "publicationDate")}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
            shrink: true,
    }}/>
    </Card>
    <br/>
    <Card> 
    <h4>Display File</h4>                   
    <TextField
        id="displayFile"
        label="displayFile"
        style={{ margin: 8 }}
        placeholder="display.html"
        fullWidth
        required
        helperText={touched.displayFile ? errors.displayFile : ""}
        error={touched.displayFile && Boolean(errors.displayFile)}
        value={displayFile}
        onChange={change.bind(null, "displayFile")}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
            shrink: true,
    }}/>
    </Card>
    <br/>
    <Card>
    <h4>Main File</h4>                   
    <TextField
        id="mainFile"
        label="mainFile"
        style={{ margin: 8 }}
        placeholder="main.Rmd"
        fullWidth
        required
        helperText={touched.mainFile ? errors.mainFile : ""}
        error={touched.mainFile && Boolean(errors.mainFile)}
        value={mainFile}
        onChange={change.bind(null, "mainFile")}
        margin="normal"
        variant="outlined"
        InputLabelProps={{
            shrink: true,
    }}/>
    </Card>
    <br/>
    <Card>
    <h4>Licenses</h4>  
    <p>Templates</p>  
    <Button
    ></Button>               
    <TextField
        id="dataLicenses"
        select
        label="dataLicenses"
        style={{ margin: 8 }}
        required
        fullWidth
        helperText={touched.dataLicenses ? errors.dataLicenses : ""}
        error={touched.dataLicenses && Boolean(errors.dataLicenses)}
        value={dataLicenses}
        onChange={change.bind(null, "dataLicenses")}
        margin="normal"
        variant="outlined"
        >
        {licenses.map(option =>(
            <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
        ))}
    </TextField>
    </Card>
    <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                disabled={!isValid}
            >
                Submit
            </Button>
            </form>
    )
}

class RequiredMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: props,
        }
    };

    render() {
        const values = {Titel: "",
        Abstract: "",
        PublicationDate:"",
        DisplayFile: "",
        MainFile: "",
        dataLicenses: "",}
        prepareLicense();

        return (
             
            <div>
                {//<Card>
                }
                    <h4>Authors</h4>
                    <Authors 
                        authors={this.props}>
                    </Authors>
                    <Formik
                        render={props => <Form{...props}/>}
                        initialValues ={values}
                        validationSchema = {validationSchema}
                        />
                    <TextField
                        id="date"
                        label="Publication date"
                        type="date"
                        //defaultValue="2017-05-24"
                        //className={classes.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                    />
              { // </Card>
              }
            </div>
        );
    }
}

export default RequiredMetadata;