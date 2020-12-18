import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export default function SimpleSelectDialog(props){
    const { dialogTitle, openSelectDialog, handleCloseDialog, handleOkDialog, selectValue, setSelectValue, selectLabel } = props;
    
    return (
        <Dialog open={openSelectDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                label={selectLabel}
                type="text"
                value={selectValue}
                onChange={(event) => setSelectValue(event.target.value)}
                fullWidth
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
                Cancel
            </Button>
            <Button onClick={handleOkDialog} color="primary">
                Add
            </Button>
            </DialogActions>
        </Dialog>
    )
  }

        // 

