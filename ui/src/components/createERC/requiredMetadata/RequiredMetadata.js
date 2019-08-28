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
            metadata: props.metadata,
            title: props.metadata.title,
            abstract: props.metadata.description,
            publicationDate: props.metadata.publication_date,
            displayFile: props.metadata.displayfile,
            mainFile: props.metadata.mainfile,
            dataLicense: props.metadata.license.data,
            textLicense: props.metadata.license.text,
            codeLicense: props.metadata.license.code,
            displayCandidates: props.metadata.displayfile_candidates,
            mainFileCandidates: props.metadata.mainfile_candidates,
            authors: props.metadata.creators,
            authorsValid: false,
            isValid: true,
            changed: props.changed,
        }
    };



    componentDidMount() {
        prepareLicense();
        this.authorsNotNull();
    }

    componentWillUnmount() {

        const values = this.state.formValues;
        const updatedMetadata = this.props.metadata;

        if (values != null) {
            updatedMetadata.title = values.title;
            updatedMetadata.description = values.abstract;
            updatedMetadata.publication_date = values.publicationDate;
            updatedMetadata.displayfile = values.displayFile;
            updatedMetadata.mainfile = values.mainFile;
            updatedMetadata.license.data = values.dataLicense;
            updatedMetadata.license.text = values.textLicense;
            updatedMetadata.license.code = values.codeLicense;
        }
        if (this.state.changed == true) {
            updatedMetadata.creators = this.state.authors;
        }

        this.props.setMetadata(updatedMetadata, false);
    }

    updateAuthors = (value) => {
        this.setState({ authors: value, changed: true }, () => {
            this.authorsNotNull()
        })
    }

    setChangedFalse = () => {
        this.setState({ changed: false })
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
                {this.state.metadata &&
                    <Formik ref={this.form}
                        onSubmit={(values, actions) => {
                            actions.setSubmitting(false);
                            this.setState({
                                changed: false,
                            });

                            const updatedMetadata = this.props.metadata;
                            updatedMetadata.title = values.title;
                            updatedMetadata.description = values.abstract;
                            updatedMetadata.creators = this.state.authors;
                            updatedMetadata.publication_date = values.publicationDate;
                            updatedMetadata.displayfile = values.displayFile;
                            updatedMetadata.mainfile = values.mainFile;
                            updatedMetadata.license.data = values.dataLicense;
                            updatedMetadata.license.text = values.textLicense;
                            updatedMetadata.license.code = values.codeLicense;
                            this.props.setMetadata(updatedMetadata, true);
                            actions.resetForm(values);
                        }
                        }
                        render={props => <Form{...props} authors={this.state.authors}
                            displayCandidates={this.state.displayCandidates}
                            mainFileCandidates={this.state.mainFileCandidates}
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
                        initialValues={this.state}
                        validationSchema={validationSchema}
                    />
                }
            </div>
        );
    }
}

export default withRouter(RequiredMetadata);