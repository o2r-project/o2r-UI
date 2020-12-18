import React, { useState } from "react";


import { Card, CardHeader, CardContent, Button, IconButton, Collapse, Grid, } from '@material-ui/core';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';


const ResultList= (props) => 
{

    const [expanded, setExpanded] = useState(null);

    const setExpand = (index) => {
        if(expanded !== index){
            setExpanded(index)
        }
        else{
            setExpanded(null);
        }
    }

    return(
  <>
                                {props.ercs.map((erc, index) => (
                                    erc.metadata? <div key={index}>
                                        <Card style={{ "text-align": "justify", "margin": "10px" }}>
                                            {erc.substituted ? <CardHeader title={erc.metadata.o2r.title + " [SUBSTITUTED]"} style={{ "padding-bottom": "0px" }} /> :
                                                <CardHeader title={erc.metadata.o2r.title} style={{ "padding-bottom": "0px" }} />}
                                            <CardContent>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={9} style={{ "padding-top": "0px" }}>
                                                        <p> <span style={{ "font-weight": "bold" }}> Created on: </span> {erc.created.substr(0, 10)} {erc.created.substr(11, 5)}  <br />
                                                            <span style={{ "font-weight": "bold" }}> by: </span> {erc.user} </p>
                                                        {erc.metadata.o2r.description ?
                                                            <> {erc.metadata.o2r.description.substr(0, 300)}
                                                                <Collapse component={"span"} in={expanded === index} unmountOnExit>
                                                                    <span>{erc.metadata.o2r.description.substring(300, erc.metadata.o2r.description.length)}</span>
                                                                </Collapse>
                                                                {erc.metadata.o2r.description.length > 300 ?
                                                                    <IconButton aria-label='more_horiz' style={{ "padding": "0px", "margin-left": "5px" }}
                                                                        onClick={() => setExpand(index)}>
                                                                        {expanded === index ? <ExpandLessIcon /> : <MoreHorizIcon />}
                                                                    </IconButton> : ""}  </> :
                                                            <div> <p>This ERC has no description</p> </div>}
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Button variant="contained" size="small" color="primary" style={{ "top": "40%" }} onClick={() => props.editMetadata(erc)}>
                                                            Edit Metadta
                                                         </Button>
                                                         <br/>
                                                         <br/>
                                                         <Button variant="contained" size="small" color="primary" style={{ "top": "40%" }} onClick={() => props.goToErc(erc)}>
                                                            Go to ERC
                                                         </Button>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </div> : ""
                                ))} </>
    )
}

export default ResultList