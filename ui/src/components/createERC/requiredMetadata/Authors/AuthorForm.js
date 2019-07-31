import * as Yup from "yup";
import {TextField,IconButton} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import React from "react";

export const authorValidationSchema = Yup.object({

    name: Yup.string()
        .required('Name is required'),

});

export const AuthorForm = props => {

    const {
        values: {name, affiliation, orcid},
        errors,
        touched,
        handleChange,
        setFieldTouched,
    } = props;

    const change = (name, e) => {
        e.persist();
        e.target.name = name;
        handleChange(e);
        setFieldTouched(name, true, false);
    };

    function update() {
        props.onChange(props.index, props.values);
    }

    self=props;
    return (
        <form id="authorForm">

            <TextField
                id="name"
                label="Author"
                type="text"
                style={{margin: 8}}
                required
                helperText={touched.name ? errors.name : ""}
                error={touched.name && Boolean(errors.name)}
                value={name}
                onChange={change.bind(null, "name")}
                onBlur={update}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}/>
            <TextField
                id="affiliation"
                label="Affiliation"
                type="text"
                style={{margin: 8}}
                helperText={touched.affiliation ? errors.affiliation : ""}
                error={touched.affiliation && Boolean(errors.affiliation)}
                value={affiliation}
                onBlur={update}
                onChange={change.bind(null, "affiliation")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }}/>
            <TextField
                id="orcId"
                label="ORCID"
                type="text"
                style={{margin: 8}}
                helperText={touched.orcid ? errors.orcid : ""}
                error={touched.orcid && Boolean(errors.orcid)}
                value={orcid}
                onBlur={update}
                onChange={change.bind(null, "orcid")}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                }} />

            {props.deleteable ?
                <IconButton aria-label="Delete"
                    onClick={() => props.handleDelete()}
                    color="primary"
                >
                    <DeleteIcon />
                </IconButton>
                : ''}

        </form>)
};