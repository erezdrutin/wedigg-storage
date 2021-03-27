import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { exportComponentAsPNG } from 'react-component-export-image';
import ImageIcon from '@material-ui/icons/Image';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import CheckboxesTags from './Add_Device/StorageAutoComplete.js';
import Grid from '@material-ui/core/Grid';
import TrackChangesTable from '../TrackChanges/TrackChangesTable.js';
import Tooltip from '@material-ui/core/Tooltip';
import { Person, LocationOn, Storage, ToggleOn, Today, Notes } from '@material-ui/icons'; // Icons
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import QRCode from "react-qr-code";

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

export default function EditDevice(props){
    const { data, formTitle, open, setOpen, handleOpenEdit} = props;
    const componentRef = useRef();
    const classes = useStyles();

    const [isActive, setIsActive] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    /**
     * A function in charge of toggling the isActive's boolean value.
     */
    const toggleIsActive = () => {
        setIsActive(!isActive);
    }

    /**
     * A function that formats a date object and returns a matching string.
     * @param {Date} date - A date which we would like to receive it's formatted string 
     */
    function getFormattedDate(date) {
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var dt = date.getDate();

        if (dt < 10) {
        dt = '0' + dt;
        }
        if (month < 10) {
        month = '0' + month;
        }

        return dt + '/' + month + '/' + year;
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
        <DialogContent style={{marginRight: '-1.5rem'}}>
            <Grid container xs={12} item spacing={3}>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Person style={{width: '15%', marginTop: '1rem'}}/>
                    <CheckboxesTags
                        getOptionTitle={(option) => option.deviceName}
                        getOptionDesc={(option) => option.deviceName}
                        data={data}
                        tooltipTitle="Associated Owner"
                        fieldWidth="85%"
                        fieldName="Owner"
                        placeholderName="owner"
                    />
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <LocationOn style={{width: '15%', marginTop: '1rem'}}/>
                    <CheckboxesTags
                        getOptionTitle={(option) => option.deviceName}
                        getOptionDesc={(option) => option.deviceName}
                        data={data}
                        tooltipTitle="Associated Site"
                        fieldWidth="85%"
                        fieldName="Site"
                        placeholderName="site"
                    />
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Storage style={{width: '15%', marginTop: '1rem'}}/>
                    <CheckboxesTags
                        getOptionTitle={(option) => option.deviceName}
                        getOptionDesc={(option) => option.deviceName}
                        data={data}
                        tooltipTitle="Associated Storage"
                        fieldWidth="85%"
                        fieldName="Storage"
                        placeholderName="storage"
                    />
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Notes style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Edit Notes" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="Notes" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Today style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Months until the device's warranty ends" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="Warranty (in months)" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={2} style={{display: 'flex'}}>
                    <FormControlLabel
                        control={<Switch 
                            checked={isActive}
                            onChange={toggleIsActive}
                            name="Device State"
                            color="primary"
                            style={{color: 'black'}}
                        />}
                        label={isActive ? "Active" : "Inactive"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TrackChangesTable title="Device Changes History" headerBackground="#9d36b3" data={[]} usersData={[]} getFormattedDate={getFormattedDate}/>
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
    </Dialog>
    )
  }

