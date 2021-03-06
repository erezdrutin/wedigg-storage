import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { EmojiSymbols, AttachMoney, Subject } from '@material-ui/icons'; // Icons
import fire from '../../fire.js';

export default function EditProduct(props) {
    const { currentProduct, open, setOpen, formTitle, handleUpdateProduct, handleOpenAlert } = props;
    const [productSku, setProductSku] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');

    // A function which will run as soon as the page loads:
    useEffect(() => {
        setProductSku(currentProduct.productSku);
        setProductDescription(currentProduct.productDescription);
        setProductPrice(currentProduct.productPrice);
    }, [currentProduct]);

    const HandleEditProduct = () => {
        const db = fire.firestore();
        var docRef = db.collection('products').doc(currentProduct.productId);

        var productRec = {
            ...(productSku !== currentProduct.productSku && {productSku: productSku}),
            ...(productDescription !== currentProduct.productDescription && {productDescription: productDescription}),
            ...(productPrice !== currentProduct.productPrice && {productPrice: productPrice}),
        }

        var addProductRec = {
            productId: currentProduct.productId,
            productSku: productSku,
            productDescription: productDescription,
            productPrice: productPrice
        };

        docRef.update(productRec)
        .then(() => {
            // Updating the product record in the products table:
            handleUpdateProduct(addProductRec);
            // Letting the user know that the operation was successful:
            handleOpenAlert("success", "Successfully edited the product!");
        })
        .catch((error) => {
            // Letting the user know that the operation wasn't successful:
            handleOpenAlert("error", "Failed to edit the product!");
        });
    }

    /**
     * A function in charge of closing the edit popup.
     */
    const handleCloseCancel = () => {
        // Set open to false:
        setOpen(false);
    }

    /**
     * A function in charge of determining whether the edits performed by the user haven't affected the product's validity.
     * @returns Bool
     */
    const validateProduct = () => {
        return productSku.length >= 2 && productDescription.length >= 2 && parseInt(productPrice) >= 0;
    }

    /**
     * A function in charge of "confirming" the edit popup.
     */
    const handleCloseConfirm = () => {
        if (validateProduct()){
            // Updating the product:
            HandleEditProduct();
            // Set open to false:
            setOpen(false);
        } else {
            handleOpenAlert("error", "Ooops, something went wrong. Did you fill all the data properly?")
        }
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="form-dialog-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{formTitle}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12} style={{display: 'flex'}}>
                        <EmojiSymbols style={{width: '15%', marginTop: '1rem', marginLeft: '-2rem'}}/>
                        <Tooltip title="Product SKU" style={{width: '85%'}}>
                            <TextField disabled id="outlined-productSku" label="Sku" variant="outlined" style={{width: '100%'}} value={productSku} onChange={(event) => setProductSku(event.target.value)} />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} style={{display: 'flex'}}>
                        <Subject style={{width: '15%', marginTop: '1rem', marginLeft: '-2rem'}}/>
                        <Tooltip title="Product Description" style={{width: '85%'}}>
                            {
                                productDescription && productDescription.length < 2 ? (
                                    <TextField error helperText="The product's description is too short!" id="outlined-productDescription" label="Description" variant="outlined" style={{width: '100%'}} value={productDescription} onChange={(event) => setProductDescription(event.target.value)} />
                                ) : (
                                    <TextField id="outlined-productDescription" label="Description" variant="outlined" style={{width: '100%'}} value={productDescription} onChange={(event) => setProductDescription(event.target.value)} />
                                )
                            }
                        </Tooltip>                     
                    </Grid>
                    <Grid item xs={12} style={{display: 'flex'}}>
                        <AttachMoney style={{width: '15%', marginTop: '1rem', marginLeft: '-2rem'}}/>
                        <Tooltip title="Product Price" style={{width: '85%'}}>
                            {
                                productPrice && (isNaN(productPrice) || parseInt(productPrice) < 0) ? (
                                    <TextField error helperText="The product's price must be a positive number!" id="outlined-productPrice" label="Price" variant="outlined" style={{width: '100%'}} value={productPrice} onChange={(event) => setProductPrice(event.target.value)} />
                                ) : (
                                    <TextField id="outlined-productPrice" label="Price" variant="outlined" style={{width: '100%'}} value={productPrice} onChange={(event) => setProductPrice(event.target.value)} />
                                )
                            }
                        </Tooltip>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseCancel} color="primary">
                Cancel
                </Button>
                <Button onClick={handleCloseConfirm} color="primary" autoFocus>
                Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
