import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';

import licensesData from '../../../helpers/licenses.json'
import { Form } from './Form';
import { refs } from './Authors/AuthorCard'

import './requiredMetadata.css';

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
    textLicense: Yup.mixed()
        .required(),
    codeLicense: Yup.mixed()
        .required(),
    dataLicense: Yup.mixed()
        .required()
});



var refs2;

class RequiredMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.form = React.createRef();

    };


    initialValues = {
        title: this.props.metadata.title,
        abstract: this.props.metadata.description,
        publicationDate: this.props.metadata.publication_date,
        displayFile: this.props.metadata.displayfile,
        mainFile: this.props.metadata.mainfile,
        dataLicense: this.props.metadata.license.data,
        textLicense: this.props.metadata.license.text,
        codeLicense: this.props.metadata.license.code,
    }

    formValues = this.initialValues

    originialValues = {
        title: this.props.originalMetadata.title,
        abstract: this.props.originalMetadata.description,
        publicationDate: this.props.originalMetadata.publication_date,
        displayFile: this.props.originalMetadata.displayfile,
        mainFile: this.props.originalMetadata.mainfile,
        dataLicense: this.props.originalMetadata.license.data,
        textLicense: this.props.originalMetadata.license.text,
        codeLicense: this.props.originalMetadata.license.code,

    }

    
    componentDidMount() {
        prepareLicense();
        refs2 = refs.splice(refs.length - this.props.authors.length, refs.length)
        console.log(refs2)
        this.form.current.getFormikActions().validateForm()
        this.form.current.getFormikActions().setTouched({ "title": true, "abstract": true, "publicationDate": true, "textLicense": true, "dataLicense": true, "codeLicense": true });
        for (var i in refs2) {
            refs2[i].getFormikActions().validateForm()
        }
    }

    componentWillUnmount() {

        const values = this.formValues;
        const newMetadata = this.props.metadata;


        newMetadata.title = values.title;
        newMetadata.description = values.abstract;
        newMetadata.publication_date = values.publicationDate;
        newMetadata.displayfile = values.displayFile;
        newMetadata.mainfile = values.mainFile;
        newMetadata.license.data = values.dataLicense;
        newMetadata.license.text = values.textLicense;
        newMetadata.license.code = values.codeLicense;
        newMetadata.creators = this.props.authors;


        this.props.setMetadata(newMetadata, false);
    }



    setFormValues = (values) => {


        if (JSON.stringify(this.originialValues) == JSON.stringify(values)) {
            this.props.setChangedFalse('form')
        }
        else {
            this.props.setChanged()
        }
        this.formValues = values;
    }

    render() {
        return (
            <div>
                {this.props.metadata &&
                    <Formik ref={this.form}
                        onSubmit={(values, actions) => {
                            actions.setSubmitting(false);

                            const newMetadata = this.props.metadata;
                            newMetadata.title = values.title;
                            newMetadata.description = values.abstract;
                            newMetadata.creators = this.props.authors;
                            newMetadata.publication_date = values.publicationDate;
                            newMetadata.displayfile = values.displayFile;
                            newMetadata.mainfile = values.mainFile;
                            newMetadata.license.data = values.dataLicense;
                            newMetadata.license.text = values.textLicense;
                            newMetadata.license.code = values.codeLicense;
                            this.props.setMetadata(newMetadata, true);
                            actions.resetForm(values);
                        }
                        }
                        render={props => <Form  {...props}
                            authors={this.props.authors}
                            displayCandidates={this.props.metadata.displayfile_candidates}
                            mainFileCandidates={this.props.metadata.mainfile_candidates}
                            onUpdate={this.props.updateAuthors}
                            authorsValid={this.props.authorsValid}
                            setFormValues={this.setFormValues}
                            resetAuthors={refs2}
                            goToERC={this.props.goToErc}
                            authorsChanged={this.props.authorsChanged}
                            changed={this.props.changed}
                            setChangedFalse={this.props.setChangedFalse}
                            originalMetadata={JSON.parse(JSON.stringify(this.originialValues))}
                            originalAuthors={JSON.parse(JSON.stringify(this.props.originalMetadata.creators))}
                            textLicenses={textLicenses}
                            codeLicenses={codeLicenses}
                            dataLicenses={dataLicenses}
                            mostRestrictiveData={mostRestrictiveData}
                            leastRestrictiveData={leastRestrictiveData} />}
                        initialValues={this.initialValues}
                        validationSchema={validationSchema}
                    />
                }
            </div>
        );
    }
}

export default withRouter(RequiredMetadata);
