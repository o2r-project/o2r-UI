import React from 'react';
import { Card, TextField, Button, MenuItem, CardContent, Grid, Paper } from "@material-ui/core";
import Authors from './Authors/Authors';
import './form.css'
export let valid2;

export const Form = props => {

    const {
        values: { title, abstract, publicationDate, displayFile, mainFile, textLicense, dataLicense, codeLicense },
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
        || (props.spatioTemporalChanged && props.authorsValid && isEmpty(errors)) || (isEmpty(errors) && props.candidate)

    valid2 = isEmpty(errors) && props.authorsValid

    const reset = props.authorsChanged || props.changed

    const handleReset = async () => {

        console.log(props.originalMetadata)
        resetForm(props.originalMetadata)
        for (var i in props.resetAuthors) {
            props.resetAuthors[i].getFormikActions().resetForm(props.originalAuthors[i])
        }
        props.onUpdate(JSON.parse(JSON.stringify(props.originalAuthors)));
        props.setChangedFalse("all");
        await props.setFormValues(props.originalMetadata)
        props.validateForm()
        props.setTouched({ "title": true, "abstract": true, "publicationDate": true, "textLicense": true, "dataLicense": true, "codeLicense": true });

    };


    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        var values = props.values
        values[name] = e.target.value
        setFieldTouched(name, true, false);
        props.setFormValues(values)
    };

    const blur = () => {
        props.setFormValues(props.values)
    }


    const goToErc = () => props.goToERC();


    const setMostRestrictive = () => {
        var values = props.values
        values.textLicense = props.mostRestrictiveData[0];
        values.codeLicense = props.mostRestrictiveData[1];
        values.dataLicense = props.mostRestrictiveData[2];
        setValues(values)
        props.setFormValues(values)
    }


    const setLeastRestrictive = () => {
        var values = props.values
        values.textLicense = props.leastRestrictiveData[0];
        values.codeLicense = props.leastRestrictiveData[1];
        values.dataLicense = props.leastRestrictiveData[2];
        setValues(values)
        props.setFormValues(values)
    }


    return (
        <form id="form" onSubmit={props.handleSubmit}>
            <br />
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Card>
                        <CardContent>
                            <h3>This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.</h3>
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
                                style={{ margin: 8, width: '20%', minWidth: "200px" }}
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
                                style={{ margin: 8, width: '20%', minWidth: "200px" }}
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
                                style={{ margin: 8, width: '20%', minWidth: "200px" }}
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
                                    onClick={() => { setMostRestrictive() }}
                                >MOST RESTRICTIVE</Button>
                                <Button variant="contained" color="primary" style={{ margin: "8px" }}
                                    onClick={setLeastRestrictive}
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {(Array.from(props.textLicenses, x => x.id).includes(props.originalMetadata.textLicense) || props.originalMetadata.textLicense === "") ? "" :
                                    <MenuItem key={props.originalMetadata.textLicense} value={props.originalMetadata.textLicense}>
                                        {props.originalMetadata.textLicense}
                                    </MenuItem>}
                                <MenuItem id={"menuItem"} key={props.leastRestrictiveData[0]} value={props.leastRestrictiveData[0]}>
                                    Least Restrictive
                                    </MenuItem>
                                <MenuItem id={"menuItem"} key={props.mostRestrictiveData[0]} value={props.mostRestrictiveData[0]}>
                                    Most Restrictive
                                    </MenuItem>
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
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {(Array.from(props.codeLicenses, x => x.id).includes(props.originalMetadata.codeLicense) || props.originalMetadata.codeLicense === "") ? "" :
                                    <MenuItem key={props.originalMetadata.codeLicense} value={props.originalMetadata.codeLicense}>
                                        {props.originalMetadata.codeLicense}
                                    </MenuItem>}
                                <MenuItem id={"menuItem"} key={props.leastRestrictiveData[1]} value={props.leastRestrictiveData[1]}>
                                    Least Restrictive
                                    </MenuItem>
                                <MenuItem id={"menuItem"} key={props.mostRestrictiveData[1]} value={props.mostRestrictiveData[1]}>
                                    Most Restrictive
                                    </MenuItem>
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
                                defaultValue=""
                                onChange={change.bind(null, "dataLicense")}
                                onBlur={blur.bind(null)}
                                margin="normal"
                                variant="outlined"
                                native={true}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            >
                                {(Array.from(props.dataLicenses, x => x.id).includes(props.originalMetadata.dataLicense) || props.originalMetadata.dataLicense === "") ? "" :
                                    <MenuItem key={props.originalMetadata.dataLicense} value={props.originalMetadata.dataLicense}>
                                        {props.originalMetadata.dataLicense}
                                    </MenuItem>
                                }
                                <MenuItem id={"menuItem"} key={props.leastRestrictiveData[2]} value={props.leastRestrictiveData[2]}>
                                    Least Restrictive
                                    </MenuItem>
                                <MenuItem id={"menuItem"} key={props.mostRestrictiveData[2]} value={props.mostRestrictiveData[2]}>
                                    Most Restrictive
                                    </MenuItem>
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
                        <Button
                            type="button"
                            onClick={goToErc}
                            disabled={props.candidate}>
                            Go To ERC
                            </Button>
                    </Paper>
                    <div id={"errorMessage"}>
                        {errors.title ? errors.title : ""}
                        {errors.title ? <br /> : ""}
                        {errors.abstract ? errors.abstract : ""}
                        {errors.abstract ? <br /> : ""}
                        {errors.publicationDate ? errors.publicationDate : ""}
                        {errors.publicationDate ? <br /> : ""}
                        {errors.displayFile ? errors.displayFile : ""}
                        {errors.displayFile ? <br /> : ""}
                        {errors.mainFile ? errors.mainFile : ""}
                        {errors.mainFile ? <br /> : ""}
                        {errors.textLicense ? errors.textLicense : ""}
                        {errors.textLicense ? <br /> : ""}
                        {errors.dataLicense ? errors.dataLicense : ""}
                        {errors.dataLicense ? <br /> : ""}
                        {errors.codeLicense ? errors.codeLicense : ""}
                        {errors.codeLicense ? <br /> : ""}
                        {!props.authorsValid ? "Authors are not valid" : ""}
                    </div>


                </Grid>
            </Grid>

        </form>
    )
}