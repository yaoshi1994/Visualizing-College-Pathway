import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue600, grey900, grey600} from 'material-ui/styles/colors';

const themeDefault = getMuiTheme({
  palette: {
  },
  appBar: {
    height: 57,
    color: grey600
  },
  drawer: {
    width: 230,
    color: grey900
  },
  raisedButton: {
    primaryColor: grey600,
  }
});


export default themeDefault;
