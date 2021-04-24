import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
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
import { LocationOn, Storage, Assignment, LocalShipping } from '@material-ui/icons'; // Icons
import StorageAddTable from './Add_Device/StorageAddTable.js';
import FileUploader from './Add_Device/FileUploader.js';
import AsyncAutoComplete from "./AsyncAutoComplete.js"

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const CssTextField = withStyles({
    root: {
      '& label.Mui-focused': {
        color: 'black',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'black',
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: 'black',
        },
      },
    },
  })(TextField);

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
        minHeight: '85vh',
        maxHeight: '85vh',
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

export default function AddDevice(props){
    const { formTitle, open, setOpen, loadSites, loadSuppliers, loadProducts, handleOpenAlert} = props;
    const componentRef = useRef();
    const classes = useStyles();
    const [currentDevice, setCurrentDevice] = useState('');
    const [devicesArr, setDevicesArr] = useState([]);
  
    const [site, setSite] = useState('');
    const [storage, setStorage] = useState('');
    const [supplier, setSupplier] = useState('');
    const [certificate, setCertificate] = useState('');
    const [certificateImage, setCertificateImage] = useState('');
    const [warrantyStartDate, setWarrantyStartDate] = useState(Date());

    const handleClose = () => {
      setOpen(false);
    };
    const handleOk = () => {
      console.log("SITE: ", site);
      console.log("STORAGE: ", storage);
      console.log("SUPPLIER: ", supplier);
      console.log("CERTIFICATE: ", certificate);
      console.log("CERTIFICATE IMAGE: ", certificateImage);
      console.log("WARRANTY START DATE: ", warrantyStartDate);
      console.log("DEVICES ARRAY: ", devicesArr);
      setOpen(false);
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.dialogPaper }}
        disableBackdropClick
        >
        <DialogTitle id="form-dialog-title"  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{formTitle}</DialogTitle>
        <DialogContent style={{marginRight: '-1.5rem'}}>
            <Grid container xs={12} item spacing={3}>
              <Grid item xs={4} style={{display: 'flex'}}>
                <LocationOn style={{width: '15%', marginTop: '1rem'}}/>
                <AsyncAutoComplete label="Site" tooltipTitle="Associated Site" getLabel={(option) => option.siteName} loadFunc={loadSites} setVal={setSite} fieldWidth="85%"/>
              </Grid>
              <Grid item xs={4} style={{display: 'flex'}}>
                <Storage style={{width: '15%', marginTop: '1rem'}}/>
                <CheckboxesTags
                  id="checkboxesTags_storage"
                  getOptionTitle={(option) => option}
                  getOptionDesc={(option) => option}
                  data={site ? site.storagesArr : []}
                  setValue={setStorage}
                  tooltipTitle="Associated Storage (related to chosen Site)"
                  fieldWidth="85%"
                  fieldName="Storage"
                  setValue={setStorage}
                />
              </Grid>
              <Grid item xs={4}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        id="newDeviceWarrantyStartDate"
                        style={{width: '100%'}}
                        label="Warranty Start Date"
                        value={warrantyStartDate}
                        onChange={date => setWarrantyStartDate(date)}
                        format="dd/MM/yyyy"
                    />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={4} style={{display: 'flex'}}>
                <LocalShipping style={{width: '15%', marginTop: '1rem'}}/>
                <AsyncAutoComplete label="Supplier" tooltipTitle="Associated Supplier" getLabel={(option) => option.supplierName} loadFunc={loadSuppliers} setVal={setSupplier} fieldWidth="85%"/>
              </Grid>
              <Grid item xs={4} style={{display: 'flex'}}>
                <Assignment style={{width: '15%', marginTop: '1rem'}}/>
                <Tooltip title="Edit Notes" style={{width: '85%'}}>
                    <CssTextField
                    id="checkboxesTags_certificate"
                    variant="outlined"
                    label={"Certificate"}
                    onChange={(event) => setCertificate(event.target.value)}
                    style={{width: '100%'}}
                    />
                </Tooltip>
              </Grid>
              <Grid item xs={4}>
                <FileUploader btnText="Certificate" btnIcon="image" handleFile={setCertificateImage}/>
              </Grid>
              <Grid item xs={12}>
                <StorageAddTable 
                    title="Devices"
                    headerBackground="#363636"
                    data={devicesArr}
                    setData={setDevicesArr}
                    currentDevice={currentDevice}
                    setCurrentDevice={setCurrentDevice}
                    loadProducts={loadProducts}
                    handleOpenAlert={handleOpenAlert}
                />
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleOk} color="primary">
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
    )
  }

