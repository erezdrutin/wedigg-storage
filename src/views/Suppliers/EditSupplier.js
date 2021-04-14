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

export default function EditSupplier(props){
    const {formTitle, open, setOpen, sitesArr, handleOpenAlert, currentSupplier, handleUpdateSupplier} = props;
    const classes = useStyles();

    // Form Variables Definition:
    const [supplierName, setSupplierName] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [supplierSla, setSupplierSla] = useState('');
    const [supplierTin, setSupplierTin] = useState('');
    const [supplierSite, setSupplierSite] = useState('');
    const [supplierServiceType, setSupplierServiceType] = useState('');
    const [supplierContacts, setSupplierContacts] = useState([]);

    // A function which will run as soon as the page loads:
    useEffect(() => {
        setSupplierName(currentSupplier.supplierName);
        setSupplierAddress(currentSupplier.supplierAddress);
        setSupplierSla(currentSupplier.supplierSla);
        setSupplierTin(currentSupplier.supplierTin);
        setSupplierSite(sitesArr.filter(s => s.siteId === currentSupplier.supplierSite)[0]);
        setSupplierServiceType(currentSupplier.supplierServiceType);
        var contactsConverted = currentSupplier.supplierContacts ? currentSupplier.supplierContacts.map(x => {return {'name': x.name, 'phone': x.phone, 'email': x.email}}) : [];
        setSupplierContacts(contactsConverted)
    }, [currentSupplier]);

    /**
     * A function in charge of clearing the different fields as soon as we're done with the pop up.
     */
    useEffect(() => {
        return clearFields();
    }, [])

    const handleClose = () => {
        setOpen(false);
    };

    /**
     * A function in charge of confirming the edit of the supplier.
     */
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
            handleEditSupplier();
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

    /**
     * A function in charge of clearing the different fields of the pop up.
     */
    const clearFields = () => {
        setSupplierName('');
        setSupplierAddress('');
        setSupplierSla('');
        setSupplierTin('');
        setSupplierContacts([]);
    }

    /**
     * A function in charge of handling the Edit Supplier operation.
     * 1. Editing the supplier record in the DB.
     * 2. Removing the existing record from our table and replacing it with the "new" (edited) one.
     * 3. Alerting the user with a success / failure bar.
     */
    const handleEditSupplier = () => {
        const db = fire.firestore();
        var docRef = db.collection('suppliers').doc(currentSupplier.supplierId);
        
        var supContactsArr = supplierContacts.map(cont => {
            return {name: cont.name, phone: cont.phone, email: cont.email};
        });

        var supplierRec = {
            ...(supplierAddress !== currentSupplier.supplierAddress && {supplierAddress: supplierAddress}),
            ...(supplierSla !== currentSupplier.supplierSla && {supplierSla: supplierSla}),
            ...(supplierSite.siteId !== currentSupplier.supplierSite && {supplierSite: supplierSite.siteId}),
            ...(supplierServiceType !== currentSupplier.supplierServiceType && {supplierServiceType: supplierServiceType}),
            supplierContacts: supContactsArr
        }

        // console.log("TEST EDIT SUP: ", supplierRec);

        var addSupplierRec = {
            supplierId: currentSupplier.supplierId,
            supplierName: supplierName,
            supplierAddress: supplierAddress,
            supplierSla: supplierSla,
            supplierTin: supplierTin,
            supplierSite: supplierSite.siteId,
            supplierServiceType: supplierServiceType,
            supplierContacts: supContactsArr,
        };

        docRef.update(supplierRec)
        .then(() => {
            // Updating the supplier record in the suppliers table:
            handleUpdateSupplier(addSupplierRec);
            // Letting the user know that the operation was successful:
            handleOpenAlert("success", "Successfully edited the supplier!");
        })
        .catch((error) => {
            // Letting the user know that the operation wasn't successful:
            handleOpenAlert("error", "Failed to edit the supplier!");
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
                        <TextField disabled id="outlined-supplierName" label="Name" variant="outlined" style={{width: '100%'}} value={supplierName} onChange={(event) => setSupplierName(event.target.value)} />
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
                        <TextField disabled id="outlined-supplierTin" label="TIN" variant="outlined" style={{width: '100%'}} value={supplierTin} onChange={(event) => setSupplierTin(event.target.value)} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Explore style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Associated Site" style={{width: '85%'}}>
                        <Autocomplete
                            id="site-autocomplete"
                            options={sitesArr}
                            value={supplierSite}
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
                            value={supplierServiceType}
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

