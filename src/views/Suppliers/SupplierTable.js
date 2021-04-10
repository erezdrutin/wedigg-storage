import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import { NavLink } from "react-router-dom";

import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DoneAllIcon from '@material-ui/icons/DoneAll';

const colorButtonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    maxWidth: '75%',
  };

export default function SiteTable(props){
    const { headerBackground, data, setData, currentSupplier, setCurrentSupplier, setOpenEdit, setOpenNew, sitesArr, verifyOperationBool,
            setVerifyOperationBool, handleOpenVerifyOperation, handleOpenAlert } = props;

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const getSiteNameById = (curSiteId) => {
        var tempSite = sitesArr.filter(s => s.siteId === curSiteId)[0];
        return tempSite !== undefined ? tempSite.siteName : '';
    }

    // ------------------------------------------------------- Deleting a supplier -------------------------------------------------------
    /**
     * Attaching a listener to verifyOperationBool which will help us determine when the verifyOperation bool state changes.
     * The main purpose of this function is to determine when the user verifies his selection to delete a certain supplier,
     * and once we verify it then we should delete the selected supplier.
     */
     useEffect(() => {
        let isSubscribed = true;
        if (verifyOperationBool && isSubscribed){
            // Deleting the supplier from the db:
            deleteSupplier();
            // Changing the verifyOperation bool's value (in case the user would like to delete other suppliers):
            setVerifyOperationBool(false);
            // Activating the deletion function to delete the object from the table:
            onRowDelete(currentSupplier);
        }
        return () => (isSubscribed = false);
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
        var docRef = db.collection("suppliers").doc(currentSupplier.supplierId);

        docRef.delete().then(() => {
            // Alerting the user to let them know that we deleted the supplier(s):
            handleOpenAlert("success", "Successfully deleted the supplier!");
        })
        .catch(function(error){
            handleOpenAlert("error", "Failed to delete the supplier! Please try again later.");
            console.error("Error removing document: ", error);
        })
    }
    // ------------------------------------------------------- Deleting a supplier -------------------------------------------------------

    const onRowDelete = (oldData) =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);

                resolve();
            }, 1000);
    });

    return (
        <MaterialTable
            isLoading={data.length === 0 || sitesArr.length === 0}
            title={
                <Button
                variant="contained"
                color="warning"
                endIcon={<Icon>add</Icon>}
                onClick={() => setOpenNew(true)}
                style={colorButtonStyle}
                >
                Add Supplier
                </Button>
            }
            columns={[
                { title: 'Supplier', field: 'supplierName' },
                { title: 'Site', field: 'supplierSite', render: rowData => getSiteNameById(rowData.supplierSite) },
                { title: 'TIN', field: 'supplierTin' },
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log("Double Click");
                    setCurrentSupplier(selectedRow);
                    setOpenEdit(true);
                }
            }}
            detailPanel={rowData => {
                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Supplier Name: </strong>{rowData.supplierName}<br></br>
                        <strong>Supplier Address: </strong>{rowData.supplierAddress}<br></br>
                        <strong>Supplier Site: </strong>{getSiteNameById(rowData.supplierSite)}<br></br>
                        <strong>Supplier SLA: </strong>{rowData.supplierSla}<br></br>
                        <strong>Supplier TIN: </strong>{rowData.supplierTin}<br></br>
                        <strong>Supplier Service Type: </strong>{rowData.supplierServiceType}<br></br><br></br>
                        <strong>Supplier Contacts: </strong>
                    </p>
                    <ol>
                        {rowData.supplierContacts.map((cont, index) => {
                            return <li key={index}>{`Name: ${cont.name} | Phone: ${cont.phone} | Email: ${cont.email}`}</li>
                        })}
                    </ol>
                    </div>
                )
            }}
            options={{
                rowStyle: rowData => ({
                    backgroundColor: (selectedRowIndex === rowData.tableData.id) ? '#EEE' : '#FFF',
                    style: {maxWidth: '100%'}
                }),
                headerStyle: {
                    backgroundColor: headerBackground,
                    color: '#FFF',
                },
                actionsCellStyle: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                },
                actionsCellStyle: {
                    height: '53px',
                    width: '48px'
                },
                exportButton: true
            }}

            actions={[
                {
                    icon: props => <p>Spacer</p>,
                    tooltip: "Spacer",
                    onClick: () => {}
                },
            ]}
            
            components={{
                Action: props => 
                {
                    if(props.action.tooltip === "Add"){
                        return(
                        <IconButton aria-label="add" onClick={() => {console.log(props); props.action.onClick();}} style={{maxWidth: '48px'}}>
                            <AddIcon />
                        </IconButton>
                        )
                    }
                    else if(props.action.tooltip === "Cancel"){
                        return(
                        <IconButton aria-label="delete" onClick={() => {console.log(props); props.action.onClick();}} style={{maxWidth: '48px'}}>
                            <ClearIcon />
                        </IconButton>
                        )
                    }
                    else if(props.action.tooltip === "Save"){
                        return(
                        <IconButton aria-label="save" onClick={() => {console.log(props); props.action.onClick();}} style={{maxWidth: '48px'}}>
                            <DoneAllIcon />
                        </IconButton>
                        )
                    }
                    else{
                        return(
                            <IconButton aria-label="delete" onClick={() => {promptToDeleteSupplier(props.data);}} style={{maxWidth: '48px'}}>
                                <DeleteIcon />
                            </IconButton>
                        )
                    }
                }
            }}
        />
    )
  }