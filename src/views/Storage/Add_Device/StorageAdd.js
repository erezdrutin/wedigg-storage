import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckboxesTags from './StorageAutoComplete.js';
import Grid from '@material-ui/core/Grid';
import StorageCard from "../StorageCard.js";
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import TextField from '@material-ui/core/TextField';

import StorageAddTable from './StorageAddTable.js';
import FileUploader from './FileUploader.js';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const colorButtonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 55,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    maxWidth: '75%',
    marginTop: '-1px'
};

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField);

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "1rem"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  headerColor: {
    background: 'linear-gradient(45deg, #F39C12 30%, #F5B041 90%)',
    boxShadow: '0 3px 5px 2px rgba(243, 156, 18, .30)',
    margin: "0 15px",
    padding: "0",
    position: "relative",
    padding: "0.75rem 1.25rem",
    marginBottom: "0",
    borderBottom: "none",
    borderRadius: "3px",
    marginTop: "-20px",
    padding: "15px",
  },
};

const useStyles = makeStyles(styles);

export default function StorageAddNew() {
  const classes = useStyles();
  const [data, setData] = useState([
    {
      siteId: "IsraelID", productId: "MH7892/A", storage: "Storage A", supplierId: "WediggitID", certificate: "SH724892",
      certificateImage: "https://firebasestorage.googleapis.com/v0/b/wedigg-storage.appspot.com/o/images%2FSH22049567?alt=media&token=37e6930b-1143-45db-a0eb-91353359b1c4",
      serial: "XY7NTF4JN", warranty: Date()
    }
  ]);


  const [currentDevice, setCurrentDevice] = useState('');

  const [site, setSite] = useState('');
  const [storage, setStorage] = useState('');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');
  const [certificate, setCertificate] = useState('');
  const [certificateImage, setCertificateImage] = useState('');

  // useEffect(() => {
  //   console.log("CERTIFICATE UPDATED: ", certificate)
  // }, [certificate])

  /**
   * A function in charge of determining whether the user's input in the General Information panel is valid or not.
   * Verifying the following things:
   * 1. The site, storage, supplier & category exists.
   * 2. The certificate's length is valid.
   * 3. The certificateImage's size is valid (less than 0.05 MB).
   */
  const verifyGeneralInfo = () => {
    
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>General Information</h4>
            <p className={classes.cardCategoryWhite}>
              The following parameters are relevant for all the devices that you will add in this session.
            </p>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        id="newDeviceWarrantyStartDate"
                        style={{width: '100%'}}
                        label="Warranty Start Date"
                        // value={warrantyStartDate}
                        onChange={date => console.log(date)}
                        format="dd/MM/yyyy"
                    />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={2}>
                <CheckboxesTags
                  id="checkboxesTags_site"
                  getOptionTitle={(option) => option.site}
                  getOptionDesc={(option) => option.site}
                  data={data}
                  tooltipTitle="Associated Site"
                  fieldWidth="100%"
                  fieldName="Site"
                  setValue={setSite}
                />
              </Grid>
              <Grid item xs={2}>
                <CheckboxesTags
                  id="checkboxesTags_storage"
                  getOptionTitle={(option) => option.storage}
                  getOptionDesc={(option) => option.storage}
                  data={data}
                  tooltipTitle="Associated Storage (related to chosen Site)"
                  fieldWidth="100%"
                  fieldName="Storage"
                  setValue={setStorage}
                />
              </Grid>
              <Grid item xs={2}>
                <CheckboxesTags
                  id="checkboxesTags_supplier"
                  getOptionTitle={(option) => option.supplier}
                  getOptionDesc={(option) => option.supplier}
                  data={data}
                  tooltipTitle="Associated Supplier"
                  fieldWidth="100%"
                  fieldName="Supplier"
                  setValue={setSupplier}
                />
              </Grid>
              <Grid item xs={2}>
                <CssTextField
                id="checkboxesTags_certificate"
                variant="outlined"
                label={"Certificate"}
                onChange={(event) => setCertificate(event.target.value)}
                style={{width: '100%'}}
                />
              </Grid>
              <Grid item xs={2}>
                <FileUploader btnText="Certificate" btnIcon="image" handleFile={setCertificateImage}/>
              </Grid>
            </Grid>
          </CardHeader>
          <CardBody>

          <StorageAddTable 
            title=""
            headerBackground="#363636"
            data={data}
            setData={setData}
            currentDevice={currentDevice}
            setCurrentDevice={setCurrentDevice}
          />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
