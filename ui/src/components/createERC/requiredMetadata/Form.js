import React from 'react';
import { Card, TextField, Button, MenuItem, CardContent, Grid } from "@material-ui/core";
import Authors from './Authors/Authors';

export const Form = props => {

    const {
        values: { title, abstract, publicationDate, displayFile, mainFile, textLicense, dataLicense, codeLicense },
        errors,
        resetForm,
        dirty,
        touched,
        handleChange,
        isValid,
        setFieldTouched,
        setFieldValue,
        setValues,
        initialValues,
        validateForm
    } = props;


    const valid = props.changed || (isValid && dirty)

    const reset = props.changed || dirty


    const handleReset = () => {

        const resetData = props.values
        resetData.title = props.originalMetadata.title
        resetData.abstract = props.originalMetadata.description
        resetData.publicationDate = props.originalMetadata.publication_date
        resetData.displayFile = props.originalMetadata.displayfile
        resetData.mainFile = props.originalMetadata.mainfile
        resetData.dataLicense = props.originalMetadata.license.data
        resetData.textLicense = props.originalMetadata.license.text
        resetData.codeLicense = props.originalMetadata.license.code
        resetForm(resetData)
        props.onUpdate(props.originalMetadata.creators);
        props.setChanged();
    };


    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        setFieldTouched(name, true, false);
    };

    const blur = () => {
        props.setFormValues(props.values);
    }


    const handleClick = (name, e) => {

        if (name === "mostRestrictive") {
            setFieldValue('textLicense', props.mostRestrictiveData[0]);
            setFieldValue('codeLicense', props.mostRestrictiveData[1]);
            setFieldValue('dataLicense', props.mostRestrictiveData[2]);
        } else if (name === "leastRestrictive") {
            setFieldValue('textLicense', props.leastRestrictiveData[0]);
            setFieldValue('codeLicense', props.leastRestrictiveData[1]);
            setFieldValue('dataLicense', props.leastRestrictiveData[2]);
        }
        else if (name === "ERC") {
            props.goToERC();
        }

        console.log(props.leastRestrictiveData)
        console.log(props.dataLicenses)
    };

    return (
        <form id="form" onSubmit={props.handleSubmit}>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Card>
                        <CardContent>
                            <h4>Title</h4>
                            <TextField
                                id="title"
                                label="Required"
                                style={{ margin: 8, width: '80%' }}
                                placeholder="Title"
                                required
                                helperText={touched.title ? errors.title : ""}
                                error={touched.title && Boolean(errors.title)}
                                value={title}
                                onChange={change.bind(null, "title")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <br />
                            <h4>Abstract</h4>
                            <TextField
                                id="abstract"
                                label="Required"
                                style={{ margin: 8, width: '80%' }}
                                placeholder="Abstract"
                                required
                                multiline
                                rows={3}
                                helperText={touched.abstract ? errors.abstract : ""}
                                error={touched.abstract && Boolean(errors.abstract)}
                                value={abstract}
                                onChange={change.bind(null, "abstract")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <br />
                            <Authors authors={props.authors} onUpdate={props.onUpdate}></Authors>
                            <br />
                            <h4>Publication Date</h4>
                            <TextField
                                id="publicationDate"
                                label="Publication date"
                                type="date"
                                style={{ margin: 8, width: '20%' }}
                                required
                                helperText={touched.publicationDate ? errors.publicationDate : ""}
                                error={touched.publicationDate && Boolean(errors.publicationDate)}
                                value={publicationDate}
                                onChange={change.bind(null, "publicationDate")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                }} />
                            <br />
                            <h4>Display File</h4>
                            <TextField
                                id="displayFile"
                                label="displayFile"
                                style={{ margin: 8, width: '20%' }}
                                placeholder="display.html"
                                required
                                select
                                helperText={touched.displayFile ? errors.displayFile : ""}
                                error={touched.displayFile && Boolean(errors.displayFile)}
                                value={displayFile}
                                onChange={change.bind(null, "displayFile")}
                                onBlur={blur.bind(null)}
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
                            <br />
                            <h4>Main File</h4>
                            <TextField
                                id="mainFile"
                                label="mainFile"
                                select
                                style={{ margin: 8, width: '20%' }}
                                placeholder="main.Rmd"
                                required
                                helperText={touched.mainFile ? errors.mainFile : ""}
                                error={touched.mainFile && Boolean(errors.mainFile)}
                                value={mainFile}
                                onChange={change.bind(null, "mainFile")}
                                onBlur={blur.bind(null)}
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
                            <br />
                            <h4>Licenses</h4>
                            <div>
                                <Button variant="contained" color="primary" style={{ margin: "8px" }}
                                    onClick={handleClick.bind(null, "mostRestrictive")}
                                >MOST RESTRICTIVE</Button>
                                <Button variant="contained" color="primary" style={{ margin: "8px" }}
                                    onClick={handleClick.bind(null, "leastRestrictive")}
                                >LEAST RESTRICTIVE</Button>
                            </div>

                            <TextField
                                id="textLicense"
                                select
                                label="Text License"
                                style={{ margin: 8, width: '30%' }}
                                required
                                helperText={touched.textLicense ? errors.textLicense : ""}
                                error={touched.textLicense && Boolean(errors.textLicense)}
                                value={textLicense}
                                onChange={change.bind(null, "textLicense")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                            >
                                {props.textLicenses.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="codeLicense"
                                select
                                label="Code License"
                                style={{ margin: 8, width: '30%' }}
                                required
                                helperText={touched.codeLicense ? errors.codeLicense : ""}
                                error={touched.codeLicense && Boolean(errors.codeLicense)}
                                value={codeLicense}
                                onChange={change.bind(null, "codeLicense")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                            >
                                {props.codeLicenses.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="dataLicense"
                                select
                                label="Data License"
                                style={{ margin: 8, width: '30%' }}
                                required
                                helperText={touched.dataLicense ? errors.dataLicense : ""}
                                error={touched.dataLicense && Boolean(errors.dataLicense)}
                                value={dataLicense}
                                onChange={change.bind(null, "dataLicense")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                            >
                                {props.dataLicenses.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={2} >
                    <Card style={{ "margin-top": "10%", position: "fixed" }}>
                        <Button
                            onClick={handleReset.bind(null)}
                            type="button"
                            disabled={!reset}
                        >
                            Reset
            </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!valid || !props.authorsValid}
                        >
                            Save
                         </Button>
                        <Button
                            type="button"
                            onClick={handleClick.bind(null, "ERC")}>
                            Go To ERC
                            </Button>
                    </Card>

                </Grid>
            </Grid>

        </form>
    )
}