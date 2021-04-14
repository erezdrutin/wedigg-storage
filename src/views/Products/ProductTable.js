import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import fire from '../../fire.js';
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

export default function ProductTable(props){
    const { title, headerBackground, data, setData, setCurrentProduct, currentProduct, setOpenEdit, verifyOperationBool, setVerifyOperationBool,
            handleOpenVerifyOperation, handleOpenAlert } = props;
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);

    // ------------------------------------------------------- Adding a supplier ---------------------------------------------------------
    const handleAddProduct = (prod) => {
        const db = fire.firestore();
        var productRec = {
            productSku: prod.productSku,
            productDescription: prod.productDescription,
            productPrice: prod.productPrice,
        }

        db.collection('products')
        .add(productRec)
        .then((docRef) => {
            productRec.productId = docRef.id;
            // Adding the supplier to the suppliers table:
            var tempArr = data.filter(p => p.productSku !== currentProduct.productSku);
            tempArr.push(productRec);
            setData(tempArr);
            // Letting the user know that the operation was successful:
            handleOpenAlert("success", "Successfully created the supplier!");
        })
        .catch((error) => {
            // Letting the user know that the operation wasn't successful:
            handleOpenAlert("error", "Failed to create the supplier!");
        });
    }
    // ------------------------------------------------------- END OF Adding a supplier --------------------------------------------------
    // ------------------------------------------------------- Deleting a supplier -------------------------------------------------------
    /**
     * Attaching a listener to verifyOperationBool which will help us determine when the verifyOperation bool state changes.
     * The main purpose of this function is to determine when the user verifies his selection to delete a certain supplier,
     * and once we verify it then we should delete the selected supplier.
     */
     useEffect(() => {
        let isSubscribed = true;
        if (verifyOperationBool && isSubscribed){
            // Deleting the product from the db:
            deleteProduct();
            // Changing the verifyOperation bool's value (in case the user would like to delete other products):
            setVerifyOperationBool(false);
            // Activating the deletion function to delete the object from the table:
            onRowDelete(currentProduct);
        }
        return () => (isSubscribed = false);
    }, [verifyOperationBool]);

    /**
     * A function in charge of prompting the user to choose whether he wants to delete the chosen product or not.
     * @param {Object} product - An object containing some details regarding the product retrieved from the chosen row from the table.
     */
    const promptToDeleteProduct = (product) => {
        setCurrentProduct(product);
        handleOpenVerifyOperation('Do you really want to delete the product ' + product.productSku
        + '?', 'Once performed, this action can not be undone!');
    }

    const deleteProduct = () => {
        // Removing a supplier from the db:
        // 1. Removing it from the DB.
        // 2. Removing the supplier from the table.
        // 3. "Alerting" the user to let him know that we removed the supplier from the db.
        const db = fire.firestore();
        var docRef = db.collection("products").doc(currentProduct.productId);

        docRef.delete().then(() => {
            // Alerting the user to let them know that we deleted the supplier(s):
            handleOpenAlert("success", "Successfully deleted the supplier!");
        })
        .catch(function(error){
            handleOpenAlert("error", "Failed to delete the supplier! Please try again later.");
            console.error("Error removing document: ", error);
        })
    }
    // ------------------------------------------------------- ENDING OF Deleting a supplier ---------------------------------------------

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
                handleAddProduct(newData);
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
            isLoading={data.length === 0}
            columns={[
                { title: 'SKU', field: 'productSku'},
                { title: 'Device', field: 'productDescription'},
                { title: 'Price', field: 'productPrice'},
            ]}
            data={data}
            onRowClick={(evt, selectedRow) => {
                setSelectedRowIndex(selectedRow.tableData.id);
                (evt.target).ondblclick = () => {
                    setCurrentProduct(selectedRow);
                    setOpenEdit(true);
                }
            }}
            detailPanel={rowData => {
                return (
                    <p style={{marginTop: '10px'}}>
                        <strong>Sku: </strong>{rowData.productSku}<br></br>
                        <strong>Device: </strong>{rowData.productDescription}<br></br>
                        <strong>Price: </strong>{rowData.productPrice}<br></br>
                    </p>
                )
            }}
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
                            <IconButton aria-label="delete" onClick={() => {promptToDeleteProduct(props.data)}} style={{maxWidth: '48px'}}>
                                <DeleteIcon />
                            </IconButton>
                        )
                    }
                },
            }}
        />
    )
  }