import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AsyncAutoComplete from "../AsyncAutoComplete.js";


export default function StorageAddTable(props){
    const { title, headerBackground, data, setData, loadProducts, handleOpenAlert } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    // const lookup = {};
    // const productsArr = [{id: 1, name: 'product1'}, {id: 2, name: 'product2'}, {id: 3, name: 'product3'}];
    // productsArr.forEach(product => {
    //     lookup[product.id] = product.name;
    // });

    const onRowAdd = (newData) => 
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (newData && (newData.product === undefined || newData.serial === undefined || newData.warrantyLength === undefined)){
                    handleOpenAlert("error", "Please fill all the fields!");
                    reject();
                } else if (newData?.serial?.length < 4){
                    handleOpenAlert("error", "The device's serial is too short!");
                    reject();
                } else if (isNaN(newData?.warrantyLength) || parseInt(newData?.warrantyLength) < 0){
                    handleOpenAlert("error", "The device's warranty length isn't valid!");
                    reject();
                } else {
                    setData([...data, newData]);
                    resolve();
                }
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
            title={title}
            columns={[
                { 
                    title: 'Product',
                    field: 'product',
                    // lookup: lookup,
                    editComponent: props => (
                        <AsyncAutoComplete label="Product" tooltipTitle="Associated Product" getLabel={(option) => option.productDescription} loadFunc={loadProducts} setVal={props.onChange} fieldWidth="85%"/>
                        // <Autocomplete
                        //     id="combo-box-demo"
                        //     freeSolo
                        //     options={options}
                        //     getOptionLabel={(option) => option.label}
                        //     onChange={(event, value) => {props.onChange(value); console.log(value)}}
                        //     style={{marginTop: '-18px', fontSize: '10px'}}
                        //     renderInput={(params) => <TextField {...params} label="SKU" />}
                        // />
                    ),
                    render: rowData => rowData.product.productDescription
                },
                { title: 'Serial', field: 'serial', type: 'string'},
                { title: 'Warranty Length (in months)', field: 'warrantyLength'},
            ]}
            data={data}
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
                }
            }}
            
            editable={{
                onRowAdd: onRowAdd
            }}

            actions={[
                {
                    icon: props => <p>Spacer</p>,
                    tooltip: "Spacer",
                    onClick: () => {}
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
                },
            }}
        />
    )
  }