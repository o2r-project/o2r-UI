import React from "react";
import {Card, CardHeader, CardContent, Grid, Checkbox } from "@material-ui/core";

const SubstitutionCard = (props) => {
    return (<Card >
        {props.class === "base" ? <CardHeader title={"Base ERC: " + props.erc.title} /> : <CardHeader title={"Overlay ERC: " + props.erc.title} />}
        <p style={{textAlign : "center"}}>Input files:</p>
        {props.files.map((datafile, index) => (
            <><Card className={"class" + ((props.selectedFiles.indexOf(datafile) % 7) + 1)} style={{ width: "70%", "margin-left": "15%" }}>
                <CardContent style={{ "padding-bottom": "16px" }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <p style={{ "top": "40%" }}>{datafile}</p>
                        </Grid>
                        <Grid item xs={2}>
                            <Checkbox
                                style={{ "top": "11%" }}
                                checked={datafile === props.selected || props.selectedFiles.includes(datafile)}
                                onChange={props.handleChange()}
                                value={datafile}
                                color="primary"
                                disabled={props.selectedFiles.includes(datafile)}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
                <br /></>
        ))}
    </Card>
    )
}

export default SubstitutionCard;