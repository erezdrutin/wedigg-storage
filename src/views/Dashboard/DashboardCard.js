import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/core
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { grayColor } from "assets/jss/material-dashboard-react.js";
import DeleteIcon from '@material-ui/icons/Delete';
import VerifyOperation from "../VerifyOperation.js";

import Icon from '@material-ui/core/Icon';

import { faBox, faMobileAlt, faStore, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
// core components
import Grid from '@material-ui/core/Grid';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardFooter from "components/Card/CardFooter.js";
import fire from '../../fire.js';
import hist from '../../history.js';


const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    deleteButton: {
      float: 'right',
      width: '100px',
      margin: theme.spacing(1),
    },
    trashButton: {
        width: '50px',
        height: '50px',
        float: 'right',
        margin: theme.spacing(1),
        alignSelf: 'flex-end',
        marginRight: '-1vh',
    },
    editButton: {
        width: '50px',
        height: '50px',
        float: 'right',
        margin: theme.spacing(1),
        alignSelf: 'flex-end',
        marginRight: '-2vh',
    },
    root: {
      margin: theme.spacing(1),
      float: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardCategory: {
        color: grayColor[0],
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        paddingTop: "10px",
        marginBottom: "0"
    },
    cardTitle: {
        color: grayColor[2],
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
          color: grayColor[1],
          fontWeight: "400",
          lineHeight: "1"
        }
    },
    detailLine: {
      marginTop: '15px',
      marginLeft: '15px',
      marginBottom: '-15px',
    },
    upperSelectFormControl: {
      margin: theme.spacing(1),
      minWidth: '10rem',
    },
}));

  const footerClickOnSite = () => {
    hist.replace('/admin/site');
  }
  const footerClickOnDevice = () => {
    hist.replace('/admin/storage');
  }
  const footerClickOnStorage = () => {
    hist.replace('/admin/storage');
  }
  const footerClickOnSupplier = () => {
    hist.replace('/admin/supplier');
  }

  // Retrieving an icon for the card's header:
  function getDefaultFooterIcon(description) {
    switch(description) {
      case "Total Managed Sites":
        return (
            <IconButton style={{width:'50px', height: '50px'}} color="primary"
              onClick={footerClickOnSite}>
                <FontAwesomeIcon icon={faMapMarkedAlt} style={{width: '20px', height: '20px'}}/>
            </IconButton>
        );
      case "Total Managed Devices":
        return (
            <IconButton style={{width:'50px', height: '50px'}} color="primary"
              onClick={footerClickOnDevice}>
                <FontAwesomeIcon icon={faMobileAlt} style={{width: '20px', height: '20px'}}/>
            </IconButton>
        );
      case "Total Managed Storages":
        return (
            <IconButton style={{width:'50px', height: '50px'}} color="primary"
              onClick={footerClickOnStorage}>
                <FontAwesomeIcon icon={faBox} style={{width: '20px', height: '20px'}}/>
            </IconButton>
        );
      case "Total Managed Suppliers":
        return (
            <React.Fragment>
                <IconButton style={{width:'50px', height: '50px'}} color="primary"
                onClick={footerClickOnSupplier}>
                    <FontAwesomeIcon icon={faStore} style={{width: '20px', height: '20px'}}/>
                </IconButton>
            </React.Fragment>
        );
    }
  }

