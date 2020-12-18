import React, { useState } from 'react';
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

import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
  const { open, setOpen, name, setName, handleOk } = props;

  // Variables Definition:
  //const [name, setName] = useState(''); // TextField
  const [address, setAddress] = useState(''); // TextField
  const [serviceType, setServiceType] = useState(''); // Select
  const [site, setSite] = useState(''); // Select
  const [sla, setSla] = useState(''); // TextField
  const [tin, setTin] = useState(''); // TextField
  const [notes, setNotes] = useState(''); // Expandable TextField
  const [sitesArr, setSitesArr] = useState(['Israel', 'UK', 'USA', 'Ukraine']);
  const [serviceTypeArr, setServiceTypeArr] = useState(['Products', 'Products & Lab', 'Lab', 'On Site Service']);
  const [openServiceTypeDialog, setOpenServiceTypeDialog] = useState(false); // Pop up to add a new storage type


  // --------------------------Add Service Type Stuff----------------------------------
  const handleCloseServiceTypeDialog = () => {
    setOpenServiceTypeDialog(false);
  }

  const handleOkServiceTypeDialog = () => {
    // Add the new value to the array of storage-types:
    serviceTypeArr.push(serviceType);
    // Then add the new value to the DB:

    // At last, close the new storage-type dialog:
    setOpenServiceTypeDialog(false);
  }
    
  const handleOpenServiceTypeDialog = () => {
    setOpenServiceTypeDialog(true);
  }
  // ----------------------------------------------------------------------------------
  
  // ----------------------Handle New Supplier Dialog Options--------------------------
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  // ----------------------------------------------------------------------------------

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
            {/* Supplier Name */}
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
            {/* Supplier Address */}
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
        <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '-15px'}}>
            {/* Supplier Service Type */}
            <Grid item style={{marginBottom: '5px', marginRight: '-10px'}}>
                <BuildIcon />
            </Grid>
            <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="select-supplier-service-type-label">Service Type</InputLabel>
                    <Select
                        labelId="select-supplier-service-type-label"
                        id="select-supplier-service-type"
                        value={serviceType}
                        onChange={(event) => setServiceType(event.target.value)}
                        input={<Input />}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    {serviceTypeArr.map((option, index) => (
                        <MenuItem key={"supplierServiceTypeArr", index+1} value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className={classes.plusButton}>
                <IconButton aria-label="add-storage-type" onClick={handleOpenServiceTypeDialog}>
                    <AddCircleOutline />
                </IconButton>
            </Grid>
            {/* Supplier Site */}
            <Grid item style={{marginLeft: '-50px', marginBottom: '5px', marginRight: '-10px'}}>
                <LocationOnIcon />
            </Grid>
            <Grid item xs={4} className={classes.selectGridItem}>
                <FormControl className={classes.formControlSecondSelect}>
                    <InputLabel id="select-supplier-site-label">Site</InputLabel>
                    <Select
                        labelId="select-supplier-site-label"
                        id="select-supplier-site"
                        value={site}
                        onChange={(event) => setSite(event.target.value)}
                        input={<Input />}
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                    {sitesArr.map((option, index) => (
                        <MenuItem key={"SupplierSitesArr", index+1} value={option}>{option}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item className={classes.secondPlusButton}>
                <IconButton aria-label="add-storage-type" onClick={handleOpenServiceTypeDialog}>
                    <AddCircleOutline />
                </IconButton>
            </Grid>
        </Grid>

        {/* ---- Fourth Row ---- */}
        <Grid container item spacing={3}>
            {/* Product Serial */}
            <Grid item xs={12}>
                <TextField
                    style={{width: '96%', marginTop: '20px'}}
                    id="text-field-device-notes"
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

        { /* Service Type Dialog Box */}
        <Dialog open={openServiceTypeDialog} onClose={handleCloseServiceTypeDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add a new Service Type</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="new-storage-type-text-field"
                label="Storage Type"
                type="text"
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseServiceTypeDialog} color="primary">
                Cancel
            </Button>
            <Button onClick={handleOkServiceTypeDialog} color="primary">
                Add
            </Button>
            </DialogActions>
        </Dialog>
    </Dialog>
  );
}
