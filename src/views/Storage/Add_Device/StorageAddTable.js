import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Grid from '@material-ui/core/Grid';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import { NavLink } from "react-router-dom";
import { Divider } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


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

export default function StorageAddTable(props){
    const { title, headerBackground, data, setData, setOpenAddDevice, currentDevice, setCurrentDevice } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);


    const lookup = {};
    const productsArr = [{id: 1, name: 'product1'}, {id: 2, name: 'product2'}, {id: 3, name: 'product3'}];
    productsArr.forEach(product => {
        lookup[product.id] = product.name;
    });

    const options = productsArr.map(product => ({
        value: product.id,
        label: product.name
    }));

    const onRowAdd = (newData) => 
        new Promise((resolve, reject) => {
            setTimeout(() => {
                //newData.tableData.id = data.length-1;
                setData([...data, newData]);
                resolve();
            }, 1000)
    });

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
            title="Devices Table"
            columns={[
            { title: 'Site ID', field: 'siteId', hidden: true},
            { title: 'Product ID', field: 'productID', hidden: true },
            { title: 'Storage', field: 'storage', hidden: true },
            { title: 'Supplier', field: 'supplierID', hidden: true },
            { title: 'Certificate', field: 'certificate', hidden: true },
            { title: 'certificateImage', field: 'certificate', hidden: true},
            { title: 'Serial', field: 'serial', hidden: true },
            { title: 'Warranty', field: 'warranty', hidden: true },
            { title: 'Owner ID', field: 'ownerId', hidden: true },
            { title: 'Active', field: 'active', hidden: true },
            { title: 'Notes', field: 'notes', hidden: true },
            { 
                title: 'SKU',
                field: 'productID',
                lookup: lookup,
                editComponent: props => (
                    <Autocomplete
                        id="combo-box-demo"
                        freeSolo
                        options={options}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, value) => {props.onChange(value); console.log(value)}}
                        style={{marginTop: '-18px', fontSize: '10px'}}
                        renderInput={(params) => <TextField {...params} label="SKU" />}
                    />
                ),
                render: rowData => rowData.product.label
            },
    
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    setCurrentDevice(selectedRow)
                }
            }}
            detailPanel={rowData => {
                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Product: </strong>{rowData.deviceName}<br></br>
                        <strong>Category: </strong>{rowData.category}<br></br>
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
                    backgroundColor: (selectedRowIndex === rowData.tableData.id) ? '#EEE' : '#FFF',
                    style: {maxWidth: '30303030px'}
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
                }
            }}
            
            editable={{
                onRowAdd: onRowAdd
            }}

            actions={[
                {
                    icon: props => <p>Spacer</p>,
                    tooltip: "Spacer",
                },
            ]}
            
            //props.action.onClick()
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
                            <IconButton aria-label="delete" onClick={() => {onRowDelete(props.data)}} style={{maxWidth: '48px'}}>
                                <DeleteIcon />
                            </IconButton>
                        )
                    }
                }
            }}
        />
    )
  }