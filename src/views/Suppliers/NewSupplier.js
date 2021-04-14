import React, { useState, useEffect } from "react";
import { useReactToPrint } from 'react-to-print';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import NewSupplierTable from './NewSupplierTable.js';
import { TextFields, LocationOn, Build, Explore, Assignment, EmojiSymbols } from '@material-ui/icons'; // Icons
import Autocomplete from '@material-ui/lab/Autocomplete';
import fire from '../../fire.js';

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
        minWidth: '50vw',
        maxWidth: '50vw',
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
        marginLeft: theme.spacing(2), 
    },
    selectGridItem: {
        marginRight: theme.spacing(-5),
    }
  }),
);

export default function NewSupplier(props){
    const {formTitle, open, setOpen, sitesArr, handleOpenAlert, handleAddSupplierTable} = props;
    const classes = useStyles();

    // Form Variables Definition:
    const [supplierName, setSupplierName] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [supplierSla, setSupplierSla] = useState('');
    const [supplierTin, setSupplierTin] = useState('');
    const [supplierSite, setSupplierSite] = useState('');
    const [supplierServiceType, setSupplierServiceType] = useState('');
    const [supplierContacts, setSupplierContacts] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOk = () => {
        // console.log("NAME: ", supplierName)
        // console.log("ADDRESS: ", supplierAddress)
        // console.log("SLA: ", supplierSla)
        // console.log("TIN: ", supplierTin)
        // console.log("SITE: ", supplierSite)
        // console.log("SERVICE TYPE: ", supplierServiceType)
        // console.log("CONTACTS: ", supplierContacts)
        if (!validateSupplier()){
            if (supplierSite && supplierServiceType){
                handleOpenAlert("error", "Ooops, something went wrong. Did you remember to include at least 1 contact?");
            } else {
                handleOpenAlert("error", "Please make sure that you select a valid site and service type.");
            }
        } else {
            handleAddSupplier();
            clearFields();
            setOpen(false);
        }
    };

    /**
     * A function in charge of validating the user's input before attempting to add it to our DB.
     */
    const validateSupplier = () => {
        return supplierName.length >= 2 && supplierAddress.length >= 2 && supplierSla.length >= 4 && supplierTin.length >= 4
        && supplierSite && supplierServiceType && supplierContacts.length > 0
    }

    const clearFields = () => {
        setSupplierName('');
        setSupplierAddress('');
        setSupplierSla('');
        setSupplierTin('');
        setSupplierSite('');
        setSupplierServiceType('');
        setSupplierContacts([]);
    }

    const handleAddSupplier = () => {
        const db = fire.firestore();
        var supplierRec = {
            supplierName: supplierName,
            supplierAddress: supplierAddress,
            supplierSla: supplierSla,
            supplierTin: supplierTin,
            supplierSite: supplierSite.siteId,
            supplierServiceType: supplierServiceType,
            supplierContacts: supplierContacts.map(cont => {
                return {name: cont.name, phone: cont.phone, email: cont.email};
            }),
        };
        db.collection('suppliers')
        .add(supplierRec)
        .then((docRef) => {
            supplierRec.supplierId = docRef.id;
            // Adding the supplier to the suppliers table:
            handleAddSupplierTable(supplierRec);
            // Letting the user know that the operation was successful:
            handleOpenAlert("success", "Successfully created the supplier!");
        })
        .catch((error) => {
            // Letting the user know that the operation wasn't successful:
            handleOpenAlert("error", "Failed to create the supplier!");
        });
    }

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}
        >
        <DialogTitle id="form-dialog-title"  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{formTitle}</DialogTitle>
        <DialogContent>
            <Grid container spacing={3}>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <TextFields style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Supplier Name" style={{width: '85%'}}>
                        {
                            supplierName && supplierName.length < 2 ? (
                                <TextField error helperText="The supplier's name is too short" id="outlined-supplierName" label="Name" variant="outlined" style={{width: '100%'}} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} />
                            ) : (
                                <TextField id="outlined-supplierName" label="Name" variant="outlined" style={{width: '100%'}} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} />
                            )
                        }
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <LocationOn style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Supplier Address" style={{width: '85%'}}>
                        {
                            supplierAddress && supplierAddress.length < 2 ? (
                                <TextField error helperText="The supplier's address is too short" id="outlined-supplierAddress" label="Address" variant="outlined" style={{width: '100%'}} value={supplierAddress} onChange={(event) => setSupplierAddress(event.target.value)} />
                            ) : (
                                <TextField id="outlined-supplierAddress" label="Address" variant="outlined" style={{width: '100%'}} value={supplierAddress} onChange={(event) => setSupplierAddress(event.target.value)} />
                            )
                        }
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Assignment style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Service Level Agreement" style={{width: '85%'}}>
                        {
                            supplierSla && supplierSla.length < 4 ? (
                                <TextField error helperText="The supplier's SLA is too short" id="outlined-supplierSla" label="SLA" variant="outlined" style={{width: '100%'}} value={supplierSla} onChange={(event) => setSupplierSla(event.target.value)} />
                            ) : (
                                <TextField id="outlined-supplierSla" label="SLA" variant="outlined" style={{width: '100%'}} value={supplierSla} onChange={(event) => setSupplierSla(event.target.value)} />
                            )
                        }
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <EmojiSymbols style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Taxpayer Identification Numbers"  style={{width: '85%'}}>
                        {
                            supplierTin && supplierTin.length < 4 ? (
                                <TextField error helperText="The supplier's TIN is too short" id="outlined-supplierTin" label="TIN" variant="outlined" style={{width: '100%'}} value={supplierTin} onChange={(event) => setSupplierTin(event.target.value)} />
                            ) : (
                                <TextField id="outlined-supplierTin" label="TIN" variant="outlined" style={{width: '100%'}} value={supplierTin} onChange={(event) => setSupplierTin(event.target.value)} />
                            )
                        }
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Explore style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Associated Site" style={{width: '85%'}}>
                        {

                        }
                        <Autocomplete
                            id="site-autocomplete"
                            options={sitesArr}
                            freeSolo
                            getOptionLabel={(option) => option.siteName}
                            style={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Site" variant="outlined" />}
                            onChange={(event, newVal) => {setSupplierSite(newVal)}}
                        />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Build style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Supplier's Service Type" style={{width: '85%'}}>
                        <Autocomplete
                            id="service-type-autocomplete"
                            options={['Technician', 'Consultant', 'Delivery', 'Repair Lab']}
                            freeSolo
                            style={{ width: '100%' }}
                            renderInput={(params) => <TextField {...params} label="Service Type" variant="outlined" />}
                            onChange={(event, newVal) => {setSupplierServiceType(newVal)}}
                        />
                    </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <NewSupplierTable title="Contacts Table" headerBackground="#3374FF" data={supplierContacts} setData={setSupplierContacts}/>
                </Grid>
            </Grid>
        </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleOk} color="primary">
                Add
            </Button>
            </DialogActions>
    </Dialog>
    )
  }

