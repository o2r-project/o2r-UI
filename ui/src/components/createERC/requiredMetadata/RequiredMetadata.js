import React, {Component} from 'react';
import {Card, TextField, Button, MenuItem, CardContent} from "@material-ui/core";
import {Formik} from 'formik';
import * as Yup from 'yup';

import licensesData from '../../../helpers/licenses.json'
import Authors from './Authors/Authors';

import './requiredMetadata.css';

import httpRequests from '../../../helpers/httpRequests';


const textLicenses = [];
const dataLicenses = [];
const codeLicenses = [];
const mostRestrictiveData = [];
const leastRestrictiveData = [];

function prepareLicense() {

    for (var i in licensesData) {
        if (licensesData[i].domain_content) {
            textLicenses.push(licensesData[i])
        }
        ;
        if (licensesData[i].domain_data) {
            dataLicenses.push(licensesData[i])
        }
        ;
        if (licensesData[i].domain_software) {
            codeLicenses.push(licensesData[i])
        }
        ;
    }
    mostRestrictiveData.push(textLicenses[3]);
    mostRestrictiveData.push(codeLicenses[28]);
    mostRestrictiveData.push(dataLicenses[1]);
    leastRestrictiveData.push(textLicenses[5]);
    leastRestrictiveData.push(codeLicenses[39]);
    leastRestrictiveData.push(dataLicenses[4]);

}


const validationSchema = Yup.object({
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
    textLicense: Yup.string()
        .required('License is requires'),
    codeLicense: Yup.string()
        .required('License is requires'),
    dataLicense: Yup.string()
        .required('License is requires')
});


