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
import fire from '../../fire';
import Button from "components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

import VerifyOperation from "../VerifyOperation.js";

import NewSite from './NewSite.js';
import EditSite from './EditSite.js';
import SiteTable from './SiteTable.js';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';


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
  addSupplierButton: {
    maxWidth: '10%',
    float: 'right',
    marginTop: '-47px'
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
    background: 'linear-gradient(45deg, #2ECC71 30%, #20E573 90%)',
    boxShadow: '0 3px 5px 2px rgba(32, 229, 115, .30)',
    margin: "0 15px",
    padding: "0",
    position: "relative",
    padding: "0.75rem 1.25rem",
    marginBottom: "0",
    borderBottom: "none",
    borderRadius: "3px",
    marginTop: "-20px",
    padding: "15px",
    height: "5.75rem"
  },
};

const useStyles = makeStyles(styles);

export default function Site() {
  const classes = useStyles();
  const [site, setSite] = useState('');
  const [sitesArr, setSitesArr] = useState([]);
  const [sitesData, setSitesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [existingSite, setExistingSite] = useState({}); // A variable which will help us determine the site chosen by the user.
  const [isEditing, setIsEditing] = useState(false);

  // Sites Counter & Storages Counter:
  const [siteCount, setSiteCount] = useState(0);
  const [storageCount, setStorageCount] = useState(0);

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
    fontSize: '14px',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };
  
  // ---------------------------------------------------------------------------------------------------------------------------
  // ~~ Add Site PopUp ~~
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    // 1. Check if valid { len > 2 }.
    if (site.length <= 2) {
      handleOpenAlert('error', 'The site name is too short!');
      return;
    }
  };
  // ---------------------------------------------------------------------------------------------------------------------------

  /**
   * A function in charge of converting the receive rowData (from the sites table) to an "editable" record.
   * @param {Object} rowData - a table record representing an existing site.
   */
  const handleSetExistingSite = (rowData) => {
    var curSite = {
      name: rowData.name,
      note: rowData.note,
      storageTypesArr: rowData.storageTypesArr  === 'None' ? [] : rowData.storageTypesArr,
      suppliersArr: rowData.suppliersArr === 'None' ? [] : rowData.suppliersArr,
      serviceTypesArr: rowData.serviceTypesArr === 'None' ? [] : rowData.serviceTypesArr,
      categoriesArr: rowData.categoriesArr === 'None' ? [] : rowData.categoriesArr
    }
    console.log(curSite)
    setExistingSite(curSite);
  }

  // A function that handles changing the storage devices values (since we can't do that from an asynchronous function):
  const handleSetSitesData = (arr) => {
    setSitesArr(arr.map((obj) => obj.name)); // Setting the sites names in the sitesArr array.
    console.log("DEFAULT TABLE ARR", arr);
    setSitesData(arr); // Setting the sites data in the sitesData array.
  }

  /**
   * A function in charge of retrieving data from the db, which we will then use in order to fill the Sites Table.
   */
  const getDataFromDb = () => {
      const db = fire.firestore()
      var sitesArr = []
      var suppliersDict = {}
      var finalArr = []

      db.collection("suppliers").get().then(function(querySnapshot){
        // Creating a dictionary where each site's is a key and it's value is an array of suppliers matching to the site:
        querySnapshot.forEach(function(doc){
          var data = doc.data();
          var curSite = data.site

          if (suppliersDict[curSite]){
            suppliersDict[curSite].push(data.supplierName)
          } else {
            suppliersDict[curSite] = [data.supplierName]
          }

        })

        // Basically retrieving all the sites from the db:
        db.collection("sites").get().then(function(querySnapshot){
          // Looping through the retrieved sites (sites / {siteName} / storageTypesArr):
          querySnapshot.forEach(function(doc){
              // Creating a record which will be used to initiate the table with data:
              var data = doc.data()
              var siteTblRec = {
                  name: doc.id,
                  storageTypesArr: data.storageTypesArr ? data.storageTypesArr : 'None',
                  storageTypesArrCount: data.storageTypesArr.length,
                  serviceTypesArr: data.serviceTypesArr,
                  categoriesArr: data.categoriesArr,
                  note: data.note
              }
              // Adding the new record to the array of sites data:
              sitesArr.push(siteTblRec);
          })
          
          // Basically we're creating some kind of an array of objects, where each object is structured with the following data:
          // { name: 'Site', storageTypesArr: [],  storageTypesArrCount: X, suppliersArr: [], suppliersArrCount: Y }
          // Then updating the sitesData variable accordingly in order to display the data to the screen properly:
          sitesArr.forEach(curSiteElement => {
            var curSuppliers = suppliersDict[curSiteElement.name]

            var finalRec = {
              name: curSiteElement.name,
              storageTypesArr: curSiteElement.storageTypesArr,
              storageTypesArrCount: curSiteElement.storageTypesArrCount,
              suppliersArr: curSuppliers ? curSuppliers : 'None',
              suppliersArrCount: curSuppliers ? curSuppliers.length : 0,
              serviceTypesArr: curSiteElement.serviceTypesArr,
              categoriesArr: curSiteElement.categoriesArr,
              note: curSiteElement.note,
            }

            // And pushing that record to the array:
            finalArr.push(finalRec)
          })

          // Setting the suppliers data according to the new array that we created:
          handleSetSitesData(finalArr);
        })
      })
  }

  /**
   * A function in charge of calculating the sum of storages.
   */
  const getStoragesCount = () => {
    var storagesTotal = sitesData.reduce(function(prev, cur){
        return prev + cur.storageTypesArrCount;
    }, 0);
    return storagesTotal;
  }

  // A function which will run as soon as the page loads:
  useEffect(() => {
    getDataFromDb();
  }, []);

  /**
   * Attaching a listener to the siteCount and updating it's value in the db accordingly when it's value changes.
   */
  useEffect(() => {
    if (siteCount !== 0){
      // Updating our db counter:
      const db = fire.firestore();
      var docRef = db.collection("counters").doc("sites");
      docRef.update({
        count: siteCount
      });
    }
  }, [siteCount])

  /**
   * Attaching a listener to the storageCount and updating it's value in the db accordingly when it's value changes.
   */
  useEffect(() => {
    if (storageCount !== 0){
      // Updating our db counter:
      const db = fire.firestore();
      var docRef = db.collection("counters").doc("storages");
      docRef.update({
        count: storageCount
      });
    }
  }, [storageCount])

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Sites Table</h4>
            <p className={classes.cardCategoryWhite}>
              A table containing all the managed sites.
            </p>
            
            <Button
            variant="contained"
            color="warning"
            style={colorButtonStyle}
            className={classes.addSupplierButton}
            endIcon={<Icon>add</Icon>}
            onClick={handleClickOpen}
            >
            Add
            </Button>
          </CardHeader>
          <CardBody>
            <SiteTable 
            title="Managed Sites" 
            headerBackground="#26C281" 
            data={sitesData}
            setData={handleSetSitesData}
            handleOpenAlert={handleOpenAlert}
            handleSetEditSite={handleSetExistingSite}
            setOpenEditSite={setOpenEdit}
            handleOpenVerifyOperation={handleOpenVerifyOperation}
            verifyOperationBool={verifyOperationBool}
            setVerifyOperationBool={setVerifyOperationBool}
            setSiteCount={setSiteCount}
            setStorageCount={setStorageCount}
            getStoragesCount={getStoragesCount}
            />
          </CardBody>
        </Card>
      </GridItem>

    <NewSite open={open} setOpen={setOpen} handleOpenAlert={handleOpenAlert} sitesNamesArr={sitesArr} setSitesTableData={handleSetSitesData} sitesTableData={sitesData}
    setSiteCount={setSiteCount} setStorageCount={setStorageCount} getStoragesCount={getStoragesCount}/>
    
    {
      openEdit && (
        <EditSite open={openEdit} setOpen={setOpenEdit} handleOpenAlert={handleOpenAlert} sitesNamesArr={sitesArr}
        setSitesTableData={handleSetSitesData} sitesTableData={sitesData} existingSite={existingSite}/>
      )
    }

    <VerifyOperation open={openVerifyOperation} setOpen={setOpenVerifyOperation} setBoolVal={setVerifyOperationBool}
    dialogText={verifyOperationText} dialogTitle={verifyOperationTitle} funcToPerform={verifyOperationFunction}/>

    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {alertText}
        </Alert>
    </Snackbar>
    </GridContainer>
  );
}
