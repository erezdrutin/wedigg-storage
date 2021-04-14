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
import NewSiteTable from './NewSiteTable.js';
import fire from '../../fire.js';
import { storage } from "firebase";

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
        minHeight: '50vh',
        maxHeight: '80vh',
        minWidth: '50vh',
        maxWidth: '80vh',
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

export default function NewSite(props){
    // Variables Definition:
    const {formTitle, open, setOpen, data, setData, handleOpenAlert} = props;
    const classes = useStyles();
    const [siteName, setSiteName] = useState('');
    const [siteLocation, setSiteLocation] = useState('');
    const [storagesArr, setStoragesArr] = useState([]);


    const handleClose = () => {
        setOpen(false);
    };

    /**
     * A function in charge of handling a click on the "ADD" button on the add site dialog.
     * Either prompting the user with the mistake they made in case any of the inputs is invalid
     * or adding the site to the DB & to the table presented in the UI.
     */
    const handleOk = () => {
        if (!validateSite()){
            handleOpenAlert("error", "Ooops, something went wrong. Did you remember to include at least 1 storage?")
        } else {
            // The site is valid:
            addSite();
            setOpen(false);
            clearFields();
        }
    };

    const validateSite = () => {
        return siteName.length >= 2 && siteLocation.length >= 2 && storagesArr.length > 0;
    }

    /**
     * A function in charge of clearing the different input fields in the component:
     */
    const clearFields = () => {
        setSiteName('');
        setSiteLocation('');
        setStoragesArr([]);
    }

    /**
     * A function in charge of adding a site to the system.
     * 1. Adding the site to the db.
     * 2. Adding the site to the UI (table).
     * 3. Prompting the user with an alert to let them know that the operation was successful.
     */
    const addSite = () => {
        const db = fire.firestore()
        var curSite = {
            siteName: siteName,
            siteLocation: siteLocation,
            storagesArr: storagesArr.map(a => a.storageName)
        }
        var query = db.collection("sites").add(curSite)
        .then((docRef) => {
            // Alerting the user to let them know that the site was successfully added to the db:
            handleOpenAlert("success", "The site was successfully added!");
            // Adding the site to the sitesArr:
            curSite.id = docRef.id; // Adding the Site's id as a field to the site object.
            var temp = data; // Initializing a copy of the original sitesArr.
            temp.push(curSite); // Pushing the new site to the copy of the sitesArr.
            setData(temp); // Setting the sitesArr to the new array of sites.
            // Printing for tests:
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            // Alerting the user to let them know that the site was unsuccessfully added to the db:
            handleOpenAlert("error", "We failed to add the site! Please try again later.");
            console.error("Error adding document: ", error);
        });
    }

    const colorButtonStyle = {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        width: '100%',
        margin: '10px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      };

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
                <Grid item xs={6}>
                    {
                        siteName && siteName.length < 2 ? (
                            <TextField
                            error
                            helperText="The site's name is too short"
                            id="outlined-site"
                            label="Site Name"
                            variant="outlined"
                            style={{width: '100%'}}
                            onChange={(event) => setSiteName(event.target.value)}
                            />
                        ) : (
                            <TextField
                            id="outlined-site"
                            label="Site Name"
                            variant="outlined"
                            style={{width: '100%'}}
                            onChange={(event) => setSiteName(event.target.value)}
                            />
                        )
                    }
                </Grid>
                <Grid item xs={6}>
                    {
                        siteLocation && siteLocation.length < 2 ? (
                            <TextField
                            error
                            helperText="The site's location is too short"
                            id="outlined-location"
                            label="Site Location"
                            variant="outlined"
                            style={{width: '100%'}}
                            onChange={(event) => setSiteLocation(event.target.value)}
                            />
                        ) : (
                            <TextField
                            id="outlined-location"
                            label="Site Location"
                            variant="outlined"
                            style={{width: '100%'}}
                            onChange={(event) => setSiteLocation(event.target.value)}
                            />
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <NewSiteTable
                    title="Storages Table"
                    headerBackground="#26C281" 
                    data={storagesArr}
                    setData={setStoragesArr}
                    />
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

