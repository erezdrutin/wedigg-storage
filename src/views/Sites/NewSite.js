import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import fire from '../../fire';

import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SimpleSelectDialog from '../Storage/SimpleSelectDialog.js';

import NewSupplier from '../Suppliers/NewSupplier.js';

import LocalShippingIcon from '@material-ui/icons/LocalShipping'; // Name Icon
import LocationOnIcon from '@material-ui/icons/LocationOn'; // Address Icon
import BuildIcon from '@material-ui/icons/Build'; // Service Type Icon
import ExploreIcon from '@material-ui/icons/Explore'; // Site Icon
import { AddCircleOutline } from '@material-ui/icons'; // Plus Button
import AssignmentIcon from '@material-ui/icons/Assignment'; // SLA Icon
import EmojiSymbolsIcon from '@material-ui/icons/EmojiSymbols'; // TIN Icon
import MessageIcon from '@material-ui/icons/Message'; // Notes Icon

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: '75%',
    },
    textField: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    margin: {
        margin: theme.spacing(1),
    },
    nameTextField: {
        margin: theme.spacing(1),
        width: '66%',
    },
    dialogPaper: {
        minHeight: '33rem',
        maxHeight: '33rem',
    },
    formControl: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(-2),
        width: '80%',
    },
    formControlSecondInSelectRow: {
        margin: theme.spacing(1),
        width: '115%',
    },
    formControlSelect:{
        margin: theme.spacing(1),
        marginTop: theme.spacing(-2),
        width: '60%',
    },
    formControlSecondSelect:{
        margin: theme.spacing(1),
        width: '100%'
    },
    plusButton: {
        marginTop: theme.spacing(-1),
        marginLeft: theme.spacing(-10),
    },
    secondPlusButton: {
        marginLeft: theme.spacing(3.5), 
    },
    selectGridItem: {
        marginRight: theme.spacing(-5),
    }
  }),
);

