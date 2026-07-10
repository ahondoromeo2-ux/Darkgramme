import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "ton-id",
  appId: "ton-app-id"
};

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

// --- LOGIQUE DE L'APPLICATION (Barre du bas) ---
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
    });
});

// --- CODE DE CONNEXION / INSCRIPTION REEL ---

// 1. Surveillance de l'état de l'utilisateur (Es-tu connecté ou déconnecté ?)
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // L'utilisateur est connecté -> On masque l'auth et on montre l'app
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        console.log("Utilisateur connecté :", user.email);
    } else {
        // L'utilisateur est déconnecté -> On montre l'auth
        authScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
});

// 2. Fonction d'Inscription
document.getElementById('btn-signup').addEventListener('click', async () => {
    const pseudo = document.getElementById('signup-pseudo').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if(!pseudo || !email || !password) return alert("Veuillez remplir tous les champs.");

    try {
        // Création du compte dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Enregistrement du pseudo dans la base de données Firestore
        await setDoc(doc(db, "users", user.uid), {
            pseudo: pseudo,
            email: email,
            photoProfil: "https://via.placeholder.com/150", // Photo par défaut
            bio: "Bienvenue sur mon Darkgramme !"
        });

    } catch (error) {
        alert("Erreur d'inscription : " + error.message);
    }
});

// 3. Fonction de Connexion
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
