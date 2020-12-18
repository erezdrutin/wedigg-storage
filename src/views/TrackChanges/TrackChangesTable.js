import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
import { element } from "prop-types";
import { FilterNone } from "@material-ui/icons";

export default function TrackChangesTable(props){
    const { title, headerBackground, data, usersData, getFormattedDate } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const removeSupplier = (supplierName) => {
        console.log(supplierName)
    }

    return (
        <MaterialTable
            // isLoading={data !== []}
            title={title}
            columns={[
                { title: 'Date', field: 'date', render: rowData => getFormattedDate(rowData.date), customSort: (a, b) => a.date - b.date },
                {
                    title: 'Owner',
                    field: 'fullName',
                },
                {
                    title: 'Email',
                    field: 'email',
                    hidden: true
                },
                {
                    title: 'Event',
                    field: 'event',
                    render: rowData => rowData.event.length > 50 ? rowData.event.substring(0, 50) + "..." : rowData.event
                }
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log(selectedRow);
                }
            }}
            detailPanel={rowData => {
                
                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Editor Name: </strong>{rowData.fullName}<br></br>
                        <strong>Editor Mail: </strong>{rowData.email}<br></br>
                        <strong>Event: </strong>{rowData.event}<br></br>
                        <strong>Date: </strong>{getFormattedDate(rowData.date)}<br></br>
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