import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';

export default function SubStorageTable(props){
    const { title, headerBackground, data, fullData } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const removeSupplier = (supplierName) => {
        console.log(supplierName)
    }

    return (
        <MaterialTable
            isLoading={data !== []}
            title={title}
            columns={[
    
            { title: 'Device', field: 'deviceName' },
            { title: 'Category', field: 'category'},
            { title: 'Serial', field: 'serial' },
            { title: 'Supplier', field: 'supplier' },
            { title: 'Price', field: 'price' },
            { title: 'Certificate', field: 'certificate' },
            { title: 'Warranty End Date', field: 'warrantyEnd' },
    
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log(selectedRow);
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
                        <strong>Name: </strong>{realRowData.deviceName}<br></br>
                        <strong>Category: </strong>{realRowData.category}<br></br>
                        <strong>Serial: </strong>{realRowData.serial}<br></br>
                        <strong>Supplier: </strong>{realRowData.supplier}<br></br>
                        <strong>Price: </strong>{realRowData.price}<br></br>
                        <strong>Certificate: </strong>{realRowData.certificate}<br></br>
                        <strong>Warranty Start Date: </strong>{realRowData.warrantyStart.toString()}<br></br>
                        <strong>Warranty Period: </strong>{realRowData.warrantyPeriod}<br></br>
                        <strong>Lab History: </strong>{realRowData.labHistory}<br></br>
                        <strong>Certificate Image: </strong><br></br>
                    </p>
                    {console.log(realRowData)}
                    <a href={realRowData.certificateImg} target="_blank">
                        <img src={realRowData.certificateImg} alt="certificate image" style={{maxHeight: '200px'}}/>
                    </a>
                    </div>
                )
            }}
            actions={[
                {
                    icon: 'delete',
                    tooltip: 'Remove Supplier',
                    disabled: true,
                    onClick: (event, rowData) => removeSupplier(rowData),
                }
            ]}
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