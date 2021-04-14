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
import fire from '../../fire.js';

import SiteTable from './SiteTable.js';
import NewSite from './NewSite.js';
import EditSite from './EditSite.js';

// Alerts:
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    background: 'linear-gradient(45deg, #2ECC71 30%, #20E573 90%)',
    boxShadow: '0 3px 5px 2px rgba(32, 229, 115, .30)',
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

export default function Site() {
  const classes = useStyles();
  const [sitesArr, setSitesArr] = useState([]);

  const [openAdd, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentSite, setCurrentSite] = useState('');

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
   * A function in charge of loading sites from the DB.
   */
  const loadSites = () => {
    const db = fire.firestore();

    db.collection("sites").get().then((querySnapshot) => {
      var tempArr = [];
      // Storing all the sites from the db in an array:
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        var curSite = {
          id: doc.id,
          siteName: data.siteName,
          siteLocation: data.siteLocation,
          storagesArr: data.storagesArr
        }
        tempArr.push(curSite);
      })
      // Initializing our sitesArr with the generated array's value:
      handleSetSitesArr(tempArr);
    });
  }

  // A function which will run as soon as the page loads:
  useEffect(() => {
    loadSites();
  }, []);

  /**
   * Setting the sites array to the received array.
   * @param [{*}] arr - An array of site objects.
   */
  const handleSetSitesArr = (arr) => {
    setSitesArr([]);
    setSitesArr(arr);
  }

  const handleSetCurrentSite = (site) => {
    setCurrentSite(site);
  }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader className={classes.headerColor}>
            <h4 className={classes.cardTitleWhite}>Your Sites</h4>
            <p className={classes.cardCategoryWhite}>
            All your managed sites in once space.
            </p>
          </CardHeader>
          <CardBody>

          <SiteTable 
            title="Sites Table"
            headerBackground="#26C281"
            data={sitesArr}
            setData={setSitesArr}
            currentSite={currentSite}
            setCurrentSite={handleSetCurrentSite}
            setOpenEdit={setOpenEdit}
            setOpenNew={setOpenNew}
          />
          </CardBody>
        </Card>
      </GridItem>
      
      <NewSite formTitle="New Site" open={openAdd} setOpen={setOpenNew} data={sitesArr} setData={handleSetSitesArr} handleOpenAlert={handleOpenAlert} />
      <EditSite formTitle="New Site" open={openEdit} setOpen={setOpenEdit} currentSite={currentSite} data={sitesArr} setData={handleSetSitesArr} handleOpenAlert={handleOpenAlert} />

      {/* Displaying alerts to the users */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertText}
          </Alert>
      </Snackbar>
    </GridContainer>
  );
}
