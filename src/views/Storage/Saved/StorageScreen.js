import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import StorageTable from "../StorageTable";
import fire from '../../../fire.js';

// Filter Options
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import NewDevice from '../NewDevice';
import DeviceQrDialog from '../DeviceQrDialog';
import EditDevice from '../EditDevice';

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
  },
  addDeviceDiv: {
    color: '#ffa21a',
  },
  addDevice: {
    maxWidth: '10%',
    float: 'right',
    marginTop: '-50px',
  },
};

const otherUseStyles = makeStyles((theme) => ({
    leftUpperSelectFormControl: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(0),
        minWidth: '10rem',
        marginBottom: theme.spacing(3),
    },
    upperSelectFormControl: {
      margin: theme.spacing(1),
      minWidth: '10rem',
    },
    filterButton: {
        maxWidth: '5%',
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: '3',
        border: '0',
        color: 'white',
        height: '55px',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
}));

const useStyles = makeStyles(styles);

export default function Storage() {
  const classes = useStyles();
  const otherClasses = otherUseStyles();
  const [open, setOpen] = useState(false);
  const [storageDevices, setStorageDevices] = useState([]);
  const [category, setCategory] = useState('');
  const [storageType, setStorageType] = useState('');
  const [chosenDevice, setChosenDevice] = useState('');
  const [editDevice, setEditDevice] = useState('');

  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [currentDevice, setCurrentDevice] = useState('');
  const [openDeviceChange, setOpenDeviceChange] = useState(true);
  const [openDeviceQr, setOpenDeviceQr] = useState(false);

  // ---------------------------------------------------------------------------------------------------------------------------
  // Alert Variables:
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

  // Alert Functions:
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
  // ---------------------------------------------------------------------------------------------------------------------------
  
  const colorButtonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  // A function that handles changing the storage devices values (since we can't do that from an asynchronous function):
  const handleSetStorageDevices = (arr) => {
      console.log(arr)
      setStorageDevices(arr)
  }


  // Retrieving data regarding the current user from the db:
  const getUserDetailsFromDb = () => {
      const db = fire.firestore();
      const auth = fire.auth();
      var docRef = db.collection("users").doc(auth.currentUser.uid);

      docRef.get().then(function(doc) {
          if (doc.exists){
              var data = doc.data()
              console.log(data);
              // Storing the user's details:
              setUserEmail(data.email);
              setUserFullName(data.fullName);
              // If the user's position is manager then setting the userAdmin to true:
              // if (data.position.toLowerCase() === "manager") {
              //     setUserAdmin(true);
              // }
          } else{
          handleOpenAlert("error", "Something went wrong, please try again later.");
          }
      })
  }

  // A function which is in charge of retrieving data from the db regarding the current user's devices:
  const getDevicesFromDb = () => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    const auth = fire.auth()
    var tempArr = []

    // Creating a reference to the storage-details part:
    db.collection("users").doc(auth.currentUser.uid).collection("storage").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          var data = doc.data();
          if (doc.id !== "storage-details"){
            var warehouseRec = {
              category: data.category,
              certificate: data.certificate,
              certificateImg: data.certificateImg,
              deviceName: data.deviceName,
              labHistory: data.labHistory,
              price: data.price,
              serial: data.serial,
              storageType: data.storageType,
              supplier: data.supplier,
              warrantyPeriod: data.warrantyPeriod,
              // Converting the TimeStamp to a date:
              warrantyStart: data.warrantyStart.toDate()
            }
            // Calculating the warranty's end date and adding it to the warehouseRec:
            var tempEnd = new Date(warehouseRec.warrantyStart.valueOf());
            tempEnd.setMonth(tempEnd.getMonth() + warehouseRec.warrantyPeriod);
            warehouseRec.warrantyEnd = tempEnd.toISOString().substring(0, 10);
            
            tempArr.push(warehouseRec);
  
            // doc.data() is never undefined for query doc snapshots:
            // console.log(doc.id, " => ", warehouseRec);
          }
        })
        handleSetStorageDevices(tempArr);
        console.log("STORAGE DEVICES: ", tempArr);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      })
  }

  useEffect(() => {
    getDevicesFromDb();
    getUserDetailsFromDb();
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Your Storage</h4>
            <p className={classes.cardCategoryWhite}>
              All your managed storage in one space.
            </p>
            <div className={classes.addDeviceDiv}>
                <Button
                style={colorButtonStyle}
                className={classes.addDevice}
                endIcon={<Icon>add</Icon>}
                onClick={handleClickOpen}
                >
                Add
                </Button>
            </div>
          </CardHeader>
          <CardBody>
            <FormControl variant="outlined" className={otherClasses.leftUpperSelectFormControl}>
            <InputLabel id="select-storage-type-outlined-label">Storage</InputLabel>
            <Select
                labelId="select-storage-type-outlined-label"
                id="select-storage-type-outlined"
                value={storageType}
                onChange={event => setStorageType(event.target.value)}
                label="Storage"
            >
                <MenuItem value="">
                <em>Any</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>

            <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
            <InputLabel id="select-category-outlined-label">Category</InputLabel>
            <Select
            clas
                labelId="select-category-outlined-label"
                id="select-category-outlined"
                value={category}
                onChange={event => setCategory(event.target.value)}
                label="Category"
            >
                <MenuItem value="">
                <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>
            <Button className={otherClasses.filterButton}>Filter</Button>

            <StorageTable
            title=""
            setOpenDeviceQr = {setOpenDeviceQr}
            headerBackground="#ffa21a" 
            data={storageDevices}
            fullData={storageDevices}
            setCurrentDevice={setCurrentDevice}
            />
          </CardBody>
        </Card>
      </GridItem>


      { /* Allows us to give the user an option to add a new device */}
      <NewDevice open={open} setOpen={setOpen} storageDevices={storageDevices} setStorageDevices={setStorageDevices} 
      handleOpenAlert={handleOpenAlert} userEmail={userEmail} userFullName={userFullName} setCurrentDevice={setCurrentDevice} setOpenDeviceChange={setOpenDeviceChange}/>

      <DeviceQrDialog formTitle={"Device QR Code - " + currentDevice.serial} serial={currentDevice.serial} open = {openDeviceQr} setOpen = {setOpenDeviceQr}/>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertText}
        </Alert>
      </Snackbar>

    </GridContainer>
  );
}
