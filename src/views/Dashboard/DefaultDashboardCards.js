import React, { useState, useEffect } from "react";
import DashboardCard from "./DashboardCard.js";
import Grid from '@material-ui/core/Grid';
import fire from '../../fire.js';

export default function GenerateDefaultCards(props) {
    // We should have multiple function, each in charge of retrieving different data from the db:
    // 1. Retrieve count of sites.
    // 2. Retrieve count of storages (Meaning that for each site we should count & add the length of the storages count).
    // 3. Retrieve count of devices (count all devices).
    // 4. Retrieve count of suppliers (count all suppliers).
  
    const db = fire.firestore();
    const [sitesCount, setSitesCount] = useState(0);
    const [storagesCount, setStoragesCount] = useState(0);
    const [devicesCount, setDevicesCount] = useState(0);
    const [suppliersCount, setSuppliersCount] = useState(0);
    
    // Defining an array of objects connecting between the set functions of each counter and it's reference in the db:
    const docRefs = [
      {setFunc : setSitesCount, ref: db.collection("counters").doc("sites")},
      {setFunc : setStoragesCount, ref: db.collection("counters").doc("storages")},
      {setFunc : setDevicesCount, ref: db.collection("counters").doc("devices")},
      {setFunc : setSuppliersCount, ref: db.collection("counters").doc("suppliers")},
    ]

    /**
     * A function in charge handling the setting of the different counters and their values.
     * @param {*} field - A function that sets the matching counter's value.
     * @param {*} counter - The counter to set it's value.
     */
    const handleSetCounter = (setFunc, counter) => {
      setFunc(counter);
    }
  
    const getCounts = () => {
      docRefs.forEach(function(docRef){
        docRef.ref.get().then(function(doc){
          if (doc.exists){
            var data = doc.data();
            handleSetCounter(docRef.setFunc, data.count);
          }
        })
        .catch(function(error){
          console.log("Error getting document:", error);
        });
      })
    }
    
    useEffect(() => {
      // Retrieving all the counters from the db:
      getCounts();
    }, []);
  
    return (
      <React.Fragment>
        <Grid container item xs={12} spacing={4}>
          <DashboardCard countTitle={sitesCount} category="Sites" color="warning" icon="location_on" description="Total Managed Sites" isDefaultCard={true}/>
          <DashboardCard countTitle={storagesCount} category="Storages" color="primary" icon="storage" description="Total Managed Storages" isDefaultCard={true}/>
          <DashboardCard countTitle={devicesCount} category="Devices" color="info" icon="tv" description="Total Managed Devices" isDefaultCard={true}/>
          <DashboardCard countTitle={suppliersCount} category="Suppliers" color="success" icon="storefront" description="Total Managed Suppliers" isDefaultCard={true}/>
        </Grid>
      </React.Fragment>
    )
  }