import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
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

export default function EditSiteTable(props){
    const { title, headerBackground, data, setData } = props;
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
            title={title}
            columns={[
            { title: 'Name', field: 'storageName'},
    
            ]}
            data={data}
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
                    onClick: () => {}
                },
            ]}

            components={{
                Action: props => 
                {
                    if(props.action.tooltip === "Add"){
                        return(
                        <IconButton aria-label="add" onClick={() => {props.action.onClick();}} style={{maxWidth: '48px'}}>
                            <AddIcon />
                        </IconButton>
                        )
                    }
                    else if(props.action.tooltip === "Cancel"){
                        return(
                        <IconButton aria-label="delete" onClick={() => {props.action.onClick();}} style={{maxWidth: '48px'}}>
                            <ClearIcon />
                        </IconButton>
                        )
                    }
                    else if(props.action.tooltip === "Save"){
                        return(
                        <IconButton aria-label="save" onClick={() => {props.action.onClick();}} style={{maxWidth: '48px'}}>
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