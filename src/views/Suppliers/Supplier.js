import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Grid from '@material-ui/core/Grid';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import TextField from '@material-ui/core/TextField';
import fire from '../../fire.js';
import VerifyOperation from "../VerifyOperation.js";

import SupplierTable from './SupplierTable.js';
import NewSupplier from './NewSupplier.js';
import EditSupplier from './EditSupplier.js';

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
    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',
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

export default function Supplier() {
  const classes = useStyles();

  // Open Pop-ups variables:
  const [openAdd, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [openVerifyOperation, setOpenVerifyOperation] = useState(false);

  // Component Variables:
  const [currentSupplier, setCurrentSupplier] = useState('');
  const [sitesArr, setSitesArr] = useState([]);
  const [suppliersArr, setSuppliersArr] = useState([]);

  // Verify Operation Variables:
  const [verifyOperationBool, setVerifyOperationBool] = useState(false);
  const [verifyOperationTitle, setVerifyOperationTitle] = useState('Default Title');
  const [verifyOperationText, setVerifyOperationText] = useState('Default Text');
  const [verifyOperationFunction, setVerifyOperationFunction] = useState('Default Function');
  
  // Alert Variables:
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

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

  useEffect(() => {
    var tempArr = suppliersArr;
    setSuppliersArr(tempArr);
  }, [suppliersArr])

  /**
   * A function in charge of initializing the sitesArr with the received vlaues.
   * @param {[*]} arr - An array of site objects.
   */
  const handleSetSitesArr = (arr) => {
    setSitesArr([]);
    setSitesArr(arr);
  }

  /**
   * A function in charge of initializing the suppliersArr with the received vlaues.
   * @param {[*]} arr - An array of supplier objects.
   */
  const handleSetSuppliersArr = (arr) => {
    setSuppliersArr([]);
    setSuppliersArr(arr);
  }

  /**
   * A function in charge of adding a supplier record to the suppliersArr.
   * @param {*} supplierRec - An object representing a supplier which we would like to add to the suppliersArr.
   */
  const handleAddSupplier = (supplierRec) => {
    var tempArr = suppliersArr;
    handleSetSuppliersArr([]);
    tempArr.push(supplierRec);
    setCurrentSupplier(supplierRec);
    console.log(supplierRec)
    handleSetSuppliersArr(tempArr);
  }

  /**
   * A function in charge of updating a supplier record in our suppliers table.
   * @param {*} supplierRec - A record representing a supplier which we would like to add.
   */
  const handleUpdateSupplier = (supplierRec) => {
    var tempArr = suppliersArr.filter(s => s.supplierId !== supplierRec.supplierId);
    console.log("UPDATED ARR: ", tempArr);
    tempArr.push(supplierRec);
    setCurrentSupplier(supplierRec);
    console.log(supplierRec)
    handleSetSuppliersArr(tempArr);
  }

  // A function which will run as soon as the page loads:
  useEffect(() => {
    const db = fire.firestore()
    loadSites(db);
    loadSuppliers(db);
  }, []);

  const loadSites = (db) => {
    // Defining a query to the db to retrieve the sites:
    var query = db.collection('sites');
    // Retrieving the sites from the db:
    query.get().then((querySnapshot) => {
      // Defining an empty array which will hold the retrieved sites:
      var tempArr = [];
      // Adding each site to tempArr:
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          var data = doc.data();
          var curSite = {
            siteId: doc.id,
            siteName: data.siteName
          };
          tempArr.push(curSite);
      });
      // Setting the sites array to the generated array:
      handleSetSitesArr(tempArr);
    });
  }

  const loadSuppliers = (db) => {
    // Defining a query to the db to retrieve the suppliers:
    var query = db.collection('suppliers');
    // Retrieving the suppliers from the db:
    query.get().then((querySnapshot) => {
      // Defining an empty array which will hold the retrieved suppliers:
      var tempArr = [];
      // Adding each supplier to tempArr:
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          var data = doc.data();
          var curSupplier = {
            supplierId: doc.id,
            supplierName: data.supplierName,
            supplierAddress: data.supplierAddress,
            supplierSite: data.supplierSite,
            supplierSla: data.supplierSla,
            supplierTin: data.supplierTin,
            supplierServiceType: data.supplierServiceType,
            supplierContacts: data.supplierContacts
          };
          tempArr.push(curSupplier);
      });
      // Setting the suppliers array to the generated array:
      handleSetSuppliersArr(tempArr);
    });
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Your Suppliers</h4>
            <p className={classes.cardCategoryWhite}>
            All your managed suppliers in once space.
            </p>
          </CardHeader>
          <CardBody>

          <SupplierTable 
            headerBackground="#3374FF"
            data={suppliersArr}
            setData={setSuppliersArr}
            currentSupplier={currentSupplier}
            setCurrentSupplier={setCurrentSupplier}
            handleOpenVerifyOperation={handleOpenVerifyOperation}
            verifyOperationBool={verifyOperationBool}
            setVerifyOperationBool={setVerifyOperationBool}
            handleOpenAlert={handleOpenAlert}
            setOpenEdit={setOpenEdit}
            setOpenNew={setOpenNew}
            sitesArr={sitesArr}
          />
          </CardBody>
        </Card>
      </GridItem>

      {/* Displaying an addition form to a supplier */}
      <NewSupplier formTitle="New Supplier" open={openAdd} setOpen={setOpenNew} sitesArr={sitesArr} handleOpenAlert={handleOpenAlert} handleAddSupplierTable={handleAddSupplier}/>
      
      {/* Displaying an edit form to a supplier */}
      <EditSupplier formTitle="Edit Supplier" open={openEdit} setOpen={setOpenEdit} sitesArr={sitesArr} handleOpenAlert={handleOpenAlert} currentSupplier={currentSupplier} handleUpdateSupplier={handleUpdateSupplier}/>

      {/* Prompting the user to confirm an operation */}
      <VerifyOperation open={openVerifyOperation} setOpen={setOpenVerifyOperation} setBoolVal={setVerifyOperationBool}
      dialogText={verifyOperationText} dialogTitle={verifyOperationTitle} funcToPerform={verifyOperationFunction}/>

      {/* Displaying alerts to the users */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertText}
          </Alert>
      </Snackbar>

    </GridContainer>
  );
}