export default function DashboardCard(props) {
    const classes = useStyles();
    const { countTitle, category, color, icon, description, isDefaultCard, handleOpenAlert, dataArr, setDataArr, cardsArr, setCardsArr } = props;
            
      // Verify Operation Variables:
      const [openVerifyOperation, setOpenVerifyOperation] = useState(false);
      const [verifyOperationTitle, setVerifyOperationTitle] = useState('Default Title');
      const [verifyOperationText, setVerifyOperationText] = useState('Default Text');
      const [verifyOperationBool, setVerifyOperationBool] = useState(false);
  
      // ---------------------------------------------------------------------------------------------------------------------------
      // Verify Operation Functions:
      /**
       * A function in charge opening the verify operation dialog.
       * @param {string} title - The title of the dialog.
       * @param {string} text - The text of the dialog.
       */
      const handleOpenVerifyOperation = (title, text) => {
        setOpenVerifyOperation(true);
        setVerifyOperationTitle(title);
        setVerifyOperationText(text);
      }
      // ---------------------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------- Deleting a card -------------------------------------------------------
    /**
     * Attaching a listener to verifyOperationBool which will help us determine when the verifyOperation bool state changes.
     * The main purpose of this function is to determine when the user verifies his selection to delete a certain card,
     * and once we verify it then we should delete the selected card.
     */
    useEffect(() => {
      if (verifyOperationBool === true){
          deleteCard()
          setVerifyOperationBool(false);
      }
    }, [verifyOperationBool]);

    /**
     * A function in charge of prompting the user to choose whether he wants to delete the chosen card or not.
     */
    const promptToDeleteCard = () => {
        handleOpenVerifyOperation('Do you really want to delete the card ' + description
        + '?', 'Once performed, this action can not be undone!');
    }

    /**
     * A function in charge of setting the data arr to the received arr.
     * @param {[cardRec]} arr - An array of card records.
     */
    const handleSetDataArr = (arr) => {
      setDataArr(arr);
    }

    /**
     * A function in charge of setting the cards arr to the received arr.
     * @param {[cardRec]} arr - An array of card records.
     */
    const handleSetCardsArr = (arr) => {
      setCardsArr(arr);
    }

    /**
     * A function in charge of removing the current card from the dataArr & the cardsArr.
     */
    const removeCardFromArr = () => {
      var tempCardsArr = dataArr.filter(cur => cur.description !== description);
      var tempDataArr = dataArr.filter(cur => cur.description !== description);
      handleSetCardsArr(tempCardsArr);
      handleSetDataArr(tempDataArr);
    }

    const deleteCard = () => {
      // Removing a card:
      // 1. Removing it from the DB.
      // 2. Removing it from the table.
      // 3. "Alerting" the user to let them know that we removed the chosen card.
      const db = fire.firestore();
      const auth = fire.auth();
      var query = db.collection("users").doc(auth.currentUser.uid).collection("cards").where("description", "==", description);
      query.get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          doc.ref
          .delete()
          .catch(function(error){
            handleOpenAlert("error", "An error has occurred. Please try again later!");
          })
        })
        // Once we deleted the card we can also delete it from the array of cards (removing based on description):
        removeCardFromArr();
        // Alerting the user to let them know that we deleted the card:
        handleOpenAlert("success", "Successfully deleted the card!");
      })
    }
    // ------------------------------------------------------- Deleting a card -------------------------------------------------------

    return (
      <React.Fragment>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color={color} stats icon>
              <CardIcon color={color}>
                <Icon>{icon}</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>{category}</p>
              <h3 className={classes.cardTitle}>{countTitle}</h3>
            </CardHeader>
            <p className={classes.detailLine}>{description}</p>
            
            {
                isDefaultCard ? (
                    <CardFooter stats>
                        {getDefaultFooterIcon(description)}
                    </CardFooter>
                ) : (
                    <CardFooter stats>
                        <IconButton style={{width:'50px', height: '50px'}} color="primary"
                        onClick={footerClickOnDevice}>
                            <FontAwesomeIcon icon={faMobileAlt} style={{width: '20px', height: '20px'}}/>
                        </IconButton>
                        <div>
                            <IconButton className={classes.trashButton} style={{color: '#DB4D46'}} onClick={promptToDeleteCard}>
                                <DeleteIcon style={{width: '24px', height: '24px'}}></DeleteIcon>
                            </IconButton>
                        </div>
                        {/* <Button variant="contained" color="danger" className={classes.deleteButton} onClick={console.log("CLICKED REMOVE")}>Remove</Button> */}
                    </CardFooter>
                )
            }
          </Card>
        </Grid>
        <VerifyOperation open={openVerifyOperation} setOpen={setOpenVerifyOperation} setBoolVal={setVerifyOperationBool}
        dialogText={verifyOperationText} dialogTitle={verifyOperationTitle}/>
      </React.Fragment>
    );
  }