import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

export default function VerifyOperation(props) {
  const { open, setOpen, setBoolVal, dialogText, dialogTitle } = props;

  const handleCloseCancel = () => {
    // Set bool val to false, set open to false:
    setOpen(false);
    setBoolVal(false);
  }

  const handleCloseConfirm = () => {
    // Set bool val to true, set open to false:
    setOpen(false);
    setBoolVal(true);
  }

  return (
    <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {dialogText}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseCancel} color="primary">
            Cancel
            </Button>
            <Button onClick={handleCloseConfirm} color="primary" autoFocus>
            Confirm
            </Button>
        </DialogActions>
    </Dialog>
  );
}
