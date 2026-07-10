// --- IMPORTATIONS FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- CONFIGURATION FIREBASE DE DARKGRAMME ---
const firebaseConfig = {
  apiKey: "AIzaSyDqRXprLqWjYXw1HDhcsdFTGItQV1Nbsaw",
  authDomain: "darkgramme-eaafa.firebaseapp.com",
  projectId: "darkgramme-eaafa",
  storageBucket: "darkgramme-eaafa.firebasestorage.app",
  messagingSenderId: "484185842451",
  appId: "1:484185842451:web:2b7f9dcbfbc0b642ecf0e6"
};

// Initialisation
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

// --- LOGIQUE DE NAVIGATION DE L'APPLICATION ---
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
    item.addEventListener('click', function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        views.forEach(view => view.classList.add('hidden'));
        const targetView = this.getAttribute('data-view');
        document.getElementById(`view-${targetView}`).classList.remove('hidden');
    });
});

// --- RÉCUPÉRATION DES DONNÉES DU PROFIL (FIRESTORE) ---
async function chargerProfilUtilisateur(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Injection des vraies données dans le code HTML
            document.getElementById('profile-pseudo').innerText = data.pseudo;
            document.getElementById('profile-bio-text').innerText = data.bio;
            if(data.photoProfil) {
                document.getElementById('profile-avatar').src = data.photoProfil;
            }
        } else {
            console.log("Aucun profil trouvé dans la base de données.");
        }
    } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
    }
}

// --- SURVEILLANCE DE L'ÉTAT DE L'UTILISATEUR ---
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

onAuthStateChanged(auth, (user) => {
    if (user) {
        authScreen.classList.add('hidden');
        appScreen.classList.remove('hidden');
        // Dès qu'on est connecté, on charge le profil de l'utilisateur actif
        chargerProfilUtilisateur(user.uid);
    } else {
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

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

// --- FONCTION DE DÉCONNEXION ---
document.getElementById('btn-logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        alert("Vous avez été déconnecté.");
    }).catch((error) => {
        alert("Erreur lors de la déconnexion : " + error.message);
    });
});
