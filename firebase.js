const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
