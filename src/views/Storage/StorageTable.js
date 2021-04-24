import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import StorageAddNew from "./Add_Device/StorageAdd.js";
import { NavLink } from "react-router-dom";

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

export default function StorageTable(props){
    const { title, headerBackground, data, setOpenDeviceQr, setOpenAddDevice, currentDevice, setCurrentDevice, productsDict, sitesDict, suppliersDict } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    return (
        <MaterialTable
            isLoading={data.length === 0}
            title={
                <Button
                variant="contained"
                color="warning"
                endIcon={<Icon>add</Icon>}
                onClick={() => setOpenAddDevice(true)}
                style={colorButtonStyle}
                >
                Add Devices
                </Button>
            }
            columns={[
                { title: 'Actions', field: 'notes', export: false, render: rowData => (
                    <Grid>
                        <IconButton color="inherit" aria-label="delete device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => console.log("delete")}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                ) },
                { title: 'Site ID', field: 'siteId', hidden: true},
                { title: 'Product', field: 'productId', render: rowData => productsDict[rowData.productId].description },
                { title: 'SKU', field: 'productId', render: rowData => productsDict[rowData.productId].sku },
                { title: 'Storage', field: 'storage', hidden: true },
                { title: 'Supplier', field: 'supplierId', hidden: true },
                { title: 'Certificate', field: 'certificate', hidden: true },
                { title: 'certificateImage', field: 'certificate', hidden: true},
                { title: 'Serial', field: 'serial' },
                { title: 'Warranty', field: 'warranty', render: rowData => rowData.warranty.toLocaleDateString() },
                { title: 'Owner ID', field: 'ownerId', hidden: true },
                { title: 'Active', field: 'active', hidden: true },
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log("Double Click")
                    setCurrentDevice(selectedRow)
                    setOpenDeviceQr(true);
                }
            }}
            detailPanel={rowData => {
                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Site: </strong>{sitesDict[rowData.siteId].name}<br></br>
                        <strong>Storage: </strong>{rowData.storage}<br></br>
                        <strong>Supplier: </strong>{suppliersDict[rowData.supplierId].name}<br></br>
                        <strong>Product: </strong>{productsDict[rowData.productId].description}<br></br>
                        <strong>SKU: </strong>{productsDict[rowData.productId].sku}<br></br>
                        <strong>Serial: </strong>{rowData.serial}<br></br>
                        <strong>Warranty: </strong>{rowData.warranty.toLocaleDateString()}<br></br>
                        <strong>Owner: </strong>{rowData.ownerId !== '' ? rowData.ownerId : 'None'}<br></br>
                        <strong>State: </strong>{rowData.active ? 'Active' : 'Inactive'}<br></br>
                        <strong>Certificate: </strong>{rowData.certificate}<br></br>
                    </p>
                    {console.log(rowData)}
                    <a href={rowData.certificateImg} target="_blank">
                        <img src={rowData.certificateImg} alt="certificate image" style={{maxHeight: '200px'}}/>
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
                    color: '#FFF',
                },
                actionsCellStyle: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  },
                exportButton: true
            }}
        />
    )
  }