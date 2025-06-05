"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_1.getFirestore)(app);
function runQueries() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, firestore_1.connectFirestoreEmulator)(db, 'localhost', 8080);
        const citiesRef = (0, firestore_1.collection)(db, "cities");
        insertData(citiesRef);
        const q = (0, firestore_1.query)(citiesRef, (0, firestore_1.where)("capital", "==", true));
        const q1 = (0, firestore_1.query)(citiesRef, (0, firestore_1.where)("state", "==", "CA"), (0, firestore_1.where)("name", "==", "Los Angeles"));
        const q2 = (0, firestore_1.query)(citiesRef, (0, firestore_1.where)("state", "==", "CA"), (0, firestore_1.where)("population", "<", 1000000));
        console.log("starting query q");
        runQuery(q);
        console.log("starting query q1");
        runQuery(q1);
        console.log("starting query q2");
        runQuery(q2);
    });
}
function insertData(citiesRef) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inserting data");
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(citiesRef, "SF"), {
            name: "San Francisco", state: "CA", country: "USA",
            capital: false, population: 860000,
            regions: ["west_coast", "norcal"]
        });
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(citiesRef, "LA"), {
            name: "Los Angeles", state: "CA", country: "USA",
            capital: false, population: 3900000,
            regions: ["west_coast", "socal"]
        });
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(citiesRef, "DC"), {
            name: "Washington, D.C.", state: null, country: "USA",
            capital: true, population: 680000,
            regions: ["east_coast"]
        });
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(citiesRef, "TOK"), {
            name: "Tokyo", state: null, country: "Japan",
            capital: true, population: 9000000,
            regions: ["kanto", "honshu"]
        });
        yield (0, firestore_1.setDoc)((0, firestore_1.doc)(citiesRef, "BJ"), {
            name: "Beijing", state: null, country: "China",
            capital: true, population: 21500000,
            regions: ["jingjinji", "hebei"]
        });
        yield new Promise(resolve => setTimeout(resolve, 3000));
    });
}
function runQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("calling query to get snapshot");
        const querySnapshot = yield (0, firestore_1.getDocs)(query);
        console.log("callback set:");
        querySnapshot.forEach((doc) => {
            console.log("callback received");
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    });
}
try {
    runQueries();
}
catch (e) {
    console.error(e);
}
