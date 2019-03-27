import React from 'react';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import {grey400} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import PageBase from '../components/PageBase';


sendData = () => {
    $.ajax({
      type: 'POST',
      url: "http://0.0.0.0:8000/get_data",
      dataType: 'jsonp',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringfy({'d': "lalallala"}),
      success: function(data) {
       console.log(JSON.stringfy({'d': "lalallala"}));
     }.bind(this),
      error: function(error) {
        console.log(error)
      }
    })
  }

const FormPage = () => {

  const styles = {
    toggleDiv: {
      maxWidth: 300,
      marginTop: 40,
      marginBottom: 5
    },
    toggleLabel: {
      color: grey400,
      fontWeight: 100
    },
    buttons: {
      marginTop: 30,
      float: 'right'
    },
    saveButton: {
      marginLeft: 5
    },
    textDiv: {
      marginTop:50
    }
  };

  return (
    <PageBase title="Contact Us"
              navigation="Application / Contact Us">
      <form>

        <TextField
          hintText="Name"
          floatingLabelText="Name"
          fullWidth={true}
        />
        <TextField
          hintText="Email Address"
          floatingLabelText="Email"
          fullWidth={true}
        />

        <SelectField
          floatingLabelText="University"
          value=""
          fullWidth={true}>
          <MenuItem key={0} primaryText="Cornell University"/>
          <MenuItem key={1} primaryText="abcd University"/>
          <MenuItem key={2} primaryText="Not Shown Above"/>
        </SelectField>

        <DatePicker
          hintText="Date"
          floatingLabelText="Date"
          fullWidth={true}/>

        <div style={styles.textDiv}>
          <TextField
          hintText="Message"
          floatingLabelText="Message"
          fullWidth={true}
          />
        </div>


        <div style={styles.buttons}>

            <RaisedButton label="Cancel" onclick={()=> this.sendData()}/>


          <RaisedButton label="Send"
                        style={styles.saveButton}
                        type="submit"
                        primary={true}/>
        </div>
      </form>
    </PageBase>
  );
};

export default FormPage;
