import {createTheme} from '@material-ui/core/styles';

const o2rTheme = createTheme({
    palette: {
        primary : {
            main: config.ojsView ? config.ERCGalleyPrimaryColour : '#004286', //eslint-disable-line
        },
        secondary: {
            main: '#220086'
        },
        success: {
            main: '#008643'
        },
        warning: {
          main: '#CE5100'
        },
        failure: {
            main: '#860000'
        }
    }

  });

  export default o2rTheme;
