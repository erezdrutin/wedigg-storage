import React, { useState, useEffect } from "react";
import MaterialTable, { MTableActions, MTableBodyRow, MTableEditRow } from "material-table";
import Button from '@material-ui/core/Button';
import fire from '../../fire.js';
import IconButton from '@material-ui/core/IconButton';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import { setDate } from "date-fns";

export default function TestsTable(props){
    const { title, headerBackground, data, setData } = props;
    const [currentRec, setCurrentRec] = useState('');
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // const onRowUpdate = (newData, newDataId) =>
    //     new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         const dataUpdate = [...data];
    //         const index = newDataId;
    //         dataUpdate[index] = newData;
    //         setData([...dataUpdate]);

    //         resolve();
    //     }, 1000)
    // })

    useEffect(() => {
        gridData.resolve();
        console.log("RESOLVE AT:", gridData.updatedAt);
    }, [gridData]);

    const [gridData, setGridData] = useState({
        data: props.data,
        resolve: () => {},
        updatedAt: new Date()
    });

    const onRowUpdate = (newData, oldData) =>
        new Promise((resolve, reject) => {
        console.log("OLD", oldData)
        console.log("NEW", newData)

        const { data } = gridData;
        const updatedAt = new Date();
        const index = data.length;
        // data[index] = newData;

        var tempArr = data;
        tempArr[index] = newData;
        handleSetData(tempArr);

        console.log("DATAAAAAFTER", data)
        setGridData({ ...gridData, data, resolve, updatedAt });
        resolve();
    });


    /**
     * A function in charge of setting the data array to the received array.
     * @param {*} arr - An array of objects.
     */
    const handleSetData = (arr) => {
        setData([]);
        var tempArr = [...arr];
        setData(tempArr);
    }

    /**
     * A function in charge of removing a record from the existing data array.
     * @param {*} delRec - An object that we would like to remove.
     */
    const handleRemoveData = (delRec) => {
        var tempArr = data;
        setData([]);
        tempArr = tempArr.filter(item => item !== delRec);
        setData(tempArr);
    }

    /**
     * A function in charge of adding a record to the existing data array.
     * @param {*} newRec - An object that we would like to add.
     */
    const handleAddData = (newRec) => {
        var tempArr = data;
        setData([]);
        tempArr.push(newRec);
        setData(tempArr);
    }

    const onRowAdd = (newData) => 
        new Promise((resolve, reject) => {
            setTimeout(() => {
                newData = JSON.parse(JSON.stringify(newData)); // Cloning the original object.
                handleAddData(newData);
                resolve();
            }, 1000)
    });

    return (
        <MaterialTable
            isLoading={data.length === 0}

            title={title}

            columns={[
                { title: 'Device', field: 'deviceName', editable: 'never' },
                { title: 'Serial', field: 'serial' },
                { title: 'SKU', field: 'sku' },
                { title: 'Warranty', field: 'warrantyEndDate', editable: 'never' },
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
                    color: '#FFF',
                    whiteSpace: 'nowrap'
                },

                rowStyle:{
                    fontSize:'8',
                },

                editCellStyle: {
                    maxWidth: '20px',
                    marginRight: '200px',
                },

                exportButton: true,
            }}

            editable={{
                onRowUpdate: onRowUpdate,
                onRowAdd: onRowAdd
            }}


            components={{
                Row: props => (
                <MTableBodyRow
                    {...props}
                    onDoubleClick={e => {
                    console.log(props);
                    onRowAdd(data[props.index]);
                    setTimeout(function(){props.actions[0]().onClick(e, props.data)}, 900);
                    }}
                />
                )
            }}
        />
    )
  }