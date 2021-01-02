import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/core
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { grayColor } from "assets/jss/material-dashboard-react.js";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import Icon from '@material-ui/core/Icon';

import AppleIcon from '@material-ui/icons/Apple';
import { faBox, faMobileAlt, faStore, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import Button from "components/CustomButtons/Button.js";
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
    const { countTitle, category, color, icon, description, isDefaultCard } = props;

    /**
     * A function in charge of handling a click on the edit button.
     */
    const handleEditClick = () => {
        console.log("Clicked on edit!");
    }

    /**
     * A function in charge of handling a click on the delete button.
     */
    const handleDeleteClick = () => {
        console.log("Clicked on delete!");
    }

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
                            <IconButton className={classes.trashButton} style={{color: '#DB4D46'}} onClick={handleDeleteClick}>
                                <DeleteIcon style={{width: '20px', height: '20px'}}></DeleteIcon>
                            </IconButton>
                            <IconButton className={classes.editButton} style={{color: '#ED9B3B'}} onClick={handleEditClick}>
                                <EditIcon style={{width: '20px', height: '20px'}}></EditIcon>
                            </IconButton>
                        </div>
                        {/* <Button variant="contained" color="danger" className={classes.deleteButton} onClick={console.log("CLICKED REMOVE")}>Remove</Button> */}
                    </CardFooter>
                )
            }
          </Card>
        </Grid>
      </React.Fragment>
    );
  }