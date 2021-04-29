import React, { Component } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';

import { OptionalForm } from './OptionalForm';
import languageCodes from '../../../helpers/isoCodes_639-1.json'


import '../requiredMetadata/requiredMetadata.css';

Yup.addMethod(Yup.array, 'unique', function (message, mapper = a => a) {
    return this.test('unique', message, function (list) {
      return list.length === new Set(list.map(mapper)).size;
    });
  });

const validationSchema = Yup.object({
    doi: Yup.string()
        .matches(
          new RegExp( '(?:^' + '(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?![%"#? ])\\S)+)' +'$)'), {excludeEmptyString: true, message: "Must be a valid DOI!"}
        ),
    paperLanguage: Yup.array().of(
            Yup.string().oneOf(languageCodes.map(language => language.code), "${value} is not a valid ISO 639-1 code. For a full list see above.")
        )
        .unique('Each language code shall only entered once.'),
    keywords: Yup.array().of(
            Yup.string().min(2, "A keyword should always be at least 2 characters.")
    )
});



var refs2;

class OptionalMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.form = React.createRef();

    };


    formValues = {
        doi: this.props.metadata.identifier.doi ? this.props.metadata.identifier.doi : "",
        paperLanguage: this.props.metadata.paperLanguage ? this.props.metadata.paperLanguage : "",
        keywords: this.props.metadata.keywords ? this.props.metadata.keywords : "",
    }


    originialValues = {
        doi: this.props.originalMetadata.identifier.doi,
        paperLanguage: this.props.originalMetadata.paperLanguage,
        keywords: this.props.originalMetadata.keywords
    }

    componentDidMount() {
        this.form.current.getFormikActions().validateForm()
        this.form.current.getFormikActions().setTouched({ "doi": true, "paperLanguage": true, "keywords":true});
    }

    componentWillUnmount() {

        const values = this.formValues;
        const newMetadata = this.props.metadata;
        newMetadata.identifier.doi = values.doi;
        newMetadata.paperLanguage = values.paperLanguage;
        newMetadata.keywords = values.keywords;

        this.props.setMetadata(newMetadata, false);
    }



    setFormValues = (values) => {


        if (JSON.stringify(this.originialValues) === JSON.stringify(values)) {
            this.props.setChangedFalse("changed")
        }
        else {
            this.props.setChanged("changed")
        }
        this.formValues = values;
        console.log(this.formValues)
    }

    render() {
        return (
            <div>
                {this.props.metadata &&
                    <Formik ref={this.form}
                        onSubmit={(values, actions) => {
                            actions.setSubmitting(false);

                            const newMetadata = this.props.metadata;
                            newMetadata.identifier.doi = values.doi;
                            newMetadata.languages = values.paperLanguage;
                            newMetadata.keywords = values.keywords;
                            this.originialValues = JSON.parse(JSON.stringify(values));
                            this.props.setMetadata(newMetadata, true);
                            actions.resetForm(this.values);
                        }
                        }
                        render={props => <OptionalForm  {...props}
                            setFormValues={this.setFormValues}
                            goToERC={this.props.goToErc}
                            spatioTemporalChanged={this.props.spatioTemporalChanged}
                            changed={this.props.changed}
                            optionalChanged={this.props.optionalChanged}
                            setChangedFalse={this.props.setChangedFalse}
                            setChanged={this.props.setChanged}
                            originalMetadata={JSON.parse(JSON.stringify(this.originialValues))}
                            originalAuthors={JSON.parse(JSON.stringify(this.props.originalMetadata.creators))}
                            candidate={this.props.candidate}
                            showProgress={this.props.showProgress}
                            updateKeywords={this.props.updateKeywords}
                            updateLanguages={this.props.updateLanguages}
                             />}
                        initialValues={this.formValues}
                        validationSchema={validationSchema}
                    />
                }
            </div>
        );
    }
}

export default withRouter(OptionalMetadata);
