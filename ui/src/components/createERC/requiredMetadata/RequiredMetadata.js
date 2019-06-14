import React, { Component } from 'react';
import { Card, CardContent, TextField, CardActions, IconButton, Button, MenuItem,  } from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';
import licensesData from '../../../helpers/licenses.json'

import './requiredMetadata.css';

/** 
function openForm(){

}
function updateCard(){
 Yup.object()
}
*/
const textLicense=[];
const dataLicense=[];
const codeLicense=[];

function prepareLicense(){
    console.log(licensesData);
        for(var i in licensesData){
            if(licensesData[i].domain_content){ textLicense.push(licensesData[i])};
            if(licensesData[i].domain_data) {dataLicense.push(licensesData[i])};
            if(licensesData[i].domain_software) {codeLicense.push(licensesData[i])};
}
    console.log (textLicense)
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
                    //onClick={}
                    >
                        <i>Edit</i>
                    </IconButton>
                </CardActions>
                
                <Formik>
                <form 
                //onSubmit={}
                >
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
  * 
  * const handleChange2 = name => event =>{
      console.log(props);
      props.values.{[name]: event.target.value})
    }
*/

    const change= (name, e) => {
        console.log(e);
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
        {dataLicense.map(option =>(
            <MenuItem key={option.id} value={option}>
                {option.title}
                </MenuItem>
        ))}
    </TextField>
    <TextField
        id="textLicenses"
        select
        label="textLicenses"
        style={{ margin: 8 }}
        required
        fullWidth
        helperText={touched.textLicenses ? errors.textLicenses : ""}
        error={touched.textLicenses && Boolean(errors.textLicenses)}
        value={textLicenses}
        onChange={change.bind(null, "textLicenses")}
        margin="normal"
        variant="outlined"
        >
        {textLicense.map(option =>(
            <MenuItem key={option.id} value={option}>
                {option.title}
                </MenuItem>
        ))}
    </TextField>
    <TextField
        id="codeLicenses"
        select
        label="codeLicenses"
        style={{ margin: 8 }}
        required
        fullWidth
        helperText={touched.codeLicenses ? errors.codeLicenses : ""}
        error={touched.codeLicenses && Boolean(errors.codeLicenses)}
        value={codeLicenses}
        onChange={change.bind(null, "codeLicenses")}
        margin="normal"
        variant="outlined"
        >
        {codeLicense.map(option =>(
            <MenuItem key={option.id} value={option}>
                {option.title}
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
                
              { // </Card>
              }
            </div>
        );
    }
}

export default RequiredMetadata;