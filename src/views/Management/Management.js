import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

// Views:
import Site from "../Sites/Site.js";
import Supplier from "../Suppliers/Supplier.js";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));

export default function Management() {
  const classes = useStyles();
  const [comp, setComp] = React.useState('Sites');
  return (
    <div>
        <FormControl className={classes.formControl}>
            <InputLabel id="select-manage">Section</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={comp}
            onChange={(event) => setComp(event.target.value)}
            >
            <MenuItem value={"Sites"}>Sites</MenuItem>
            <MenuItem value={"Suppliers"}>Suppliers</MenuItem>
            </Select>
        </FormControl>
        {comp === "Sites" ? (
            <Site />
        ): (
            <Supplier />
        )}
    </div>
  );
}
