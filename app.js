// --- IMPORTATIONS FIREBASE (Via CDN pour GitHub Pages) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- CONFIGURATION FIREBASE DE DARKGRAMME ---
const firebaseConfig = {
  apiKey: "AIzaSyDqRXprLqWjYXw1HDhcsdFTGItQV1Nbsaw",
  authDomain: "darkgramme-eaafa.firebaseapp.com",
  projectId: "darkgramme-eaafa",
  storageBucket: "darkgramme-eaafa.firebasestorage.app",
  messagingSenderId: "484185842451",
  appId: "1:484185842451:web:2b7f9dcbfbc0b642ecf0e6"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- NAVIGATION ENTRE INSCRIPTION ET CONNEXION ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

document.getElementById('go-to-signup').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

document.getElementById('go-to-login').addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// --- LOGIQUE DE L'INTERFACE (Barre de navigation du bas) ---
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// --- SURVEILLANCE DE L'ÉTAT DE L'UTILISATEUR ---
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utilisateur connecté -> On bascule sur l'application Darkgramme
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        console.log("Bienvenue sur Darkgramme ! Connecté :", user.email);
    } else {
        // Utilisateur déconnecté -> On affiche l'écran de connexion
        authScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
});

// --- FONCTION D'INSCRIPTION ---
document.getElementById('btn-signup').addEventListener('click', async () => {
    const pseudo = document.getElementById('signup-pseudo').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if(!pseudo || !email || !password) return alert("Veuillez remplir tous les champs.");

    try {
        // 1. Création du compte utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Création de son profil dans la base de données Firestore
        await setDoc(doc(db, "users", user.uid), {
            pseudo: pseudo,
            email: email,
            photoProfil: "https://via.placeholder.com/150", 
            bio: "Bienvenue sur mon Darkgramme !",
            dateCreation: new Date()
        });
        
        alert("Compte créé avec succès !");

    } catch (error) {
        alert("Erreur d'inscription : " + error.message);
    }
});

// --- FONCTION DE CONNEXION ---
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if(!email || !password) return alert("Veuillez remplir tous les champs.");

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert("Erreur de connexion : " + error.message);
    }
});

console.log("Le moteur de Darkgramme est configuré et prêt.");
