import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
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

export default function SiteTable(props){
    const { title, headerBackground, data, setCurrentSite, currentSite, setOpenEdit, setOpenNew } = props;

    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const extractSiteFromRow = (dataRow) => {
        return {
            id: dataRow.id,
            siteName: dataRow.siteName,
            siteLocation: dataRow.siteLocation,
            storagesArr: dataRow.storagesArr,
        }
    }

    return (
        <MaterialTable
            isLoading={data.length === 0}
            title={
                <Button
                variant="contained"
                color="warning"
                endIcon={<Icon>add</Icon>}
                onClick={() => setOpenNew(true)}
                style={colorButtonStyle}
                >
                Add Site
                </Button>
            }
            columns={[
                { title: 'Site', field: 'siteName' },
                { title: 'Location', field: 'siteLocation' },
                { title: 'Total Storages', field: 'storagesArr', render: rowData => rowData.storagesArr ? rowData.storagesArr.length : 0 },
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    console.log("Double Click");
                    setCurrentSite(extractSiteFromRow(selectedRow));
                    setOpenEdit(true);
                }
            }}
            detailPanel={rowData => {
                return (
                    <div>
                    <p style={{marginTop: '10px'}}>
                        <strong>Site Name: </strong>{rowData.siteName}<br></br>
                        <strong>Site Location: </strong>{rowData.siteLocation}<br></br>
                        <strong>Site Storages: </strong>{rowData.storagesArr.toString()}<br></br>
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