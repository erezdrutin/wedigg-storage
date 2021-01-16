import React,  { useState, useEffect } from 'react';
import fire from './fire';
import hist from './history';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";


import "assets/css/material-dashboard-react.css?v=1.9.0";
import './App.css';

// Login:
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Button from "components/CustomButtons/Button.js";
import LoginImage from "assets/img/login_img.svg";

// Alerts:
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Global Variables:
const auth = fire.auth();


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/index.html">
        Wedigg Storage
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  wrappingDiv: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      margin: 0,
  },
  wrappingCard: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: theme.spacing(20),
      alignItems: 'center',
      justifyContent: 'center',
      width: '30%',
      backgroundColor: '#F8F8F8',
  },
  wrappingCardMobile: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: '#F8F8F8',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  signInBtn: {
    width: '50%',
    marginTop: theme.spacing(3),
  },
  formItems: {
    width: '50%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  img: {
    maxWidth: 300,
    margin: 'auto',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  SignInText: {
    marginBottom: theme.spacing(1),
  }
}));

function App() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [site, setSite] = useState('');
  const [sitesArr, setSitesArr] = useState('')
  const [fullName, setFullName] = useState('');
  const classes = useStyles();

  // Alert Variables:
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertText, setAlertText] = useState('');

  // A list containing all the users & their data:
  const users = [
    {
      email: "drutinerez3@gmail.com",
      displayName: "Erez Drutin",
      work:{
        title: "manager",
        site: "Israel"
      }
    },
    {
      email: "tippoyt@gmail.com",
      displayName: "Tippo",
      work:{
        title: "user",
        site: "USA"
      }
    }
  ]

  const handleOpenAlert = (severity, text) => {
    // Setting the alert text:
    setAlertText(text);
    // Setting the alert severity (color ~ error, warning, info, success):
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    // Closing the alert:
    setAlertOpen(false);
  };
  

  const clearInputs = () => {
    setEmail('');
  }

  const clearErrors = () => {
    setEmailError('');
  }

  /**
   * A function that handles the user's login (an asynchronous function).
   */
  const handleLogin = async () => {
    // Clearing errors before attempting to login:
    clearErrors();
    // If the user is valid (meaning he is in our list of users which we allow in our app) then:
    if (isValidUser()){
      // Allowing the user to login:
      loginUserToApp();
    } else {
      handleOpenAlert('error', `The mail isn't registered with this app, contact your manager to proceed.`);
    }
  }

  /**
   * A function which is in charge allowing the user to login.
   */
  const loginUserToApp = () => {
    if (auth.isSignInWithEmailLink(window.location.href) && !!email) {
      auth.signInWithEmailLink(email, window.location.href).catch((err) =>{
        switch(err.code){
          default:
            case "auth/invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
              setEmailError(err.message);
              handleOpenAlert('error', emailError);
              break;
        }
      });
    } else {
      auth
        .sendSignInLinkToEmail(email, {
          url: "https://erezdrutin.github.io/wedigg-storage/",
          handleCodeInApp: true,
        })
        .then(() => {
          // Saving the users mail to verify it once they access their mail:
          window.localStorage.setItem("emailForSignIn", email);
          // Letting the user know that an email was sent to him:
          handleOpenAlert('success', 'Check your mail box!');
        })
        .catch((err) => {
          switch(err.code) {
            default:
              case "auth/invalid-email":
              case "auth/user-disabled":
              case "auth/user-not-found":
                setEmailError(err.message);
                handleOpenAlert('error', emailError);
                break;
          }
        })
    }
  }

/**
 * A function which will check whether the current email is valid { in a list of users emails which we're willing to accept to our app. }
 */
