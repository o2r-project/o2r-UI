import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';

import licensesData from '../../../helpers/licenses.json'
import { Form } from './Form';

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
    mostRestrictiveData.push(textLicenses[3].id);
    mostRestrictiveData.push(codeLicenses[28].id);
    mostRestrictiveData.push(dataLicenses[1].id);
    leastRestrictiveData.push(textLicenses[5].id);
    leastRestrictiveData.push(codeLicenses[39].id);
    leastRestrictiveData.push(dataLicenses[4].id);
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




class RequiredMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authors: props.metadata.creators,
            authorsValid: false,
            isValid: true,
            authorsChanged: false,
        }
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


    componentDidMount() {
        prepareLicense();
        this.authorsNotNull();
    }

    componentWillUnmount() {

        const values = this.state.formValues;
        const newMetadata = this.props.metadata;

        if (values != null) {
            newMetadata.title = values.title;
            newMetadata.description = values.abstract;
            newMetadata.publication_date = values.publicationDate;
            newMetadata.displayfile = values.displayFile;
            newMetadata.mainfile = values.mainFile;
            newMetadata.license.data = values.dataLicense;
            newMetadata.license.text = values.textLicense;
            newMetadata.license.code = values.codeLicense;
        }
        if (this.state.authorsChanged == true) {
            newMetadata.creators = this.state.authors;
        }
        if(values!= null || this.state.authorsChanged)
        {
        this.props.setMetadata(newMetadata, false);
        }
    }

    updateAuthors = (value) => {
        this.setState({ authors: value, authorsChanged: true, changed: true }, () => {
            this.authorsNotNull()
        })
    }

    setChangedFalse = () =>{
        this.setState({ changed: false})
    }

    authorsNotNull = () => {

        let valid = true;
        if (this.state.authors.length === 0 || this.state.authors === null) {
            valid = false;
        }
        for (var i in this.state.authors) {
            if (this.state.authors[i].name === "") {
                valid = false;
            }
        }
        this.setState({ authorsValid: valid });
    };

    setFormValues = (values) => {
        this.setState({ formValues: values })
    }

    render() {
        return (
            <div>
                {this.props.metadata &&
                    <Formik ref={this.form}
                        onSubmit={(values, actions) => {
                            actions.setSubmitting(false);
                            this.setState({
                                changed: false,
                            });

                            const newMetadata = this.props.metadata;
                            newMetadata.title = values.title;
                            newMetadata.description = values.abstract;
                            newMetadata.creators = this.state.authors;
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
                        render={props => <Form{...props} 
                            authors={this.state.authors}
                            displayCandidates={this.props.metadata.displayfile_candidates}
                            mainFileCandidates={this.props.metadata.mainfile_candidates}
                            onUpdate={this.updateAuthors}
                            authorsValid={this.state.authorsValid}
                            setFormValues={this.setFormValues}
                            goToERC={this.props.goToErc}
                            reset={this.props.reset}
                            changed={this.state.changed}
                            setChanged={this.setChangedFalse}
                            originalMetadata={this.props.originalMetadata}
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
