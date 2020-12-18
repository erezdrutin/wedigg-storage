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
import StorageTable from "./StorageTable";
import fire from '../../fire.js';

import VerifyOperation from "../VerifyOperation.js";

// Filter Options
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import NewDevice from './NewDevice';
import DeviceQrDialog from './DeviceQrDialog';
import EditDevice from './EditDevice';

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
  const [usersArr, setUsersArr] = useState([]);
  const [currentUserRec, setCurrentUserRec] = useState({});


  const [site, setSite] = useState('');
  const [sitesArr, setSitesArr] = useState([]);
  const [storage, setStorage] = useState('');
  const [storagesArr, setStoragesArr] = useState([]);
  const [category, setCategory] = useState('');
  const [categoriesArr, setCategoriesArr] = useState([]);
  const [supplier, setSupplier] = useState('');
  const [suppliersDict, setSuppliersDict] = useState([]);
  const [suppliersArr, setSuppliersArr] = useState([]);
  const [selectDataArr, setSelectDataArr] = useState([]);

  const [storageDevices, setStorageDevices] = useState([]);

  const [open, setOpen] = useState(false);
  const [chosenDevice, setChosenDevice] = useState('');
  const [editDevice, setEditDevice] = useState('');

  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [currentDevice, setCurrentDevice] = useState('');
  const [openDeviceChange, setOpenDeviceChange] = useState(true);
  const [openDeviceQr, setOpenDeviceQr] = useState(false);
  const [openEditDevice, setOpenEditDevice] = useState(false);

  // Alert Variables:
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

  // Verify Operation Variables:
  const [openVerifyOperation, setOpenVerifyOperation] = useState(false);
  const [verifyOperationTitle, setVerifyOperationTitle] = useState('Default Title');
  const [verifyOperationText, setVerifyOperationText] = useState('Default Text');
  const [verifyOperationFunction, setVerifyOperationFunction] = useState('Default Text');
  const [verifyOperationBool, setVerifyOperationBool] = useState(false);

  // ---------------------------------------------------------------------------------------------------------------------------
  // Verify Operation Functions:
  /**
   * A function in charge opening the verify operation dialog.
   * @param {string} title - The title of the dialog.
   * @param {string} text - The text of the dialog.
   */
  const handleOpenVerifyOperation = (title, text) => {
    setOpenVerifyOperation(true);
    setVerifyOperationTitle(title);
    setVerifyOperationText(text);
  }
  // ---------------------------------------------------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------------------------------------------------
  // Alert Functions:
  /**
   * A function in charge of opening an alert.
   * @param {string} severity - The color of the alert.
   * @param {string} text - The text displayed in the alert.
   */
  const handleOpenAlert = (severity, text) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  /**
   * A function in charge of closing an alert.
   * @param {string} reason - A string representing the reason for closing the alert.
   */
  const handleCloseAlert = (reason) => {
    // Not closing the alert in case of a click on the screen:
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
      setStorageDevices(arr)
  }

  /**
   * A function in charge of setting the usersData variable to the received arr.
   * @param {*} arr - An array of users records which will be used while parsing through the different data that we should display the user.
   */
  const handleSetUsersData = (arr, currentRec) => {
    setUsersArr(arr)
    setCurrentUserRec(currentRec)
  }

  /**
   * Basically retrieving all the relevant data from the db.
   */
  const getUsersDataFromDb = (db, auth) => {
    db.collection("users").get().then(function(querySnapshot){
      var tempArr = []; // An empty array which will be filled with users data.
      var currentRec = {}; // A variable to hold the current user's record.
      querySnapshot.forEach(function(doc){
        // Each doc.id is a unique user id. Storing the details of all the users, while storing the current user's details in specific variables too:
        var data = doc.data()
        var userRec = {
          uid: doc.id,
          fullName: data.fullName,
          email: data.email,
          site: data.site
        }
        tempArr.push(userRec);
        // If the current record matches the current user --> Setting the currentRec accordingly:
        if (doc.id == auth.currentUser.uid){
          currentRec = userRec;
        }
      })
      handleSetUsersData(tempArr, currentRec);
    })
  }

    /**
   * A function in charge of retrieving the details which we will use in the different selects that appear on the top of the page.
   * Our DB is configured in such way which will make it easy for us to pull all the SELECT fields quickly from 1 Read.
   * Basically, all we have to do is to run through (/sites) in our db, and we will receive a dictionary which will look like so:
   * {siteName: "", categoriesArr: [], storageTypesArr: []}
   */
  const getSelectData = (db) => {
    var tempArr = [];
    db.collection("sites").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        var data = doc.data()
        var selectRec = {
          siteName: doc.id,
          categoriesArr: data.categoriesArr,
          storageTypesArr: data.storageTypesArr
        }
        // Pushing the record we created:
        tempArr.push(selectRec);
      })
      // Setting the selectDataArr to the retrieved data:
      handleSetSelectDataArr(tempArr);
    })
  }

  /**
   * A function in charge of setting the selectDataArr variable to the received arr.
   * @param {string []} arr - An array with the select data. 
   */
  const handleSetSelectDataArr = (arr) => {
    setSelectDataArr(arr);
    // Setting the sites arr:
    setSitesArr(arr.map(a => a.siteName));
    console.log(arr);
  }


  const getFilteredDevicesFromDb = () => {
    var devicesRef = fire.firestore().collection("devices");

    var query = devicesRef;
    
    // If site exists OR site === 0
    if (site){
      var curSite = selectDataArr ? selectDataArr[site-1].siteName : "";
      var curStorage = selectDataArr ? selectDataArr[site-1].storageTypesArr[storage-1] : "";
      var curCategory = selectDataArr ? selectDataArr[site-1].categoriesArr[category-1] : "";
      var curSupplier = suppliersArr ? suppliersArr[supplier-1] : "";

      if (curSite && curSite !== ""){
        console.log("CURSITE", curSite)
        query = query.where("site", "==", curSite);
      }
      if (curStorage && curStorage !== ""){
        console.log("CURSTORAGE", curStorage)
        query = query.where("storageType", "==", curStorage);
      }
      if (curCategory && curCategory !== ""){
        console.log("CURCATEGORY", curCategory)
        query = query.where("category", "==", curCategory);
      }
      if (curSupplier && curSupplier !== ""){
        console.log("CURSUPPLIER", curSupplier)
        query = query.where("supplier", "==", curSupplier);
      }
    }

    console.log("ABOUT TO PERFORM QUERY ====> ", query)

    query.get().then(function(querySnapshot) {
      var tempArr = []
      querySnapshot.forEach(function(doc){
        // Storing each of the devices stored in the db with it's matching details.
        var data = doc.data()
        var deviceRec = {
          category: data.category,
          deviceName: data.deviceName,
          certificate: data.certificate,
          certificateImg: data.certificateImg,
          price: data.price,
          notes: data.notes,
          serial: data.serial,
          site: data.site,
          storageType: data.storageType,
          supplier: data.supplier,
          user: data.user,
          warrantyPeriod: data.warrantyPeriod,
          warrantyStart: data.warrantyStart.toDate() // Converting the timestamp to a date and then to a string
        };
        deviceRec.warrantyEnd = calculateWarrantyEnd(deviceRec.warrantyStart, deviceRec.warrantyPeriod);
        console.log("DEVICEREC", deviceRec)
        tempArr.push(deviceRec);
      })
      // Setting the devices data based on the db query:
      handleSetStorageDevices(tempArr);
    })
  }


  /**
   * A function in charge of querying the db for the devices data related to all the users.
   */
  const getDevicesDataFromDb = (db, auth) => {
    db.collection("devices").get().then(function(querySnapshot){
      var tempArr = []
      querySnapshot.forEach(function(doc){
        // Storing each of the devices stored in the db with it's matching details.
        var data = doc.data()
        var deviceRec = {
          category: data.category,
          deviceName: data.deviceName,
          certificate: data.certificate,
          certificateImg: data.certificateImg,
          price: data.price,
          notes: data.notes,
          serial: data.serial,
          site: data.site,
          storageType: data.storageType,
          supplier: data.supplier,
          user: data.user,
          warrantyPeriod: data.warrantyPeriod,
          warrantyStart: data.warrantyStart.toDate() // Converting the timestamp to a date and then to a string
        };
        deviceRec.warrantyEnd = calculateWarrantyEnd(deviceRec.warrantyStart, deviceRec.warrantyPeriod);
        console.log("DEVICEREC", deviceRec)
        tempArr.push(deviceRec);
      })
      // Setting the devices data based on the db query:
      handleSetStorageDevices(tempArr);
    })
  }

  /**
   * A function in charge of calculating the date on which the warranty ends.
   * Basically, the function returns the date "warrantyPeriod" months after "warrantyStart".
   * @param {timestamp} warrantyStart - A variable representing the date on which the warranty began.
   * @param {*} warrantyPeriod - A variable representing the length of the warranty (in months).
   */
  const calculateWarrantyEnd = (warrantyStart, warrantyPeriod) => {
    var tempEnd = new Date(warrantyStart.valueOf());
    var tempEnd = addMonths(tempEnd, warrantyPeriod);
    return tempEnd;
  }

  function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  /**
   * A function that formats a date object and returns a matching string.
   * @param {Date} date - A date which we would like to receive it's formatted string 
   */
  // function getFormattedDate(date) {
  //   var year = date.getFullYear();
  //   var month = date.getMonth()+1;
  //   var dt = date.getDate();

  //   if (dt < 10) {
  //     dt = '0' + dt;
  //   }
  //   if (month < 10) {
  //     month = '0' + month;
  //   }

  //   return dt + '/' + month + '/' + year;
  // }

  /**
   * A function in charge of retrieving a suppliersDict from the db.
   * @param {*} db - A connection to the db.
   */
  const getSuppliersArr = (db) => {
      var tempDict = {};
      db.collection("suppliers").get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc){
              var data = doc.data()
              if (tempDict[data.site]){
                  tempDict[data.site].push(data.supplierName);
              } else {
                  tempDict[data.site] = [data.supplierName];
              }
          })
          handleSetSuppliersDict(tempDict);
      })
  }

  /**
   * A function in charge of setting the suppliersDict variable to the received arr.
   * @param {string []} arr - An array with the select data. 
   */
  const handleSetSuppliersDict = (dict) => {
    setSuppliersDict(dict);
  }

  useEffect(() => {
    // First retrieving all the users details from the db:
    const db = fire.firestore()
    const auth = fire.auth()
    getUsersDataFromDb(db, auth);
    getDevicesDataFromDb(db, auth);
    getSelectData(db);
    getSuppliersArr(db);
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
            <InputLabel id="select-site-outlined-label">Site</InputLabel>
            <Select
                labelId="select-site-outlined-label"
                id="select-site-outlined"
                value={site}
                onChange={event => {
                  var curSite = event.target.value;
                  // 1. Setting a site:
                  setSite(curSite)
                  // 2. Updating the storage types & categories arrays accordingly:
                  // First finding the record in the selectDataArr which matches our siteName:
                  if (curSite){
                    setStoragesArr(selectDataArr[curSite-1].storageTypesArr);
                    setCategoriesArr(selectDataArr[curSite-1].categoriesArr);
                    setSuppliersArr(suppliersDict[sitesArr[curSite-1]]);
                  } else {
                    // If curSite === 0 --> Then we would like to rest the storagesArr & categoriesArr options:
                    setStoragesArr([]);
                    setCategoriesArr([]);
                    setStorage('');
                    setCategory('');
                    setSupplier('');
                  }
                }}
                label="Site"
              >
                <MenuItem value="">
                  <em>Any</em>
                </MenuItem>
                {sitesArr.map((option, index) => (
                    <MenuItem key={"sitesArr_", index} value={index+1}>{option}</MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
            <InputLabel id="select-storage-type-outlined-label">Storage</InputLabel>
            <Select
                labelId="select-storage-type-outlined-label"
                id="select-storage-type-outlined"
                value={storage}
                onChange={event => setStorage(event.target.value)}
                label="Storage"
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {storagesArr && storagesArr.map((option, index) => (
                  <MenuItem key={"storagesArr_", index} value={index+1}>{option}</MenuItem>
              ))}
            </Select>
            </FormControl>

            <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
            <InputLabel id="select-category-outlined-label">Category</InputLabel>
            <Select
                labelId="select-category-outlined-label"
                id="select-category-outlined"
                value={category}
                onChange={event => setCategory(event.target.value)}
                label="Category"
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {categoriesArr && categoriesArr.map((option, index) => (
                  <MenuItem key={"categoriesArr_", index} value={index+1}>{option}</MenuItem>
              ))}
            </Select>
            </FormControl>

            <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
            <InputLabel id="select-supplier-outlined-label">Supplier</InputLabel>
            <Select
                labelId="select-supplier-outlined-label"
                id="select-supplier-outlined"
                value={supplier}
                onChange={event => setSupplier(event.target.value)}
                label="Supplier"
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {suppliersArr && suppliersArr.map((option, index) => (
                  <MenuItem key={"categoriesArr_", index} value={index+1}>{option}</MenuItem>
              ))}
            </Select>
            </FormControl>

            <Button className={otherClasses.filterButton} onClick={getFilteredDevicesFromDb}>Filter</Button>

            <StorageTable
            title=""
            setOpenDeviceQr = {setOpenDeviceQr}
            headerBackground="#ffa21a" 
            data={storageDevices}
            setData={setStorageDevices}
            fullData={storageDevices}
            usersData={usersArr}
            handleOpenAlert={handleOpenAlert}
            currentDevice={currentDevice}
            setCurrentDevice={setCurrentDevice}
            setOpenEditDevice={setOpenEditDevice}
            handleOpenVerifyOperation={handleOpenVerifyOperation}
            verifyOperationBool={verifyOperationBool}
            setVerifyOperationBool={setVerifyOperationBool}
            //getFormattedDate={getFormattedDate}
            />
          </CardBody>
        </Card>
      </GridItem>


      { /* Allows us to give the user an option to add a new device */}
      <NewDevice open={open} setOpen={setOpen} storageDevices={storageDevices} setStorageDevices={setStorageDevices} 
      handleOpenAlert={handleOpenAlert} userRec={currentUserRec} setCurrentDevice={setCurrentDevice} usersArr={usersArr}
      setSitesArr={setSitesArr} sitesArr={sitesArr} selectDataArr={selectDataArr} setSelectDataArr={setSelectDataArr}
      calculateWarrantyEnd={calculateWarrantyEnd} setOpenDeviceQr={setOpenDeviceQr}/>

      { /* Allows us to give the user an option to edit a device */}
      {
        openEditDevice && (
          <EditDevice open={openEditDevice} setOpen={setOpenEditDevice} storageDevices={storageDevices} setStorageDevices={setStorageDevices} 
          handleOpenAlert={handleOpenAlert} userRec={currentUserRec} currentDevice={currentDevice} setCurrentDevice={setCurrentDevice} usersArr={usersArr}
          setSitesArr={setSitesArr} sitesArr={sitesArr} selectDataArr={selectDataArr} setSelectDataArr={setSelectDataArr}
          calculateWarrantyEnd={calculateWarrantyEnd} setOpenDeviceQr={setOpenDeviceQr} deviceSuppliersDict={suppliersDict}/>
        )
      }

      <VerifyOperation open={openVerifyOperation} setOpen={setOpenVerifyOperation} setBoolVal={setVerifyOperationBool}
      dialogText={verifyOperationText} dialogTitle={verifyOperationTitle} funcToPerform={verifyOperationFunction}/>

      <DeviceQrDialog formTitle={"Device QR Code - " + currentDevice.serial} serial={currentDevice.serial} open={openDeviceQr} setOpen={setOpenDeviceQr}/>

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertText}
        </Alert>
      </Snackbar>

    </GridContainer>
  );
}
