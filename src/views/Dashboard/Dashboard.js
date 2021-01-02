import React, { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard.js";
import GenerateDefaultCards from "./DefaultDashboardCards.js";
import GenerateCustomCards from "./CustomDashboardCards.js";
import NewCard from './NewCard.js';
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
  
  /**
   * Setting the cards array to the received array.
   * @param {[cardRec]} arr - An array containing cardRec records (Objects).
   */
  const handleSetCardsArr = (arr) => {
    console.log("EREZ ==> ", arr)
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
    <div>
    {/* The following part is in charge of the cards on top of the page: */}
    
      <div>
        {/* Add Card Button Section: */}
        <Button
        variant="contained"
        color="warning"
        className={classes.addCardButton}
        endIcon={<Icon>add</Icon>}
        onClick={() => {setOpenNewCard(true)}}
        style={colorButtonStyle}
        >
        Add Card
        </Button>
        {GenerateDefaultCards()}
        <Grid container item xs={12} spacing={4}>
          {
            cardsArr.length > 0 && <GenerateCustomCards db={db} cardsArr={cardsArr}></GenerateCustomCards>
          }
          {/* <DashboardCard countTitle="13" category="Devices" color="danger" icon="calendar_today" description="Total Managed Devices in Home at Israel" isDefaultCard={false}/> */}
        </Grid>
      </div>

      <NewCard open={openNewCard} handleCancel={() => {setOpenNewCard(false)}} handleOk={() => {setOpenNewCard(false)}}/>
    </div>
  )
}
