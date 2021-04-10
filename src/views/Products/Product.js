import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Grid from '@material-ui/core/Grid';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
import TextField from '@material-ui/core/TextField';

import ProductTable from './ProductTable.js';
import EditProduct from './EditProduct.js';

const colorButtonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 55,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    maxWidth: '75%',
    marginTop: '-1px'
};

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField);

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "1rem"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  headerColor: {
    background: 'linear-gradient(45deg, #2E3753 30%, #2E3D53 90%)',
    boxShadow: '0 3px 5px 2px rgba(46, 61, 83, .30)',
    margin: "0 15px",
    padding: "0",
    position: "relative",
    padding: "0.75rem 1.25rem",
    marginBottom: "0",
    borderBottom: "none",
    borderRadius: "3px",
    marginTop: "-20px",
    padding: "15px",
  },
};

const useStyles = makeStyles(styles);

export default function Product() {
  const classes = useStyles();

  // Component Variables:
  const [productsArr, setProductsArr] = useState([]);
  const [currentProduct, setCurrentProduct] = useState('');

  // Open Pop-ups variables:
  const [alertOpen, setAlertOpen] = useState(false);
  const [openVerifyOperation, setOpenVerifyOperation] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Verify Operation Variables:
  const [verifyOperationBool, setVerifyOperationBool] = useState(false);
  const [verifyOperationTitle, setVerifyOperationTitle] = useState('Default Title');
  const [verifyOperationText, setVerifyOperationText] = useState('Default Text');
  const [verifyOperationFunction, setVerifyOperationFunction] = useState('Default Function');
  
  // Alert Variables:
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

  /**
   * A function in charge opening the verify operation dialog.
   * @param {string} title - The title of the dialog.
   * @param {string} text - The text of the dialog.
  */
  const handleOpenVerifyOperation = (title, text) => {
    setOpenVerifyOperation(true);
    setVerifyOperationTitle(title);
    setVerifyOperationText(text);
  }

  // ---------------------------------------------------------------------------------------------------------------------------
  // Alert Functions:
  /**
   * A function in charge of opening an alert.
   * @param {string} severity - The color of the alert.
   * @param {string} text - The text displayed in the alert.
   */
  const handleOpenAlert = (severity, text) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  /**
   * A function in charge of closing an alert.
   * @param {string} reason - A string representing the reason for closing the alert.
   */
  const handleCloseAlert = (reason) => {
    // Not closing the alert in case of a click on the screen:
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };
  // ---------------------------------------------------------------------------------------------------------------------------


  /**
   * A function in charge of initializing the productsArr with the received vlaues.
   * @param {[*]} arr - An array of products objects.
   */
   const handleSetProductsArr = (arr) => {
    setProductsArr([]);
    setProductsArr(arr);
  }

  
  /**
   * A function in charge of updating a product record in our products table.
   * @param {*} productRec - A record representing a product which we would like to add.
  */
  const handleUpdateProduct = (productRec) => {
    var tempArr = productsArr.filter(p => p.productId !== productRec.productId);
    tempArr.push(productRec);
    setCurrentProduct(productRec);
    console.log(productRec)
    handleSetProductsArr(tempArr);
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Your Products</h4>
            <p className={classes.cardCategoryWhite}>
            All your managed products in one space.
            </p>
          </CardHeader>
          <CardBody>

          <ProductTable 
            title="Products Table"
            headerBackground="#2E3D53"
            data={productsArr}
            setData={setProductsArr}
            currentProduct={currentProduct}
            setCurrentProduct={setCurrentProduct}
            setOpenEdit={setOpenEdit}
          />
          </CardBody>
        </Card>
      </GridItem>

      <EditProduct formTitle="Edit Product" open={openEdit} setOpen={setOpenEdit} productsArr={productsArr} handleOpenAlert={handleOpenAlert} currentProduct={currentProduct} handleUpdateProduct={handleUpdateProduct}/>
    </GridContainer>
  );
}
