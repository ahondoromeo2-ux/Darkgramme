// --- IMPORTATIONS FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Variables globales pour stocker les infos de l'utilisateur connecté
let pseudoConnecte = "Utilisateur";
let avatarConnecte = "https://via.placeholder.com/150";

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

function changerVue(targetView) {
    // Masquer toutes les vues
    views.forEach(view => view.classList.add('hidden'));
    // Afficher la vue ciblée
    document.getElementById(`view-${targetView}`).classList.remove('hidden');
    
    // Mettre à jour les icônes de la barre du bas
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if(nav.getAttribute('data-view') === targetView) {
            nav.classList.add('active');
        }
    });
}

navItems.forEach(item => {
    item.addEventListener('click', function() {
        const targetView = this.getAttribute('data-view');
        changerVue(targetView);
    });
});

// --- RÉCUPÉRATION DES DONNÉES DU PROFIL (FIRESTORE) ---
async function chargerProfilUtilisateur(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            pseudoConnecte = data.pseudo;
            avatarConnecte = data.photoProfil || "https://via.placeholder.com/150";

            // Injection des données dans la page Profil HTML
            document.getElementById('profile-pseudo').innerText = pseudoConnecte;
            document.getElementById('profile-bio-text').innerText = data.bio;
            document.getElementById('profile-avatar').src = avatarConnecte;
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
        chargerProfilUtilisateur(user.uid);
    } else {
        authScreen.classList.remove('hidden');
        appScreen.classList.add('hidden');
    }
});

// --- ENREGISTRER UN NOUVEAU POST ---
document.getElementById('btn-share').addEventListener('click', async () => {
    const imgUrl = document.getElementById('post-img-url').value.trim();
    const caption = document.getElementById('post-caption').value.trim();
    const user = auth.currentUser;

    if (!user) return alert("Tu dois être connecté pour publier.");
    if (!imgUrl) return alert("Ajoute le lien d'une image pour publier !");

    try {
        // Envoi des données dans une collection globale "posts" sur Firestore
        await addDoc(collection(db, "posts"), {
            uid: user.uid,
            pseudo: pseudoConnecte,
            avatar: avatarConnecte,
            imageUrl: imgUrl,
            caption: caption,
            date: new Date(),
            likes: 0
        });

        alert("Publication partagée avec succès ! 🚀");
        
        // On vide les champs du formulaire
        document.getElementById('post-img-url').value = "";
        document.getElementById('post-caption').value = "";

        // Retour automatique sur le fil d'actualité (Accueil)
        changerVue('home');

    } catch (error) {
        alert("Erreur lors du partage : " + error.message);
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