export default function NewSite(props) {
  const classes = useStyles();
  const { open, setOpen, handleOpenAlert, sitesNamesArr, setSitesTableData, sitesTableData, setSiteCount, setStorageCount, getStoragesCount } = props;
  const [sitesData, setSitesData] = useState([]); // Passing this variable to NewSupplier.

  // Variables Definition:
  const [name, setName] = useState(''); // TextField
  const [storageTypesArr, setStorageTypesArr] = useState(['Office', 'Home', 'Repair Lab']); // A Select filled with some default values with (+) button to add more storages.
  const [serviceTypesArr, setServiceTypesArr] = useState(['Technician', 'Consultant', 'Delivery', 'Repair Lab']); // Empty Select with (+) button.
  const [suppliersArr, setSuppliersArr] = useState([]); // Empty Select with (+) button.
  const [categoriesArr, setCategoriesArr] = useState(['Workstation', 'Laptop', 'Accessories', 'Mobile', 'Tablet']); // Empty Select with (+) button.
  const [note, setNote] = useState('');

  // Popups variables:
  const [openStorageTypesDialog, setOpenStorageTypesDialog] = useState(false);
  const [openServiceTypesDialog, setOpenServiceTypesDialog] = useState(false);
  const [openCategoriesDialog, setOpenCategoriesDialog] = useState(false);
  const [openSuppliersDialog, setOpenSuppliersDialog] = useState(false);
  const [item, setItem] = useState('');


  const handleClose = () => {
      setOpen(false);
  }

  const handleOk = () => {
      // All we have to do is to add the site to the db using the relevant details:
      // First - we should verify that the site doesn't exist in the sitesArr yet:
      if (verifySiteValidity()){
        // Once verified, we can call a function which will add the site and the relevant details to the db.
        // Also updating the sites table accordingly:
        handleAddToDb();
        cleanInput();
        setOpen(false);
      } else {
        handleOpenAlert("error", "The site already exists or some of the details are missing.");
      }
  }

  /**
   * A function in charge of cleaning the user's input after adding a site.
   */
  const cleanInput = () => {
      setName('');
      setStorageTypesArr(['Home Storage', 'Lab', 'Other']);
      setServiceTypesArr([]);
      setSuppliersArr([]);
      setCategoriesArr([]);
      setNote('');
  }

  /**
   * Checking whether the site name appears in the array of sites or not.
   * If it does, we will return true (!arr.length --> True if length = 0).
   * Otherwise, we will return false, meaning that the array contains the current site's name.
   */
  const verifySiteValidity = () => {
      return name.length >= 2 && storageTypesArr.length && serviceTypesArr.length && categoriesArr.length && !sitesNamesArr.filter(siteName => siteName.toLowerCase() === name.toLowerCase()).length
  }


  const handleAddSiteToTable = (siteRec) => {
    var curSuppliersNames = siteRec.suppliersArr.map((obj) => obj.supplierName);
    
    var finalRec = {
      name: siteRec.name,
      storageTypesArr: siteRec.storageTypesArr,
      storageTypesArrCount: siteRec.storageTypesArr.length,
      suppliersArr: curSuppliersNames,
      suppliersArrCount: siteRec.suppliersArr.length,
      serviceTypesArr: siteRec.serviceTypesArr,
      categoriesArr: siteRec.categoriesArr,
      note: siteRec.note
    }

    // Adding the new site to the tables::
    var tempArr = sitesTableData;
    tempArr.push(finalRec);
    setSitesTableData(tempArr);
  }

  /**
   * A function in charge of updating our sites counter.
   * @param {int} count - A count representing the amount of sites in our DB.
   */
  const handleSetSiteCount = (count) => {
    setSiteCount(count);
  }

  /**
   * A function in charge of updating our storages counter.
   * @param {int} count - A count representing the amount of storages in our DB.
   */
  const handleSetStorageCount = (count) => {
    setStorageCount(count);
  }

  /**
   * A function in charge of updating our suppliers counter.
   * First, checking how many suppliers we should add (if it's 0 then this function will just return).
   * Then, if we should add any suppliers to the suppliers counter - retrieving the suppliers counter from the db.
   * Once we have the suppliers counter, adding the X suppliers to the counter and over-writing the existing counter in the db.
   */
  const handleUpdateSuppliersCount = () => {
    if (suppliersArr.length > 0){
        const db = fire.firestore();
        console.log("ayyo waddup?");
        var docRef = db.collection("counters").doc("suppliers");
        docRef.get().then(function(doc){
            if (doc.exists){
                // Storing the count of suppliers from the db and adding the current amount of suppliers to it:
                var newSupCount = doc.data().count + suppliersArr.length;
                docRef.update({
                    count: newSupCount
                });
            }
        })
    }
  }

  /**
   * A function in charge of adding the new site and the relevant details to the db.
   * We should:
   * 1. Add the site to the db, including it's matching sub-arrays and other details {serviceTypesArr, storageTypesArr} & notes.
   * 2. Add each of the suppliers specified in the suppliersArr to the db (suppliers/{supplierId}).
   */
  const handleAddToDb = () => {
      // Creating a reference to our db instance:
      const db = fire.firestore()
      // Setting the paths in which we will write the new doc(s):
      const docRef = db.collection("sites").doc(name);
      const supDocRef = db.collection("suppliers");
      var newSiteCount = sitesTableData.length + 1;
      var newStorageCount = getStoragesCount() + storageTypesArr.length;

    
      var siteRec = {
        serviceTypesArr: serviceTypesArr,
        storageTypesArr: storageTypesArr,
        categoriesArr: categoriesArr,
        note: note
      }

      var sitesTblRec = {
        name: name,
        serviceTypesArr: serviceTypesArr,
        storageTypesArr: storageTypesArr,
        categoriesArr: categoriesArr,
        note: note,
        suppliersArr: suppliersArr
      }

      // Writing a new site in the db:
      docRef.set(siteRec)
      .then(function() {
        suppliersArr.forEach(function(supplier){
            // Once we finished writing the site document - we would like to continue and write the supplier(s) document(s):
            var curDocRef = supDocRef;
            curDocRef.add(supplier)
            .then(function(docRef) {
                console.log("Supplier written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        })

        // Adding the site to the sites counter's document:
        handleSetSiteCount(newSiteCount);
        // Adding the storages to the storages counter's document:
        handleSetStorageCount(newStorageCount);
        // Adding the supplier(s) to the suppliers counter's document:
        handleUpdateSuppliersCount();
        // Adding the site to the sites table:
        handleAddSiteToTable(sitesTblRec);
        // Setting an alert to let the user know that the site was successfully added:
        handleOpenAlert("success", "The site was successfully added!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }

  const handleOpenStorageTypesDialog = () => {
    setOpenStorageTypesDialog(true);
  }

  const handleOpenServiceTypesDialog = () => {
    setOpenServiceTypesDialog(true);
  }

  const handleOpenCategoriesDialog = () => {
    setOpenCategoriesDialog(true);
  }

  const handleOpenSuppliersDialog = () => {
    generateSitesData();
    setOpenSuppliersDialog(true);
  }

  const handleOkStorageTypesDialog = () => {
      // Adding the new item:
      var tempArr = storageTypesArr;
      tempArr.push(item);
      setStorageTypesArr(Array.from(new Set(tempArr)));

      // Then adding the item to the array and cleaning the item's value:
      setItem('');
      setOpenStorageTypesDialog(false);
  }

  /**
   * A function in charge of handling click on "OK" on the service types dialog.
   */
  const handleOkServiceTypesDialog = () => {
      // Adding the new item:
      var tempArr = serviceTypesArr;
      tempArr.push(item);
      setServiceTypesArr(Array.from(new Set(tempArr)));

      // Then adding the item to the array and cleaning the item's value:
      setItem('');
      setOpenServiceTypesDialog(false);
  }

  /**
   * A function in charge of handling click on "OK" on the categories dialog.
   */
  const handleOkCategoriesDialog = () => {
    // Adding the new item:
    var tempArr = categoriesArr;
    tempArr.push(item);
    setCategoriesArr(Array.from(new Set(tempArr)));

    // Then adding the item to the array and cleaning the item's value:
    setItem('');
    setOpenCategoriesDialog(false);
  }

  const handleOkSuppliersDialog = () => {
    // Adding the new item:
    var tempArr = suppliersArr;
    tempArr.push(item);
    setSuppliersArr(Array.from(new Set(tempArr)));

    // Then adding the item to the array and cleaning the item's value:
    setItem('');
    setOpenSuppliersDialog(false);
  }


  const handleAddSiteSuppliersArr = (supplierRec) => {
    // Basically just adding the received supplier record to the current suppliers array:
    var tempArr = suppliersArr;
    tempArr.push(supplierRec);
    setSuppliersArr(tempArr);
    console.log("TEMPARR", tempArr);
  }

  /**
   * A function in charge of generating a "SitesData" array with one record - a record matching to our current site & serviceTypesArr.
   */
  const generateSitesData = () => {
      var sitesDataRec = {
          site: name,
          serviceTypesArr: serviceTypesArr,
      };
      console.log("EREZ TESTING HERE", [sitesDataRec]);
      setSitesData([sitesDataRec]);
  }

  return (
    <Dialog
    disableBackdropClick
    disableEscapeKeyDown
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    classes={{ paper: classes.dialogPaper }}
    >
        <DialogTitle>Would you like to add a new site?</DialogTitle>
        <DialogContent>
        
        {/* ---- First Row ---- */}
        <Grid container item spacing={3} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {/* Supplier Name */}
            <Grid item xs={12} style={{marginLeft: '-2rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                { name !== '' && name.length < 2 ?
                <TextField
                    error
                    helperText="Name should be at least 2 characters."
                    className={classes.nameTextField}
                    label="Name"
                    value={name}
                    onChange={(event) => {setName(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AssignmentIcon />
                            </InputAdornment>
                        ),
                    }}
                /> : 
                <TextField
                    className={classes.nameTextField}
                    label="Name"
                    value={name}
                    onChange={(event) => {setName(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <ExploreIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            }
            </Grid>
        </Grid>
            
        {/* ---- Second Row ---- */}
        <Grid container item spacing={3} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {/* Supplier Name */}
            <Grid item xs={12} style={{marginLeft: '-2rem', marginTop: '-0.5rem', marginBottom: '-0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <TextField
                    className={classes.nameTextField}
                    label="Note"
                    value={note}
                    onChange={(event) => {setNote(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AssignmentIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>

            <Grid item xs={10}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-storageTypesArr-label">Storages</InputLabel>
                    <Select
                        labelId="select-storageTypesArr-label"
                        id="select-storageTypesArr"
                        value=""
                        input={<Input />}
                    >
                    {storageTypesArr.length > 0 ? (
                        ''
                    ) : (
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    )}
                    {storageTypesArr.map((option, index) => (
                        <MenuItem key={"storageTypesArr", index+1} value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className={classes.plusButton}>
                <IconButton aria-label="add-storage-type" onClick={handleOpenStorageTypesDialog}>
                    <AddCircleOutline />
                </IconButton>
            </Grid>

            
            <Grid item xs={10}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-serviceTypesArr-label">Suppliers Services Types</InputLabel>
                    <Select
                        labelId="select-serviceTypesArr-label"
                        id="select-serviceTypesArr"
                        value=""
                        input={<Input />}
                    >
                    {serviceTypesArr.length > 0 ? (
                        ''
                    ) : (
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    )}
                    {serviceTypesArr.map((option, index) => (
                        <MenuItem key={"serviceTypesArr", index+1} value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className={classes.plusButton}>
                <IconButton aria-label="add-storage-type" onClick={handleOpenServiceTypesDialog}>
                    <AddCircleOutline />
                </IconButton>
            </Grid>

            <Grid item xs={10}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-categoriesArr-label">Products Categories</InputLabel>
                    <Select
                        labelId="select-categoriesArr-label"
                        id="select-categoriesArr"
                        value=""
                        input={<Input />}
                    >
                    {categoriesArr.length > 0 ? (
                        ''
                    ) : (
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    )}
                    {categoriesArr.map((option, index) => (
                        <MenuItem key={"categoriesArr", index+1} value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className={classes.plusButton}>
                <IconButton aria-label="add-category-type" onClick={handleOpenCategoriesDialog}>
                    <AddCircleOutline />
                </IconButton>
            </Grid>
            
            <Grid item xs={10}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-suppliersArr-label">Suppliers</InputLabel>
                    <Select
                        labelId="select-suppliersArr-label"
                        id="select-suppliersArr"
                        value=""
                        input={<Input />}
                    >
                    {suppliersArr.length > 0 ? (
                        ''
                    ) : (
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    )}

                    {suppliersArr.map((option, index) => (
                        <MenuItem key={"suppliersArr", index+1} value={index+1}>{option.supplierName}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className={classes.plusButton}>
                <IconButton aria-label="add-storage-type" onClick={handleOpenSuppliersDialog} disabled={!serviceTypesArr.length}>
                    <AddCircleOutline />
                </IconButton>
            </Grid>
        </Grid>

        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="primary">
            Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
            Ok
        </Button>
        </DialogActions>

        { /* Storage Types Pop Up */}
        <SimpleSelectDialog dialogTitle="Add Storage" openSelectDialog={openStorageTypesDialog}
        handleCloseDialog={() => {setOpenStorageTypesDialog(false)}} handleOkDialog={handleOkStorageTypesDialog}
        selectValue={item} setSelectValue={setItem} selectLabel="Storage Name" />

        { /* Service Types Pop Up */}
        <SimpleSelectDialog dialogTitle="Add Service Type" openSelectDialog={openServiceTypesDialog}
        handleCloseDialog={() => {setOpenServiceTypesDialog(false)}} handleOkDialog={handleOkServiceTypesDialog}
        selectValue={item} setSelectValue={setItem} selectLabel="Supplier Service Type" />

        { /* Categories Pop Up */}
        <SimpleSelectDialog dialogTitle="Add Category" openSelectDialog={openCategoriesDialog}
        handleCloseDialog={() => {setOpenCategoriesDialog(false)}} handleOkDialog={handleOkCategoriesDialog}
        selectValue={item} setSelectValue={setItem} selectLabel="Storage Name" />

        { /* Suppliers Pop Up */}
        <NewSupplier open={openSuppliersDialog} setOpen={setOpenSuppliersDialog} supplierSite={"__new_site__"}
        sitesData={sitesData} handleSetSuppliersTable={handleAddSiteSuppliersArr} handleOpenAlert={handleOpenAlert}/>

    </Dialog>
  );
}
