// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    setDoc,
    doc,
    query,
    Query,
    connectFirestoreEmulator,
    where,
    CollectionReference
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyJtS8WOdIpSQlqL9Um0qmzHP4WeDSKNI",
    authDomain: "ctfirestoreindexes.firebaseapp.com",
    projectId: "ctfirestoreindexes",
    storageBucket: "ctfirestoreindexes.firebasestorage.app",
    messagingSenderId: "1093585967141",
    appId: "1:1093585967141:web:c4322f5b844810fb5e87cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function runQueries() {
    connectFirestoreEmulator(db, 'localhost', 8080);
    const citiesRef = collection(db, "cities");

    insertData(citiesRef);

    const q = query(citiesRef, where("capital", "==", true));
    const q1 = query(citiesRef, where("state", "==", "CA"), where("name", "==", "Los Angeles"));
    const q2 = query(citiesRef, where("state", "==", "CA"), where("population", "<", 1000000));

    console.log("starting query q");
    runQuery(q);
    console.log("starting query q1");
    runQuery(q1);
    console.log("starting query q2");
    runQuery(q2);

}

async function insertData(citiesRef: CollectionReference) {
    console.log("inserting data");
    await setDoc(doc(citiesRef, "SF"), {
        name: "San Francisco", state: "CA", country: "USA",
        capital: false, population: 860000,
        regions: ["west_coast", "norcal"]
    });
    await setDoc(doc(citiesRef, "LA"), {
        name: "Los Angeles", state: "CA", country: "USA",
        capital: false, population: 3900000,
        regions: ["west_coast", "socal"]
    });
    await setDoc(doc(citiesRef, "DC"), {
        name: "Washington, D.C.", state: null, country: "USA",
        capital: true, population: 680000,
        regions: ["east_coast"]
    });
    await setDoc(doc(citiesRef, "TOK"), {
        name: "Tokyo", state: null, country: "Japan",
        capital: true, population: 9000000,
        regions: ["kanto", "honshu"]
    });
    await setDoc(doc(citiesRef, "BJ"), {
        name: "Beijing", state: null, country: "China",
        capital: true, population: 21500000,
        regions: ["jingjinji", "hebei"]
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
}

async function runQuery(query: Query) {
    console.log("calling query to get snapshot");
    const querySnapshot = await getDocs(query);
    console.log("callback set:");
    querySnapshot.forEach((doc) => {
        console.log("callback received");
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
    });
}
try {
    runQueries();
} catch (e) {
    console.error(e);
}