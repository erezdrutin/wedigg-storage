import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';

export default function SupplierTable(props){
    const { title, headerBackground, suppliersData, suppliersArr, setSuppliersArr, setSuppliersData, convertArrToSpecial, handleOpenAlert } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    const removeSupplier = (supplierName) => {
        // Remove supplierName from supplierArr
        var supIndex = suppliersArr.indexOf(supplierName);
        var tempArr = suppliersArr
        console.log(supplierName);
        if (supIndex != -1){
            tempArr.splice(supIndex, 1);
        }

        // Updating the suppliersArr:
        setSuppliersArr(tempArr);
        // Updating our table's content:
        setSuppliersData(convertArrToSpecial(suppliersArr));
        
        // Initializing Firestore through firebase and saving it to a variable:
        const db = fire.firestore()

        db.collection("suppliers").doc(window.localStorage.getItem("site")).set({
            suppliers: suppliersArr
        })

        // Letting the user know that the supplier was successfully deleted:
        handleOpenAlert('success', 'The supplier was successfully deleted!');
    }

    return (
        <MaterialTable
            title={title}
            columns={[
                { title: 'Supplier Name', field: 'supplierName' },
                { address: 'Address', field: 'address' },
                { serviceType: 'Service Type', field: 'serviceType' },
                { site: 'Site', field: 'site' },
                { sla: 'SLA', field: 'sla' },
                { tin: 'TIN', field: 'tin' },
            ]}
            data={suppliersData}        
            actions={[
                {
                    icon: 'delete',
                    tooltip: 'Remove Supplier',
                    onClick: (event, rowData) => removeSupplier(rowData.supplierName),
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












  
//   <SupplierTable 
//   title="Managed Suppliers" 
//   headerBackground="#26C281" 
//   suppliersData={suppliersData} 
//   setSuppliersData={setSuppliersData} 
//   suppliersArr={suppliersArr} 
//   setSuppliersArr={setSuppliersArr} 
//   convertArrToSpecial={convertArrToSpecial}
//   handleOpenAlert={handleOpenAlert} />