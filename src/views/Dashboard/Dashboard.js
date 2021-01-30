import React, { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard.js";
import GenerateDefaultCards from "./DefaultDashboardCards.js";
import GenerateCustomCards from "./CustomDashboardCards.js";
import NewCard from './NewCard.js';
import DashboardTable from './DashboardTable.js';
import GenerateAutoComplete from "./GenerateAutoComplete.js";
import fire from '../../fire.js';
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import Button from "components/CustomButtons/Button.js";
// core components
import Grid from '@material-ui/core/Grid';
// Styles:
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { card } from "assets/jss/material-dashboard-react.js";
// Cards:
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// Alerts:
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(styles);
  
const colorButtonStyle = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};

export default function Dashboard(props) {
  // "Main" Variables Definition:
  const classes = useStyles();
  const db = fire.firestore();
  const auth = fire.auth();

  // "useState" Variables Definition:
  const [openNewCard, setOpenNewCard] = useState(false);
  const [cardsArr, setCardsArr] = useState([]);

  // Alert Variables:
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

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
   * Setting the cards array to the received array.
   * @param {[cardRec]} arr - An array containing cardRec records (Objects).
   */
  const handleSetCardsArr = (arr) => {
    setCardsArr(arr);
  }

  /**
   * A function in charge of retrieving the current user's cards from the db.
   */
  const getCardsFromDb = () => {
    var docRef = db.collection("users").doc(auth.currentUser.uid).collection("cards");
    docRef.get().then(function(querySnapshot){
      // Creating a temporary array in which we will hold the retrieved cards records:
      var tempArr = [];
      // Adding each of the card records retrieved from the db to the array:
      querySnapshot.forEach(function(doc){
        var data = doc.data();
        var cardRec = {
          description: data.description,
          color: data.color,
          icon: data.icon,
          owner: data.owner,
          site: data.site,
          storage: data.storage,
          category: data.category,
          supplier: data.supplier,
          warrantyEndPeriod: data.warrantyEndPeriod
        }
        tempArr.push(cardRec);
      })
      // Once we finished fetching & storing all the cards in an array, setting the cards array to the retrieved cards array:
      handleSetCardsArr(tempArr);
    })
  }

  /**
   * A function in charge of initializing our different arrays data (fetching data from the db) as soon as this component loads.
   */
  useEffect(() => {
    getCardsFromDb();
  }, []);

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>Your Dashboard</h4>
        <p className={classes.cardCategoryWhite}>
          All your devices and actions in one space.
        </p>
        {/* Add Card Button Section - Allowing up to 4 custom cards: */}
        <Button
        variant="contained"
        color="warning"
        className={classes.addCardButton}
        endIcon={<Icon>add</Icon>}
        onClick={() => {cardsArr.length < 4 ? setOpenNewCard(true) : handleOpenAlert("error", "The maximum amount of custom cards allowed is 4!")}}
        style={colorButtonStyle}
        >
        Add Card
        </Button>
      </CardHeader>
      <CardBody>
        {/* The following part is in charge of the cards on top of the page: */}
          <Grid style={{display: 'flex', marginTop: '0.5rem', marginBottom: '3.5rem'}}>
            <div style={{width: '80%'}}>
              <Grid container xs={12}>
                  <Grid item xs={2}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={[]} isMultiple={true} handleSetNewVal={() => console.log("erez")} tfLabel="Owner" isDisabled={false} />
                  </Grid>
                  <Grid item xs={2} style={{width: '75%'}}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={[]} isMultiple={true} handleSetNewVal={() => console.log("erez")} tfLabel="Site" isDisabled={false} />
                  </Grid>
                  <Grid item xs={2} style={{width: '75%'}}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={[]} isMultiple={true} handleSetNewVal={() => console.log("erez")} tfLabel="Storage" isDisabled={false} />
                  </Grid>
                  <Grid item xs={2}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={[]} isMultiple={true} handleSetNewVal={() => console.log("erez")} tfLabel="Category" isDisabled={false} />
                  </Grid>
                  <Grid item xs={2}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={[]} isMultiple={true} handleSetNewVal={() => console.log("erez")} tfLabel="Supplier" isDisabled={false} />
                  </Grid>
                  <Grid item xs={2}>
                    <GenerateAutoComplete acID="checkboxes-owners" valuesArr={[]} isMultiple={true} handleSetNewVal={() => console.log("erez")} tfLabel="Warranty" isDisabled={false} />
                  </Grid>
              </Grid>
            </div>
            <div style={{width: '20%', marginLeft: '0.5rem'}}>
              <Grid container xs={12}>
                <Grid item xs={6}>
                  <Button
                  variant="contained"
                  color="warning"
                  endIcon={<Icon>search</Icon>}
                  onClick={() => {cardsArr.length < 4 ? setOpenNewCard(true) : handleOpenAlert("error", "The maximum amount of custom cards allowed is 4!")}}
                  style={colorButtonStyle}
                  >
                  Filter
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
          {/* <Grid item xs={12}> */}
              {/* Generating The 4 Default Cards (which are global) */}
              {/* {GenerateDefaultCards()} */}
              {/* Generating The Custom Cards (which are specific to the current user) */}
              {/* {cardsArr.length > 0 && <GenerateCustomCards db={db} cardsArr={cardsArr} setCardsArr={setCardsArr} handleOpenAlert={handleOpenAlert}></GenerateCustomCards>} */}
          {/* </Grid> */}
          <Grid container xs={12} spacing={8}>
            <Grid item xs={6}>
              <DashboardTable title="Managed Devices" headerBackground="#363636" data={[]} />
            </Grid>
            <Grid container xs={6} spacing={2}>
              <Grid item xs={6}>
                <DashboardCard countTitle={4} category="Sites" color="warning" icon="location_on" description="Total Managed Sites" isDefaultCard={true}/>
              </Grid>
              <Grid item xs={6}>
                <DashboardCard countTitle={9} category="Storages" color="primary" icon="storage" description="Total Managed Storages" isDefaultCard={true}/>
              </Grid>
              <Grid item xs={6} style={{marginTop: '-2.5rem'}}>
                <DashboardCard countTitle={3} category="Devices" color="info" icon="tv" description="Total Managed Devices" isDefaultCard={true}/>
              </Grid>
              <Grid item xs={6} style={{marginTop: '-2.5rem'}}>
                <DashboardCard countTitle={4} category="Suppliers" color="success" icon="storefront" description="Total Managed Suppliers" isDefaultCard={true}/>
              </Grid>
            </Grid>
          </Grid>

          <NewCard open={openNewCard} setOpenNewCard={setOpenNewCard} handleOpenAlert={handleOpenAlert} cardsArr={cardsArr} setCardsArr={setCardsArr}/>


          <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={alertSeverity}>
                {alertText}
            </Alert>
          </Snackbar>
      </CardBody>
    </Card>
  )
}
