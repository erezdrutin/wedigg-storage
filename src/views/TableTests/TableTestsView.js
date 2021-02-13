import React, { useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import TestsTable from "./TestsTable.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
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
  }
};

const useStyles = makeStyles(styles);

export default function TableTestsView() {
  const classes = useStyles();
  const [data, setData] = useState(
    [
      {deviceName: "iPhone 12", serial: "CF8YNJD4N", sku: "MHB7TY/A", warrantyEndDate: "22/08/2022"},
      {deviceName: "iPhone 12 Mini", serial: "CFMTN5Y4N", sku: "MHB5ZY/A", warrantyEndDate: "11/02/2023"}
    ]);
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Table Tests</h4>
            <p className={classes.cardCategoryWhite}>
              Testing some table related things...
            </p>
          </CardHeader>
          <CardBody>
            <TestsTable 
            title="Tests Table"
            headerBackground="#2E4053"
            data={data}
            setData={setData}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
