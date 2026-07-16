require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Permet à l'application de comprendre le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sert les fichiers statiques (comme ton index.html)
app.use(express.static(path.join(__dirname)));

// 1. Route pour lire les observations existantes
app.get('/api/observations', (req, res) => {
    fs.readFile('observations.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Impossible de lire les observations." });
        }
        res.json(JSON.parse(data));
    });
});

// 2. Route pour enregistrer une nouvelle observation
app.post('/api/observations', (req, res) => {
    const nouvelleNote = req.body.note;

    if (!nouvelleNote || nouvelleNote.trim() === "") {
        return res.status(400).json({ error: "La note ne peut pas être vide." });
    }

    // Lire le fichier actuel
    fs.readFile('observations.json', 'utf8', (err, data) => {
        let observations = [];
        if (!err && data) {
            observations = JSON.parse(data);
        }

        // Créer le nouvel objet avec la date actuelle
        const nouvelleEntree = {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            type: "Note utilisateur",
            note: nouvelleNote
        };

        // L'ajouter à la liste
        observations.push(nouvelleEntree);

        // Réécrire le fichier avec la nouvelle liste
        fs.writeFile('observations.json', JSON.stringify(observations, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de l'enregistrement." });
            }
            res.json({ success: true, message: "Observation consignée !" });
        });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur Darkgramme démarré sur le port ${PORT}`);
});
