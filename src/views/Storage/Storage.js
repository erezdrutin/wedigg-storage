import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { grey } from '@material-ui/core/colors';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckboxesTags from './Add_Device/StorageAutoComplete.js';
import Grid from '@material-ui/core/Grid';
import StorageCard from "./StorageCard.js";

import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";

import StorageTable from './StorageTable.js';
import DeviceQrDialog from './DeviceQrDialog';
import hist from '../../history.js';
import EditDevice from "./EditDevice.js";
import AddDevice from "./AddDevice.js";

const GreenCheckbox = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: grey[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);


const colorButtonStyle = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 52,
  padding: '0 30px',
  marginTop: '0px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  maxWidth: '100%',
};

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
    background: 'linear-gradient(45deg, #F39C12 30%, #F5B041 90%)',
    boxShadow: '0 3px 5px 2px rgba(243, 156, 18, .30)',
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

export default function Storage() {
  // Variables Definition:
  const classes = useStyles();
  const [data, setData] = useState([
    {
      siteId: "9Js9w91ZLFnbI5v8KhIm", productId: "9NASxzjq123masIFJn3m", storage: "Storage A", supplierId: "3Js8w91PLFNbI5v8KhIm", certificate: "SH724892",
      certificateImage: "https://firebasestorage.googleapis.com/v0/b/wedigg-storage.appspot.com/o/images%2FSH22049567?alt=media&token=37e6930b-1143-45db-a0eb-91353359b1c4",
      serial: "XY7NTF4JN", warranty: new Date(), ownerId: "", active: true, notes: "None"
    }
  ]);
  const [productsDict, setProductsDict] = useState({
    "9NASxzjq123masIFJn3m": {sku: "MH7892/A", description: "iPhone 12", price: 3800},
    "9SUAD194msaq1293FJ2m": {sku: "MH8531/A", description: "iPhone 12 Pro Max", price: 5000}
  });
  const [sitesDict, setSitesDict] = useState({
    "9Js9w91ZLFnbI5v8KhIm": {name: "Israel", location: "Tel Aviv", storages: ["Storage A", "Storage B"]},
    "9NG6p21ZLFnbI5v8KhIm": {name: "UK", location: "London", storages: ["Storage A", "Storage B"]}
  });
  const [suppliersDict, setSuppliersDict] = useState({
    "3Js8w91PLFNbI5v8KhIm": {site: "Israel", name: "Wediggit"},
    "8KSA21n3fnYKF129d3Ym": {site: "UK", name: "Apple"}
  });

  const [usersArr, setUsersArr] = useState('');

  const [currentDevice, setCurrentDevice] = useState('');

  // Different "Popups" / Pages:
  const [openDeviceQr, setOpenDeviceQr] = useState(false);
  const [openAddDevice, setOpenAddDevice] = useState(false);
  const [openEditDevice, setOpenEditDevice] = useState(false);

  /**
   * A function in charge of setting the openDeviceQr to false and the openEditDevice to true.
   */
  const handleOpenEdit = () => {
    setOpenDeviceQr(false);
    setOpenEditDevice(true);
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Filter Options</h4>
            <p className={classes.cardCategoryWhite}>
              Use the different filter to retrieve specific data.
            </p>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <CheckboxesTags
                  getOptionTitle={(option) => option.deviceName}
                  getOptionDesc={(option) => option.deviceName}
                  data={data}
                  fieldName="Site"
                  placeholderName="site"
                  tooltipTitle="Associated Site"
                />
              </Grid>
              <Grid item xs={3}>
                <CheckboxesTags
                  getOptionTitle={(option) => option.deviceName}
                  getOptionDesc={(option) => option.deviceName}
                  data={data}
                  fieldName="Storage"
                  placeholderName="storage"
                  tooltipTitle="Associated Storage"
                />
              </Grid>
              <Grid item xs={2}>
                <CheckboxesTags
                  getOptionTitle={(option) => option.deviceName}
                  getOptionDesc={(option) => option.deviceName}
                  data={data}
                  fieldName="Supplier"
                  placeholderName="supplier"
                  tooltipTitle="Associated Supplier"
                />
              </Grid>
              <Grid item xs={2}>
                <Tooltip title="Months until the device's warranty ends">
                    <TextField id="outlined-basic" label="Warranty (in months)" variant="outlined" style={{width: '100%'}} />
                </Tooltip>
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Show inactive devices">
                  <FormControlLabel
                    control={<GreenCheckbox style={{marginTop: '0.25rem'}} />}
                    label="Inactive" onChange={() => console.log("inactive changed")} style={{color: 'white'}}
                  />
                </Tooltip>
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => console.log("Clicked on apply filters.")}
                  style={colorButtonStyle}
                  >
                  Filter
                  </Button>
              </Grid>
            </Grid>
          </CardHeader>
          <CardBody>

          <Grid container spacing={3}>
            <Grid item xs={3}>
              <StorageCard countTitle={20} category="Devices" color="info" icon="tv" description="Managed Devices" isDefaultCard={true}/>
            </Grid>
            <Grid item xs={3}>
              <StorageCard countTitle={3} category="Devices" color="success" icon="check_circle" description="Insured Devices" isDefaultCard={true}/>
            </Grid>
            <Grid item xs={3}>
              <StorageCard countTitle={7} category="Suppliers" color="warning" icon="alarm" description="Warranty Ends Soon" isDefaultCard={true}/>
            </Grid>
            <Grid item xs={3}>
              <StorageCard countTitle={10} category="Devices" color="danger" icon="cancel" description="Uninsured Devices" isDefaultCard={true}/>
            </Grid>
          </Grid>
          <StorageTable 
            title=""
            headerBackground="#363636"
            data={data}
            setOpenDeviceQr={setOpenDeviceQr}
            setOpenAddDevice={setOpenAddDevice}
            currentDevice={currentDevice}
            setCurrentDevice={setCurrentDevice}
            productsDict={productsDict}
            sitesDict={sitesDict}
            suppliersDict={suppliersDict}
          />
          </CardBody>
        </Card>
      </GridItem>
      <DeviceQrDialog formTitle={"Device QR Code - " + currentDevice.serial} serial={currentDevice.serial} open={openDeviceQr} setOpen={setOpenDeviceQr} handleOpenEdit={handleOpenEdit}/>
      {
        openEditDevice ? (
          <EditDevice formTitle={"Edit Device - " + currentDevice.serial} serial={currentDevice.serial} open={openEditDevice} setOpen={setOpenEditDevice}/>
        ) : ('')
      }
      {
        openAddDevice ? (
          <AddDevice formTitle={"Add Devices"} open={openAddDevice} setOpen={setOpenAddDevice}/>
        ) : ('')
      }
    </GridContainer>
  );
}
