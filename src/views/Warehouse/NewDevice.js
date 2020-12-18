import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import fire from '../../fire';

// New Device Components Imports:
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

// New Device Icons In Form:
import LaptopMacIcon from '@material-ui/icons/LaptopMac'; // Product
import DevicesOtherIcon from '@material-ui/icons/DevicesOther'; // Category
import EmojiSymbolsIcon from '@material-ui/icons/EmojiSymbols'; // Serial
import CreditCardIcon from '@material-ui/icons/CreditCard'; // Price
import DescriptionIcon from '@material-ui/icons/Description'; // Certificate
import PhotoIcon from '@material-ui/icons/Photo'; // Certificate Image
import LocalShippingIcon from '@material-ui/icons/LocalShipping'; // Supplier
import PlaceIcon from '@material-ui/icons/Place'; // Storage Type
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'; // Warranty Period
import BuildIcon from '@material-ui/icons/Build'; // Lab History




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
  }),
);


export default function NewDevice(props) {
    const { open, setOpen, officeStorageDevices, setOfficeStorageDevices, homeStorageDevices, setHomeStorageDevices, handleOpenAlert,
            userEmail, userFullName } = props;

    // Defining some variables to hold the user's input:
    const [name, setName] = useState(''); // Text Input
    const [category, setCategory] = useState(''); // Text Input
    const [serial, setSerial] = useState(''); // Text Input
    const [price, setPrice] = useState(''); // Number Input
    const [supplier, setSupplier] = useState(''); // Select
    const [storageType, setStorageType] = useState(''); // Select
    const [storageUserId, setStorageUserId] = useState(''); // Select { Convert User Objects to Text }
    const [storageSite, setStorageSite] = useState(''); // Select
    const [certificate, setCertificate] = useState(''); // Text Input
    const [certificateImage, setCertificateImage] = useState(''); // Image Input
    const [warrantyStartDate, setWarrantyStartDate] = useState(new Date()); // Date Picker
    const [warrantyPeriod, setWarrantyPeriod] = useState(''); // Number Input
    const [notes, setNotes] = useState(''); // Text Input { Expandable }
    
    // New Device Helping Variables:
    const [deviceSuppliersArr, setDeviceSuppliersArr] = useState(['Wediggit', 'One']);
    const [deviceStorageTypesArr, setDeviceStorageTypesArr] = useState(['Office Storage', 'Home Storage']);
    const classes = useStyles();

    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
    };

    const handleOk = () => {
        if (checkInputValidity()){
            // Adding the device:
            handleAddDevice();
            // Then closing the pop up form:
            setOpen(false);
        }
    }

    const cleanUserInputs = () => {
        setName('');
        setCategory('');
        setSerial('');
        setPrice('');
        setStorageType('');
        setCertificate('');
        setCertificateImage('');
        setWarrantyStartDate(new Date());
        setWarrantyPeriod('');
        setNotes('');
    }

    const handleAddDevice = () => {
        // 1. Add the device to the db.
        // 2. Add the device to the matching table.

        // Since this is a new device, we need to retrieve the deviceActions details:
        // We should first pull the data from the db {under the current user's uid}:
        // Adding the image to the db & to the tables displaying the devices:
        insertCertificateToDb(userEmail, userFullName);
        // Cleaning the inputs:
        cleanUserInputs();
    }

    /**
     * A function in charge of inserting the certificate's image uploaded by the user to the db.
     * After uploading the image to the db, this function will call another function which is in charge of
     * adding the device details inputted by the user to the db.
     * @param {string} userEmail -- The email of the current user.
     * @param {string} userFullName -- The name of the current user.
     */
    const insertCertificateToDb = (userEmail, userFullName) => {
        // Create a root reference
        var storageRef = fire.storage().ref();
        var imageRef = storageRef.child("images/" + certificate);

        // Attempting to find the certificate in the system:
        imageRef.getDownloadURL().then(onResolve, onReject);

        function onResolve(foundURL){
            // Do something with the found certificate's URL --> Start addDeviceToDB:
            return addDevice(foundURL, userEmail, userFullName);
        }
    
        function onReject(error){
            // Then we should add the image to the DB:
            var uploadTask = imageRef.put(certificateImage)
            uploadTask.on('state_changed', function(snapshot){
                // Uploading the image.   
            }, function(error){
                // Handle unsuccessful uploads:
                handleOpenAlert("error", "An error occurred while attempting to upload the certificate's image.");
            }, function() {
                // Handle successful uploads {on complete}:
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                    // Adding the device to the DB:
                    return addDevice(downloadURL, userEmail, userFullName);
                })
            })
            
        }
    }


    const addDevice = (downloadURL) => {
        const db = fire.firestore()
        const auth = fire.auth()
        var docRef = db.collection("users").doc(auth.currentUser.uid).collection("storage");

        // Defining a device record:
        let deviceSupplierName = deviceSuppliersArr[parseInt(supplier)-1];
        let deviceStorageType = storageType===1 ? "Office Storage" : "Home Storage";
        var deviceRec = {
            deviceName: name,
            category: category,
            serial: serial,
            price: parseInt(price),
            certificate: certificate,
            certificateImg: downloadURL,
            supplier: deviceSupplierName,
            warrantyStart: warrantyStartDate,
            warrantyPeriod: parseInt(warrantyPeriod),
            storageType: deviceStorageType,
            labHistory: notes,
            lastActionEmail: userEmail,
            lastActionFullName:  userFullName,
        }

        // Adding the device record to the db:
        docRef.add({
            deviceName: name,
            category: category,
            serial: serial,
            price: parseInt(price),
            certificate: certificate,
            certificateImg: downloadURL,
            supplier: deviceSupplierName,
            warrantyStart: warrantyStartDate,
            warrantyPeriod: parseInt(warrantyPeriod),
            storageType: deviceStorageType,
            labHistory: notes,
            lastActionEmail: userEmail,
            lastActionFullName:  userFullName,
        })
        .then(function() {
            console.log("Document successfully written!");
            handleOpenAlert('success', 'Successfully added the device!');
            return true;
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            handleOpenAlert('error', 'An error occurred.');
            return false;
        });

        // Then adding the device record to the matching table:
        if (deviceStorageType === "Office Storage"){
            var tempArr = officeStorageDevices;
            tempArr.push(deviceRec)
            setOfficeStorageDevices(tempArr);
        } else {
            var tempArr = homeStorageDevices;
            tempArr.push(deviceRec)
            setHomeStorageDevices(tempArr);
        }
    }


    // Checking the user's input and accordingly returning true / false.
    // Also raising any alerts if needed to let the user know whether he should change something or not.
    const checkInputValidity = () => {
        console.log("hi")
        var isValid = true;
        var notValidMessage = "";
        // Checking text fields:
        if (name.length < 2 || category.length < 2 || serial.length < 4 || parseInt(price) < 0 || certificate.length < 4 || parseInt(warrantyPeriod) < 0){
            isValid = false;
            notValidMessage = "Did you fill all the text input fields properly?"
        }

        // Checking Select Fields:
        else if (supplier === "" || storageType === ""){
            isValid = false;
            notValidMessage = "Did you fill all the select fields properly?"
        }
        else if (certificateImage === ""){
            isValid = false;
            notValidMessage = "Did you upload an image?"
        }
        // If we got here then we should add the certificate as it wasn't found in the storage:
        // file.size displays image size in bytes.
        // Capping Max File size at 0.5 MB {524,288 Bytes}:
        else if (certificateImage.size > 524288){
            isValid = false;
            notValidMessage = "The size of the image you inputted is too big (Max Size - 0.05MB)."
        }

        if (!isValid) {
            handleOpenAlert("error", notValidMessage)
            return false;
        } else {
            return true;
        }
    }

  
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogTitle id="alert-dialog-title">{"Would you like to add a new device?"}</DialogTitle>
            <DialogContent>
                {/* ---- First Row ---- */}
                <Grid container item spacing={3}>
                    {/* Product Name */}
                    <Grid item xs={6}>
                        { name !== '' && name.length < 2 ?
                        <TextField
                            error
                            helperText="Name should be at least 2 characters."
                            className={classes.margin}
                            id="newDeviceName"
                            label="Product Name"
                            value={name}
                            onChange={(event) => {setName(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LaptopMacIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> : 
                        <TextField
                            className={classes.margin}
                            id="newDeviceName"
                            label="Product Name"
                            value={name}
                            onChange={(event) => {setName(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LaptopMacIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    }
                        
                    </Grid>
                    {/* Product Category */}
                    <Grid item xs={6}>    
                        { category !== '' && category.length < 2 ?
                        <TextField
                            error
                            helperText="Category should be at least 2 characters."
                            className={classes.margin}
                            id="newDeviceCategory"
                            label="Category"
                            value={category}
                            onChange={(event) => {setCategory(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DevicesOtherIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> :
                        <TextField
                            className={classes.margin}
                            id="newDeviceCategory"
                            label="Category"
                            value={category}
                            onChange={(event) => {setCategory(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DevicesOtherIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        }
                    </Grid>
                </Grid>

                {/* ---- Second Row ---- */}
                <Grid container item spacing={3}>
                    {/* Product Serial */}
                    <Grid item xs={6}>
                        { serial !== '' && serial.length < 4 ?
                        <TextField
                            error
                            helperText="Serial should be at least 4 characters."
                            className={classes.margin}
                            id="newDeviceSerial"
                            label="Serial"
                            value={serial}
                            onChange={(event) => {setSerial(event.target.value)}}
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
                            id="newDeviceSerial"
                            label="Serial"
                            value={serial}
                            onChange={(event) => {setSerial(event.target.value)}}
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
                    {/* Product Price */}
                    <Grid item xs={6}>
                        { price !== '' && parseInt(price) < 0 ?
                        <TextField
                            error
                            helperText="Price should be positive."
                            className={classes.margin}
                            id="newDevicePrice"
                            label="Price"
                            value={price}
                            type="number"
                            onChange={(event) => {setPrice(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCardIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> :
                        <TextField
                            className={classes.margin}
                            id="newDevicePrice"
                            label="Price"
                            value={price}
                            type="number"
                            onChange={(event) => {setPrice(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCardIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        }
                    </Grid>
                </Grid>
                
                {/* ---- Third Row ---- */}
                <Grid container item spacing={1} alignItems="flex-end">
                    <Grid item xs={6}>
                        { certificate !== '' && certificate.length < 4 ?
                        <TextField
                            error
                            helperText="Certificate should be at least 4 characters."
                            className={classes.margin}
                            id="newDeviceCertificate"
                            label="Certificate"
                            value={certificate}
                            onChange={(event) => {setCertificate(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> :
                        <TextField
                            className={classes.margin}
                            id="newDeviceCertificate"
                            label="Certificate"
                            value={certificate}
                            onChange={(event) => {setCertificate(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        }
                    </Grid>
                    {/* Product Certificate */}
                    <Grid item xs={6}>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                            disabled={certificate ? false : true}
                            onChange={(event) => {setCertificateImage(event.target.files[0])}}
                        />
                        <label htmlFor="raised-button-file">
                            <Button
                                style={{marginTop: '-40px', marginLeft: '20px'}}
                                variant="contained"
                                color={!certificateImage ? (certificate ? "primary": "secondary") : ("default")}
                                startIcon={<PhotoIcon />}
                                component="span"
                            >
                                Upload Certificate
                            </Button>
                        </label>
                    </Grid>
                </Grid>
            
                {/* ---- Fourth Row ---- */}
                <Grid container item spacing={3}>
                    {/* Product Serial */}
                    <Grid item xs={6}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                id="newDeviceWarrantyStartDate"
                                style={{width: '90%'}}
                                label="Warranty Start Date"
                                className={classes.formControl}
                                value={warrantyStartDate}
                                onChange={date => setWarrantyStartDate(date)}
                                format="dd/MM/yyyy"
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    {/* Product Warranty Period */}
                    <Grid item xs={6}>
                        { warrantyPeriod !== '' && parseInt(warrantyPeriod) < 0 ?
                        <TextField
                            error
                            helperText="Warranty Period should be positive."
                            className={classes.margin}
                            id="newDeviceWarrantyPeriod"
                            label="Warranty Period (Months)"
                            value={warrantyPeriod}
                            type="number"
                            onChange={(event) => {setWarrantyPeriod(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <QueryBuilderIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> :
                        <TextField
                            className={classes.margin}
                            id="newDeviceWarrantyPeriod"
                            label="Warranty Period (Months)"
                            value={warrantyPeriod}
                            type="number"
                            onChange={(event) => {setWarrantyPeriod(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <QueryBuilderIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        }
                    </Grid>
                </Grid>

                { /* ---- Fifth Row ---- */}
                <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '-10px'}}>
                    {/* Product Supplier */}
                    <Grid item>
                        <LocalShippingIcon />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-device-supplier-label">Supplier</InputLabel>
                            <Select
                                labelId="select-device-supplier-label"
                                id="select-device-supplier"
                                value={supplier}
                                onChange={(event) => {setSupplier(Number(event.target.value) || 0);}}
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
                    {/* Product Storage Type */}
                    <Grid item style={{marginLeft: '-20px'}}>
                        <PlaceIcon />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={classes.formControlSecondInSelectRow}>
                            <InputLabel id="select-device-storage-type-label">Storage Type</InputLabel>
                            <Select
                                style={{width: '94%'}}
                                labelId="select-device-storage-type-label"
                                id="select-device-supplier"
                                value={storageType}
                                onChange={(event) => {setStorageType(Number(event.target.value) || 0);}}
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





                {/* ---- Sixth Row ---- */}
                <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '-10px'}}>
                    {/* Product Supplier */}
                    <Grid item>
                        <LocalShippingIcon />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-device-supplier-label">Supplier</InputLabel>
                            <Select
                                labelId="select-device-supplier-label"
                                id="select-device-supplier"
                                value={supplier}
                                onChange={(event) => {setSupplier(Number(event.target.value) || 0);}}
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
                    {/* Product Storage Type */}
                    <Grid item style={{marginLeft: '-20px'}}>
                        <PlaceIcon />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl className={classes.formControlSecondInSelectRow}>
                            <InputLabel id="select-device-storage-type-label">Storage Type</InputLabel>
                            <Select
                                style={{width: '94%'}}
                                labelId="select-device-storage-type-label"
                                id="select-device-supplier"
                                value={storageType}
                                onChange={(event) => {setStorageType(Number(event.target.value) || 0);}}
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








                {/* ---- Seventh Row ---- */}
                <Grid container item spacing={3}>
                    {/* Product Serial */}
                    <Grid item xs={12}>
                        <TextField
                            style={{width: '96%', marginTop: '20px'}}
                            id="text-field-device-notes"
                            label="Notes (Lab History, etc.)"
                            multiline
                            value={notes}
                            onChange={(event) => {setNotes(event.target.value)}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BuildIcon />
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
            <Button onClick={handleOk} color="primary" autoFocus>
                Ok
            </Button>
            </DialogActions>
        </Dialog>
    );
  }