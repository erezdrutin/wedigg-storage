import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyAw46sqqZwFmF2iKe2Nc_0IHvqIXxyYvhw",
    authDomain: "wedigg-storage.firebaseapp.com",
    databaseURL: "https://wedigg-storage.firebaseio.com",
    projectId: "wedigg-storage",
    storageBucket: "wedigg-storage.appspot.com",
    messagingSenderId: "198664235889",
    appId: "1:198664235889:web:4dd8fa3600c004db7d24d0",
    measurementId: "G-78ZM881BC1"
  };
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default fire;