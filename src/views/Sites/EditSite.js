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
import EditSiteTable from './EditSiteTable.js';
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

export default function EditSite(props){
    // Variables Definition:
    const {formTitle, open, setOpen, currentSite, data, setData, handleOpenAlert} = props;
    const classes = useStyles();
    const [siteName, setSiteName] = useState('');
    const [siteLocation, setSiteLocation] = useState('');
    const [storagesArr, setStoragesArr] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    // A function which will run as soon as the page loads:
    useEffect(() => {
        console.log("ERERELELEL: ", currentSite);
        setSiteName(currentSite.siteName);
        setSiteLocation(currentSite.siteLocation);
        // Converting the storages array to a format which will be applicable to the table:
        var storagesArrConverted = currentSite.storagesArr ? currentSite.storagesArr.map(x => {return {'storageName': x}}) : [];
        setStoragesArr(storagesArrConverted);
    }, [currentSite]);

    const handleOk = () => {
        console.log("NAME: ", siteName);
        console.log("LOCATION: ", siteLocation);
        console.log("STORAGES: ", storagesArr);
        // Adding the site (both to the DB & to the UI table):
        setOpen(false);
        editSite();
        clearFields();
    };


    /**
     * A function in charge of editing a site in the system.
     * 1. Editing the site in the db.
     * 2. Editing the site in the UI (table).
     * 3. Prompting the user with an alert to let them know that the operation was successful/unsuccessful.
     */
    const editSite = () => {
        const db = fire.firestore()
        var curSite = {
            siteName: siteName,
            siteLocation: siteLocation,
            storagesArr: storagesArr.map(a => a.storageName)
        }

        // Defining a pointer to the site element in the db:
        var docRef = db.collection("sites").doc(currentSite.id);

        docRef.update(curSite)
        .then(() => {
            // Alerting the user to let them know that the site was successfully edited to the db:
            handleOpenAlert("success", "The site was successfully edited!");
            var temp = data.filter(a => a.id !== currentSite.id); // Initializing a copy of the original sitesArr without the edited site.
            temp.push(curSite); // Pushing the new site to the copy of the sitesArr.
            setData(temp); // Setting the sitesArr to the new array of sites.
        })
        .catch((error) => {
            // Alerting the user to let them know that the site was unsuccessfully edited to the db:
            handleOpenAlert("success", "We failed to edit the site! Please try again later.");
            console.error("Error updating document: ", error);
        });
    }

    /**
     * A function in charge of clearing the different input fields in the component:
     */
    const clearFields = () => {
        setSiteName('');
        setSiteLocation('');
        setStoragesArr([]);
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
                    <TextField
                    id="outlined-site"
                    label="Site Name"
                    variant="outlined"
                    style={{width: '100%'}}
                    value={siteName}
                    disabled={true}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    id="outlined-location"
                    label="Site Location"
                    variant="outlined"
                    value={siteLocation}
                    style={{width: '100%'}}
                    disabled={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <EditSiteTable
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

