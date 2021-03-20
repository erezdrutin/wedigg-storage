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
    const {formTitle, open, setOpen} = props;
    const classes = useStyles();
    const [data, setData] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };

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
                <Grid item xs={4} style={{display: 'flex'}}>
                    <TextFields style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Supplier Name" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="Name" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <LocationOn style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Supplier Address" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="Address" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Assignment style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Service Level Agreement" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="SLA" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <EmojiSymbols style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Taxpayer Identification Numbers"  style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="TIN" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Explore style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Associated Site" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="Site" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={4} style={{display: 'flex'}}>
                    <Build style={{width: '15%', marginTop: '1rem'}}/>
                    <Tooltip title="Supplier's Service Type" style={{width: '85%'}}>
                        <TextField id="outlined-basic" label="Service Type" variant="outlined" style={{width: '100%'}} />
                    </Tooltip>
                </Grid>
                <Grid item xs={12}>
                    <NewSupplierTable title="Storages Table" headerBackground="#3374FF" data={data} setData={setData}/>
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

