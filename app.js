
// --- IMPORTATIONS FIREBASE (Version modulaire) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- CONFIGURATION FIREBASE ---
// Nous remplacerons ces valeurs par tes vraies clés plus tard
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "ton-id",
  appId: "ton-app-id"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- LOGIQUE DE L'INTERFACE ---

// Gestion de la barre de navigation du bas
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', function() {
        // 1. On retire la classe "active" de tous les boutons
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // 2. On ajoute la classe "active" au bouton cliqué
        this.classList.add('active');
        
        // 3. Plus tard, nous ajouterons ici le code pour changer de page (Feed, Explorer, Profil...)
        console.log("Changement d'onglet !");
    });
});

console.log("Darkgramme est en ligne.");
