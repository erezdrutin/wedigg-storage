import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

export default function StorageTable(props){
    const { title, headerBackground, data, setData, fullData, setOpenDeviceQr, currentDevice, setCurrentDevice, usersData, handleOpenAlert, setOpenEditDevice,
        handleOpenVerifyOperation, verifyOperationBool, setVerifyOperationBool } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const editDevice = (deviceDetails) => {
        setCurrentDevice(deviceDetails);
        setOpenEditDevice(true);
        console.log("Editing device: ", deviceDetails)
    }



    // ------------------------------------------------------- Deleting a device -------------------------------------------------------
    /**
     * Attaching a listener to verifyOperationBool which will help us determine when the verifyOperation bool state changes.
     * The main purpose of this function is to determine when the user verifies his selection to delete a certain device,
     * and once we verify it then we should delete the selected device.
     */
    useEffect(() => {
        if (verifyOperationBool === true){
            deleteDevice()
            setVerifyOperationBool(false);
        }
    }, [verifyOperationBool]);

    /**
     * A function in charge of prompting the user to choose whether he wants to delete the chosen device or not.
     * @param {Object} recToDel - An object containing some details regarding the device retrieved from the chosen row from the table.
     */
    const promptToDelete = (recToDel) => {
        setCurrentDevice(recToDel);
        handleOpenVerifyOperation('Do you really want to delete the product ' + recToDel.deviceName
        + '?', 'Once performed, this action can not be undone!');
    }

    // ------------------------------------------------------- Deleting a device -------------------------------------------------------


    /**
     * A function in charge of removing a device.
     * The actions which will be taken in this function are:
     * 1. Remove the device from the db.
     * 2. Remove the device from the devices table.
     */
    const deleteDevice = () => {
        // Variables Definition:
        const db = fire.firestore();
        var docRef = db.collection("devices").where("serial", "==", currentDevice.serial);

        // Deleting from the db & table:
        docRef.get().then(function(querySnapshot){
            // Deleting the device from the db:
            querySnapshot.docs[0].ref.delete();
            // Deleting the device from the table:
            removeDeviceFromTable(currentDevice);
            // Letting the user know that the operation was successful:
            handleOpenAlert("success", "Successfully deleted the device.");
        })
        .catch(function(error){
            // Letting the user know that the operation was unsuccessful:
            handleOpenAlert("error", "Failed to delete the device.");
        })
    }

    /**
     * A function in charge of removing a device from the storage table data array.
     */
    const removeDeviceFromTable = () => {
        var tempArr = data.filter(rec => rec.serial !== currentDevice.serial);
        setData(tempArr);
    }

    const getUserName = (rowData) => {
        var res = usersData.filter(function(o){return o.uid == rowData.user;})
        return res ? res[0].fullName : 'loading...'
    }

    const getUserDetails = (rowData) => {
        var res = usersData.filter(function(o){return o.uid == rowData.user;})
        return res ? (res[0].fullName + ' | ' + res[0].email + ' | Site: ' + res[0].site) : 'loading...'
    }

    return (
        <MaterialTable
            isLoading={data.length === 0}
            title={title}
            columns={[
    
            { title: 'Actions', field: 'notes', render: rowData => (
                <Grid>
                    <IconButton color="inherit" aria-label="edit device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => editDevice(rowData)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label="delete device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => promptToDelete(rowData)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
            ) },
            { title: 'Product', field: 'deviceName', render: rowData => rowData.deviceName.length > 25 ? rowData.deviceName.substring(0, 25) + '...' : rowData.deviceName },
            { title: 'Serial', field: 'serial' },
            { title: 'Certificate', field: 'certificate' },
            { title: 'Owner', field: 'uid', render: rowData => getUserName(rowData)},
            { title: 'Warranty End Date', field: 'warrantyEnd', render: rowData => rowData.warrantyEnd.toLocaleDateString(), customSort: (a, b) => a.warrantyEnd - b.warrantyEnd },
    
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log("Double Click")
                    setCurrentDevice(selectedRow);
                    setOpenDeviceQr(true);
                }
            }}
            detailPanel={rowData => {
                // Storing all the data relevant to the current row { Filtering by Serial Number }:
                const realRowData = fullData.filter(function(fd) {
                    return fd.serial === rowData.serial
                })[0]



                console.log(rowData.serial)
                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Product: </strong>{realRowData.deviceName}<br></br>
                        <strong>Category: </strong>{realRowData.category}<br></br>
                        <strong>Certificate: </strong>{realRowData.certificate}<br></br>
                        <strong>Serial: </strong>{realRowData.serial}<br></br>
                        <strong>Price: </strong>{realRowData.price}<br></br>
                        <strong>Site: </strong>{realRowData.site}<br></br>
                        <strong>Storage: </strong>{realRowData.storageType}<br></br>
                        <strong>Supplier: </strong>{realRowData.supplier}<br></br>
                        <strong>Owner: </strong>{getUserDetails(realRowData)}<br></br>
                        <strong>Warranty Period: </strong>{realRowData.warrantyPeriod}<br></br>
                        <strong>Warranty Start Date: </strong>{realRowData.warrantyStart.toLocaleDateString()}<br></br>
                        <strong>Warranty End Date: </strong>{realRowData.warrantyEnd.toLocaleDateString()}<br></br>
                        <strong>Notes: </strong>{realRowData.notes}<br></br>
                        <strong>Certificate Image: </strong><br></br>
                    </p>
                    {console.log(realRowData)}
                    <a href={realRowData.certificateImg} target="_blank">
                        <img src={realRowData.certificateImg} alt="certificate image" style={{maxHeight: '200px'}}/>
                    </a>
                    </div>
                )
            }}
            options={{
            rowStyle: rowData => ({
                backgroundColor: (selectedRowIndex === rowData.tableData.id) ? '#EEE' : '#FFF'
            }),
            headerStyle: {
                backgroundColor: headerBackground,
                color: '#FFF'
            },
            exportButton: true
            }}
        />
    )
  }