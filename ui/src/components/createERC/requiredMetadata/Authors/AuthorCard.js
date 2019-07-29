import {Card, CardContent, IconButton} from "@material-ui/core";
import {Formik} from "formik";
import React from "react";
import {AuthorForm, authorValidationSchema} from "./AuthorForm";
import DeleteIcon from '@material-ui/icons/Delete';
import "./authorCard.css";


function AuthorCard(props) {

    const [expanded, setExpanded] = React.useState(false);

    function handleExpandClick() {
        setExpanded(!expanded);
    }

    const self = props;
    return (

        <Card id="authorcard">

            <CardContent>
                <div>
                    <Formik
                        onSubmit={(values, actions) => {
                            props.handleUpdate(props.id, values);
                            handleExpandClick();
                        }}
                        render={props => <AuthorForm{...props}  method={"Update"} onChange={self.handleUpdate}
                                                     index={self.id}/>}
                        initialValues={props.author}
                        validationSchema={authorValidationSchema}
                        enableReinitialize={true}
                    />

                </div>
                <div>
                    {props.deletable ?
                        <IconButton aria-label="Delete"
                                    onClick={() => props.handleDelete()}
                                    color="primary"
                        >
                            <DeleteIcon/>
                        </IconButton>
                        : ''}
                </div>
            </CardContent>

        </Card>

    );

}

export default AuthorCard;