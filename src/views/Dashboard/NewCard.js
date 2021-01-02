import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { IconPicker } from 'react-fa-icon-picker';
import fire from '../../fire.js';

import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, Input, Select, InputLabel, MenuItem, FormControl, Typography, Divider, Checkbox, ListItemIcon, ListItemText } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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

const useStyles = makeStyles((theme) =>
  createStyles({
    horDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        float: 'left',
        marginLeft: theme.spacing(1),
    },
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
        height: '65vh',
        width: '70vh',
        textAlign: 'center',
    },
    formControl: {
        margin: theme.spacing(1),
        width: '88%',
    },
    formControlSecondInSelectRow: {
        margin: theme.spacing(1),
        width: '115%',
    },
    formControlSelect:{
        margin: theme.spacing(1),
        width: '60%',
    },
    formControlAutoComplete:{
        margin: theme.spacing(1),
        width: '88%'
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

function GenerateAutoComplete(props) {
    const classes = useStyles();
    const { acID, valuesArr, isMultiple, handleSetNewVal, tfLabel, isDisabled } = props;

    /**
     * A function in charge of returning a label (which will be presented in the AutoComplete TextField) that represents a certain option.
     * @param {{*}} option - An option ({} / [] / string) representing a field.
     */
    const retrieveOptionLabel = (option) => {
        if (acID.includes("site")){
            return option.site;
        } else if (acID.includes("owner")){
            return option.fullName;
        } else {
            return option;
        }
    }

    /**
     * A function in charge of returning a label (which will be presented in the AutoComplete dropdown list) that represents a certain option.
     * @param {{*}} option - An option ({} / [] / string) representing a field.
     */
    const retrieveOptionLabelList = (option) => {
        if (acID.includes("site")){
            return option.site;
        } else if (acID.includes("owner")){
            return option.fullName + " | " + option.email.split("@")[0] + "@...";
        } else {
            return option;
        }
    }

    return (
        <React.Fragment>
            {
                <FormControl variant="standard" className={classes.formControlAutoComplete}>
                    <Autocomplete
                        multiple={isMultiple}
                        limitTags={1}
                        key={valuesArr.length}
                        disabled={isDisabled}
                        id={acID}
                        options={valuesArr}
                        onChange={(event, newVal) => {handleSetNewVal(newVal)}}
                        disableCloseOnSelect
                        freeSolo
                        getOptionLabel={(option) => retrieveOptionLabel(option)}
                        renderOption={(option, { selected }) => (
                        <React.Fragment>
                            <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            />
                            {
                                retrieveOptionLabelList(option)
                            }
                        </React.Fragment>
                        )}
                        renderInput={(params) => (
                        <TextField {...params} variant="standard" size="small" label={tfLabel} placeholder=""/>
                        )}
                    />
                </FormControl>
            }
            
        </React.Fragment>
    )
}

export default function NewCard(props){
    const classes = useStyles();
    const { open, handleCancel, handleOk} = props;
    // Variables Definition:
    // 1. MUST FILL VARIABLES:
    const [description, setDescription] = useState(''); // Simple TextField
    const [color, setColor] = useState(''); // Simple TextField
    const [icon, setIcon] = useState(''); // Simple TextField
    const [subject, setSubject] = useState(''); // Select between Device / Site / Supplier / Storage.

    const [iconsArr, setIconsArr] = useState([
        {"icon": "verified", "description": "Success"},
        {"icon": "warning", "description": "Warning"},
        {"icon": "schedule_icon", "description": "Clock"},
        {"icon": "calendar_today", "description": "Calendar"},
        {"icon": "build", "description": "Lab"},
        {"icon": "grade", "description": "Important"},
        {"icon": "tv", "description": "TV"},
        {"icon": "phone_iphone", "description": "Phone"},
        {"icon": "tablet_mac", "description": "Tablet"},
        {"icon": "computer", "description": "Laptop"},
        {"icon": "phonelink", "description": "Devices"},
        {"icon": "location_on", "description": "Location"},
        {"icon": "storage", "description": "Storage"},
        {"icon": "cloud", "description": "Cloud"},
        {"icon": "headset", "description": "Earphones"},
        {"icon": "all_inbox", "description": "Drawer"},
        {"icon": "account_box", "description": "Person"},
        {"icon": "supervisor_account", "description": "People"},
        {"icon": "explore", "description": "Explore"},
        {"icon": "category", "description": "Category"},
        {"icon": "local_shipping", "description": "Delivery"},
        {"icon": "storefront", "description": "Supplier"},
        {"icon": "delete", "description": "Trash"},
    ])

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
    const [suppliersArr, setSuppliersArr] = useState(['test', 'test2']); // An array containing data regarding suppliers.

    // 3. OTHER VARIABLES (FOR DEVICES):
    const [warrantyEndPeriod, setWarrantyEndPeriod] = useState(''); // Select (this week / this month / this year).
    const [warrantyEndPeriodArr, setWarrantyEndPeriodArr] = useState(['Any', 'A week from today', 'A month from today', 'A year from today']); // Select with multiple options (None / this month / this year).
    const [unInsuredDevices, setUnInsuredDevices] = useState(''); // Toggle (True / False).

    // A variable to retrieve data from the db:
    const db = fire.firestore();

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
        console.log("HI erez")
    }, []);

    const handleResetStorages = () => {
        setStorage('');
        setStoragesArr([]);
    }

    const handleResetCategories = () => {
        setCategory('');
        setCategoriesArr([]);
    }

    /**
     * A function in charge of setting the categoriesArr & storagesArr based on the recieved "option".
     * We have 2 cases:
     * 1. Only 1 site was selected - meaning that we should initiate the categoreisArr & the storagesArr accordingly.
     * 2. More than 1 site was selected - we should set both arrays to be empty.
     * @param {[siteRec]} option - An array of site records.
     */
    const handleSetSite = (option) => {
        console.log("STO", storage)
        console.log("CAT", category)
        // Setting the site variable to the received option:
        setSite(option);
        if (option.length === 1){
            setCategoriesArr(option[0].categories);
            setStoragesArr(option[0].storages);
        } else {
            handleResetStorages();
            handleResetCategories();
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
                        <TextField style={{width: '95%', marginBottom: '0.5vh'}} required id="input-card-description" label="Card Description" />
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
                                <MenuItem value={"#74B66A"} style={{color: 'green'}}>Green</MenuItem>
                                <MenuItem value={"#F2A641"} style={{color: 'orange'}}>Orange</MenuItem>
                                <MenuItem value={"#60CFEA"} style={{color: 'cyan'}}>Cyan</MenuItem>
                                <MenuItem value={"#E26556"} style={{color: 'red'}}>Red</MenuItem>
                                <MenuItem value={"#A137BE"} style={{color: 'purple'}}>Purple</MenuItem>
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