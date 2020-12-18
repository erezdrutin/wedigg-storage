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
import SubStorageTable from './SubStorageTable.js';
import AdminTable from './AdminTable.js';
import fire from '../../fire.js';
import { storage } from "firebase";
import NewDevice from './NewDevice';
import EditDevice from './EditDevice';
import Icon from "@material-ui/core/Icon";

import styles from "./StorageStyle";

// Alerts:
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const useStyles = makeStyles(styles);

const addDeviceBtnStyle = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};

export default function Warehouse() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [warehouseName, setWarehouseName] = useState('')
  const [warehouseAddress, setWarehouseAddress] = useState('')
  const [warehouseMaxCapacity, setWarehouseMaxCapacity] = useState('')
  const [officeStorageDevices, setOfficeStorageDevices] = useState([])
  const [homeStorageDevices, setHomeStorageDevices] = useState([])
  const [userAdmin, setUserAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [usersWarehouses, setUsersWarehouses] = useState([]);

  const [chosenDevice, setChosenDevice] = useState('');
  const [editDevice, setEditDevice] = useState('');



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


  // Storing each of the warehouses from the db:
  const getAllWarehousesFromDb = () => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    const auth = fire.auth()
    userIds.forEach(curUserId => {
      var docRef = db.collection("users").doc(curUserId).collection("storage")
    })

  }

  // Storing all the users ids from the db:
  const getAllUsersFromDb = () => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    const auth = fire.auth()

    var tempArr = userIds

    db.collection("users").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        console.log(doc.data());
        // Storing all the documents IDs from the db in an array:
        tempArr.push(doc.id)
      })
    })
    // Storing all the userIds retrieved in userIds:
    setUserIds(tempArr);
    console.log(tempArr);
  }


  // A function which is in charge of retrieving data from the db regarding the current user's devices:
  const getDevicesFromDb = () => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    const auth = fire.auth()

    // Creating a reference to the storage-details part:
    db.collection("users").doc(auth.currentUser.uid).collection("storage").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var data = doc.data();
        if (doc.id === "storage-details"){
          setWarehouseName(data.name);
          setWarehouseAddress(data.address);
          setWarehouseMaxCapacity(data.maxCapacity);
        } else {
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


          if (warehouseRec.storageType === "Home Storage"){
            var tempArr = homeStorageDevices;
            tempArr.push(warehouseRec);
            setHomeStorageDevices(tempArr);
          } else {
            var tempArr = officeStorageDevices;
            tempArr.push(warehouseRec);
            setOfficeStorageDevices(tempArr);
          }

          // doc.data() is never undefined for query doc snapshots:
          // console.log(doc.id, " => ", warehouseRec);
        }
      })
    })
    .catch(function(error) {
      console.log("Error getting documents: ", error);
    })
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
          if (data.position.toLowerCase() === "manager") {
            setUserAdmin(true);
          }
      } else{
        handleOpenAlert("error", "Something went wrong, please try again later.");
      }
    })
  }

  useEffect(() => {
    getDevicesFromDb();
    getUserDetailsFromDb();
    getAllUsersFromDb();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Your Storage</h4>
            <p className={classes.cardCategoryWhite}>
              Both your office & home storage organized in one place.
            </p>
            <div className={classes.addDeviceDiv}>
              <Button
              style={addDeviceBtnStyle}
              className={classes.addDevice}
              endIcon={<Icon>add</Icon>}
              onClick={handleClickOpen}
              >
              Add
              </Button>
            </div>
          </CardHeader>
          { userAdmin ?
            (
              <CardBody>
                <AdminTable
                title="Office Storage"
                headerBackground="#ffa21a" 
                data={officeStorageDevices}
                fullData={officeStorageDevices}
                setChosenDevice={setChosenDevice}
                setEditDevice={setEditDevice}
                />
                <Card></Card>
                <AdminTable
                title="Home Storage"
                headerBackground="#5cb860"
                data={homeStorageDevices}
                fullData={homeStorageDevices}
                setChosenDevice={setChosenDevice}
                setEditDevice={setEditDevice}
                />
              </CardBody>
            )
            :
            (
              <CardBody>
              <SubStorageTable
              title="Office Storage"
              headerBackground="#ffa21a" 
              data={officeStorageDevices}
              fullData={officeStorageDevices}
              />
              <Card></Card>
              <SubStorageTable
              title="Home Storage"
              headerBackground="#5cb860"
              data={homeStorageDevices}
              fullData={homeStorageDevices}
              />
            </CardBody>
            )
            }
          
          
        </Card>
      </GridItem>
      
      { /* Allows us to open & close a pop up: */}
      <NewDevice open={open} setOpen={setOpen} officeStorageDevices={officeStorageDevices}
      setOfficeStorageDevices={setOfficeStorageDevices} homeStorageDevices={homeStorageDevices}
      setHomeStorageDevices={setHomeStorageDevices} handleOpenAlert={handleOpenAlert}
      userEmail={userEmail} userFullName={userFullName} />

      { editDevice && (
        <EditDevice open={editDevice} setOpen={setEditDevice} officeStorageDevices={officeStorageDevices}
        setOfficeStorageDevices={setOfficeStorageDevices} homeStorageDevices={homeStorageDevices}
        setHomeStorageDevices={setHomeStorageDevices} handleOpenAlert={handleOpenAlert}
        userEmail={userEmail} userFullName={userFullName} existingDevice={chosenDevice}/>
      ) }

      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertText}
        </Alert>
      </Snackbar>
    </GridContainer>
  );
}
