import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TagFacesIcon from '@material-ui/icons/TagFaces';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function SelectedSettings(props) {
  const classes = useStyles();
  const settings = props.settings;

  const handleDelete = settingToDelete => () => {
    props.removeItem(settingToDelete)
  };

  return (
    <Paper className={classes.root}>
      {settings.map((setting,index) => {
        let icon;

        icon = <TagFacesIcon />;

        return (
          <Chip
            key={index}
            label={setting}
            onDelete={handleDelete(setting)}
            className={classes.chip}
          />
        );
      })}
    </Paper>
  );
}