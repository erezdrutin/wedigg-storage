import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { exportComponentAsPNG } from 'react-component-export-image';
import ImageIcon from '@material-ui/icons/Image';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';

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
        minHeight: '28rem',
        maxHeight: '28rem',
        minWidth: '30rem',
        maxWidth: '30rem',
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

export default function DeviceQrDialog(props){
    const { serial, formTitle, open, setOpen, handleOpenEdit} = props;
    const componentRef = useRef();
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
            <div ref={componentRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px'}}>
                <QRCode value={serial} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button style={colorButtonStyle} onClick={handlePrint}>
                    <PrintIcon style={{marginRight: '0.5rem'}} />
                    <Typography variant="button"  display="block" style={{marginRight: '1rem'}}>Print QR</Typography>
                </Button>
                <Button style={colorButtonStyle} onClick={handleOpenEdit}>
                    <EditIcon style={{marginRight: '0.5rem'}} />
                    <Typography variant="button"  display="block" style={{marginRight: '1rem'}}>Edit Device</Typography>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
    )
  }

