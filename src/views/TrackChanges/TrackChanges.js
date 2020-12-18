import React, { useState, useEffect } from "react";
import fire from "../../fire";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Search from "@material-ui/icons/Search";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

// Helping Components:
import styles from "./TrackChangesStyles";
import TrackChangesTable from "./TrackChangesTable";

const useStyles = makeStyles(styles);

export default function TrackChanges() {
  const classes = useStyles();
  const [serial, setSerial] = useState('');
  const [changesData, setChangesData] = useState([]);
  const [usersArr, setUsersArr] = useState([]);

  /**
   * A function in charge of setting the usersData variable to the received arr.
   * @param {*} arr - An array of users records which will be used while parsing through the different data that we should display the user.
   */
  const handleSetUsersData = (arr) => {
    console.log(arr);
    setUsersArr(arr);
  }

  /**
   * Basically retrieving all the users from the db.
  */
  const getUsersDataFromDb = (db, auth) => {
    db.collection("users").get().then(function(querySnapshot){
      var tempArr = []; // An empty array which will be filled with users data.
      var currentRec = {}; // A variable to hold the current user's record.
      querySnapshot.forEach(function(doc){
        // Each doc.id is a unique user id. Storing the details of all the users, while storing the current user's details in specific variables too:
        var data = doc.data()
        var userRec = {
          uid: doc.id,
          fullName: data.fullName,
          email: data.email,
          site: data.site
        }
        tempArr.push(userRec);
      })
      handleSetUsersData(tempArr, currentRec);
    })
  }

  /**
   * A function that formats a date object and returns a matching string.
   * @param {Date} date - A date which we would like to receive it's formatted string 
   */
  function getFormattedDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return dt + '/' + month + '/' + year;
  }

  useEffect(() => {
    // First retrieving all the users details from the db:
    const db = fire.firestore();
    const auth = fire.auth();
    getUsersDataFromDb(db, auth);
  }, []);

  const handleSearchClick = () => {
    const db = fire.firestore();
    const auth = fire.auth();

    //console.log("users/", auth.currentUser.uid, "/storage", "serial==", serial)
    //var docRef = db.collection("users").doc(auth.currentUser.uid).collection("storage")

    var docRef = db.collection("devices");

    var tempArr = []

    docRef.where("serial", "==", serial).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // Storing the document's id:
            var docId = doc.id;
            // Then collecting data regarding all the actions that were performed on the device:
            docRef.doc(docId).collection("actions").get().then(function(querySnapshot){
              querySnapshot.forEach(function(doc){
                var data = doc.data()
                var userRec = usersArr.filter(user => user.uid === data.uid)[0]
                var trackRec = {
                  date: data.date.toDate(),
                  event: data.event,
                  fullName: userRec.fullName,
                  email: userRec.email
                }
                console.log(trackRec, "TRACKREC");
                tempArr.push(trackRec);
                console.log(doc.id, " => ", doc.data());
              })
              console.log(tempArr)
              // Once we finished collecting the changes data, setting our useState to update the table accordingly:
              setChangesData(tempArr);
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  return (
    <GridContainer>
      <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          inputProps={{
            onChange: event => setSerial(event.target.value),
            placeholder: "Enter a serial to begin",
            inputProps: {
              "aria-label": "Enter a serial to begin"
            }
          }}
        />
        <Button color="white" aria-label="edit" justIcon round onClick={handleSearchClick}>
          <Search />
        </Button>
      </div>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Track Changes</h4>
            <p className={classes.cardCategoryWhite}>
              Track Changes Done Right. All the actions performed managed from one place.
            </p>
          </CardHeader>
          <CardBody>
            <TrackChangesTable title="Device Changes List" headerBackground="#9d36b3" data={changesData} usersData={usersArr} getFormattedDate={getFormattedDate}/>
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
