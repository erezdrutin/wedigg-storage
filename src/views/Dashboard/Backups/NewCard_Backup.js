import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { IconPicker } from 'react-fa-icon-picker';

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
        width: '60vh',
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
        width: '88%',
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
    const { acID, valuesArr, isMultiple, handleSetNewVal, tfLabel } = props;
    return (
        <React.Fragment>
            {
                isMultiple ? (
                <FormControl variant="standard" className={classes.formControlAutoComplete}>
                    <Autocomplete
                        multiple
                        limitTags={1}
                        id={acID}
                        options={valuesArr}
                        onChange={(event, newVal) => {handleSetNewVal(newVal)}}
                        disableCloseOnSelect
                        freeSolo
                        getOptionLabel={(option) => option}
                        renderOption={(option, { selected }) => (
                        <React.Fragment>
                            <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                            checkedIcon={<CheckBoxIcon fontSize="small" />}
                            style={{ marginRight: 8 }}
                            checked={selected}
                            />
                            {
                                acID.includes("site") ? option.site : option
                            }
                        </React.Fragment>
                        )}
                        renderInput={(params) => (
                        <TextField {...params} variant="standard" label={tfLabel} placeholder="" />
                        )}
                    />
                </FormControl>
                ) : (
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            limitTags={1}
                            id={acID}
                            options={valuesArr}
                            onChange={(event, newVal) => {handleSetNewVal(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
                            renderOption={(option, { selected }) => (
                            <React.Fragment>
                                <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                />
                                {
                                    acID.includes("site") ? option.site : option
                                }
                            </React.Fragment>
                            )}
                            renderInput={(params) => (
                            <TextField {...params} variant="standard" label={tfLabel} placeholder="" />
                            )}
                        />
                    </FormControl>
                )
            }
            
        </React.Fragment>
    )
}

export default function NewCard(props){
    const classes = useStyles();
    const { open, handleCancel, handleOk} = props;
    // Variables Definition:
    // 1. MUST FILL VARIABLES:
    const [title, setTitle] = useState(''); // Simple TextField
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
    const [sitesData, setSitesData] = useState([]); // An array containing data regarding sites, storages, categories and suppliers.
    // EXTRAS (FOR DEVICES):
    const [owner, setOwner] = useState(''); // AutoComplete (allow multiple owners).
    const [storage, setStorage] = useState(''); // AutoComplete (allow multiple storages).
    const [category, setCategory] = useState(''); // AutoComplete (allow multiple categories).
    const [supplier, setSupplier] = useState(''); // Select (1 Supplier).
    const [ownersArr, setOwnersArr] = useState(['test', 'test2']); // An array containing data regarding users.
    const [storagesArr, setStoragesArr] = useState(['test', 'test2']); // An array containing data regarding storages.
    const [categoriesArr, setCategoriesArr] = useState(['test', 'test2']); // An array containing data regarding categories.
    const [suppliersArr, setSuppliersArr] = useState(['test', 'test2']); // An array containing data regarding suppliers.

    // 3. OTHER VARIABLES (FOR DEVICES):
    const [warrantyEndPeriod, setWarrantyEndPeriod] = useState(''); // Select (this week / this month / this year).
    const [warrantyEndPeriodArr, setWarrantyEndPeriodArr] = useState(['Ends this week', 'Ends this month', 'Ends this year']); // Select with multiple options (None / this month / this year).
    const [unInsuredDevices, setUnInsuredDevices] = useState(''); // Toggle (True / False).

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
                <Grid container item spacing={3} alignItems="flex-end">
                    <Grid item xs={1}>
                        <TitleIcon />
                    </Grid>
                    <Grid item item xs={5}>
                        <TextField required id="input-card-title" label="Card Title" />
                    </Grid>
                    <Grid item xs={1}>
                        <TextFieldsIcon />
                    </Grid>
                    <Grid item item xs={5}>
                        <TextField required id="input-card-description" label="Card Description" />
                    </Grid>
                </Grid>

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

                        {/* <div className={classes.horDiv}> */}
                            {/* <Typography variant="body1" style={{marginRight: '2vh'}} color="textSecondary">Card Icon * </Typography> */}
                            
                            {/* <Select>
                                <MenuItem value="">
                                <ListItemIcon>
                                    <Icon>{"tv"}</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Inbox" />
                                </MenuItem>
                            </Select> */}

                            {/* <IconPicker value={icon} onChange={(v) => setIcon(v)} /> */}
                        {/* </div> */}
                    </Grid>
                </Grid>
            {/* End of "MUST FILL" part. */}
            <Divider style={{marginTop: '2vh'}} light/>
            {/* Start of "SITE RELATED" parameters part. */}
            <Typography variant="subtitle1" color="textPrimary" style={{marginTop:'1vh', marginBottom: '-3vh', textAlign: 'left'}}>Card Content:</Typography>
            {/* Start of 1st row on Card Content */}
            <Grid container item spacing={3} alignItems="flex-end">
                <Grid item xs={1}>
                    <PersonIcon />
                </Grid>
                <Grid item item xs={5}>
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            multiple
                            limitTags={1}
                            id="checkboxes-owners"
                            options={ownersArr}
                            onChange={(event, newVal) => {setOwner(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
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
                            <TextField {...params} variant="standard" label="Owner" placeholder="" />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <PlaceIcon />
                </Grid>
                <Grid item item xs={5}>                    
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            multiple
                            limitTags={1}
                            id="checkboxes-sites"
                            options={sitesArr}
                            onChange={(event, newVal) => {setSite(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
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
                            <TextField {...params} variant="standard" label="Site" placeholder="" />
                            )}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            {/* Start of 2nd row on Card Content */}
            <Grid container item spacing={3} alignItems="flex-end">
                <Grid item xs={1}>
                    <BubbleChartIcon />
                </Grid>
                <Grid item item xs={5}>
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            multiple
                            limitTags={1}
                            id="checkboxes-storages"
                            options={storagesArr}
                            onChange={(event, newVal) => {setStorage(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
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
                            <TextField {...params} variant="standard" label="Storage" placeholder="" />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <DevicesOtherIcon />
                </Grid>
                <Grid item item xs={5}>
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            multiple
                            limitTags={1}
                            id="checkboxes-categories"
                            options={categoriesArr}
                            onChange={(event, newVal) => {setCategory(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
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
                            <TextField {...params} variant="standard" label="Category" placeholder="" />
                            )}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            {/* Start of 3rd row on Card Content */}
            <Grid container item spacing={3} alignItems="flex-end">
                <Grid item xs={1}>
                    <LocalShippingIcon />
                </Grid>
                <Grid item item xs={5}>
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            multiple
                            limitTags={1}
                            id="checkboxes-suppliers"
                            options={suppliersArr}
                            onChange={(event, newVal) => {setSupplier(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
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
                            <TextField {...params} variant="standard" label="Supplier" placeholder="" />
                            )}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={1}>
                    <ScheduleIcon />
                </Grid>
                <Grid item item xs={5}>
                    <FormControl variant="standard" className={classes.formControlAutoComplete}>
                        <Autocomplete
                            limitTags={1}
                            id="checkboxes-warrantyEnd"
                            options={warrantyEndPeriodArr}
                            onChange={(event, newVal) => {setWarrantyEndPeriod(newVal)}}
                            disableCloseOnSelect
                            freeSolo
                            getOptionLabel={(option) => option}
                            renderOption={(option, { selected }) => (
                            <React.Fragment>
                                <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                                checkedIcon={<CheckBoxIcon fontSize="small" />}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                />
                                {option}
                            </React.Fragment>
                            )}
                            renderInput={(params) => (
                            <TextField {...params} variant="standard" label="Warranty End Period" placeholder="" />
                            )}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            {/* End of Card Content part. */}
            <Divider style={{marginTop: '2vh'}} light/>

            </DialogContent>
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