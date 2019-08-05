import React, {Component} from "react";
import AuthorCard from "./AuthorCard"
import {Card, IconButton, CardContent} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';



class Authors extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
            deletable: false
        };
        
    }


    componentDidMount() {
        if (this.props.authors.length > 1) {
            this.setState({deletable: true})
        } else {
            this.setState({deletable: false})
        }
    }


    handleDelete(i) {
        let authors = this.props.authors.slice();

        authors.splice(i, 1);

        this.props.onUpdate(authors);
        if (authors.length > 1) {
            this.setState({deletable: true});
        } else {
            this.setState({deletable: false});
        }
    }

    handleUpdate = (i, value) => {
        const authors = this.props.authors.slice();
        authors[i] = value;
        this.props.onUpdate(authors);
    };

    handleClick = () => {
        this.setState({deletable: true});
        this.props.onUpdate(this.props.authors.concat({
            name: "",
            affiliation: "",
            orcid: ""
        }))
    };


    render() {
        return (
            
               <div>
                    <h4>Authors</h4>
                    {this.props.authors.map((item, index) =>
                        <AuthorCard
                            key={index}
                            id={index}
                            author={item}
                            deleteable={this.state.deletable}
                            handleDelete={() => this.handleDelete(index)}
                            handleUpdate={this.handleUpdate}
                        />
                    )}
                
                <div>
                    <IconButton aria-label="Add"
                        onClick={this.handleClick}
                        color="primary"
                    >
                        <AddIcon />
                    </IconButton>
                </div>
</div>
        

        )
    }
}

export default Authors