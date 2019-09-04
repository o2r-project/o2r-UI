import { Formik } from "formik";
import React from "react";
import { AuthorForm, authorValidationSchema } from "./AuthorForm";


export const refs = []

function AuthorCard(props) {

    const self = props;
    
    return (
        <div id="AuthorCard">

            <Formik ref={(ref) => refs.push(ref)}
                onSubmit={(values, actions) => {

                }}
                render={props => <AuthorForm{...props} method={"Update"} handleDelete={self.handleDelete} deleteable={self.deleteable} onChange={self.handleUpdate}
                    index={self.id} />}
                initialValues={props.author}
                validationSchema={authorValidationSchema}
            />

        </div>
    );

}

export default AuthorCard;
