// --- IMPORTATIONS FIREBASE (VERSION WEB CDN) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, arrayUnion, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- CONFIGURATION DE TON PROJET (DARKGRAMME-PRO) ---
const firebaseConfig = {
  apiKey: "AIzaSyDqfKtCjW0nXB8ZGkEYx_bHFmfAtMJKxxU",
  authDomain: "darkgramme-pro.firebaseapp.com",
  projectId: "darkgramme-pro",
  storageBucket: "darkgramme-pro.firebasestorage.app",
  messagingSenderId: "662519634699",
  appId: "1:662519634699:web:dc68ed771121e81daa200e"
};

// Initialisation des services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Variables globales
let pseudoConnecte = "Utilisateur";
let avatarConnecte = "https://via.placeholder.com/150";
let tousLesPosts = []; 

// --- COMPRESSION & CONVERSION DE L'IMAGE EN TEXTE (BASE64) ---
function compresserEtConvertirEnBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400; 
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.4)); 
            };
        };
    });
}

// --- NAVIGATION INTERNE ---
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

function changerVue(targetView) {
    views.forEach(view => view.classList.add('hidden'));
    const vueCible = document.getElementById(`view-${targetView}`);
    if (vueCible) vueCible.classList.remove('hidden');
    
    navItems.forEach(nav => {
        nav.classList.remove('active');
        if(nav.getAttribute('data-view') === targetView) {
            nav.classList.add('active');
        }
    });
}

navItems.forEach(item => {
    item.addEventListener('click', function() {
        changerVue(this.getAttribute('data-view'));
    });
});

// --- CHARGEMENT DU PROFIL ---
async function chargerProfilUtilisateur(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            pseudoConnecte = data.pseudo;
            avatarConnecte = data.photoProfil || "https://via.placeholder.com/150";
            document.getElementById('profile-pseudo').innerText = pseudoConnecte;
            document.getElementById('profile-bio-text').innerText = data.bio;
            document.getElementById('profile-avatar').src = avatarConnecte;
        }
    } catch (error) {
        console.error("Erreur profil :", error);
    }
}

// --- EN DIRECT : FIL D'ACTUALITÉ (AVEC LIKES ET COMMENTAIRES) ---
function ecouterLeFilActualite() {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    onSnapshot(q, (snapshot) => {
        const feed = document.getElementById('feed');
        if(!feed) return;
        feed.innerHTML = "";
        tousLesPosts = [];

        snapshot.forEach((documentSnap) => {
            const post = documentSnap.data();
            const postId = documentSnap.id;
            tousLesPosts.push({ ...post, id: postId }); 
            
            // Génération de la liste des commentaires existants
            let listCommentsHTML = "";
            if (post.comments && post.comments.length > 0) {
                post.comments.forEach(c => {
                    listCommentsHTML += `<p style="margin-bottom:4px; font-size:13px;"><strong style="color:#fff;">${c.pseudo} :</strong> ${c.texte}</p>`;
                });
            }

            const postEl = document.createElement('div');
            postEl.classList.add('post-card');
            postEl.innerHTML = `
                <div class="post-header">
                    <img src="${post.avatar}" class="post-avatar">
                    <strong>${post.pseudo}</strong>
                </div>
                <img src="${post.imageUrl}" class="post-image">
                
                <!-- Zone d'interactions -->
                <div style="padding: 10px 12px 5px 12px; display:flex; gap:15px; align-items:center;">
                    <button class="btn-like" data-id="${postId}" style="width:auto; background:none; color:#ff4757; font-size:18px; padding:0; text-align:left;">❤️ ${post.likes || 0}</button>
                </div>

                <div class="post-caption">
                    <strong>${post.pseudo}</strong> ${post.caption}
                </div>

                <!-- Section des Commentaires -->
                <div style="padding: 10px 12px; border-top: 1px solid #111; background:#050505;">
                    <div style="max-height:100px; overflow-y:auto; margin-bottom:8px; color:#aaa;">
                        ${listCommentsHTML || '<p style="font-size:12px; color:#555;">Aucun commentaire...</p>'}
                    </div>
                    <div style="display:flex; gap:5px;">
                        <input type="text" id="input-comm-${postId}" placeholder="Ajouter un commentaire..." style="margin-bottom:0; padding:6px; font-size:12px;">
                        <button class="btn-comment" data-id="${postId}" style="width:auto; padding:6px 12px; font-size:12px; background:#222; color:#fff;">Publier</button>
                    </div>
                </div>
            `;
            feed.appendChild(postEl);
        });
    });
}

// --- ÉCOUTEUR DES CLICS SUR LE FIL (GESTION DES BOUTONS LIKE & COMMENTAIRES) ---
const feedContainer = document.getElementById('feed');
if(feedContainer) {
    feedContainer.addEventListener('click', async (e) => {
        // Clic sur le bouton Like
        if (e.target.classList.contains('btn-like')) {
            const idDoc = e.target.getAttribute('data-id');
            const postRef = doc(db, "posts", idDoc);
            try {
                await updateDoc(postRef, { likes: increment(1) });
            } catch (err) { console.error(err); }
        }

        // Clic sur le bouton Publier Commentaire
        if (e.target.classList.contains('btn-comment')) {
            const idDoc = e.target.getAttribute('data-id');
            const inputField = document.getElementById(`input-comm-${idDoc}`);
            const texteComm = inputField.value.trim();
            if (!texteComm) return;

            const postRef = doc(db, "posts", idDoc);
            try {
                await updateDoc(postRef, {
                    comments: arrayUnion({
                        pseudo: pseudoConnecte,
                        texte: texteComm,
                        date: new Date().toISOString()
                    })
                });
                inputField.value = "";
            } catch (err) { console.error(err); }
        }
    });
}

