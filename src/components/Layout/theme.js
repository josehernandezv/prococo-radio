import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import deepPurple from '@material-ui/core/colors/deepPurple';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: teal,
        secondary: deepPurple
    },
    typography: {
        useNextVariants: true,
    },
});

export default theme;