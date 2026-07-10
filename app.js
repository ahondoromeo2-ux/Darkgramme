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
        document.getElementById('post-img-url').value = "";
        document.getElementById('post-caption').value = "";
        changerVue('home');
    } catch (error) {
        alert("Erreur lors du partage : " + error.message);
    }
});

// --- L'INTELLIGENCE ARTIFICIELLE LOX (FONCTIONS & CHAT) ---
const loxInput = document.getElementById('lox-input');
const btnLoxSend = document.getElementById('btn-lox-send');
const loxChatMessages = document.getElementById('lox-chat-messages');

// Afficher un message dans le chat
function ajouterMessageChat(auteur, texte) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    
    if (auteur === 'user') {
        messageDiv.classList.add('user-msg');
        messageDiv.innerHTML = `<strong>Moi :</strong> ${texte}`;
    } else {
        messageDiv.classList.add('lox-msg');
        messageDiv.innerHTML = `<strong>Lox :</strong> ${texte}`;
    }
    
    loxChatMessages.appendChild(messageDiv);
    // Scroll automatique vers le bas
    loxChatMessages.scrollTop = loxChatMessages.scrollHeight;
}

// Cerveau de Lox : Analyse des mots-clés et exécution des fonctions
function executerCommandeLox(message) {
    const texte = message.toLowerCase();
    
    // Raccourcis pour faire défiler le chat
    setTimeout(() => {
        // Fonction 1 : Ouvrir le Profil
        if (texte.includes('profil') || texte.includes('mon compte')) {
            changerVue('profile');
            ajouterMessageChat('lox', "Action exécutée ! Je viens de t'ouvrir ton profil. 👤");
        } 
        // Fonction 2 : Ouvrir l'Accueil / Flux
        else if (texte.includes('accueil') || texte.includes('fil') || texte.includes('flux')) {
            changerVue('home');
            ajouterMessageChat('lox', "Tout de suite ! Retour sur le fil d'actualité. 🏠");
        } 
        // Fonction 3 : Ouvrir l'écran de Recherche
        else if (texte.includes('recherche') || texte.includes('chercher')) {
            changerVue('search');
            ajouterMessageChat('lox', "C'est fait, l'écran de recherche est ouvert. 🔍");
        } 
        // Fonction 4 : Aller sur l'écran de Publication
        else if (texte.includes('post') || texte.includes('publier') || texte.includes('créer')) {
            changerVue('post');
            ajouterMessageChat('lox', "Compris ! J'ai ouvert la page de création. Prêt à publier ton image. 📸");
        } 
        // Fonction 5 : Nettoyer l'historique du chat
        else if (texte.includes('efface') || texte.includes('nettoie') || texte.includes('clear')) {
            loxChatMessages.innerHTML = "";
            ajouterMessageChat('lox', "Écran nettoyé ! Table rase, qu'est-ce qu'on fait maintenant ? 🧹");
        } 
        // Fonction 6 : Aide à la création de légendes (Idées de posts)
        else if (texte.includes('légende') || texte.includes('idée') || texte.includes('inspiration')) {
            const idees = [
                "« Capturer l'instant présent avant qu'il ne devienne un souvenir. ✨ »",
                "« En mode Darkgramme. La simplicité fait toute la différence. 🖤 »",
                "« focus sur l'objectif, le reste n'est que du bruit. 🚀 »",
                "« Les meilleures histoires se trouvent entre les lignes. 📖 »"
            ];
            const choix = idees[Math.floor(Math.random() * idees.length)];
            ajouterMessageChat('lox', `Voici une idée de légende stylée que tu peux copier-coller : <br><br><strong>${choix}</strong>`);
        }
        // Réponses classiques de discussion
        else if (texte.includes('salut') || texte.includes('bonjour') || texte.includes('hey')) {
            ajouterMessageChat('lox', `Salut ! Content de te parler. Je suis prêt à exécuter tes ordres ! Donne-moi un mot-clé comme 'profil', 'publier' ou 'légende'. 😊`);
        } else if (texte.includes('ca va') || texte.includes('comment tu vas')) {
            ajouterMessageChat('lox', "Je fonctionne à plein régime ! Toujours dispo pour faire tourner Darkgramme au doigt et à l'œil. Et toi ? 🔥");
        } else {
            ajouterMessageChat('lox', "Je comprends le message, mais pour déclencher une action magique, essaie d'inclure des mots comme : <strong>profil</strong>, <strong>accueil</strong>, <strong>publier</strong>, <strong>légende</strong> ou <strong>effacer</strong> ! 😉");
        }
    }, 600); // Petit délai pour simuler la réflexion de l'IA
}

// Événement au clic sur le bouton envoyer
btnLoxSend.addEventListener('click', () => {
    const msg = loxInput.value.trim();
    if (!msg) return;
    
    ajouterMessageChat('user', msg);
    loxInput.value = "";
    executerCommandeLox(msg);
});

// Événement avec la touche Entrée du clavier
loxInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const msg = loxInput.value.trim();
        if (!msg) return;
        
        ajouterMessageChat('user', msg);
        loxInput.value = "";
        executerCommandeLox(msg);
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
