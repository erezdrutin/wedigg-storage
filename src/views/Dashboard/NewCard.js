import React, { useState, useEffect } from "react";
import { IconPicker } from 'react-fa-icon-picker';
import fire from '../../fire.js';
import GenerateAutoComplete from "./GenerateAutoComplete.js";
import useStyles from "./NewCardStyles.js";
import iconsArr from "./DashboardIcons.js";

import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, Input, Select, InputLabel, MenuItem, FormControl, Typography, Divider, Checkbox, ListItemIcon, ListItemText } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

// Form Icons:
import TitleIcon from '@material-ui/icons/Title'; // Title
import TextFieldsIcon from '@material-ui/icons/TextFields'; // Description
import PaletteIcon from '@material-ui/icons/Palette'; // Color
import ExtensionIcon from '@material-ui/icons/Extension'; // Icons
import PlaceIcon from '@material-ui/icons/Place'; // Site
import DevicesOtherIcon from '@material-ui/icons/DevicesOther'; // Category
import LocalShippingIcon from '@material-ui/icons/LocalShipping'; // Supplier
import BubbleChartIcon from '@material-ui/icons/BubbleChart'; // Storage
import PersonIcon from '@material-ui/icons/Person'; // User
import ScheduleIcon from '@material-ui/icons/Schedule'; // Warranty End Date
import { auth } from "firebase";

