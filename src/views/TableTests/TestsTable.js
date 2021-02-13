import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

export default function TestsTable(props){
    const { title, headerBackground, data, setData } = props;
    const [currentRec, setCurrentRec] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);


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
                        var newRow = JSON.parse(JSON.stringify(rowData));
                        newRow.tableData.id = data.length+1;
                        onRowAdd(newRow);
                    }}>
                        <AddToPhotosIcon />
                    </IconButton>
                        <IconButton color="inherit" aria-label="edit device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => {
                          console.log("clicked on edit!")
                        }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="inherit" aria-label="delete device" style={{maxWidth: '32px', maxHeight: '32px'}} onClick={() => {
                          console.log("clicked on delete!")
                        }}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                ) },
                { title: 'Device', field: 'deviceName' },
                { title: 'Serial', field: 'serial' },
                { title: 'SKU', field: 'sku' },
                { title: 'Warranty', field: 'warrantyEndDate'},
            ]}
            data={data}
            detailPanel={rowData => {
                // Storing all the data relevant to the current row { Filtering by TIN }:
                const realRowData = data.filter(function(fd) {
                    return fd.serial === rowData.serial
                })[0]

                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        {`Name: ${realRowData.deviceName}`}<br></br>
                        {`Serial: ${realRowData.serial}`}<br></br>
                        {`SKU: ${realRowData.sku}`}<br></br>
                        {`Warranty: ${realRowData.warrantyEndDate}`}<br></br>
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
            }}
        />
    )
  }