import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import fire from '../../fire';
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

import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import LocalShippingIcon from '@material-ui/icons/LocalShipping'; // Name Icon
import LocationOnIcon from '@material-ui/icons/LocationOn'; // Address Icon
import BuildIcon from '@material-ui/icons/Build'; // Service Type Icon
import ExploreIcon from '@material-ui/icons/Explore'; // Site Icon
import { AddCircleOutline, PermContactCalendar } from '@material-ui/icons'; // Plus Button
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
    dialogPaper: {
        minHeight: '75vh',
        maxHeight: '75vh',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '75%',
    },
    formControlSecondInSelectRow: {
        margin: theme.spacing(1),
        width: '115%',
    },
    formControlSelect:{
        margin: theme.spacing(1),
        width: '60%',
    },
    formControlSecondSelect:{
        margin: theme.spacing(1),
        width: '100%'
    },
    plusButton: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(-9),
        marginRight: theme.spacing(7),
    },
    secondPlusButton: {
        marginLeft: theme.spacing(3.5), 
    },
    selectGridItem: {
        marginRight: theme.spacing(-5),
    }
  }),
);

export default function NewSupplier(props) {
  const classes = useStyles();
  const { open, setOpen, supplierSite, handleOpenAlert, sitesData, handleSetSuppliersTable, suppliersTableData } = props;

  // Variables Definition:
  const [name, setName] = useState(''); // TextField
  const [address, setAddress] = useState(''); // TextField
  const [serviceType, setServiceType] = useState(''); // Select
  const [contact, setContact] = useState(''); // Text Field
  const [site, setSite] = useState(''); // Select
  const [sla, setSla] = useState(''); // TextField
  const [tin, setTin] = useState(''); // TextField
  const [notes, setNotes] = useState(''); // Expandable TextField
  const [sitesArr, setSitesArr] = useState([]);
  //const [sitesData, setSitesData] = useState([]);
  const [serviceTypesArr, setServiceTypesArr] = useState([]);
  const [openServiceTypeDialog, setOpenServiceTypeDialog] = useState(false); // Pop up to add a new storage type

  const cleanUserInputs = () => {
      setName('');
      setAddress('');
      setServiceType('');
      setContact('');
      setSite('');
      setSla('');
      setTin('');
      setNotes('');
  }
  
  // ----------------------Handle New Supplier Dialog Options--------------------------
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**
   * A function in charge of handling a case on which the user presses "OK".
   * We have 2 Options:
   * 1. Either this pop-up was opened via the sites - on which case we will use a received function in order to add the relevant record to the suppliersArr.
   * 2. OR this pop-up was opened via the suppliers page itself - on which case we would like to add the supplier to the db & to the suppliers table.
   * ON BOTH Cases, we WON'T close the pop-up, unless we managed to perform the action.
   * IN ADDITION, the action will be performed ONLY after we manage to validate the inputted details.
   */
  const handleOk = () => {
      // If we received a supplier site (meaning this form is opened as a sub-form for a site addition),
      // we would like to use the received setSupplierNameForSite function in order to return the new site
      if (validateSupplier()){
        var curSite = supplierSite ? sitesData[0].site : site.site;
        var supplierRec = {
            supplierName: name,
            address: address,
            sla: sla,
            tin: tin,
            site: curSite,
            serviceType: serviceType,
            contact: contact,
            notes: notes
        }
        if (supplierSite){
            handleSetSuppliersTable(supplierRec);
        } else {
            handleAddSupplierToDb(supplierRec);
        }
        
        // Cleaning the user's input:
        cleanUserInputs();
        // Closing the pop up:
        setOpen(false);
    }
  }

  const handleAddSupplierToTable = (supplierRec) => {
    // Basically just adding the received supplier record to the table suppliers array:
    var tempArr = suppliersTableData;
    tempArr.push(supplierRec);
    handleSetSuppliersTable(tempArr);
    console.log("TEMPARR", tempArr);
  }


  /**
   * A function in charge of adding the supplier based on the inputted details to the db.
   */
  const handleAddSupplierToDb = (tempRec) => {
    const db = fire.firestore();
    var docRef = db.collection("suppliers");

    docRef.add(tempRec)
    .then(function(docRef) {
        // Adding the rec to the suppliers table:
        handleAddSupplierToTable(tempRec);
        handleOpenAlert("success", "Successfully added the supplier!");
    })
    .catch(function(error) {
        handleOpenAlert("error", "Failed to add the supplier!");
    });    
  }

  // ----------------------------------------------------------------------------------

  /**
   * A function in charge of determining whether the inputted details are valid or not.
   */
  const validateSupplier = () => {
      var isValid = true;
      var notValidMessage = "";
      // Basically verifying that the details inputted by the user are at least some-what making sense:
      if (name.length < 2 || address.length < 4 || sla.length < 2 || tin.length < 4) {
        isValid = false;
        notValidMessage = "Did you fill all the text input fields properly?"
      } else if (serviceType === "" || (site === "" && supplierSite === "")) {
        isValid = false;
        notValidMessage = "Did you fill all the select fields properly?"
      }

      if (!isValid){
          handleOpenAlert("error", notValidMessage);
          return false;
      } else {
          return true;
      }
  }

  // If we reached here then we must be in the suppliers page, meaning that on the
  // addition of the supplier, we will have to perform both following actions:
  // 1. Add the supplier to the db.
  // 2. Add the supplier to the table.
  const handleAddSupplier = () => {
    
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
        <DialogTitle>Would you like to add a new supplier?</DialogTitle>
        <DialogContent>
        
        {/* ---- First Row ---- */}
        <Grid container item spacing={3}>
            {/* Supplier Name */}
            <Grid item xs={6}>
                { name !== '' && name.length < 2 ?
                <TextField
                    error
                    helperText="Name should be at least 2 characters."
                    className={classes.margin}
                    label="Supplier Name"
                    value={name}
                    onChange={(event) => {setName(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocalShippingIcon />
                            </InputAdornment>
                        ),
                    }}
                /> : 
                <TextField
                    className={classes.margin}
                    label="Supplier Name"
                    value={name}
                    onChange={(event) => {setName(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocalShippingIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            }
            </Grid>
            {/* Supplier Address */}
            <Grid item xs={6}>
                { address !== '' && address.length < 4 ?
                <TextField
                    error
                    helperText="Address should be at least 4 characters."
                    className={classes.margin}
                    label="Address"
                    value={address}
                    onChange={(event) => {setAddress(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationOnIcon />
                            </InputAdornment>
                        ),
                    }}
                /> : 
                <TextField
                    className={classes.margin}
                    label="Address"
                    value={address}
                    onChange={(event) => {setAddress(event.target.value)}}
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
        <Grid container item spacing={3}>
            {/* Supplier SLA */}
            <Grid item xs={6}>
                { sla !== '' && sla.length < 2 ?
                <TextField
                    error
                    helperText="SLA should be at least 2 characters."
                    className={classes.margin}
                    label="SLA"
                    value={sla}
                    onChange={(event) => {setSla(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AssignmentIcon />
                            </InputAdornment>
                        ),
                    }}
                /> : 
                <TextField
                    className={classes.margin}
                    label="SLA"
                    value={sla}
                    onChange={(event) => {setSla(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AssignmentIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            }
            </Grid>
            {/* Supplier TIN */}
            <Grid item xs={6}>
                { tin !== '' && tin.length < 4 ?
                <TextField
                    error
                    helperText="TIN should be at least 4 characters."
                    className={classes.margin}
                    label="TIN"
                    value={tin}
                    onChange={(event) => {setTin(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmojiSymbolsIcon />
                            </InputAdornment>
                        ),
                    }}
                /> : 
                <TextField
                    className={classes.margin}
                    label="TIN"
                    value={tin}
                    onChange={(event) => {setTin(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmojiSymbolsIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            }
            </Grid>
        </Grid>

        {/* ---- Third Row ---- */}
        <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '5px'}}>
            {/* Supplier Site */}
            <Grid item style={{marginBottom: '5px', marginRight: '-10px'}}>
                <LocationOnIcon />
            </Grid>
            <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                <InputLabel id="select-supplier-site-label">Site</InputLabel>
                <Select
                    labelId="select-supplier-site-label"
                    id="select-supplier-site"
                    value={supplierSite ? sitesData[0] : site}
                    style={{width: '105%'}}
                    disabled={!!supplierSite}
                    
                    onChange={event => {
                        var curSite = event.target.value;
                        console.log(curSite);
                        // 1. Setting the site:
                        setSite(curSite);
                        // 2. Updating the storage types & categories arrays accordingly:
                        // First finding the record in the selectDataArr which matches our siteName:
                        if (curSite){
                            setServiceTypesArr(curSite.serviceTypesArr);
                        } else {
                        // If curSite === 0 --> Then we would like to rest the storagesArr & categoriesArr options:
                            setServiceTypesArr([]);
                        }
                    }}
                    input={<Input />}
                >
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                {sitesData.map((option, index) => (
                    <MenuItem key={"SupplierSitesArr", index+1} value={option}>{option.site}</MenuItem>
                ))}
                </Select>
            </FormControl>
            </Grid>

            {/* Supplier Service Type */}
            <Grid item style={{marginLeft: '-9px', marginBottom: '5px', marginRight: '-10px'}}>
                <BuildIcon />
            </Grid>
            <Grid item xs={5} className={classes.selectGridItem}>
                <FormControl className={classes.formControlSecondSelect}>
                    <InputLabel id="select-supplier-service-type-label">Service Type</InputLabel>
                    <Select
                        labelId="select-supplier-service-type-label"
                        id="select-supplier-service-type"
                        value={serviceType}
                        onChange={(event) => setServiceType(event.target.value)}
                        input={<Input />}
                        style={{width: '93%'}}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    {!supplierSite ? serviceTypesArr.map((option, index) => (
                        <MenuItem key={"supplierServiceTypeArr", index+1} value={option}>{option}</MenuItem>
                    )) : sitesData.length ? sitesData[0].serviceTypesArr.map((option, index) => (
                        <MenuItem key={"supplierServiceTypeArr", index+1} value={option}>{option}</MenuItem>
                    )) : ''}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>

        {/* ---- Fourth Row ---- */}
        <Grid container item spacing={3}>
            {/* Product Serial */}
            <Grid item xs={12}>
                <TextField
                    style={{width: '98%', marginTop: '20px'}}
                    id="text-field-contact"
                    label="Contact"
                    multiline
                    value={contact}
                    onChange={(event) => {setContact(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PermContactCalendar />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </Grid>

        {/* ---- Fifth Row ---- */}
        <Grid container item spacing={3}>
            {/* Product Serial */}
            <Grid item xs={12}>
                <TextField
                    style={{width: '98%', marginTop: '20px'}}
                    id="text-field-supplier-notes"
                    label="Notes"
                    multiline
                    value={notes}
                    onChange={(event) => {setNotes(event.target.value)}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <MessageIcon />
                            </InputAdornment>
                        ),
                    }}
                />
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
    </Dialog>
  );
}
