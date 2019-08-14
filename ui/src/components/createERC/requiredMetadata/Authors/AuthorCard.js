import { Formik } from "formik";
import React from "react";
import { AuthorForm, authorValidationSchema } from "./AuthorForm";



function AuthorCard(props) {

    const self = props;
    return (
        <div id="AuthorCard">

            <Formik
                onSubmit={(values, actions) => {

                }}
                render={props => <AuthorForm{...props} method={"Update"} handleDelete={self.handleDelete} deleteable={self.deleteable} onChange={self.handleUpdate}
                    index={self.id} />}
                initialValues={props.author}
                validationSchema={authorValidationSchema}
                enableReinitialize={true}
            />

        </div>
    );

}

export default AuthorCard;