const isValidUser = () => {
  // Here some GET will be performed and we will receive some object built like so:
  return users.filter(cur => cur.email === email).length
  // var siteUsers = []
  // users.forEach(curUser => {
  //   if (curUser.work.site.toLowerCase() === site.toLowerCase()){
  //     siteUsers.push(curUser)
  //   }
  // })
  // if (siteUsers.some(e => e.email === email)) {
  //   /* Users contains the email entered */
  //   return true
  // }
  // return false
}
/*
// Initializing Firestore through firebase and saving it to a variable:
        const db = fire.firestore();

        // Adding the user to the db:
        db.collection("users").doc(data.user.uid).set({
          isManager: false,
          canAdd: true,
          canRemove: true,
          fullName: fullName,
          company: company.toLowerCase()
        })
*/


  const handleLogOut = () => {
    fire.auth().signOut()
  }

  const addToDb = () => {
    // First - checking if the user exists in our db or not:
    const db = fire.firestore()
    const auth = fire.auth()

    const usersRef = db.collection('users').doc(auth.currentUser.uid);
    usersRef.get().then((doc) => {
      if (!doc.exists){
        // First storing the current user's details:
        var userDetails = '';
        users.find(function(details, index){
          if (details.email === window.localStorage.getItem("emailForSignIn")){
            userDetails = details;
          }
        })
        // Then we should add the document.
        usersRef.set({
          name: userDetails.displayName,
          email: userDetails.email,
          cards: ["0,primary", "1,info", "2,success", "3,danger", "4,info", "5,warning"],
          position: userDetails.work.title,
          site: userDetails.work.site
        })
      }
    });
  }

  const authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      if(user){
        // Clearing inputs every time we already have a user and we want to login:
        clearInputs();
        setUser(user);
        addToDb();
        // Setting the user for the window:
        window.localStorage.setItem("user", user);
      } else {
        setUser('');
      }
    })
  }

  /**
   * A function that retrieves a list of sites from the db.
   */
  const getSites = () => {
    var tempArr = []
    const db = fire.firestore()
    db.collection("sites").get().then(function(querySnapshot){
      querySnapshot.forEach(function(doc) {
        // The id of each document in the sites collection is a name of a site:
        tempArr.push(doc.id)
      })
      setSitesArr(tempArr);
    })
  }

  useEffect(() => {
    // Get the saved email
    const saved_email = window.localStorage.getItem("emailForSignIn");

    // Verify the user went through an email link and the saved email is not null
    if (auth.isSignInWithEmailLink(window.location.href) && !!saved_email) {
      // Sign the user in
      auth.signInWithEmailLink(saved_email, window.location.href);
    }

    // Initializing the sites array if needed:
    if (!sitesArr){
      getSites()
    }

    // Using the auth listener to determine when the user logs out:
    return authListener();
  }, []);


  return (
    <div className="App">
    { user ? (
      <Router history={hist}>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/rtl" component={RTL} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </Router>
    ) : (
      
      <div className={classes.wrappingDiv}>
        <Card className={window.innerWidth <= 500 ? classes.wrappingCardMobile : classes.wrappingCard}>
            <img src={LoginImage} alt="Login Image" className={classes.img} />
            <Typography component="h1" variant="h5" className={classes.SignInText}>
            Sign in
            </Typography>
            <TextField
              className={classes.formItems}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
{/* 
            <FormControl variant="outlined" className={classes.formItems}>
              <InputLabel id="site-outlined-label">Site</InputLabel>
              <Select
                labelId="site-outlined-label"
                id="site-select-outlined"
                value={site}
                onChange={e => setSite(e.target.value)}
                label="Site"
              >
                <MenuItem key="None" value="">
                  <em>None</em>
                </MenuItem>
                {sitesArr ? sitesArr.map(function(item, index){
                  return <MenuItem key={item, index} value={item}>{item}</MenuItem>
                }) : ''};
                
              </Select>
            </FormControl> */}

            <Button color="primary" onClick={handleLogin} className={classes.signInBtn}>Sign in</Button>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Card>
        
        <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alertSeverity}>
            {alertText}
          </Alert>
      </Snackbar>
      </div>
    ) }
    </div>
  );
}

export default App;
