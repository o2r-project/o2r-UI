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


const validationSchema = Yup.object({
    title: Yup.string()
        .nullable()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters long'),
    abstract: Yup.string()
        .nullable()
        .required('Abstract is required')
        .min(5, 'Abstract must be at least 5 characters long'),
    publicationDate: Yup.date()
        .max(new Date(), 'No Valid Date')
        .required("Date is required"),
    displayFile: Yup.string()
        .required('DisplayFile is required'),
    mainFile: Yup.string()
        .notOneOf([0])
        .required('MainFile is required'),
    textLicense: Yup.mixed()
        .required('Text License is required'),
    codeLicense: Yup.mixed()
        .required('Code License is required'),
    dataLicense: Yup.mixed()
        .required('Data License is required')
});



var refs2;

class RequiredMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialLicense: ""
        }
        this.form = React.createRef();

    };


    formValues = {
        title: this.props.metadata.title,
        abstract: this.props.metadata.description,
        publicationDate: this.props.metadata.publication_date,
        displayFile: this.props.metadata.displayfile,
        mainFile: this.props.metadata.mainfile,
        dataLicense: this.props.metadata.license.data ? this.props.metadata.license.data : "",
        textLicense: this.props.metadata.license.text ? this.props.metadata.license.text : "",
        codeLicense: this.props.metadata.license.code ? this.props.metadata.license.code : "",
    }


    originialValues = {
        title: this.props.originalMetadata.title,
        abstract: this.props.originalMetadata.description,
        publicationDate: this.props.originalMetadata.publication_date,
        displayFile: this.props.originalMetadata.displayfile,
        mainFile: this.props.originalMetadata.mainfile,
        dataLicense: this.props.originalMetadata.license.data,
        textLicense: this.props.originalMetadata.license.text,
        codeLicense: this.props.originalMetadata.license.code,
        authors: this.props.originalMetadata.authors
    }

    componentDidMount() {
        this.prepareLicense();
        refs2 = refs.splice(refs.length - this.props.authors.length, refs.length)
        this.form.current.getFormikActions().validateForm()
        this.form.current.getFormikActions().setTouched({ "title": true, "abstract": true, "publicationDate": true, "textLicense": true, "dataLicense": true, "codeLicense": true });
        for (var i in refs2) {
            refs2[i].getFormikActions().validateForm()
        }
        this.testSpecialLicense();
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


        prepareLicense() {

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


testSpecialLicense(){
    let specialLicense = {
        text: false,
        code: false,
        data: false
    }
    if(!Array.from(textLicenses, x => x.id).includes(this.formValues.textLicense)){
        specialLicense.text = true;
    }
    if(!Array.from(codeLicenses, x => x.id).includes(this.formValues.codeLicense)){
        specialLicense.code = true;
    }
    if(!Array.from(dataLicenses, x => x.id).includes(this.formValues.dataLicense)){
        specialLicense.data = true;
    }
    this.setState({specialLicense: specialLicense})
}



    setFormValues = (values) => {


        if (JSON.stringify(this.originialValues) === JSON.stringify(values)) {
            this.props.setChangedFalse("changed")
        }
        else {
            this.props.setChanged("changed")
        }
        this.formValues = values;
        this.testSpecialLicense();
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
                            newMetadata.authors = this.props.authors;
                            newMetadata.publication_date = values.publicationDate;
                            newMetadata.displayfile = values.displayFile;
                            newMetadata.mainfile = values.mainFile;
                            newMetadata.license.data = values.dataLicense;
                            newMetadata.license.text = values.textLicense;
                            newMetadata.license.code = values.codeLicense;
                            values.authors=this.props.authors
                            this.originialValues = JSON.parse(JSON.stringify(values));
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
                            spatioTemporalChanged={this.props.spatioTemporalChanged}
                            optionalChanged={this.props.optionalChanged}
                            authorsChanged={this.props.authorsChanged}
                            changed={this.props.changed}
                            setChangedFalse={this.props.setChangedFalse}
                            originalMetadata={JSON.parse(JSON.stringify(this.originialValues))}
                            originalAuthors={JSON.parse(JSON.stringify(this.originialValues.authors))}
                            textLicenses={textLicenses}
                            codeLicenses={codeLicenses}
                            dataLicenses={dataLicenses}
                            mostRestrictiveData={mostRestrictiveData}
                            leastRestrictiveData={leastRestrictiveData}
                            candidate={this.props.candidate}
                            specialLicense={this.state.specialLicense}
                            showProgress={this.props.showProgress} />}
                        initialValues={this.formValues}
                        validationSchema={validationSchema}
                    />
                }
            </div>
        );
    }
}

export default withRouter(RequiredMetadata);
