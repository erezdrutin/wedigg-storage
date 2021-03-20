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

import SupplierTable from './SupplierTable.js';
import NewSupplier from './NewSupplier.js';
// import EditSite from './EditSite.js';

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
    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .30)',
    margin: "0 15px",
    padding: "0",
    position: "relative",
    padding: "0.75rem 1.25rem",
    marginBottom: "0",
    borderBottom: "none",
    borderRadius: "3px",
    marginTop: "-20px",
    padding: "15px",
    height: "5.75rem"
  },
};

const useStyles = makeStyles(styles);

export default function Supplier() {
  const classes = useStyles();
  const [data, setData] = useState([
    {name: "Site A", location: "Israel", storagesArr: ["Stoage A", "Storage B", "Storage C"], note: "None"},
    {name: "Site B", location: "Israel", storagesArr: ["Stoage D", "Storage E", "Storage F"], note: "None"},
  ]);

  const [openAdd, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentSite, setCurrentSite] = useState('');

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Your Suppliers</h4>
            <p className={classes.cardCategoryWhite}>
            All your managed suppliers in once space.
            </p>
          </CardHeader>
          <CardBody>

          <SupplierTable 
            title="Suppliers Table"
            headerBackground="#3374FF"
            data={data}
            setData={setData}
            currentSite={currentSite}
            setCurrentSite={setCurrentSite}
            setOpenEdit={setOpenEdit}
            setOpenNew={setOpenNew}
          />
          </CardBody>
        </Card>
      </GridItem>
      <NewSupplier formTitle="New Supplier" open={openAdd} setOpen={setOpenNew}/>
    </GridContainer>
  );
}
