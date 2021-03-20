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
  const [data, setData] = useState([
    {
      deviceName: "iPhone 12 Pro Max", category: "iPhone 12", site: "Israel", storage: "Main Storage", supplier: "Wediggit", certificate: "SH724892",
      serial: "XY7NTF4JN", sku: "MH7892/A", price: 5300, warrantyStart: Date(), warrantyPeriod: "24", owner: "none", active: true, note: "none"
    }
  ]);


  const [openDeviceQr, setOpenDeviceQr] = useState(false);
  const [currentDevice, setCurrentDevice] = useState('');

  const [site, setSite] = useState('');
  const [storage, setStorage] = useState('');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');
  const [certificate, setCertificate] = useState('');
  const [certificateImage, setCertificateImage] = useState('');

  // useEffect(() => {
  //   console.log("CERTIFICATE UPDATED: ", certificate)
  // }, [certificate])

  /**
   * A function in charge of determining whether the user's input in the General Information panel is valid or not.
   * Verifying the following things:
   * 1. The site, storage, supplier & category exists.
   * 2. The certificate's length is valid.
   * 3. The certificateImage's size is valid (less than 0.05 MB).
   */
  const verifyGeneralInfo = () => {
    
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Your Products</h4>
            <p className={classes.cardCategoryWhite}>
            All your managed products in once space.
            </p>
          </CardHeader>
          <CardBody>

          <ProductTable 
            title="Products Table"
            headerBackground="#2E3D53"
            data={data}
            setData={setData}
            setOpenDeviceQr={setOpenDeviceQr}
            currentDevice={currentDevice}
            setCurrentDevice={setCurrentDevice}
          />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
