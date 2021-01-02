import React, { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard.js";
import Grid from '@material-ui/core/Grid';

export default function GenerateCustomCards(props) {
    const { db, cardsArr } = props;
    const [dataArr, setDataArr] = useState([]);

    /**
     * A function in charge of retrieving the count of the devices that match the filters applied by the user.
     * @param {*} cardRec - A record representing a card.
     */
    const addCard = (cardRec) => {
      // Defining the "base" query. We will add the different filters to the query accordingly:
      var query = db.collection("devices");

      // Starting to apply the different filters:
      // 1. Checking if the card is attached to a certain owner.
      if (cardRec.owner.length > 0){
        query = query.where("owner", "in", cardRec.owner)
      }
      // 2. If the card isn't associated with an owner, checking if it's associated with a site:
      else if (cardRec.site.length > 0){
        // Checking if the card is associated with only 1 site:
        if (cardRec.site.length === 1){
          query = query.where("site", "==", cardRec.site[0]);
          // If we got here then the user may have applied "site related" filters - Filtering based on the different options:
          if (cardRec.storage.length > 0){
            query = query.where("storageType", "in", cardRec.storage);
          } else if (cardRec.category.length > 0){
            query = query.where("category", "in", cardRec.category);
          } else if (cardRec.supplier.length > 0){
            query = query.where("supplier", "in", cardRec.supplier);
          }
        } else {
          // The user can't apply any "site related" filters if there's more than 1 site:
          query = query.where("site", "in", cardRec.site);
        }
      }

      // 2. Applying Time Filter for the queries:
      var tempEnd = Date.now();
      switch(cardRec.warrantyEndPeriod){
        case 'Any':
          var tempEnd = 0;
          break;
        case 'A week from today':
          var tempEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'A month from today':
          var tempEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          break;
        case 'A year from today':
          var tempEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          // Default = Any:
          var tempEnd = 0;
          break;
      }
      
      // If a warranty end was selected then applying the filter - otherwise we will ignore dates:
      if (tempEnd !== 0){
        query = query.where("warrantyEnd", "<=", tempEnd);
      }
      
      // Performing the query and returning the size of the query results:
      query.get().then(function(snap){
        console.log("SKSKSKSKS", snap.size)
        // Adding the retrieved count as a field to the card:
        cardRec.count = snap.size;
        // Updating the dataArr accordingly:
        handleAddDataArr(cardRec);
      })
      // Or catching any errors that may occur (& printing them) and returning 0:
      .catch(function(error) {
        console.log("Error getting document:", error);
        // Adding the retrieved count as a field to the card:
        cardRec.count = 0;
        // Updating the dataArr accordingly:
        handleAddDataArr(cardRec);
      });
    }

    /**
     * A function in charge of retrieving the counts relevant to the different cards in the received cardsArr.
     * The function is attached to the cardsArr as a listener, which means that if anything changes in it, the function will run.
     */
    useEffect(() => {
      generateDataArr(); // Calling a function in charge of generating a data array (an array with the different cards & their matching counts).
    }, [cardsArr]);

    /**
     * A function in charge of generating the data array which we will render our "custom" cards based on.
     */
    const generateDataArr = () => {
      cardsArr.forEach(function(curCard){
        // Checking if the card exists in the data array:
        if (dataArr.filter(dataCard => curCard.description === dataCard.description).length === 0){
          // If the card doesn't exist then we should retrieve it's count and add it to the dataArr:
          addCard(curCard);
        }
      })
    }

    /**
     * A function in charge of adding the retrieved record to the dataArr.
     * @param {*} tempArr - An object representing a card record.
     */
    const handleAddDataArr = (rec) => {
      // Adding the card to a temporary array which will contain that card:
      var tempArr = dataArr;
      setDataArr([]);
      tempArr.push(rec);
      setDataArr(tempArr);
    }

    const getCountTest = (cardRec) => {
      console.log("ok?")
      return Math.floor(Math.random() * 10) + 1;
    }
  
    return (
      <React.Fragment>
        <Grid container item xs={12} spacing={4}>
          {
            dataArr.map((cardRec, index) => (
              <DashboardCard key={"cardRec_", index} countTitle={cardRec.count} category="Devices" color={cardRec.color} icon={cardRec.icon} description={cardRec.description} isDefaultCard={false}></DashboardCard>
            ))
          }
        </Grid>
      </React.Fragment>
    )
  }