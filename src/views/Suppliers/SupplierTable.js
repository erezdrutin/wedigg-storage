import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

export default function SupplierTable(props){
    const { title, headerBackground, data, setData, handleOpenAlert, handleOpenVerifyOperation,
            setOpenEditSupplier, verifyOperationBool, setVerifyOperationBool, handleSetEditSupplier, setSupplierCount } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [currentSupplier, setCurrentSupplier] = useState('');

    /**
     * A function in charge of removing a supplier from the table.
     * @param {supplierRec} supplier - A record representing a supplier which we would like to remove.
     */
    const removeSupplierFromTable = (supplier) => {
        var tempArr = data.filter(sup => sup !== supplier);
        setData(tempArr);
    }

    /**
     * A function in charge of updating our devices counter.
     * @param {int} count - A count representing the amount of devices in our DB.
     */
    const handleSetSupplierCount = (count) => {
        setSupplierCount(count);
    }


    // ------------------------------------------------------- Deleting a supplier -------------------------------------------------------
    /**
     * Attaching a listener to verifyOperationBool which will help us determine when the verifyOperation bool state changes.
     * The main purpose of this function is to determine when the user verifies his selection to delete a certain supplier,
     * and once we verify it then we should delete the selected supplier.
     */
    useEffect(() => {
        if (verifyOperationBool === true){
            deleteSupplier()
            setVerifyOperationBool(false);
        }
    }, [verifyOperationBool]);

    /**
     * A function in charge of prompting the user to choose whether he wants to delete the chosen supplier or not.
     * @param {Object} supplier - An object containing some details regarding the supplier retrieved from the chosen row from the table.
     */
    const promptToDeleteSupplier = (supplier) => {
        setCurrentSupplier(supplier);
        handleOpenVerifyOperation('Do you really want to delete the supplier ' + supplier.supplierName
        + '?', 'Once performed, this action can not be undone!');
    }

    const deleteSupplier = () => {
        // Removing a supplier from the db:
        // 1. Removing it from the DB.
        // 2. Removing the supplier from the table.
        // 3. "Alerting" the user to let him know that we removed the supplier from the db.
        const db = fire.firestore();
        var query = db.collection("suppliers").where("supplierName", "==", currentSupplier.supplierName);
        var newSupCount = data.length - 1;

        // Deleting each record that stands by our terms (Expecting only 1 result):
        query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                doc.ref.delete();
            })
            // Removing the supplier from the table:
            removeSupplierFromTable(currentSupplier);
            // Removing the supplier from our suppliers counter:
            handleSetSupplierCount(newSupCount);
            // Alerting the user to let them know that we deleted the supplier(s):
            handleOpenAlert("success", "Successfully deleted the supplier(s).");
        })
        .catch(function(error) {
            handleOpenAlert("error", "Failed to delete the supplier(s).");
            console.error("Error removing document: ", error);
        });
    }
    // ------------------------------------------------------- Deleting a supplier -------------------------------------------------------


    const duplicateSupplier = (rowData) => {
        const materialTable = props.materialTableRef.current;
        materialTable.dataManager.changeRowEditing();
        
        // const materialTable = this.materialTableRef.current;

        // this.setState({
        //     initialFormData: {
        //     ...rowData,
        //     name: null,
        //     },
        // });

        // materialTable.dataManager.changeRowEditing();
        // materialTable.setState({
        //     ...materialTable.dataManager.getRenderState(),
        //     showAddRow: true,
        // });
    }

    // useEffect(() => {
    //     gridData.resolve();
      
    //     // update columns from props
    //     setcolumns(props.col);
    // }, [gridData, props.col]);

    const onRowUpdate = (newData, newDataId) =>
        new Promise((resolve, reject) => {
        setTimeout(() => {
            const dataUpdate = [...data];
            const index = newDataId;
            dataUpdate[index] = newData;
            setData([...dataUpdate]);

            resolve();
        }, 1000)
    })

    const onRowAdd = (newData) => 
        new Promise((resolve, reject) => {
            setTimeout(() => {
                //newData.tableData.id = data.length-1;
                setData([...data, newData]);
                onRowUpdate(newData, newData.tableData.id);
                resolve();
            }, 1000)
    });

    return (
        <MaterialTable
            isLoading={data.length === 0}
            title={title}
            columns={[
                { title: 'Actions', field: 'notes', export: false, render: rowData => (
                    <Grid>
                    <IconButton color="inherit" aria-label="duplicate device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => {
                        onRowAdd({supplierName: 'erez', address: 'test', serviceType: 'testing', contact: 'testos', site: 'testorino', sla: 'slaTest', tin: 'tinTest'});
                    }}>
                        <AddToPhotosIcon />
                    </IconButton>
                        <IconButton color="inherit" aria-label="edit device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => {
                            handleSetEditSupplier(rowData);
                            setOpenEditSupplier(true);
                        }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="delete device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => promptToDeleteSupplier(rowData)}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                ) },
                { title: 'Supplier Name', field: 'supplierName' },
                { title: 'Address', field: 'address' },
                { title: 'Service Type', field: 'serviceType' },
                { title: 'Contact', field: 'contact', hidden: true },
                { title: 'Site', field: 'site' },
                { title: 'SLA', field: 'sla' },
                { title: 'TIN', field: 'tin' },
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
            }}
            detailPanel={rowData => {
                // Storing all the data relevant to the current row { Filtering by TIN }:
                const realRowData = data.filter(function(fd) {
                    return fd.tin === rowData.tin
                })[0]

                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Name: </strong>{realRowData.supplierName}<br></br>
                        <strong>Address: </strong>{realRowData.address}<br></br>
                        <strong>Service Type: </strong>{realRowData.serviceType}<br></br>
                        <strong>Contact: </strong>{realRowData.contact}<br></br>
                        <strong>Site: </strong>{realRowData.site}<br></br>
                        <strong>SLA (Service Level Agreement): </strong>{realRowData.sla}<br></br>
                        <strong>TIN (Taxpayer Identification Number): </strong>{realRowData.tin}<br></br>
                        <strong>Notes: </strong>{realRowData.notes}<br></br>
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
            editable={{
              onBulkUpdate: changes =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve();
                  }, 1000);
                }),     
              onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    resolve();
                  }, 1000);
                }),     
            }}
        />
    )
  }