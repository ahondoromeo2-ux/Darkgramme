<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Darkgramme — Le Portail</title>
    <style>
        /* Style général - Ambiance Sombre & Épurée */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0b0c10;
            color: #c5c6c7;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        /* Conteneur principal */
        .container {
            width: 90%;
            max-width: 600px;
            background: #1f2833;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid #45f3ff33; /* Légère lueur turquoise */
            text-align: center;
        }

        /* Titre principal */
        h1 {
            color: #45f3ff;
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 0 0 10px rgba(69, 243, 255, 0.3);
        }

        /* Sous-titre */
        p.subtitle {
            color: #66fcf1;
            font-size: 1.1rem;
            margin-bottom: 30px;
            font-style: italic;
        }

        /* Zone de saisie interactive */
        .input-box {
            background-color: #0b0c10;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #1f2833;
            margin-bottom: 20px;
        }

        textarea {
            width: 100%;
            height: 100px;
            background: transparent;
            border: none;
            color: #fff;
            font-size: 1rem;
            resize: none;
            outline: none;
        }

        textarea::placeholder {
            color: #66fcf155;
        }

        /* Bouton d'action */
        .btn {
            background: linear-gradient(45deg, #66fcf1, #45f3ff);
            color: #0b0c10;
            border: none;
            padding: 12px 30px;
            font-size: 1rem;
            font-weight: bold;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(69, 243, 255, 0.2);
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(69, 243, 255, 0.4);
        }

        /* Pied de page */
        footer {
            margin-top: 30px;
            font-size: 0.8rem;
            color: #c5c6c766;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Darkgramme</h1>
        <p class="subtitle">La réalité décodée au présent.</p>
        
        <div class="input-box">
            <textarea placeholder="Une intuition, une anomalie ou une idée à noter ? Écris-la ici..."></textarea>
        </div>

        <button class="btn" onclick="sauvegarderNote()">Consigner dans la matrice</button>

        <footer>
            Darkgramme — Tous droits réservés © 2026
        </footer>
    </div>

    <script>
        async function sauvegarderNote() {
            const textarea = document.querySelector('textarea');
            const texte = textarea.value;

            if (texte.trim() === "") {
                alert("La zone est vide. Écris quelque chose avant de consigner !");
                return;
            }

            try {
                // Envoie de la note au serveur connecté à Firebase
                const response = await fetch('/api/observations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ note: texte })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Succès : Note bien consignée dans la base Firebase !");
                    textarea.value = ""; // Vide la zone de texte
                } else {
                    alert("Erreur : " + result.error);
                }
            } catch (error) {
                console.error("Erreur de connexion :", error);
                alert("Impossible de joindre le serveur. Vérifie qu'il est bien démarré.");
            }
        }
    </script>

</body>
</html>