const Form = props => {
    const {
        values: {title, abstract, publicationDate, displayFile, mainFile, textLicense, dataLicense, codeLicense},
        errors,
        touched,
        handleChange,
        isValid,
        setFieldTouched,
        setFieldValue
    } = props;


    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        setFieldTouched(name, true, false)
    };

    const handleClick = (name, e) => {
        if (name === "mostRestrictive") {
            setFieldValue('textLicense', mostRestrictiveData[0]);
            setFieldValue('codeLicense', mostRestrictiveData[1]);
            setFieldValue('dataLicense', mostRestrictiveData[2]);
        } else if (name === "leastRestrictive") {
            setFieldValue('textLicense', leastRestrictiveData[0]);
            setFieldValue('codeLicense', leastRestrictiveData[1]);
            setFieldValue('dataLicense', leastRestrictiveData[2]);
        }
    };

    return (
        <form id="form" onSubmit={props.handleSubmit}>
            <br/>
            <Card>
                <CardContent>
                    <h4>Title</h4>
                    <TextField
                        id="title"
                        label="Required"
                        style={{margin: 8, width: '80%'}}
                        placeholder="Title"
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
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <h4>Abstract</h4>
                    <TextField
                        id="abstract"
                        label="Required"
                        style={{margin: 8, width: '80%'}}
                        placeholder="Abstract"
                        required
                        multiline
                        rows={3}
                        helperText={touched.abstract ? errors.abstract : ""}
                        error={touched.abstract && Boolean(errors.abstract)}
                        value={abstract}
                        onChange={change.bind(null, "abstract")}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}/>
                </CardContent>
            </Card>
            <br/>
            <Authors authors={props.authors} onUpdate={props.onUpdate}></Authors>
            <br/>
            <Card>
                <CardContent>
                    <h4>Publication Date</h4>
                    <TextField
                        id="publicationDate"
                        label="Publication date"
                        type="date"
                        style={{margin: 8}}
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
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <h4>Display File</h4>
                    <TextField
                        id="displayFile"
                        label="displayFile"
                        style={{margin: 8, width: '10%'}}
                        placeholder="display.html"
                        required
                        select
                        helperText={touched.displayFile ? errors.displayFile : ""}
                        error={touched.displayFile && Boolean(errors.displayFile)}
                        value={displayFile}
                        onChange={change.bind(null, "displayFile")}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}>
                        {props.displayCandidates.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <h4>Main File</h4>
                    <TextField
                        id="mainFile"
                        label="mainFile"
                        select
                        style={{margin: 8, width: '10%'}}
                        placeholder="main.Rmd"
                        required
                        helperText={touched.mainFile ? errors.mainFile : ""}
                        error={touched.mainFile && Boolean(errors.mainFile)}
                        value={mainFile}
                        onChange={change.bind(null, "mainFile")}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                            shrink: true,
                        }}>
                        {props.mainFileCandidates.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </CardContent>
            </Card>
            <br/>
            <Card>
                <CardContent>
                    <h4>Licenses</h4>
                    <div>
                        <p>Templates</p>
                        <Button variant="contained" color="primary" style={{margin: "8px"}}
                                onClick={handleClick.bind(null, "mostRestrictive")}
                        >MOST RESTRICTIVE</Button>
                        <Button variant="contained" color="primary" style={{margin: "8px"}}
                                onClick={handleClick.bind(null, "leastRestrictive")}
                        >LEAST RESTRICTIVE</Button>
                    </div>

                    <TextField
                        id="textLicense"
                        select
                        label="Text License"
                        style={{margin: 8, width: '80%'}}
                        required
                        helperText={touched.textLicense ? errors.textLicense : ""}
                        error={touched.textLicense && Boolean(errors.textLicense)}
                        value={textLicense}
                        onChange={change.bind(null, "textLicense")}
                        margin="normal"
                        variant="outlined"
                    >
                        {textLicenses.map(option => (
                            <MenuItem key={option.id} value={option}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="codeLicense"
                        select
                        label="Code License"
                        style={{margin: 8, width: '80%'}}
                        required
                        helperText={touched.codeLicense ? errors.codeLicense : ""}
                        error={touched.codeLicense && Boolean(errors.codeLicense)}
                        value={codeLicense}
                        onChange={change.bind(null, "codeLicense")}
                        margin="normal"
                        variant="outlined"
                    >
                        {codeLicenses.map(option => (
                            <MenuItem key={option.id} value={option}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="dataLicense"
                        select
                        label="Data License"
                        style={{margin: 8, width: '80%'}}
                        required
                        helperText={touched.dataLicense ? errors.dataLicense : ""}
                        error={touched.dataLicense && Boolean(errors.dataLicense)}
                        value={dataLicense}
                        onChange={change.bind(null, "dataLicense")}
                        margin="normal"
                        variant="outlined"
                    >
                        {dataLicenses.map(option => (
                            <MenuItem key={option.id} value={option}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </TextField>
                </CardContent>
            </Card>
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid || !props.authorsValid}
            >
                Submit
            </Button>
        </form>
    )
}

class RequriedMetadata extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadata: null,
            title: "",
            abstract: "",
            publicationDate: "",
            displayFile: "",
            mainFile: "",
            dataLicense: "",
            textLicense: "",
            codeLicense: "",
            displayCandidates: null,
            mainFileCandidates: null,
            authors: [{
                author: "",
                affiliation: "",
                orcid: ""
            }],
            authorsValid: false,
        }
    };

     getMetadata() {
         const self = this;
         httpRequests.singleCompendium(this.props.metadata.data.data.id)
             .then(function (response) {
                 const data = response.data.metadata.o2r;
                 self.setState({
                     metadata: data,
                     title: data.title,
                     abstract: data.description,
                     authors: data.creators,
                     publicationDate: data.publication_date,
                     displayFile: data.displayfile,
                     mainFile: data.mainfile,
                     dataLicense: data.license.data,
                     textLicense: data.license.text,
                     codeLicense: data.license.code,
                     displayCandidates: data.displayfile_candidates,
                     mainFileCandidates: data.mainfile_candidates
                 });
             })
             .catch(function (response) {
                 console.log(response)
             })
     }
     

    componentDidMount() {
        this.getMetadata()
        prepareLicense();
        this.authorsNotNull();
    }

    updateAuthors = (value) => {
        this.setState({authors: value}, () => {
            this.authorsNotNull()
        })
    };

    authorsNotNull = () => {

        let valid = true;
        if (this.state.authors.length === 0 || this.state.authors === null) {
            valid = false;
        }
        for (var i in  this.state.authors) {
            if (this.state.authors[i].name === "") {
                valid = false;
            }
        }
        this.setState({authorsValid: valid});
    };

    render() {


        return (
            <div>

                {this.state.metadata &&
                    <Formik
                        onSubmit={(values, actions) => {
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                actions.setSubmitting(false);
                            }, 1000);
                        }}
                        render={props => <Form{...props} authors={this.state.authors}
                                              displayCandidates={this.state.displayCandidates}
                                              mainFileCandidates={this.state.mainFileCandidates}
                                              onUpdate={this.updateAuthors}
                                              authorsValid={this.state.authorsValid}/>}
                        initialValues={this.state}
                        validationSchema={validationSchema}
                    />
                }
            </div>


        );
    }
}

export default RequriedMetadata;