

import React, { Fragment, useState, useEffect } from "react";
// @material-ui/core components 
import { makeStyles, Theme } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import MaterialTable from "material-table";
import Button from "components/CustomButtons/Button.js";
import IconButton from '@material-ui/core/IconButton';

import Icon from "@material-ui/core/Icon";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import fire from '../../fire.js';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";

// New Device Icons In Form:
import LaptopMacIcon from '@material-ui/icons/LaptopMac'; // Product
import DevicesOtherIcon from '@material-ui/icons/DevicesOther'; // Category
import EmojiSymbolsIcon from '@material-ui/icons/EmojiSymbols'; // Serial
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'; // Price
import DescriptionIcon from '@material-ui/icons/Description'; // Certificate
import PhotoIcon from '@material-ui/icons/Photo'; // Certificate Image
import LocalShippingIcon from '@material-ui/icons/LocalShipping'; // Supplier
import PlaceIcon from '@material-ui/icons/Place'; // Storage Type
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'; // Warranty Period
import BuildIcon from '@material-ui/icons/Build'; // Lab History

// Alerts:
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
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
  }
};

const useStyles = makeStyles(styles);

const otherUseStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '600px'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  warrantyPeriod: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  addDevice: {
    width: '120px',
    float: 'right',
  },
  topRow: {
    width: '100%',
  },
  topLeft: {
    display: 'block',
    float: 'left',
    width: '65%'
  },
  topRight: {
    width: '35%',
    float: 'right',
  },
}));

const newCardTypeOptions = [
  'Count Of Devices', 'Count Of Warehouses', 'Warehouses Capacity %', 'Count Of Insured Devices', 'Count Of Uninsured Devices %', 'Devices Whose Warranty Is About To Expire'
]

const newCardColorOptions = [
  'Cyan', 'Green', 'Orange', 'Red', 'Purple'
]

function FormCreator(props){
  const { controlId } = props;
  const otherClasses = otherUseStyles();
  const [selectedCardType, setSelectedCardType] = useState('');
  const [open, setOpen] = useState(false);
  const handleCardTypeChange = (event) => {
    setOpen(true);
  }
  
  return (
    <form className={otherClasses.container}>
    <TextField id="standard-basic" label="Standard" />

          <FormControl className={otherClasses.formControl}>
              <InputLabel id="select-card-type-label">Card Content</InputLabel>
              <Select
                labelId="select-card-type-label"
                id="select-card-type"
                value={selectedCardType}
                onChange={handleCardTypeChange}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {newCardTypeOptions.map((option, index) => (
                  <MenuItem value={index+1}>{option}</MenuItem>
                ))}
              </Select>
          </FormControl>

        </form>
  );
}



function WarrantyDatePickerCreator(props) {
  const { labelText, warrantyDate, setWarrantyDate } = props;
  const otherClasses = otherUseStyles();
  return (
    <Fragment>
      <KeyboardDatePicker
        required
        label={labelText}
        className={otherClasses.formControl}
        value={warrantyDate}
        onChange={date => setWarrantyDate(date)}
        maxDate={new Date()}
        format="dd/MM/yyyy"
      />
    </Fragment>
  );
}

