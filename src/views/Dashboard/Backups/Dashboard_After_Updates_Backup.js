import React, { useState, useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import IconButton from '@material-ui/core/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTv, faClock, faRocket, faBomb, faPercentage, faMobileAlt, faMapMarkerAlt, faWarehouse, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Button from "components/CustomButtons/Button.js";
// @material-ui/icons
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { bugs, website, server } from "variables/general.js";
import fire from '../../../fire.js';
import Link from '@material-ui/core/Link';
import hist from '../../../history.js';
import DeleteIcon from '@material-ui/icons/Delete';




// New Card Stuff:
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NewCard from '../NewCard.js';


import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

/*
  <CardElement headerColor='primary' iconNum='1' cardCategoryText='Devices' cardTitleText='7200' footerIconNum='1' footerText='Total Devices Stored'/>
      <CardElement headerColor='info' iconNum='2' cardCategoryText='Warehouses' cardTitleText='40' footerIconNum='2' footerText='Total Warehouses Managed'/>
       <CardElement headerColor='success' iconNum='3' cardCategoryText='Insured Devices' cardTitleText='4500' footerIconNum='1' footerText='Total Devices Insured'/>
      <CardElement headerColor='danger' iconNum='4' cardCategoryText='UnInsured Devices' cardTitleText='2700' footerIconNum='1' footerText='Total Devices UnInsured'/>
      <CardElement headerColor='danger' iconNum='5' cardCategoryText='Warranty Expires Soon' cardTitleText='1150' footerIconNum='1' footerText='Total Devices Which Will Soon Be UnInsured'/>
      <CardElement headerColor='primary' iconNum='6' cardCategoryText='Capacity Usage' cardTitleText='75%' footerIconNum='2' footerText='Total Capacity Usage From Available Warehouses'/>
*/
const cards = [{cardType: 1, headerColor:'primary', iconNum:'1', cardCategoryText:'Sites', cardTitleText:'10', footerIconNum:'1', footerText:'Total Sites Managed'},
{cardType: 2, headerColor:'info', iconNum:'2', cardCategoryText:'Storages', cardTitleText:'40', footerIconNum:'2', footerText:'Total Storages Managed'},
{cardType: 3, headerColor: 'warning', iconNum: '3', cardCategoryText: 'Products', cardTitleText: '7200', footerIconNum: '3', footerText: 'Total Products Managed'},
{cardType: 4, headerColor:'success', iconNum:'4', cardCategoryText:'Insured Devices', cardTitleText:'4500', footerIconNum:'3', footerText:'Total Devices Insured'},
{cardType: 5, headerColor:'danger', iconNum:'5', cardCategoryText:'Uninsured Devices', cardTitleText:'2700', footerIconNum:'3', footerText:'Total Devices Uninsured'},
{cardType: 6, headerColor:'danger', iconNum:'6', cardCategoryText:'Warranty Expires Soon', cardTitleText:'1150', footerIconNum:'3', footerText:'Total Devices Which Will Soon Be UnInsured'},
{cardType: 7, headerColor:'primary', iconNum:'7', cardCategoryText:'Capacity Usage', cardTitleText:'75%', footerIconNum:'2', footerText:'Total Capacity Usage In Managed Warehouses'}];

const cardColors = ['info', 'success', 'warning', 'danger', 'primary'];

const newCardTypeOptions = [
  'Count Of Devices', 'Count Of Warehouses', 'Warehouses Capacity %', 'Count Of Insured Devices', 'Count Of Uninsured Devices %', 'Devices Whose Warranty Is About To Expire'
]

const newCardColorOptions = [
  'Cyan', 'Green', 'Orange', 'Red', 'Purple'
]
  
const colorButtonStyle = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
};

