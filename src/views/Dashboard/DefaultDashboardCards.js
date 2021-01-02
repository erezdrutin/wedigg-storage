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
  
    /**
     * A function in charge of setting the different counters values based on the received counters values.
     * @param {int} siCount - A number representing the count of sites.
     * @param {int} stCount - A number representing the count of storages.
     * @param {int} deCount - A number representing the count of devices.
     * @param {int} suCount - A number representing the count of suppliers.
     */
    const handleSetCounters = (siCount, stCount, deCount, suCount) => {
      setSitesCount(siCount);
      setStoragesCount(stCount);
      setDevicesCount(deCount);
      setSuppliersCount(suCount);
    }
  
    const getCounts = () => {
      // Defining a reference to the db where we store the defaultCards values:
      var docRef = db.collection("counters").doc('defaultCards');
  
      // Retrieving the defaultCards document from the db:
      docRef.get().then(function(doc) {
        if (doc.exists) {
          var data = doc.data();
          handleSetCounters(data.sites, data.storages, data.devices, data.suppliers);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
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