// --- EN DIRECT : BARRE DE RECHERCHE ---
const searchBar = document.getElementById('search-bar');
if(searchBar) {
    searchBar.addEventListener('input', (e) => {
        const motCle = e.target.value.toLowerCase().trim();
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = "";

        if(!motCle) return;

        const postsFiltres = tousLesPosts.filter(post => 
            post.caption.toLowerCase().includes(motCle) || post.pseudo.toLowerCase().includes(motCle)
        );

        postsFiltres.forEach(post => {
            const resEl = document.createElement('div');
            resEl.classList.add('search-res-item');
            resEl.innerHTML = `
                <img src="${post.imageUrl}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; background:#111;">
                <div>
                    <strong>${post.pseudo}</strong><br>
                    <small style="color:#aaa;">${post.caption}</small>
                </div>
            `;
            resultsContainer.appendChild(resEl);
        });
    });
}

// --- EN DIRECT : MESSAGERIE DU QG ---
function ecouterLaMessagerie() {
    const q = query(collection(db, "messages"), orderBy("date", "asc"));
    onSnapshot(q, (snapshot) => {
        const msgBox = document.getElementById('msg-box');
        if(!msgBox) return;
        msgBox.innerHTML = "";

        snapshot.forEach((doc) => {
            const msg = doc.data();
            const msgEl = document.createElement('div');
            const estMoi = msg.pseudo === pseudoConnecte;
            
            msgEl.classList.add('msg-bubble', estMoi ? 'msg-me' : 'msg-them');
            msgEl.innerHTML = `
                <span class="msg-sender-name">${msg.pseudo}</span>
                ${msg.texte}
            `;
            msgBox.appendChild(msgEl);
        });
        msgBox.scrollTop = msgBox.scrollHeight;
    });
}

const btnSendMsg = document.getElementById('btn-send-msg');
if(btnSendMsg) {
    btnSendMsg.addEventListener('click', async () => {
        const input = document.getElementById('msg-input');
        const texte = input.value.trim();
        if(!texte) return;

        try {
            await addDoc(collection(db, "messages"), {
                pseudo: pseudoConnecte,
                texte: texte,
                date: new Date()
            });
            input.value = "";
        } catch (error) {
            console.error("Erreur d'envoi :", error);
        }
    });
}

// --- PUBLICATION D'UNE PHOTO ---
const btnShare = document.getElementById('btn-share');
if(btnShare) {
    btnShare.addEventListener('click', async () => {
        const fileInput = document.getElementById('post-file');
        const caption = document.getElementById('post-caption').value.trim();
        const user = auth.currentUser;

        if (!user) return alert("Connecte-toi d'abord.");
        if (!fileInput.files || fileInput.files.length === 0) return alert("Choisis une photo dans ton téléphone !");

        try {
            alert("Compression de la photo en cours... Patientez ⏳");
            const photoBase64 = await compresserEtConvertirEnBase64(fileInput.files[0]);

            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                pseudo: pseudoConnecte,
                avatar: avatarConnecte,
                imageUrl: photoBase64, 
                caption: caption,
                likes: 0,
                comments: [],
                date: new Date()
            });

            alert("Posté avec succès sur Darkgramme ! 🚀");
            fileInput.value = "";
            document.getElementById('post-caption').value = "";
            changerVue('home');
        } catch (error) {
            alert("Erreur lors du partage : " + error.message);
        }
    });
}

// --- ÉCOUTEUR D'ÉTAT DE CONNEXION ---
const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');

onAuthStateChanged(auth, (user) => {
    if (user) {
        if(authScreen) authScreen.classList.add('hidden');
        if(appScreen) appScreen.classList.remove('hidden');
        chargerProfilUtilisateur(user.uid);
        ecouterLeFilActualite();
        ecouterLaMessagerie();
    } else {
        if(authScreen) authScreen.classList.remove('hidden');
        if(appScreen) appScreen.classList.add('hidden');
    }
});

// --- GESTION DE L'AUTHENTIFICATION ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if(document.getElementById('go-to-signup')) {
    document.getElementById('go-to-signup').addEventListener('click', () => {
        loginForm.classList.add('hidden'); signupForm.classList.remove('hidden');
    });
}
if(document.getElementById('go-to-login')) {
    document.getElementById('go-to-login').addEventListener('click', () => {
        signupForm.classList.add('hidden'); loginForm.classList.remove('hidden');
    });
}

if(document.getElementById('btn-signup')) {
    document.getElementById('btn-signup').addEventListener('click', async () => {
        const pseudo = document.getElementById('signup-pseudo').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        if(!pseudo || !email || !password) return alert("Remplis tous les champs.");
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", credential.user.uid), {
                pseudo: pseudo, email: email, photoProfil: "https://via.placeholder.com/150", bio: "Nouveau sur Darkgramme !", dateCreation: new Date()
            });
            alert("Compte créé ! 🎯");
        } catch (e) { alert(e.message); }
    });
}

if(document.getElementById('btn-login')) {
    document.getElementById('btn-login').addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        try { await signInWithEmailAndPassword(auth, email, password); } catch (e) { alert(e.message); }
    });
}

if(document.getElementById('btn-logout')) {
    document.getElementById('btn-logout').addEventListener('click', () => { signOut(auth); });
}