export default function NewCard(props){
    const classes = useStyles();
    const { open, setOpenNewCard, handleOpenAlert, cardsArr, setCardsArr } = props;
    // Variables Definition:
    // 1. MUST FILL VARIABLES:
    const [description, setDescription] = useState(''); // Simple TextField
    const [color, setColor] = useState(''); // Simple TextField
    const [icon, setIcon] = useState(''); // Simple TextField

    // 2. SITE RELATED VARIABLES:
    const [site, setSite] = useState(''); // AutoComplete (allow multiple sites).
    const [sitesArr, setSitesArr] = useState([]); // An array containing sites.
    // EXTRAS (FOR DEVICES):
    const [owner, setOwner] = useState(''); // AutoComplete (allow multiple owners).
    const [storage, setStorage] = useState(''); // AutoComplete (allow multiple storages).
    const [category, setCategory] = useState(''); // AutoComplete (allow multiple categories).
    const [supplier, setSupplier] = useState(''); // Select (1 Supplier).
    const [ownersArr, setOwnersArr] = useState([]); // An array containing data regarding users.
    const [storagesArr, setStoragesArr] = useState([]); // An array containing data regarding storages.
    const [categoriesArr, setCategoriesArr] = useState([]); // An array containing data regarding categories.
    const [suppliersDict, setSuppliersDict] = useState([]); // An array containing data regarding suppliers.
    const [suppliersArr, setSuppliersArr] = useState([]); // An array containing data regarding suppliers.


    // 3. OTHER VARIABLES (FOR DEVICES):
    const [warrantyEndPeriod, setWarrantyEndPeriod] = useState(''); // Select (this week / this month / this year).
    const [warrantyEndPeriodArr, setWarrantyEndPeriodArr] = useState(['Any', 'A week from today', 'A month from today', 'A year from today']); // Select with multiple options (None / this month / this year).
    const [unInsuredDevices, setUnInsuredDevices] = useState(''); // Toggle (True / False).

    // A variable to retrieve data from the db:
    const db = fire.firestore();
    const auth = fire.auth();


    const handleCancel = () => {
        setOpenNewCard(false);
        clearInput();
    }

    const handleOk = () => {
        if (verifyInput()){
            handleAddCard();
            setOpenNewCard(false);
            clearInput();
        }
    }

    /**
     * A function in charge of determining whether the user's input is valid or not and accordingly return True / False.
     */
    const verifyInput = () => {
        var isValid = true;
        var errMessage = "";
        // First verifying the card details section:
        if (description === "" || color === "" || icon === "" || description.length < 2){
            isValid = false;
            errMessage = "Did you fill all the fields in the Card Details section?";
        } else if (owner.length === 0 && site.length === 0){
            isValid = false;
            errMessage = "Did you choose a site / owner?";
        } else if (cardsArr.filter(a => a.description.toLowerCase() === description.toLowerCase()).length > 0){
            isValid = false;
            errMessage = "The description you chose already exists!"
        }
        // Opening an alert in case the input isn't valid:
        if (!isValid){
            handleOpenAlert("error", errMessage);
            return false;
        } else {
            return true;
        }
    }

    /**
     * A function in charge of clearing the input received from the user.
     */
    const clearInput = () => {
        setSite('');
        setOwner('');
        setCategory('');
        setSupplier('');
        setStorage('');
        setWarrantyEndPeriod('');
        setDescription('');
        setIcon('');
        setColor('');
    }

    /**
     * A function in charge of retrieving the relevant details to creating a "card record", and then adding it to:
     * 1. Adding the "card record" we create to the db.
     * 2. Adding the "card record" we create to the list of cards that appear on our screen.
     * Assuming both additions ended ok, we will open a success alert to let the user know that the operation was successful.
     * Otherwise, we will open an error alert to let the user know that the operation wasn't successful.
     */
    const handleAddCard = () => {
        // Defining a path to our user's card collection {/users/(uid)/cards}:
        var docRef = db.collection("users").doc(auth.currentUser.uid).collection("cards");
        // Defining a "card record":
        var cardRec = {
            description: description,
            color: color,
            icon: icon.icon,
            site: site ? [...site.map(a => a.site)] : [],
            owner: owner ? [... owner.map(a => a.uid)] : [],
            category: [... category],
            supplier: [... supplier],
            storage: [... storage],
            warrantyEndPeriod: warrantyEndPeriod
        }
        // Attempting to add the card record to the db:
        docRef.
        add(cardRec)
        .then(function() {
            console.log("Document successfully written!");
            // Attempting to add the card record to the cardsArr:
            var tempArr = cardsArr;
            handleSetCardsArr([]);
            tempArr.push(cardRec);
            handleSetCardsArr(tempArr);
            handleOpenAlert("success", "Successfully added the card!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
            handleOpenAlert("error", "Failed to add the card!");
        });
    }


    /**
     * A function in charge of setting the cardsArr based on the received array.
     * @param {[cardRec]} arr - An array containing card records.
     */
    const handleSetCardsArr = (arr) => {
        setCardsArr(arr);
    }


    /**
     * A function in charge of setting the ownersArr based on the data retrieved from the db.
     * @param {[userRec]} arr - An array of user records.
     */
    const handleSetOwnersArr = (arr) => {
        setOwnersArr(arr);
    }

    /**
     * A function in charge of initializing an array containing all the sites and their "sub-arrays" data (categoriesArr, storagesArr).
     * @param {[siteRec]} arr 
     */
    const handleSetSitesArr = (arr) => {
        setSitesArr(arr);
    }

    /**
     * A function in charge of retrieving the owners array from the db.
     */
    const getOwnersArrFromDb = () => {
        var docRef = db.collection("users");
        docRef.get().then(function(querySnapshot){
            // Defining a temporary array in which we will store all the users we retrieve from the db:
            var tempArr = [];
            // Looping through all the retrieved users from the db:
            querySnapshot.forEach(function(doc){
                var data = doc.data();
                var userRec = {
                    uid: doc.id,
                    email: data.email,
                    fullName: data.fullName
                }
                // Pushing the user record we gathered from the db to temp array:
                tempArr.push(userRec);
            })
            // Setting the array:
            handleSetOwnersArr(tempArr);
        })
    }

    /**
     * A function in charge of setting the suppliersDict variable to the received dict.
     * @param {suppliersDict} dict - An array with the select data. 
     */
    const handleSetSuppliersDict = (dict) => {
        setSuppliersDict(dict);
    }

    /**
     * A function in charge of retrieving the suppliersArr from the db.
     */
    const getSuppliersArrFromDb = () => {
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

    const getSitesArrFromDb = () => {
        var docRef = db.collection("sites");
        docRef.get().then(function(querySnapshot){
            // Defining a temporary array in which we will store all the sites & the data we retrieve from the db:
            var tempArr = [];
            querySnapshot.forEach(function(doc){
                var data = doc.data();
                var siteRec = {
                    site: doc.id,
                    categories: data.categoriesArr,
                    storages: data.storageTypesArr
                }
                // Pushing the user record we gathered from the db to temp array:
                tempArr.push(siteRec);
            })
            // Setting the array:
            handleSetSitesArr(tempArr);
        })
    }

    /**
     * A function in charge of initializing our different arrays data (fetching data from the db) as soon as this component loads.
     */
    useEffect(() => {
        getOwnersArrFromDb();
        getSitesArrFromDb();
        getSuppliersArrFromDb();
    }, []);

    const handleResetStorages = () => {
        setStorage('');
        setStoragesArr([]);
    }

    const handleResetCategories = () => {
        setCategory('');
        setCategoriesArr([]);
    }

    const handleResetSuppliers = () => {
        setSupplier('');
        setSuppliersArr([]);
    }

    /**
     * A function in charge of setting the categoriesArr & storagesArr based on the recieved "option".
     * We have 2 cases:
     * 1. Only 1 site was selected - meaning that we should initiate the categoreisArr & the storagesArr accordingly.
     * 2. More than 1 site was selected - we should set both arrays to be empty.
     * @param {[siteRec]} option - An array of site records.
     */
    const handleSetSite = (option) => {
        // Setting the site variable to the received option:
        setSite(option);
        
        if (option.length === 1){
            setCategoriesArr(option[0].categories);
            setStoragesArr(option[0].storages);
            setSuppliersArr(suppliersDict[option[0].site] ? suppliersDict[option[0].site] : []);
        } else {
            handleResetStorages();
            handleResetCategories();
            handleResetSuppliers();
        }
    }

    return (
        <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}>
            <DialogTitle id="form-dialog-title">Create A New Card</DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1" color="textPrimary" style={{textAlign: 'left', marginTop: '-1vh'}}>Card Details:</Typography>
                {/* Start of "MUST FILL" parameters part. */}
                {/* Start of Card Description Section */}
                <Grid container item spacing={3} alignItems="flex-end">
                    <Grid item xs={1}>
                        <TextFieldsIcon />
                    </Grid>
                    <Grid item item xs={11}>
                        {
                            description && description.length < 2 ? (
                                <TextField
                                    style={{width: '95%', marginBottom: '0.5vh'}}
                                    required
                                    error
                                    helperText="Description should be at least 2 characters."
                                    id="input-card-description"
                                    label="Card Description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            ) : (
                                <TextField
                                    style={{width: '95%', marginBottom: '0.5vh'}}
                                    required
                                    id="input-card-description"
                                    label="Card Description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                />
                            )
                        }
                    </Grid>
                </Grid>
                {/* End of Card Description Section */}
                {/* Start of Card Color Section */}
                <Grid container item spacing={3} alignItems="flex-end">
                    <Grid item xs={1}>
                        <PaletteIcon />
                    </Grid>
                    <Grid item item xs={5}>
                        <FormControl className={classes.formControl}>
                            <InputLabel required id="color-label">Color</InputLabel>
                            <Select
                            labelId="color-label"
                            id="color-select"
                            value={color}
                            onChange={event => setColor(event.target.value)}
                            >
                                <MenuItem value={"success"} style={{color: 'green'}}>Green</MenuItem>
                                <MenuItem value={"warning"} style={{color: 'orange'}}>Orange</MenuItem>
                                <MenuItem value={"info"} style={{color: 'cyan'}}>Cyan</MenuItem>
                                <MenuItem value={"danger"} style={{color: 'red'}}>Red</MenuItem>
                                <MenuItem value={"primary"} style={{color: 'purple'}}>Purple</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* End of Card Color Section */}
                    {/* Start of Card Icon Section */}
                    <Grid item xs={1}>
                        <ExtensionIcon />
                    </Grid>
                    <Grid item item xs={5}>
                        <FormControl className={classes.formControl}>
                            <InputLabel required id="select-icon-label">Card Icon</InputLabel>
                            <Select
                                labelId="select-icon-label"
                                id="select-icon-supplier"
                                value={icon}
                                style={{maxHeight: '32px'}}
                                renderValue={(option) => (
                                    <Icon>{option.icon}</Icon>
                                )}
                                onChange={(event) => {setIcon(event.target.value)}}
                                input={<Input />}
                            >
                                {
                                    iconsArr.map((option, index) => (
                                        <MenuItem value={option} key={index}>
                                            <ListItemIcon>
                                                <Icon>{option.icon}</Icon>
                                            </ListItemIcon>
                                            <ListItemText primary={option.description}/>
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {/* End of Card Icon Section */}
                </Grid>
            {/* End of "MUST FILL" part. */}
            <Divider style={{marginTop: '2vh'}} light/>

            {/* Start of "SITE RELATED" parameters part. */}
            <Typography variant="subtitle1" color="textPrimary" style={{marginTop:'1vh', marginBottom: '-3vh', textAlign: 'left'}}>Card Content:</Typography>
            {/* Start of 1st row on Card Content */}
            <Grid container item spacing={3} alignItems="flex-end">
                {/* Start of Owner Section */}
                <Grid item xs={1}>
                    <PersonIcon />
                </Grid>
                <Grid item item xs={5}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={ownersArr} isMultiple={true} handleSetNewVal={setOwner} tfLabel="Owner" isDisabled={site.length > 0} />
                </Grid>
                {/* End of Owner Section */}
                {/* Start of Site Section */}
                <Grid item xs={1}>
                    <PlaceIcon />
                </Grid>
                <Grid item item xs={5}>                    
                    <GenerateAutoComplete acID="checkboxes-sites" valuesArr={sitesArr} isMultiple={true} handleSetNewVal={handleSetSite} tfLabel="Site" isDisabled={owner.length > 0} />
                </Grid>
                {/* End of Site Section */}
            </Grid>
            {/* Start of 2nd row on Card Content */}
            <Grid container item spacing={3} alignItems="flex-end">
                {/* Start of Storage Section */}
                <Grid item xs={1}>
                    <BubbleChartIcon />
                </Grid>
                <Grid item item xs={5}>
                    <GenerateAutoComplete acID="checkboxes-storages" valuesArr={storagesArr} isMultiple={true} handleSetNewVal={setStorage} tfLabel="Storage" isDisabled={storagesArr.length === 0 || owner.length > 0 || category.length > 0 || supplier.length > 0} />
                </Grid>
                {/* End of Storage Section */}
                {/* Start of Category Section */}
                <Grid item xs={1}>
                    <DevicesOtherIcon />
                </Grid>
                <Grid item item xs={5}>
                    <GenerateAutoComplete acID="checkboxes-categories" valuesArr={categoriesArr} isMultiple={true} handleSetNewVal={setCategory} tfLabel="Category" isDisabled={categoriesArr.length === 0 || owner.length > 0 || storage.length > 0 || supplier.length > 0} />
                </Grid>
                {/* End of Category Section */}
            </Grid>
            {/* Start of 3rd row on Card Content */}
            <Grid container item spacing={3} alignItems="flex-end">
                {/* Start of Supplier Section */}
                <Grid item xs={1}>
                    <LocalShippingIcon />
                </Grid>
                <Grid item item xs={5}>
                    <GenerateAutoComplete acID="checkboxes-suppliers" valuesArr={suppliersArr} isMultiple={true} handleSetNewVal={setSupplier} tfLabel="Supplier" isDisabled={suppliersArr.length === 0  || owner.length > 0 || category.length > 0 || storage.length > 0} />
                </Grid>
                {/* End of Supplier Section */}
                {/* Start of Warranty End Period Section */}
                <Grid item xs={1}>
                    <ScheduleIcon />
                </Grid>
                <Grid item item xs={5}>
                    <GenerateAutoComplete acID="checkboxes-warrantyEnd" valuesArr={warrantyEndPeriodArr} isMultiple={false} handleSetNewVal={setWarrantyEndPeriod} tfLabel="Warranty End Period" isDisabled={false} />
                </Grid>
                {/* End of Warranty End Period Section */}
            </Grid>
            {/* End of Card Content part. */}
            <Divider style={{marginTop: '2vh'}} light/>
            {/* End of Dialog Content */}
            </DialogContent>
            {/* Start of Dialog Actions */}
            <DialogActions>
            <Button onClick={handleCancel} color="primary">
                Cancel
            </Button>
            <Button onClick={handleOk} color="primary">
                Add
            </Button>
            </DialogActions>
        </Dialog>
    )
}