export default function Device() {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [test, setTest] = useState('');
  const otherClasses = otherUseStyles();
  const [createNewCard, setCreateNewCard] = useState('');
  const [cardsArr, setCardsArr] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [selectedCardColor, setSelectedCardColor] = useState('');

  // New Device Variables:
  const [deviceName, setDeviceName] = useState('');
  const [deviceCategory, setDeviceCategory] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [devicePrice, setDevicePrice] = useState('');
  const [deviceCertificate, setDeviceCertificate] = useState('');
  const [deviceCertificateImage, setDeviceCertificateImage] = useState('');
  const [deviceSupplier, setDeviceSupplier] = useState('');
  const [deviceStorageType, setDeviceStorageType] = useState('');
  const [deviceWarrantyStart, setDeviceWarrantyStart] = useState(new Date());
  const [deviceWarrantyPeriod, setDeviceWarrantyPeriod] = useState(new Date());
  const [deviceLabHistory, setDeviceLabHistory] = useState('');
  // New Device Helping Variables:
  const [deviceSuppliersArr, setDeviceSuppliersArr] = useState(['Wediggit', 'One']);
  const [deviceStorageTypesArr, setDeviceStorageTypesArr] = useState(['Office Storage', 'Home Storage']);
  const [deviceCategoriesArr, setDeviceCategoriesArr] = useState(['Macbook Pro', 'Macbook Air', 'iMac', 'HP Laptop', 'Dell Laptop', 'Dell Monitor', 'iPhone', 'Other']);

  // Alert Variables:
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

  const handleOpenAlert = (severity, text) => {
    // Setting the alert text:
    setAlertText(text);
    // Setting the alert severity (color ~ error, warning, info, success):
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };


  const imageChanged = (event) => {
    // Create a root reference
    var storageRef = fire.storage().ref();

    // File { Blob }:
    var file = event.target.files[0]

    // file.size displays image size in bytes.
    // Capping Max File size at 0.5 MB {65,536 Bytes}:
    if (file.size > 65536){
      alert("The received image is too big. Are you sure that you tried to upload a certificate?")
    } else {
      // Create the file metadata
      var metadata = {
        contentType: 'image/jpeg'
      };
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child('images/' + deviceCertificate).put(file, metadata);
      
      // // Upload completed successfully, now we can get the download URL
      // uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      //   console.log('File available at', downloadURL);
      // });
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleCancel = () => {
    setOpen(false);
  };

  // A function which will run as soon as the page loads:
  useEffect(() => {
    getDbDevices();
  }, []);


  const getDbDevices = () => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    const auth = fire.auth()
    var docRef = db.collection("users").doc(auth.currentUser.uid).collection("storage")
    docRef.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if (doc.id !== 'storage-details'){
          // Then we want to add the devices to an array of devices.
        }
        // doc.data() is never undefined for query doc snapshots:
        console.log(doc.id, " => ", doc.data());
      })
    })
  }

  const writeToDB = (downloadURL) => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    const auth = fire.auth()
    let supplierName = deviceSuppliersArr[parseInt(deviceSupplier)-1];
    let storageType = deviceStorageType===1 ? "Office Storage" : "Home Storage";
    let category = deviceCategoriesArr[parseInt(deviceCategory)-1];
    db.collection("users").doc(auth.currentUser.uid).collection("storage").add({
      deviceName: deviceName,
      category: category,
      serial: deviceSerial,
      price: parseInt(devicePrice),
      certificate: deviceCertificate,
      certificateImg: downloadURL,
      supplier: supplierName,
      warrantyStart: deviceWarrantyStart,
      warrantyPeriod: parseInt(deviceWarrantyPeriod),
      storageType: storageType,
      labHistory: deviceLabHistory
    })
    .then(function() {
        console.log("Document successfully written!");
        handleOpenAlert('success', 'Successfully added the device!');
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        handleOpenAlert('error', 'An error occurred.');
    });
  }

  const handleOk = () => {
    console.log(deviceName + deviceCategory + deviceSerial + devicePrice + deviceCertificate + deviceCertificateImage + deviceSupplier + deviceStorageType + deviceWarrantyStart + deviceWarrantyPeriod + deviceLabHistory);
    
    // Create a root reference
    var storageRef = fire.storage().ref();

    storageRef.child("images/" + deviceCertificate).getDownloadURL().then(function onResolve(foundURL){
      // If we got here then we found the certificate therefore we shouldn't add it again.
    }, function onReject(error){
      // If we got here then we should add the certificate as it wasn't found in the storage:
      // file.size displays image size in bytes.
      // Capping Max File size at 0.05 MB {524,288 Bytes}:
      if (deviceCertificateImage.size > 524288){
        alert("The received image is too big. Are you sure that you tried to upload a certificate?")
      } else {
        // Create the file metadata
        var metadata = {
          contentType: 'image/jpeg'
        };
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('images/' + deviceCertificate).put(deviceCertificateImage, metadata);

        uploadTask.on('state_changed', function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, function(error) {
      }, function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            writeToDB(downloadURL);
            console.log(downloadURL);
          })
        })
      }
    })
    // Now resetting all the entered values:
    setDeviceName('');
    setDeviceSerial('');
    setDevicePrice('');
    setDeviceCertificate('');
    setDeviceCertificateImage('');
    setDeviceCategory('');
    setDeviceSupplier('');
    setDeviceStorageType('');
    setDeviceWarrantyStart('');
    setDeviceWarrantyPeriod('');
    setDeviceLabHistory('');

    // At last, closing the pop up:
    setOpen(false);
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div className={otherClasses.topRow}>
                <div className={otherClasses.topLeft}>
                  <h4 className={classes.cardTitleWhite}>Warehouses Table</h4>
                  <p className={classes.cardCategoryWhite}>
                    A table containing all the warehouses that are being managed.
                  </p>
                </div>
                <div className={otherClasses.topRight}>
                  <Button
                  variant="contained"
                  color="warning"
                  className={otherClasses.addDevice}
                  endIcon={<Icon>add</Icon>}
                  onClick={handleClickOpen}
                  >
                  Add Device
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardBody>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCancel}>
      <DialogTitle>Create A Device</DialogTitle>
      <DialogContent>
        <form className={otherClasses.container}>
          <Grid>

            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <LaptopMacIcon />
              </Grid>
              <Grid item>
                <TextField required id="standard-basic" label="Product Name" className={otherClasses.formControl} value={deviceName} onChange={(event) => {setDeviceName(event.target.value)}} />
              </Grid>
              <Grid item>
                <EmojiSymbolsIcon />
              </Grid>
              <Grid item>
                <TextField required id="standard-basic" label="Serial" className={otherClasses.formControl} value={deviceSerial} onChange={(event) => {setDeviceSerial(event.target.value)}} />
              </Grid>
            </Grid>

            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <MonetizationOnIcon />
              </Grid>
              <Grid item>
                <TextField required id="standard-basic" label="Price" className={otherClasses.formControl} type="number" InputLabelProps={{ shrink: true }} value={devicePrice} onChange={(event) => {setDevicePrice(event.target.value)}}/>
              </Grid>
              <Grid item>
                <DescriptionIcon />
              </Grid>
              <Grid item>
                <TextField required id="standard-basic" label="Certificate" className={otherClasses.formControl} onChange={(event) => {setDeviceCertificate(event.target.value)}}/>
              </Grid>
              <Grid item>
                <input
                  accept="image/*"
                  className={classes.input}
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  disabled={deviceCertificate ? false : true}
                  onChange={(event) => {setDeviceCertificateImage(event.target.files[0])}}
                />
                <label htmlFor="raised-button-file">
                  <IconButton color={deviceCertificate ? "primary": "secondary"} aria-label="upload picture" component="span">
                    <PhotoIcon />
                  </IconButton>
                </label>
              </Grid>
            </Grid>

            <Grid container spacing={1} alignItems="flex-end">
            
            <Grid item>
              <DevicesOtherIcon />
            </Grid>
            <Grid>
              <FormControl className={otherClasses.formControl}>
                <InputLabel id="select-device-category-label">Category *</InputLabel>
                  <Select
                    labelId="select-device-category-label"
                    id="select-device-category"
                    value={deviceCategory}
                    onChange={(event) => {setDeviceCategory(event.target.value)}}
                    input={<Input />}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {deviceCategoriesArr.map((option, index) => (
                      <MenuItem key={"deviceCategoriesArr", index+1} value={index+1}>{option}</MenuItem>
                    ))}
                  </Select>
              </FormControl>
            </Grid>

              <Grid item>
                <LocalShippingIcon />
              </Grid>
              <Grid item>
                <FormControl className={otherClasses.formControl}>
                  <InputLabel id="select-device-supplier-label">Supplier *</InputLabel>
                    <Select
                      labelId="select-device-supplier-label"
                      id="select-device-supplier"
                      value={deviceSupplier}
                      onChange={(event) => {setDeviceSupplier(Number(event.target.value) || 0);}}
                      input={<Input />}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                    {deviceSuppliersArr.map((option, index) => (
                      <MenuItem key={"deviceSuppliersArr", index+1} value={index+1}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item>
                <PlaceIcon />
              </Grid>
              <Grid>
                <FormControl className={otherClasses.formControl}>
                  <InputLabel id="select-device-storage-type-label">Storage Type *</InputLabel>
                    <Select
                      labelId="select-device-storage-type-label"
                      id="select-device-storage-type"
                      value={deviceStorageType}
                      onChange={(event) => {setDeviceStorageType(Number(event.target.value) || 0);}}
                      input={<Input />}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {deviceStorageTypesArr.map((option, index) => (
                        <MenuItem key={"deviceStorageTypesArr", index+1} value={index+1}>{option}</MenuItem>
                      ))}
                    </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
      
        
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <WarrantyDatePickerCreator labelText="Warranty Start Date" warrantyDate={deviceWarrantyStart} setWarrantyDate={setDeviceWarrantyStart}/>
            </MuiPickersUtilsProvider>
            </Grid>
            <Grid item>
              <TextField id="standard-basic" required label="Warranty Period (Months)" type="number" InputLabelProps={{ shrink: true }} className={otherClasses.warrantyPeriod} value={deviceWarrantyPeriod} onChange={(event) => {setDeviceWarrantyPeriod(event.target.value)}} />
            </Grid>
            <Grid item>
              <QueryBuilderIcon />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <BuildIcon/>
            </Grid>
            <Grid item>
              <TextField
                id="standard-multiline-static"
                label="Lab History"
                style={{width:"265%"}}
                multiline
                value={deviceLabHistory}
                onChange={(event) => {setDeviceLabHistory(event.target.value)}}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertText}
        </Alert>
    </Snackbar>

    </div>
  );
}
