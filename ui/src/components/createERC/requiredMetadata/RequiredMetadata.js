import React, { Component } from 'react';
import { Card, CardContent, TextField, CardActions, IconButton, Button, MenuItem, Collapse } from "@material-ui/core";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';

import licensesData from '../../../helpers/licenses.json'
import './requiredMetadata.css';
import httpRequests from '../../../helpers/httpRequests';


const textLicenses = [];
const dataLicenses = [];
const codeLicenses = [];
const mostRestrictiveData = [];
const leastRestrictiveData = [];

function prepareLicense() {

    for (var i in licensesData) {
        if (licensesData[i].domain_content) { textLicenses.push(licensesData[i]) };
        if (licensesData[i].domain_data) { dataLicenses.push(licensesData[i]) };
        if (licensesData[i].domain_software) { codeLicenses.push(licensesData[i]) };
    }
    mostRestrictiveData.push(textLicenses[3]);
    mostRestrictiveData.push(codeLicenses[28]);
    mostRestrictiveData.push(dataLicenses[1]);
    leastRestrictiveData.push(textLicenses[5]);
    leastRestrictiveData.push(codeLicenses[39]);
    leastRestrictiveData.push(dataLicenses[4]);

}

const authorValidationSchma = Yup.object({

    author: Yup.string()
        .required('Author is required'),

})

const AuthorForm = props => {
    const {
        values: { author, affiliation, orcid },
        errors,
        touched,
        handleChange,
        isValid,
        setFieldTouched,
        setFieldValue
    } = props

    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        setFieldTouched(name, true, false)
    }

    return (
        <form
            onSubmit={() => {
                alert('submit');
            }} >
            <br />
            >
             <TextField
                id="author"
                label="Author"
                type="text"
                style={{ margin: 8 }}
                required
                helperText={touched.author ? errors.author : ""}
                error={touched.author && Boolean(errors.author)}
                value={author}
                onChange={change.bind(null, "author")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }} />
            <TextField
                id="affiliation"
                label="Affiliation"
                type="text"
                style={{ margin: 8 }}
                helperText={touched.affiliation ? errors.affiliation : ""}
                error={touched.affiliation && Boolean(errors.affiliation)}
                value={affiliation}
                onChange={change.bind(null, "affiliation")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }} />
            <TextField
                id="orcId"
                label="ORCID"
                type="text"
                style={{ margin: 8 }}
                helperText={touched.orcid ? errors.orcid : ""}
                error={touched.orcid && Boolean(errors.orcid)}
                value={orcid}
                onChange={change.bind(null, "orcid")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }} />
            <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                disabled={!isValid}
            >
                Update Author
            </Button>

        </form>

    )
}
function Authors(props) {
    const [expanded, setExpanded] = React.useState(false);
    const listItems = props.authors.authors.map((author) => {



        function handleExpandClick() {
            setExpanded(!expanded);
        }

        return (
            <Card key={author} id="authorcard">
                <CardContent>
                    <p>Max Power</p>
                    <p>Institute for Geoinformatics</p>
                    <p>0000 000 000 1</p>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-Label="Edit"
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                    >
                        <i>Edit</i>
                    </IconButton>
                </CardActions>
                <Collapse in={expanded}>
                    <CardContent>
                        <Formik>
                            render={props => <AuthorForm{...props} />}
                            initialValues={this.state}
                            validationSchema={validationSchema}
                        </Formik>
                    </CardContent>
                </Collapse>
            </Card>
        );


    });
    return listItems;
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
})



const Form = props => {
    const {
        values: { title, abstract, publicationDate, displayFile, mainFile, textLicense, dataLicense, codeLicense },
        errors,
        touched,
        handleChange,
        isValid,
        setFieldTouched,
        setFieldValue
    } = props


    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        setFieldTouched(name, true, false)
    }

    const handleClick = (name, e) => {
        console.log(name);
        if (name === "mostRestrictive") {
            setFieldValue('textLicense', mostRestrictiveData[0]);
            setFieldValue('codeLicense', mostRestrictiveData[1]);
            setFieldValue('dataLicense', mostRestrictiveData[2]);
        }
        else if (name === "leastRestrictive") {
            setFieldValue('textLicense', leastRestrictiveData[0]);
            setFieldValue('codeLicense', leastRestrictiveData[1]);
            setFieldValue('dataLicense', leastRestrictiveData[2]);
        }
    }

    return (
        <form
            onSubmit={() => {
                alert('submit');
            }} >
            <br />
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
                    }} />
            </Card>
            <br />
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
                    }} />
            </Card>
            <br />
            <Card>
                <h4>Publication Date</h4>
                <TextField
                    id="publicationDate"
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
                    }} />
            </Card>
            <br />
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
                    }} />
            </Card>
            <br />
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
                    }} />
            </Card>
            <br />
            <Card>
                <h4>Licenses</h4>
                <p>Templates</p>
                <Button onClick={handleClick.bind(null, "mostRestrictive")}
                >MOST RESTRICTIVE</Button>
                <Button onClick={handleClick.bind(null, "leastRestrictive")}
                >LEAST RESTRICTIVE</Button>
                <TextField
                    id="textLicense"
                    select
                    label="Text License"
                    style={{ margin: 8 }}
                    required
                    fullWidth
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
                    style={{ margin: 8 }}
                    required
                    fullWidth
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
                    style={{ margin: 8 }}
                    required
                    fullWidth
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
            metadata: null,
            title: "",
            abstract: "",
            publicationDate: "",
            displayFile: "",
            mainFile: "",
            dataLicense: "",
            textLicense: "",
            codeLicense: ""
        }
    };

    //Review, should be better ;)
    getMetadata() {
        const self = this;
        httpRequests.singleCompendium(this.props.metadata.data.data.id)
            .then(function (res) {
                const data = res.data.metadata.o2r;
                res.data.metadata.o2r.inputfiles.push("binding.json");
                self.setState({
                    metadata: data,
                    title: data.title,
                    abstract: data.description,
                    publicationDate: data.publication_date,
                    displayFile: data.displayfile,
                    mainFile: data.mainfile,
                    dataLicense: data.license.data,
                    textLicense: data.license.text,
                    codeLicense: data.license.code,
                });
                res.data.candidate = false;
                const binding = self.getBindingJson(res.data);
                    console.log(binding.sourcecode.parameter.name)
                res.data.metadata.o2r.interaction.push(binding);
                httpRequests.updateMetadata(self.props.metadata.data.data.id, res.data.metadata.o2r)
                    .then(function(res2) {
                        httpRequests.sendBinding(binding)
                            .then(function(res3) {
                                console.log(res3)
                                self.props.history.push({
                                    pathname: '/erc/' + self.props.metadata.data.data.id, 
                                    state: {data:data}
                                });
                            })
                    })
            })
            .catch(function (response) {
                console.log(response)
            })
    }

    componentDidMount() {
        this.getMetadata()
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

    render() {
        prepareLicense();
        
        return (
            <div>
                <h4>Authors</h4>
                {this.state.metadata &&
                    <Formik
                        render={props => <Form{...props} />}
                        initialValues={this.state}
                        validationSchema={validationSchema}
                    />
                }
            </div>
        );
    }
}

export default withRouter(RequiredMetadata);