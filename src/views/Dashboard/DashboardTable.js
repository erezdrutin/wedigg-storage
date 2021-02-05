import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';

export default function DashboardTable(props){
    const { title, headerBackground, data } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    return (
        <MaterialTable
            isLoading={data.length === 0}
            title={title}
            columns={[
                { title: 'Product', field: 'deviceName' },
                { title: 'Serial', field: 'serial' },
                { title: 'SKU', field: 'sku' },
                { title: 'Warranty', field: 'warrantyEndPeriod' },
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