import firebase from "firebase/app";
import "firebase/storage"
import "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCAit1HDm7ItG-RpnbRPeDhGP06Kn0au2E",
    authDomain: "gifty-2e899.firebaseapp.com",
    projectId: "gifty-2e899",
    storageBucket: "gifty-2e899.appspot.com",
    messagingSenderId: "950095555423",
    appId: "1:950095555423:web:b62014c4f34b6cb57d64ea",
    measurementId: "G-KD9QXNK5ZB"
};

firebase.initializeApp(firebaseConfig);
export default firebase;