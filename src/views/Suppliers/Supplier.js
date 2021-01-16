import React, { useState, useEffect, Fragment } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import SupplierTable from './SupplierTable';
import fire from '../../fire';
import Button from "components/CustomButtons/Button.js";
import Icon from "@material-ui/core/Icon";

import VerifyOperation from "../VerifyOperation.js";
import NewSupplier from './NewSupplier';
import EditSupplier from './EditSupplier';

// Filter Options
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';


// Alerts:
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Converting an array to a special kind
const convertArrToSpecial = (arr) => {
  var tempArr = [];
  for (var i=0; i<arr.length; i+=1){
    tempArr.push({supplierName: arr[i]})
  }
  return tempArr;
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

export default function Supplier() {
  const classes = useStyles();
  const otherClasses = otherUseStyles();
  const [supplier, setSupplier] = useState('');
  const [site, setSite] = useState([]);
  const [suppliersArr, setSuppliersArr] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [open, setOpen] = useState(false);
  const [sitesData, setSitesData] = useState(['']);
  const [openEdit, setOpenEdit] = useState(false); // A variable to determine when we're editing a supplier.
  const [existingSupplier, setExistingSupplier] = useState({}); // A variable which will help us determine the supplier chosen by the user.

  // Suppliers Counter:
  const [supplierCount, setSupplierCount] = useState(0);

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
  // ~~ Add Supplier PopUp ~~
  const handleClickOpen = () => {
    // Generating a sites data array based on the data stored in the db.
    // Also, once we finish collecting this data, we will open our NewSupplier pop-up.
    //generateSitesDataFromDb();
    // We would also like to open the NewSupplier pop-up:
    setOpen(true);
  };

  /**
   * A function in charge of adding the received siteRec to the sitesData arr.
   * @param {Object} siteRec - An object containing a site data which we would like to add to the sitesData arr.
   */
  const handleSetSitesData = (siteRecsArr) => {
    setSitesData(siteRecsArr);
  }

  /**
   * A function in charge of retrieving data regarding the different sites from the db.
   */
  const generateSitesDataFromDb = () => {
    // Defining a connection to the db:
    const db = fire.firestore();
    // Retrieving all the sites from the db and their matching service types arrays:
    db.collection("sites").get().then(function(querySnapshot){
      // Defining an array in which we will temporarily store all the sites records we retrieve:
      var tempArr = [];
      // Looping through the retrieved sites:
      querySnapshot.forEach(function(doc){
          // Creating a record which will be used to fill our sitesData array:
          var data = doc.data()
          var siteRec = {
              site: doc.id,
              serviceTypesArr: data.serviceTypesArr,
          }
          // Adding each of the site records we create to the tempArr:
          tempArr.push(siteRec);
      })
      // Once we finished with retrieving all the sites, we can update our sitesData state:
      handleSetSitesData(tempArr);
    })
  }
  // ---------------------------------------------------------------------------------------------------------------------------

  /**
   * A function in charge of converting the receive rowData (from the suppliers table) to an "editable" record.
   * @param {Object} rowData - a table record representing an existing supplier.
   */
  const handleSetEditSupplier = (rowData) => {
    setExistingSupplier(rowData);
  }

  // A function that handles changing the storage devices values (since we can't do that from an asynchronous function):
  const handleSetSuppliersData = (arr) => {
    setSuppliersArr(arr);
    setSuppliersData(arr);
  }

  /**
   * A function in charge of filtering the sites data based on the user's site selection.
   */
  const handleFilterSitesData = () => {
    const db = fire.firestore();
    var query = db.collection("suppliers");
    var tempArr = [];

    var tempSitesArr = site.map(a => a.site);

    if (tempSitesArr.length){
      query = query.where("site", "in", tempSitesArr);
    }

    // Performing a query to the db to retrieve all the relevant suppliers:
    query.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        var data = doc.data();
        setSuppliersArr(suppliersData);
        // Creating a supplier record for the current supplier:
        var supplierRec = {
          supplierName: data.supplierName,
          address: data.address,
          serviceType: data.serviceType,
          contact: data.contact,
          site: data.site,
          sla: data.sla,
          tin: data.tin,
          notes: data.notes
        }
        // Adding the new record to the array of suppliers:
        tempArr.push(supplierRec);
      })
      // Setting the suppliers data according to the new array that we created:
      handleSetSuppliersData(tempArr)
    })
  }


  // A function which is in charge of retrieving data from the db:
  const getDbData = () => {
    // Initializing Firestore through firebase and saving it to a variable:
    const db = fire.firestore()
    // Initializing Auth through firebase and saving it to a variable:
    const auth = fire.auth()


    // Retrieving all the suppliers:
    var docRef = db.collection("suppliers")
    var tempArr = [];
    docRef.get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        var data = doc.data()
        // Creating a supplier record for the current supplier:
        var supplierRec = {
          supplierName: data.supplierName,
          address: data.address,
          serviceType: data.serviceType,
          contact: data.contact,
          site: data.site,
          sla: data.sla,
          tin: data.tin,
          notes: data.notes
        }
        // Adding the new record to the array of suppliers:
        tempArr.push(supplierRec);
      })
      // Setting the suppliers data according to the new array that we created:
      handleSetSuppliersData(tempArr);
    })
  }

  // A function which will run as soon as the page loads:
  useEffect(() => {
    getDbData();
    generateSitesDataFromDb();
  }, []);


  /**
   * Attaching a listener to the deviceCount and updating it's value in the db accordingly when it's value changes.
   */
  useEffect(() => {
    if (supplierCount !== 0){
      // Updating our db counter:
      const db = fire.firestore();
      var docRef = db.collection("counters").doc("suppliers");
      docRef.update({
        count: supplierCount
      });
    }
  }, [supplierCount])

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Suppliers Table</h4>
            <p className={classes.cardCategoryWhite}>
              A table containing all the suppliers.
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
            
            {/* <FormControl variant="outlined" className={otherClasses.leftUpperSelectFormControl}>
              <InputLabel id="select-storage-type-outlined-label">Site</InputLabel>
              <Select
                  labelId="select-storage-type-outlined-label"
                  id="select-storage-type-outlined"
                  value={site}
                  onChange={event => setSite(event.target.value)}
                  label="Storage Type"
              >
                  <MenuItem value="">
                  <em>None</em>
                  </MenuItem>
                  {sitesData && sitesData.map((option, index) => (
                    <MenuItem key={"sitesData", index+1} value={index+1}>{option.site}</MenuItem>
                  ))}
              </Select>
            </FormControl> */}


            <FormControl variant="outlined" className={otherClasses.leftUpperSelectFormControl}>
              <Autocomplete
                multiple
                limitTags={1}
                id="checkboxes-sites"
                options={sitesData}
                onChange={(event, newVal) => {
                  setSite(newVal)
                }}
                disableCloseOnSelect
                freeSolo
                getOptionLabel={(option) => option.site}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.site}
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Site" placeholder="" />
                )}
              />
            </FormControl>

            <Button className={otherClasses.filterButton} onClick={handleFilterSitesData}>Filter</Button>

            <SupplierTable 
            title="Managed Suppliers" 
            headerBackground="#3374FF" 
            data={suppliersData}
            setData={handleSetSuppliersData}
            handleOpenAlert={handleOpenAlert}
            handleOpenVerifyOperation={handleOpenVerifyOperation}
            verifyOperationBool={verifyOperationBool}
            setVerifyOperationBool={setVerifyOperationBool}
            setOpenEditSupplier={setOpenEdit}
            handleSetEditSupplier={handleSetEditSupplier}
            setSupplierCount={setSupplierCount}
            />
          </CardBody>
        </Card>
      </GridItem>

    <NewSupplier open={open} setOpen={setOpen} handleOpenAlert={handleOpenAlert} sitesData={sitesData} 
    handleSetSuppliersTable={handleSetSuppliersData} suppliersTableData={suppliersData} setSupplierCount={setSupplierCount} />

    {
      openEdit && (
        <EditSupplier open={openEdit} setOpen={setOpenEdit} handleOpenAlert={handleOpenAlert} sitesData={sitesData} 
        handleSetSuppliersTable={handleSetSuppliersData} suppliersTableData={suppliersData} existingSupplier={existingSupplier}/>
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
