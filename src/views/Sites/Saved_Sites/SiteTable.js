import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

export default function SiteTable(props){
    const { title, headerBackground, data, setData, handleOpenAlert, handleSetEditSite, setOpenEditSite, handleOpenVerifyOperation,
        verifyOperationBool, setVerifyOperationBool, setSiteCount, setStorageCount, getStoragesCount } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [currentSite, setCurrentSite] = useState('');

    /**
     * A function in charge of removing a site from the table.
     * @param {Object} site - A record representing a site which we would like to remove.
     */
    const removeSiteFromTable = (site) => {
        var tempArr = data.filter(s => s !== site);
        setData(tempArr);
    }

    /**
     * A function in charge of updating our sites counter.
     * @param {int} count - A count representing the amount of sites in our DB.
     */
    const handleSetSiteCount = (count) => {
        setSiteCount(count);
    }

    /**
     * A function in charge of updating our storages counter.
     * @param {int} count - A count representing the amount of storages in our DB.
     */
    const handleSetStorageCount = (count) => {
        setStorageCount(count);
    }

    // ------------------------------------------------------- Deleting a site -------------------------------------------------------
    /**
     * Attaching a listener to verifyOperationBool which will help us determine when the verifyOperation bool state changes.
     * The main purpose of this function is to determine when the user verifies his selection to delete a certain site,
     * and once we verify it then we should delete the selected site.
     */
    useEffect(() => {
        if (verifyOperationBool === true){
            deleteSite();
            setVerifyOperationBool(false);
        }
    }, [verifyOperationBool]);

    /**
     * A function in charge of prompting the user to choose whether he wants to delete the chosen site or not.
     * @param {Object} site - An object containing some details regarding the site retrieved from the chosen row from the table.
     */
    const promptToDeleteSite = (site) => {
        setCurrentSite(site);
        handleOpenVerifyOperation('Do you really want to delete the site ' + site.name
        + '?', 'Once performed, this action can not be undone!');
    }

    const deleteSite = () => {
        // Removing a site from the db:
        // 1. Removing it from the DB.
        // 2. Removing the site from the table.
        // 3. "Alerting" the user to let him know that we removed the site from the db.
        const db = fire.firestore();
        var delQuery = db.collection("sites").doc(currentSite.name);
        var newSiteCount = data.length - 1;
        var newStorageCount = getStoragesCount() - currentSite.storageTypesArrCount;

        delQuery.delete()
        .then(function(){
            // Removing the site from the table:
            removeSiteFromTable(currentSite);
            // Removing the device from our sites counter:
            handleSetSiteCount(newSiteCount);
            // Removing the device from our storages counter:
            handleSetStorageCount(newStorageCount);
            // Alerting the user to let them know that we deleted the site(s):
            handleOpenAlert("success", "Successfully deleted the site!");
        })
        .catch(function(error) {
            handleOpenAlert("error", "Failed to delete the site!");
            console.error("Error removing document: ", error);
        });
    }
    // ------------------------------------------------------- Deleting a site -------------------------------------------------------

    return (
        <MaterialTable
            isLoading={data.length === 0}
            title={title}
            columns={[
                { title: 'Actions', field: 'notes', render: rowData => (
                    <Grid>
                        <IconButton color="inherit" aria-label="edit device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => {
                            handleSetEditSite(rowData);
                            setOpenEditSite(true);
                        }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="delete device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => promptToDeleteSite(rowData)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                ) },
                { title: 'Name', field: 'name' },
                { title: 'Storages Count', field: 'storageTypesArrCount' },
                { title: 'Storages', field: 'storageTypesArr', hidden: true, export: true },
                { title: 'Suppliers Count', field: 'suppliersArrCount' },
                { title: 'Suppliers', field: 'suppliersArr', hidden: true, export: true },
                { title: 'Note', field: 'note' },
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log(selectedRow);
                }
            }}
            detailPanel={rowData => {
                // Storing all the data relevant to the current row { Filtering by TIN }:
                const realRowData = data.filter(function(fd) {
                    return fd.name === rowData.name
                })[0]


                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Name: </strong>{realRowData.name}<br></br>
                        <strong>Storages Count: </strong>{realRowData.storageTypesArrCount}<br></br>
                        <strong>Storages: </strong>{realRowData.storageTypesArr.toString()}<br></br>
                        <strong>Suppliers Count: </strong>{realRowData.suppliersArrCount}<br></br>
                        <strong>Suppliers: </strong>{realRowData.suppliersArr.toString()}<br></br>
                        <strong>Service Types: </strong>{realRowData.serviceTypesArr.toString()}<br></br>
                        <strong>Service Types Count: </strong>{realRowData.serviceTypesArr.length}<br></br>
                        <strong>Categories: </strong>{realRowData.categoriesArr.toString()}<br></br>
                        <strong>Categories Count: </strong>{realRowData.categoriesArr.length}<br></br>
                        <strong>Note: </strong>{realRowData.note}<br></br>
                    </p>
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