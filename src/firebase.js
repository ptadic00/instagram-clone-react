import firebase from "firebase";


//firestore secret data
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCvqvF-2Br3So1XUa95hKNWE84xY6zEEN0",
    authDomain: "instagram-clone-react-6f5c4.firebaseapp.com",
    projectId: "instagram-clone-react-6f5c4",
    storageBucket: "instagram-clone-react-6f5c4.appspot.com",
    messagingSenderId: "948858218705",
    appId: "1:948858218705:web:9340fbbc582a7d17c3bdf0",
    measurementId: "G-556LHW0BQS"
  });

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db, auth, storage};

 