# 🗣️ FORUM – Application Web de Discussion

## 📌 Présentation

**FORUM** est une application web simple et intuitive qui permet aux utilisateurs de :
- créer des fils de discussion,
- commenter les publications,
- liker ou disliker les messages,
- effectuer des recherches,
- le tout avec un système d’authentification.

Elle est conçue avec **Node.js**, **Express.js** et **SQLite**.

---

## ✨ Fonctionnalités principales

✅ Création et lecture de fils de discussion  
✅ Ajout de commentaires à chaque sujet  
✅ Système de likes et dislikes  
✅ Recherches par mot-clé  
✅ Connexion et gestion d’utilisateurs via cookies

---

## 🛠️ Technologies utilisées

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)

---

## 🚀 Installation rapide

> **Prérequis** : Node.js et npm installés sur votre machine.

### 1. Clonez ce dépôt

```bashv
git clone https://github.com/votre-utilisateur/forum.git
cd forum

2. Installez les dépendances
bash
Copier
Modifier
npm install
3. Base de données SQLite
Vérifiez que le fichier forum.db est bien présent à la racine du projet.
Sinon, créez-le avec cette commande dans un terminal :

bash
Copier
Modifier
sqlite3 forum.db
Ensuite, créez les tables (Threads, Users, Comments, etc.) si nécessaire.

4. Lancez le serveur
bash
Copier
Modifier
npm start
Le projet tourne ensuite sur :
🌐 http://localhost:3000

📁 Structure du projet
pgsql
Copier
Modifier
forum/
├── public/             → Fichiers HTML, CSS, JS client
│   └── html/, css/, js/
├── routes/             → Définition des routes Express
├── utils/              → Fonctions utilitaires, cookies, etc.
├── forum.db            → Fichier de base de données SQLite
├── server.js           → Point d’entrée du serveur Express
├── database.js         → Connexion SQLite
└── Auth.js             → Authentification des utilisateurs
🔌 API Endpoints
Méthode	Route	Description
GET	/api/comments/:thread_id	Récupère les commentaires d’un fil
GET	/ (search.js)	Recherche des threads

🙋‍♂️ Pour les débutants
Pas d'inquiétude ! Voici quelques conseils :

💡 Pour démarrer le projet :

Ouvre un terminal dans VS Code (Ctrl + `)

Tape npm install puis npm start

💡 Pour la base de données :

Utilise l’extension SQLite dans VS Code pour visualiser forum.db

Vérifie que les tables existent avec .tables

💡 Pour tester les routes :

Navigue sur http://localhost:3000

Utilise des outils comme Postman pour tester l’API

---
