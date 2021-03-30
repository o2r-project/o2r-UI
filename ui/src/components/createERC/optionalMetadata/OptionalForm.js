import React from 'react';
import { Card, TextField, Button, MenuItem, CardContent, Grid, Paper, IconButton } from "@material-ui/core";

import { Field, FieldArray } from 'formik';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import '../requiredMetadata/form.css'
export let valid2;

export const OptionalForm = props => {

    const {
        values: { doi, paperLanguage, keywords },
        errors,
        resetForm,
        touched,
        handleChange,
        setFieldTouched,
        setValues,
    } = props;


    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    const valid = (props.authorsChanged && props.authorsValid && isEmpty(errors)) || (props.changed && isEmpty(errors) && props.authorsValid)
        || (props.spatioTemporalChanged && props.authorsValid && isEmpty(errors)) || (props.optionalChanged && props.authorsValid && isEmpty(errors)) ||(isEmpty(errors) && props.candidate)


    const reset = props.optionalChanged

    const handleReset = async () => {

        console.log(props.originalMetadata)
        resetForm(props.originalMetadata)
        /*for (var i in props.resetAuthors) {
            props.resetAuthors[i].getFormikActions().resetForm(props.originalAuthors[i])
        }*/
        //props.onUpdate(JSON.parse(JSON.stringify(props.originalAuthors)));
        props.setChangedFalse("optionalChanged");
        await props.setFormValues(props.originalMetadata)
        props.validateForm()
        props.setTouched({ "doi": true });

    };


    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        props.setChanged("optionalChanged")
        var values = props.values
        values[name] = e.target.value
        setFieldTouched(name, true, false);
        props.setFormValues(values)
    };

    const arrayChange = (name, index, e) => {
        e.persist();
        e.target.name = name;
        props.setChanged("optionalChanged")
        var values = props.values
        values[name].splice(index, 1, e.target.value)
        setFieldTouched(name, true, true);
        props.setFormValues(values)
    };
    const arrayDelete = (name, index, e) => {
        e.persist();
        e.target.name = name;
        props.setChanged("optionalChanged")
        var values = props.values
        values[name].splice(index, 1)
        setFieldTouched(name, true, true);
        props.setFormValues(values)
    };
    const arrayAdd = (name, e) => {
        e.persist();
        e.target.name = name;
        props.setChanged("optionalChanged")
        var values = props.values
        values[name].push("")
        setFieldTouched(name, true, true);
        console.log(values)
        props.setFormValues(values)
    };

    const blur = () => {
        props.setFormValues(props.values)
    }


    const goToErc = () => props.goToERC();


    return (
        <form id="form" onSubmit={props.handleSubmit}>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Card>
                        <CardContent>
                            <h3>This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.</h3>
                            <h4>DOI</h4>
                            <TextField
                                id="doi"
                                label="Optional"
                                style={{ margin: 8, width: '80%' }}
                                placeholder="DOI"
                                helperText={touched.doi ? errors.doi : ""}
                                error={touched.doi && Boolean(errors.doi)}
                                value={doi}
                                onChange={change.bind(null, "doi")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <br />
                            <h4>Keywords</h4>
                            <FieldArray
                                name='keywords'
                                render={arrayHelpers => (
                                    <div>

                                        {keywords.map((keyword, index) => (
                                            <div key={index}>

                                                {/* Edit the value here */}
                                                <TextField
                                                    id={"keywords"}
                                                    label="Optional"
                                                    style={{ margin: 8, width: '80%' }}
                                                    placeholder="Keyword"
                                                    helperText={touched.keywords? errors.keywords ? errors.keywords[index] : "" : ""}
                                                    error={errors.keywords ? touched.keywords && Boolean(errors.keywords[index]): false}
                                                    value={keyword}
                                                    onChange={arrayChange.bind(null, "keywords", index)}
                                                    //onBlur={blur.bind(null)}
                                                    margin="normal"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }} />

                                                {/* Remove this vehicle */}
                                                <IconButton aria-label="Delete"
                                                    onClick={arrayDelete.bind(null, "keywords", index)}
                                                    color="primary"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                            </div>
                                        ))}

                                        {/* Add a new empty vehicle at the end of the list */}
                                        <IconButton aria-label="Add"
                                            onClick={arrayAdd.bind(null, "keywords")}
                                            color="primary"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                )}
                            />
                            <h4>Paper languages as <a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" target="_blank" title="Wikipedias list of ISO 639 codes">ISO 639-1 codes</a></h4>
                            <FieldArray
                                name='paperLanguage'
                                render={arrayHelpers => (
                                    <div>

                                        {paperLanguage.map((language, index) => (
                                            <div key={index}>

                                                {/* Edit the value here */}
                                                <TextField
                                                    id="language"
                                                    label="Optional"
                                                    style={{ margin: 8, width: '80%' }}
                                                    placeholder="Language"
                                                    helperText={touched.paperLanguage ? errors.paperLanguage ? errors.paperLanguage[index] : "" : ""}
                                                    error={errors.paperLanguage ? touched.paperLanguage && Boolean(errors.paperLanguage[index]): false}
                                                    value={language}
                                                    onChange={arrayChange.bind(null, "paperLanguage", index)}
                                                    //onBlur={blur.bind(null)}
                                                    margin="normal"
                                                    variant="outlined"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }} />

                                                {/* Remove this vehicle */}
                                                <IconButton aria-label="Delete"
                                                    onClick={arrayDelete.bind(null, "paperLanguage", index)}
                                                    color="primary"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>

                                            </div>
                                        ))}

                                        {/* Add a new empty vehicle at the end of the list */}
                                        <IconButton aria-label="Add"
                                            onClick={arrayAdd.bind(null, "paperLanguage")}
                                            color="primary"
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </div>
                                )}
                            />
                            <br />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} >
                    <Paper style={{ marginTop: "10%", marginRight: "3%", position: "fixed" }}>
                        <Button
                            onClick={handleReset.bind(null)}
                            type="button"
                            disabled={!reset || props.showProgress}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!valid || props.showProgress}
                        >
                            Publish
                         </Button>
                        {props.candidate
                          ? <Button
                          id="goTo"
                              type="button"
                              onClick={goToErc}>
                              Preview
                            </Button>
                          : <Button
                          id="goTo"
                              type="button"
                              color="primary"
                              onClick={goToErc}
                              disabled={props.candidate}>
                              Go To ERC
                            </Button>
                        }
                    </Paper>
                    <div id={"errorMessage"}>
                    </div>


                </Grid>
            </Grid>

        </form>
    )
}