const otherUseStyles = makeStyles((theme) => ({
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
  root: {
    margin: theme.spacing(1),
    float: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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

export default function Dashboard(props) {
  const [firstRender, setFirstRender] = useState(true);
  // Variables Definition:
  const classes = useStyles();
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const otherClasses = otherUseStyles();
  const [createNewCard, setCreateNewCard] = useState('');
  const [cardsArr, setCardsArr] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [selectedCardColor, setSelectedCardColor] = useState('');
  const [site, setSite] = useState('');
  const [sitesArr, setSitesArr] = useState([]);
  const [storage, setStorage] = useState('');
  const [storagesArr, setStoragesArr] = useState([]);
  const [category, setCategory] = useState('');
  const [categoriesArr, setCategoriesArr] = useState([]);
  const [selectDataArr, setSelectDataArr] = useState([]);
  const [openNewCard, setOpenNewCard] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [age, setAge] = React.useState('');

  const filterButtonStyle = {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 55,
    maxWidth: '120px',
    padding: '0 30px',
    marginTop: '7px',
    marginLeft: '10px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  };

  // Retrieving an icon for the card's header:
  function retrieveHeaderIcon(iconNum) {
    iconNum = iconNum ? iconNum : 0
    switch(iconNum) {
      // Devices Cards
      case '1':
        return <FontAwesomeIcon icon={faMapMarkedAlt}/>;
      // Warehouses Cards
      case '2':
        return <FontAwesomeIcon icon={faBox}/>;
      case '3':
        return <FontAwesomeIcon icon={faTv}/>;
      // Timed Cards
      case '4':
        return <FontAwesomeIcon icon={faRocket}/>;
      // Insured Devices
      case '5':
        return <FontAwesomeIcon icon={faBomb}/>;
      // Uninsured devices
      case '6':
        return <FontAwesomeIcon icon={faClock}/>;
      case '7':
        return <FontAwesomeIcon icon={faPercentage}/>;
    }
  }

  // Retrieving an icon for the card's footer:
  function retrieveFooterIcon(iconNum) {
    iconNum = iconNum ? iconNum : 0
    switch(iconNum) {
      // Devices Cards
      case '1':
        return <FontAwesomeIcon icon={faMapMarkerAlt} style={{width: '20px', height: '20px'}} />;
      // Warehouses Cards
      case '2':
        return <FontAwesomeIcon icon={faWarehouse} style={{width:'20px', height: '20px'}} />;
      case '3':
        return <FontAwesomeIcon icon={faMobileAlt} style={{width:'20px', height: '20px'}} />;
      default:
        return <faTv />;
    }
  }

  function CardElement(props) {
    const { headerColor, iconNum, cardCategoryText, cardTitleText, footerIconNum, footerText, cardsArr, setCardsArr } = props;

    /* A function that handles the removal of a card from the screen. */
    const handleRemove = () => {
      // Removing a new card, both from the DB & the screen:
      var cardIndex = cardsArr[iconNum-1]
      // Removing the card from the array:
      const index = iconNum-1;
      cardsArr.splice(index, 1);
      console.log(cardsArr);
      
      // Gathering all the existing cards (without the removed one) and converting them to the string format applied for card details:
      var docArr = []
      cardsArr.forEach(function (item, index) {
        docArr.push(`${index},${item.headerColor}`)
      })
      console.log(docArr);

      // Initializing Firestore through firebase and saving it to a variable:
      const db = fire.firestore()

      // Defining a reference to our document:
      var docRef = db.collection("users").doc(fire.auth().currentUser.uid);
      console.log(docRef);
      
      // Updating the cards array in the db:
      docRef.update({
        cards: docArr
      })
      .then(function() {
        console.log("Document successfully updated!");
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
      // Setting our variable that stores the user's cards' value to the array of cards that we have just created:
      setCardsArr(cardsArr);

      // Reloading the page:
      hist.replace('/admin/dashboard');
    }

    return (
      <React.Fragment>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color={headerColor} stats icon>
              <CardIcon color={headerColor}>
                {retrieveHeaderIcon(iconNum)}
              </CardIcon>
              <p className={classes.cardCategory}>{cardCategoryText}</p>
              <h3 className={classes.cardTitle}>{cardTitleText}</h3>
            </CardHeader>
            <p className={otherClasses.detailLine}>{footerText}</p>

            <CardFooter stats>
              <IconButton style={{width:'40px', height: '40px'}} color="primary"
              onClick={footerIconNum == '1' ? ()=> {hist.replace('/admin/device')} : () => {hist.replace('/admin/warehouse')}}>
                {retrieveFooterIcon(footerIconNum)}
              </IconButton>
              <Button variant="contained" color="danger" className={otherClasses.deleteButton} onClick={handleRemove}>
                Remove
              </Button>
            </CardFooter>
          </Card>
        </Grid>
      </React.Fragment>
    );
  }

  /**
   * A function in charge of retrieving the details which we will use in the different selects that appear on the top of the page.
   * Our DB is configured in such way which will make it easy for us to pull all the SELECT fields quickly from 1 Read.
   * Basically, all we have to do is to run through (/sites) in our db, and we will receive a dictionary which will look like so:
   * {siteName: "", categoriesArr: [], storageTypesArr: []}
   */
  const getSelectSites = () => {
    const db = fire.firestore();
    var tempArr = [];
    db.collection("sites").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        var data = doc.data()
        var selectRec = {
          siteName: doc.id,
          categoriesArr: data.categoriesArr,
          storageTypesArr: data.storageTypesArr
        }
        // Pushing the record we created:
        tempArr.push(selectRec);
      })
      // Setting the selectDataArr to the retrieved data:
      handleSetSelectDataArr(tempArr);
    })
  }

  /**
   * A function in charge of setting the selectDataArr variable to the received arr.
   * @param {string []} arr - An array with the select data. 
   */
  const handleSetSelectDataArr = (arr) => {
    setSelectDataArr(arr);
    // Setting the sites arr:
    setSitesArr(arr.map(a => a.siteName));
    console.log(arr);
  }

  function getUserDetails() {
    if (!fullName && !company){   
      // Initializing Firestore through firebase and saving it to a variable:
      const db = fire.firestore();
      // Defining a reference to our document:
      var docRef = db.collection("users").doc(fire.auth().currentUser.uid);
      // Then running a DB query to retrieve the user's full name & his company:
      docRef.get().then(function(doc) {
        if (doc.exists) {
            // Storing the full name of the user and his company:
            setFullName(doc.data().fullName);
            setCompany(doc.data().company);

            // Retrieving the user's cards from the db:
            var tempCardsArr = [];
            var userCardsArr = doc.data().cards;

            // If the user have any cards:
            console.log(userCardsArr)
            if (userCardsArr !== []){
              userCardsArr.forEach(element => {
                var elements=element.split(',');
                // First adding the card by it's index:
                var curCard = cards[parseInt(elements[0])];
                curCard.headerColor = elements[1];
                tempCardsArr.push(curCard);
              });
            }

            // Setting our variable that stores the user's cards' value to the array of cards that we have just created:
            setCardsArr(tempCardsArr);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
  }

  // Basically this function runs itself as soon as the component loads itself:
  useEffect(() => {
    if (firstRender){
      getSelectSites();
      getUserDetails();
      setFirstRender(false);
    }
  });

 

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };

  const handleCardTypeChange = (event) => {
    setSelectedCardType(Number(event.target.value) || 0);
  }

  const handleCardColorChange = (event) => {
    setSelectedCardColor(Number(event.target.value) || 0);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    // Add new card, both to DB & to the screen:
    var tempTypesArr=[]
    // Creating an array with all the card types that already exist:
    cardsArr.forEach(function (item, index) {
      tempTypesArr.push(item.cardType)
    })
    // Verifying that the card type which the user is attempting to add doesn't exist yet:
    if (!tempTypesArr.includes(selectedCardType)){
      // If the selected card type isn't in the array then we can add it:
      var tempCardsArr = cardsArr;
      // Storing the card selected by the user & setting it's color according to the user's choice:
      var tempCard = cards[selectedCardType-1];
      tempCard.headerColor = cardColors[selectedCardColor-1];
      // adding the card to the temporary array we created and updating our array:
      tempCardsArr.push(tempCard);
      setCardsArr(tempCardsArr);
      // Closing the pop up form:
      setOpen(false);

      let dbNewArrValue = `${selectedCardType-1},${cardColors[selectedCardColor-1]}`;
      console.log(dbNewArrValue);
      // Initializing Firestore through firebase and saving it to a variable:
      const db = fire.firestore()
      // Defining a reference to our document:
      var docRef = db.collection("users").doc(fire.auth().currentUser.uid);
      // Gathering all the existing cards (including the new one) and converting them to the string format applied for card details:
      var docArr = []
      cardsArr.forEach(function (item, index) {
        docArr.push(`${index},${item.headerColor}`)
      })
      // Updating the cards array in the db:
      docRef.update({cards: docArr});
    }
  }
  

  return (
    <div>
    {/* The following part is in charge of the cards on top of the page: */}
    
      <div>
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

        {fullName ? <h3>Welcome {fullName}</h3> : <h3></h3>}

        <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
          <InputLabel id="select-site-outlined-label">Site</InputLabel>
          <Select
            labelId="select-site-outlined-label"
            id="select-site-outlined"
            value={site}
            onChange={event => {
              var curSite = event.target.value;
              // 1. Setting a site:
              setSite(curSite)
              // 2. Updating the storage types & categories arrays accordingly:
              // First finding the record in the selectDataArr which matches our siteName:
              if (selectDataArr[curSite]){
                setStoragesArr(selectDataArr[curSite].storageTypesArr);
                setCategoriesArr(selectDataArr[curSite].categoriesArr);
              } else {
                setStorage("");
                setCategory("");
                setStoragesArr([]);
                setCategoriesArr([]);
              }
            }}
            label="Site"
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {sitesArr.map((option, index) => (
                <MenuItem key={"sitesArr_", index} value={index}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
          <InputLabel id="select-storage-outlined-label">Storage</InputLabel>
          <Select
            labelId="select-storage-outlined-label"
            id="select-storage-outlined"
            value={storage}
            onChange={event => setStorage(event.target.value)}
            label="Storage"
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {storagesArr.map((option, index) => (
                <MenuItem key={"storagesArr_", index+1} value={index+1}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={otherClasses.upperSelectFormControl}>
          <InputLabel id="select-category-outlined-label">Category</InputLabel>
          <Select
            labelId="select-category-outlined-label"
            id="select-category-outlined"
            value={category}
            onChange={event => setCategory(event.target.value)}
            label="Category"
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {categoriesArr.map((option, index) => (
                <MenuItem key={"categoriesArr_", index+1} value={index+1}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button style={filterButtonStyle}>Filter</Button>

        <Grid container item xs={12} spacing={6}>
          {/* Dynamically loading the cards to the screen: */}
          {cardsArr ? cardsArr.map((card) =>
            <CardElement key={card.cardType} headerColor={card.headerColor} iconNum={card.iconNum} cardCategoryText={card.cardCategoryText}
            cardTitleText={card.cardTitleText} footerIconNum={card.footerIconNum} footerText={card.footerText} cardsArr={cardsArr} setCardsArr={setCardsArr}/>
          ): ''}
        </Grid>
      </div>
    { /* Basically the following part is the part on which the user gets to create a new card. */}
      <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleCancel}>
      <DialogTitle>Create A Card</DialogTitle>
      <DialogContent>
        <form className={otherClasses.container}>

          <FormControl className={otherClasses.formControl}>
              <InputLabel id="select-card-type-label">Card Content</InputLabel>
              <Select
                labelId="select-card-type-label"
                id="select-card-type"
                value={selectedCardType}
                onChange={handleCardTypeChange}
                input={<Input />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {newCardTypeOptions.map((option, index) => (
                  <MenuItem key={"cardTypeOption_" + index} value={index+1}>{option}</MenuItem>
                ))}
              </Select>
          </FormControl>

          <FormControl className={otherClasses.formControl}>
            <InputLabel id="select-card-color-label">Color</InputLabel>
                <Select
                  labelId="select-card-color-label"
                  id="select-card-color"
                  value={selectedCardColor}
                  onChange={handleCardColorChange}
                  input={<Input />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                {newCardColorOptions.map((option, index) => (
                  <MenuItem key={"cardColorOption_" + index} value={index+1}>{option}</MenuItem>
                ))}
                </Select>
          </FormControl>

        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>

    <NewCard open={openNewCard} handleCancel={() => {setOpenNewCard(false)}} handleOk={() => {setOpenNewCard(false)}}/>
    </div>
  )
}
