import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import fire from '../../../fire';
import SimpleSelectDialog from '../SimpleSelectDialog';
import NewSite from '../../Sites/Saved_Sites/NewSite';

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
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CasinoIcon from '@material-ui/icons/Casino';

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
import BubbleChartIcon from '@material-ui/icons/BubbleChart'; // Storage Type
import PlaceIcon from '@material-ui/icons/Place'; // Site
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder'; // Warranty Period
import BuildIcon from '@material-ui/icons/Build'; // Lab History
import PersonIcon from '@material-ui/icons/Person'; // User
import { AddCircleOutline } from '@material-ui/icons'; // Plus Button
import StarIcon from '@material-ui/icons/Star'; // Event
import CachedIcon from '@material-ui/icons/Cached'; // Refresh Data
import { query } from 'chartist';
import { firestore } from 'firebase';

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
        minHeight: '80vh',
        maxHeight: '80vh',
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
    supplierPlusButton: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(-7),
        marginRight: theme.spacing(7),
    },
    secondPlusButton: {
        marginLeft: theme.spacing(2), 
    },
    selectGridItem: {
        marginRight: theme.spacing(-5),
    },
    refreshButton: {
        width: '0.5rem',
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: '3',
        border: '0',
        color: 'white',
        height: '2rem',
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    }
  }),
);


