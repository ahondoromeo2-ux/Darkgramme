require('dotenv').config();
const express = require('express');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Configuration sécurisée de Firebase (chargée depuis le .env)
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialisation de Firebase et Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// 2. Route pour récupérer les observations depuis Firestore
app.get('/api/observations', async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "observations"));
        const observations = [];
        querySnapshot.forEach((doc) => {
            observations.push({ id: doc.id, ...doc.data() });
        });
        res.json(observations);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des données Firebase." });
    }
});

// 3. Route pour ajouter une nouvelle observation dans Firestore
app.post('/api/observations', async (req, res) => {
    const nouvelleNote = req.body.note;

    if (!nouvelleNote || nouvelleNote.trim() === "") {
        return res.status(400).json({ error: "La note ne peut pas être vide." });
    }

    try {
        const nouvelleEntree = {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            type: "Note utilisateur",
            note: nouvelleNote
        };

        // Envoi direct à la collection "observations" sur Firebase
        await addDoc(collection(db, "observations"), nouvelleEntree);
        res.json({ success: true, message: "Observation enregistrée dans Firebase !" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'enregistrement dans Firebase." });
    }
});

// Démarrage
app.listen(PORT, () => {
    console.log(`Serveur Darkgramme connecté à Firebase sur le port ${PORT}`);
});