export default function EditDevice(props) {
    const { open, setOpen, storageDevices, setStorageDevices, handleOpenAlert, userRec, currentDevice, setCurrentDevice, usersArr,
            setSitesArr, sitesArr, selectDataArr, setSelectDataArr, calculateWarrantyEnd, setOpenDeviceQr, deviceSuppliersDict } = props;
    
    // The current component's style:
    const classes = useStyles();

    // Defining some variables to hold the user's input:
    const [name, setName] = useState(currentDevice.deviceName ? currentDevice.deviceName : ''); // Text Input
    const [category, setCategory] = useState(currentDevice.category ? currentDevice.category : ''); // Text Input
    const [serial, setSerial] = useState(currentDevice.serial ? currentDevice.serial : ''); // Text Input
    const [serialDisable, setSerialDisable] = useState(false); // A bool to determine whether we should disable the input and generate a random serial or not.
    const [price, setPrice] = useState(currentDevice.price ? currentDevice.price : ''); // Number Input
    const [supplier, setSupplier] = useState(currentDevice.supplier ? currentDevice.supplier : ''); // Select
    const [storageType, setStorageType] = useState(currentDevice.storageType ? currentDevice.storageType : ''); // Select
    const [deviceUser, setDeviceUser] = useState(currentDevice.user ? currentDevice.user : ''); // Select { Convert User Objects to Text }
    const [deviceSite, setDeviceSite] = useState(currentDevice.site ? currentDevice.site : ''); // Select
    const [certificate, setCertificate] = useState(currentDevice.certificate ? currentDevice.certificate : ''); // Text Input
    const [certificateImage, setCertificateImage] = useState(currentDevice.certificateImg ? currentDevice.certificateImg : ''); // Image Input
    const [warrantyStartDate, setWarrantyStartDate] = useState(currentDevice.warrantyStart ? currentDevice.warrantyStart : new Date()); // Date Picker
    const [warrantyPeriod, setWarrantyPeriod] = useState(currentDevice.warrantyPeriod ? currentDevice.warrantyPeriod : ''); // Number Input
    const [events, setEvents] = useState(''); // Text Input { Expandable }
    const [notes, setNotes] = useState(currentDevice.notes ? currentDevice.notes : ''); // Text Input { Expandable }
    const [actions, setActions] = useState([]); // An array containing the actions for the current device
    const [actionUserName, setActionUserName] = useState(''); // A string to hold the name of the user performing the action
    const [actionUserMail, setActionUserMail] = useState(''); // A string to hold the mail of the user performing the action

    // Dialogs:
    const [openStorageTypeDialog, setOpenStorageTypeDialog] = useState(false); // Pop up to add a new storage type
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false); // Pop up to add a new category
    const [openSiteDialog, setOpenSiteDialog] = useState(false); // Pop up to add a new site
    
    // New Device Helping Variables:
    const [deviceStorageTypesArr, setDeviceStorageTypesArr] = useState([]);
    const [deviceCategoriesArr, setDeviceCategoriesArr] = useState([]);
    const [deviceSuppliersArr, setDeviceSuppliersArr] = useState([]);

    // -------------------------------Alert Stuff----------------------------------------
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
    // ----------------------------------------------------------------------------------

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

  /**
   * A function which will run as our component starts loading itself.
  */
  useEffect(() => {
    initArrays();
  }, []);


  /**
   * A function in charge of initializing the different select fields and their matching values accordingly, after we finished loading the rest of the data.
   */
  const initArrays = () => {
    // Setting userIndex & siteIndex based on their matching values:
    var siteIndex = sitesArr.indexOf(deviceSite)
    var storageArr = selectDataArr[siteIndex].storageTypesArr;
    var categoryArr = selectDataArr[siteIndex].categoriesArr;
    var suppliersArr = deviceSuppliersDict[sitesArr[siteIndex]];

    handleSetInitArrays(storageArr, categoryArr, suppliersArr);
  }

  /**
   * A function in charge of setting the storages & categories array when this component is being loaded.
   * @param {[arr]} storageArr - An array of storages.
   * @param {[arr]} categoryArr - An array of categories.
   * @param {[arr]} suppliersArr - An array of suppliers.
   */
  const handleSetInitArrays = (storageArr, categoryArr, suppliersArr) => {
    setDeviceStorageTypesArr(storageArr);
    setDeviceCategoriesArr(categoryArr);
    // console.log("SUPPLIERRRRRR", suppliersArr)
    // console.log("SKDKASMCMZX", deviceSite)
    // console.log("SADSADMAS", deviceSuppliersDict)
    // console.log("SUPPLIERRRRRR", deviceSuppliersDict[deviceSite])
    setDeviceSuppliersArr(suppliersArr);
  }


    // --------------------------Add Storage Type Stuff----------------------------------
    const handleCloseStorageTypeDialog = () => {
        setOpenStorageTypeDialog(false);
    }

    const handleOkStorageTypeDialog = () => {
        // Adding the new value to the array of storage-types:
        if (deviceCategoriesArr) {
            var tempArr = deviceStorageTypesArr;
            tempArr.push(storageType);
            setDeviceStorageTypesArr(tempArr);
        } else {
            var tempArr = [storageType];
            setDeviceStorageTypesArr(tempArr);
        }
        // At last, close the new storage-type dialog:
        setOpenStorageTypeDialog(false);
    }
    
    const handleOpenStorageTypeDialog = () => {
        setOpenStorageTypeDialog(true);
        setStorageType('');
    }
    // ----------------------------------------------------------------------------------

    // --------------------------Add Category Stuff--------------------------------------
    const handleCloseCategoryDialog = () => {
        setOpenCategoryDialog(false);
    }

    const handleOkCategoryDialog = () => {
        // Adding the new category to the device categories arr:
        if (deviceCategoriesArr) {
            var tempArr = deviceCategoriesArr;
            tempArr.push(category);
            setDeviceCategoriesArr(tempArr);
        } else {
            var tempArr = [category];
            setDeviceCategoriesArr(tempArr);
        }
        // Then add the new value to the DB:

        // At last, close the new storage-type dialog:
        setOpenCategoryDialog(false);
    }
    
    const handleOpenCategoryDialog = () => {
        setOpenCategoryDialog(true);
        setCategory('');
    }
    // ----------------------------------------------------------------------------------

    // ------------------------------Add Site Stuff--------------------------------------
    const hanldeOpenSiteDialog = () => {
        setOpenSiteDialog(true);
    }
    // ----------------------------------------------------------------------------------

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
        setEvents('');
    }

    const handleAddDevice = () => {
        // 1. Add the device to the db.
        // 2. Add action to device's sub-collection "actions".
        // 3. Add the device to the storageTable.
        
        // Since this is a new device, we need to retrieve the deviceActions details:
        // We should first pull the data from the db {under the current user's uid}:
        // Adding the image to the db & to the tables displaying the devices:
        if (certificate !== currentDevice.certificate || certificateImage !== currentDevice.certificateImg){
            console.log("Changed the certificate!")
            insertCertificateToDb();
        } else {
            editDevice(certificateImage)
        }

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
    const insertCertificateToDb = () => {
        // Create a root reference
        var storageRef = fire.storage().ref();
        var imageRef = storageRef.child("images/" + certificate);

        // Attempting to find the certificate in the system:
        imageRef.getDownloadURL().then(onResolve, onReject);

        function onResolve(foundURL){
            // Do something with the found certificate's URL --> Start addDeviceToDB:
            return editDevice(foundURL);
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
                    return editDevice(downloadURL);
                })
            })
        }
    }

    /**
     * A function in charge of editing the existing device by setting it's fields to match the new details entered by the user.
     * @param {string} downloadURL - A link to a place where the certificate image is stored.
     */
    const editDevice = (downloadURL) => {

        const db = fire.firestore();
        // Retrieving the id of the current document:
        var curDocRef =
            db.collection("devices")
            .where("deviceName", "==", currentDevice.deviceName)
            .where("category", "==", currentDevice.category)
            .where("serial", "==", currentDevice.serial)
            .where("price", "==", currentDevice.price)
            .where("certificate", "==", currentDevice.certificate)
            .where("certificateImg", "==", currentDevice.certificateImg)
            .where("supplier", "==", currentDevice.supplier)
            .where("user", "==", currentDevice.user)
            .where("site", "==", currentDevice.site);
        
        curDocRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(document) {
                // A record representing a device & it's data:
                var deviceRec = {
                    deviceName: name,
                    category: category,
                    serial: serialDisable ? document.id : serial,
                    price: parseInt(price),
                    certificate: certificate,
                    certificateImg: downloadURL,
                    supplier: supplier,
                    user: deviceUser,
                    site: deviceSite,
                    storageType: storageType,
                    warrantyStart: warrantyStartDate,
                    warrantyPeriod: parseInt(warrantyPeriod),
                    notes: notes
                }

                // Setting the current device (for the Storage Screen):
                deviceRec.warrantyEnd = calculateWarrantyEnd(deviceRec.warrantyStart, deviceRec.warrantyPeriod);
                setCurrentDevice(deviceRec)

                document.ref.update(deviceRec)
                .then(function() {
                    console.log("Document successfully updated!");
                    handleOpenAlert('success', 'Successfully edited the device!');
                    
                    // Then adding the device record to the array:
                    var tempArr = storageDevices.filter(curDev => curDev !== currentDevice);
                    tempArr.push(deviceRec);
                    setStorageDevices(tempArr)

                    // Once we finish adding the device, we would like to pass the current doc's id
                    // to a function on which we will start a new "actions" collection for the current device:
                    return addAction(db, document.id);
                })
                .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                    handleOpenAlert('error', 'An error occurred.');
                    return false;
                });
            });
        });
    }

    /**
     * Basically adding the "event" that the user defined to a sub-collection of the new device document we have just defined.
     * @param {fire.firestore()} db - A reference to the db object.
     * @param {fire.auth()} auth - A reference to the auth object.
     * @param {string} docId - The id of the document matching to the device we've just added.
     */
    const addAction = (db, docId) => {
        var docRef = db.collection("devices").doc(docId).collection("actions");
        var curDate = new Date();
        docRef.add({
            date: curDate,
            event: events,
            uid: userRec.uid
        })
        .then(function() {
            console.log("Document successfully written!");
            handleOpenAlert('success', 'Successfully added the action to the device actions sub-collection!');
            // Once we're done --> opening the qr code of the added device:
            setOpenDeviceQr(true);
            return true;
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            handleOpenAlert('error', 'An error occurred.');
            return false;
        });
    }


    // Checking the user's input and accordingly returning true / false.
    // Also raising any alerts if needed to let the user know whether he should change something or not.
    const checkInputValidity = () => {
        console.log("hi")
        var isValid = true;
        var notValidMessage = "";
        // Checking text fields:
        if (name.length < 2 || category.length < 2 || (!serialDisable && serial.length < 4) || parseInt(price) < 0 || certificate.length < 4
        || parseInt(warrantyPeriod) < 0 || events.length < 1){
            isValid = false;
            notValidMessage = "Did you fill all the text input fields properly?"
        }

        // Checking Select Fields:
        else if (supplier === "" || storageType === ""){
            isValid = false;
            notValidMessage = "Did you fill all the select fields properly?"
        }
        else if (certificateImage === "" || !certificateImage){
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
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            classes={{ paper: classes.dialogPaper }}
        >
            <DialogTitle id="alert-dialog-title">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                <h6 style={{marginTop: '0.5rem'}}>Would you like to add a new device?</h6>
                <Button
                    className={classes.refreshButton}
                    style={{marginLeft: '2rem'}}
                >
                    <CachedIcon/>
                </Button>
            </div>
            </DialogTitle>
            
            <DialogContent>
                
                {/* ---- First Row ---- */}
                <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '-10px'}}>
                    {/* Product Owner */}
                    <Grid item>
                        <PersonIcon />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="select-device-owner-label">Owner</InputLabel>
                            <Select
                                labelId="select-device-owner-label"
                                id="select-device-owner"
                                value={deviceUser}
                                onChange={(event) => {
                                    setDeviceUser(event.target.value);
                                }}
                                input={<Input />}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                            {usersArr.map((option, index) => (
                                <MenuItem key={"deviceUsersArr", index+1} value={option.uid}>{option.fullName + " | " + option.email + " | " + option.site}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Product Site */}
                    <Grid item style={{marginLeft: '-20px'}}>
                        <PlaceIcon />
                    </Grid>
                    <Grid item xs={5} className={classes.selectGridItem}>
                        <FormControl className={classes.formControlSecondSelect}>
                        <InputLabel id="select-site-outlined-label">Site</InputLabel>
                        <Select
                            labelId="select-site-outlined-label"
                            id="select-site-outlined"
                            style={{width: '84%'}}
                            value={deviceSite}
                            onChange={event => {
                              var curSite = sitesArr.indexOf(event.target.value);

                              // 1. Setting a site:
                              setDeviceSite(event.target.value)
                              // 2. Updating the storage types & categories arrays accordingly:
                              // First finding the record in the selectDataArr which matches our siteName:
                              if (curSite !== -1){
                                setDeviceStorageTypesArr(selectDataArr[curSite].storageTypesArr)
                                setDeviceCategoriesArr(selectDataArr[curSite].categoriesArr)
                                setDeviceSuppliersArr(deviceSuppliersDict[sitesArr[curSite]] ? deviceSuppliersDict[sitesArr[curSite]] : [])
                              } else {
                                // If curSite === 0 --> Then we would like to rest the storagesArr & categoriesArr options:
                                setDeviceStorageTypesArr([]);
                                setDeviceCategoriesArr([]);
                                setDeviceSuppliersArr([]);
                                setDeviceSite('');
                              }
                              setSupplier('');
                              setStorageType('');
                              setCategory('');
                            }}
                            label="Site"
                          >
                            <MenuItem value="">
                              <em>Any</em>
                            </MenuItem>
                            {sitesArr.length && sitesArr.map((option, index) => (
                                <MenuItem key={"sitesArr_", index} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                
                {/* ---- Second Row ---- */}
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
                                onChange={(event) => {setSupplier(event.target.value)}}
                                input={<Input />}
                            >
                                <MenuItem value="">
                                <em>Any</em>
                                </MenuItem>
                                {
                                    deviceSuppliersArr.length && deviceSuppliersArr.map((option, index) => (
                                        <MenuItem key={"deviceSuppliersArr", index+1} value={option}>{option}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* Product Storage Type */}
                    <Grid item style={{marginLeft: '-20px'}}>
                        <BubbleChartIcon />
                    </Grid>
                    <Grid item xs={4} className={classes.selectGridItem}>
                        <FormControl className={classes.formControlSecondSelect}>
                            <InputLabel id="select-device-storage-type-label">Storage</InputLabel>
                            <Select
                                style={{width: '94%'}}
                                labelId="select-device-storage-type-label"
                                id="select-device-storage-type"
                                value={storageType}
                                onChange={(event) => {setStorageType(event.target.value)}}
                                input={<Input />}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                            {deviceStorageTypesArr.length && deviceStorageTypesArr.map((option, index) => (
                                <MenuItem key={"deviceStorageTypesArr", index+1} value={option}>{option}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.secondPlusButton}>
                        <IconButton aria-label="add-storage-type" onClick={handleOpenStorageTypeDialog}>
                            <AddCircleOutline />
                        </IconButton>
                    </Grid>
                </Grid>

                {/* ---- Third Row ---- */}
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
                    {/* Product Storage Type */}
                    <Grid item style={{marginLeft: '5px', marginTop: '2rem'}}>
                        <DevicesOtherIcon />
                    </Grid>
                    <Grid item xs={5} className={classes.selectGridItem} style={{marginLeft: '-20px'}}>
                        <FormControl className={classes.formControlSecondSelect}>
                            <InputLabel id="select-device-storage-type-label">Category</InputLabel>
                            <Select
                                style={{width: '80%'}}
                                labelId="select-device-storage-type-label"
                                id="select-device-supplier"
                                value={category}
                                onChange={(event) => {setCategory(event.target.value)}}
                                input={<Input />}
                            >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                {deviceCategoriesArr.length && deviceCategoriesArr.map((option, index) => (
                                    <MenuItem key={"deviceCategoriesArr", index+1} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item className={classes.secondPlusButton} style={{marginLeft:'-2rem', marginTop: '1rem'}}>
                        <IconButton aria-label="add-category" onClick={handleOpenCategoryDialog}>
                            <AddCircleOutline />
                        </IconButton>
                    </Grid>
                </Grid>
                
                

                {/* ---- Fourth Row ---- */}
                <Grid container item spacing={3} style={{marginTop: '-1rem'}}>
                    {/* Product Serial */}
                    <Grid item xs={5}>
                        { serial !== '' && serial.length < 4 ?
                        <TextField
                            error
                            helperText="Serial should be at least 4 characters."
                            className={classes.margin}
                            id="newDeviceSerial"
                            label="Serial"
                            disabled={serialDisable}
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
                            disabled={serialDisable}
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

                    <Grid item className={classes.secondPlusButton} style={{marginLeft:'-2rem', marginTop: '1rem'}}>
                        <IconButton aria-label="add-category" onClick={() => {
                            // 1. Disabling the edit option for the serial:
                            setSerialDisable(!serialDisable);
                            // 2. Setting indicative text (or leaving as empty) to update the user:
                            setSerial(!serialDisable ? 'RANDOM' : '');
                        }}>
                            <CasinoIcon />
                        </IconButton>
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
                
                {/* ---- Fifth Row ---- */}
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
            
                {/* ---- Sixth Row ---- */}
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


                {/* ---- Seventh Row ---- */}
                <Grid container item spacing={3} style={{marginTop: '-1rem'}}>
                {/* Product Serial */}
                <Grid item xs={12}>
                    <TextField
                        style={{width: '96%', marginTop: '20px'}}
                        id="text-field-device-events"
                        label="Event (Device Addition, Device Repair, etc.)"
                        multiline
                        value={events}
                        onChange={(event) => {setEvents(event.target.value)}}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <StarIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                </Grid>



                {/* ---- Eigth Row ---- */}
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

            { /* Storage Type Dialog Box */}
            <SimpleSelectDialog dialogTitle="Add a new Storage" openSelectDialog={openStorageTypeDialog} handleCloseDialog={handleCloseStorageTypeDialog}
            handleOkDialog={handleOkStorageTypeDialog} selectValue={storageType} setSelectValue={setStorageType} selectLabel="Storage" />
            
            { /* Category Dialog Box */}
            <SimpleSelectDialog dialogTitle="Add a new Category" openSelectDialog={openCategoryDialog} handleCloseDialog={handleCloseCategoryDialog}
            handleOkDialog={handleOkCategoryDialog} selectValue={category} setSelectValue={setCategory} selectLabel="Category" />
            
            { /* Site Dialog Box */}
            <NewSite open={openSiteDialog} setOpen={setOpenSiteDialog} />
        </Dialog>
    );
  }