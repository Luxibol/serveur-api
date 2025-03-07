## API - Port de Plaisance Russell

## 📌 Description
Cette API permet la gestion des catways, des réservations et des utilisateurs pour le port de plaisance de Russell. Elle est construite avec **Express.js** et utilise **MongoDB** comme base de données.

## 🚀 Fonctionnalités

### **1. Gestion des utilisateurs**
- Création d'un utilisateur
- Authentification d'un utilisateur
- Récupération d'un utilisateur par email
- Mise à jour des informations d'un utilisateur
- Suppression d'un utilisateur

### **2. Gestion des catways**
- Création d'un catway
- Liste des catways
- Détails d'un catway spécifique
- Modification de l'état d'un catway
- Suppression d'un catway

### **3. Gestion des réservations**
- Création d'une réservation pour un catway
- Liste des réservations d'un catway
- Détails d'une réservation spécifique
- Modification d'une réservation
- Suppression d'une réservation

### **4. Interface Web**
- Page d'accueil avec connexion et documentation
- Tableau de bord affichant les réservations
- CRUD (Créer, Lire, Modifier, Supprimer) pour les catways, réservations et utilisateurs

---

## 🔧 Installation et Utilisation

### **1️⃣ Cloner le projet**
```sh
 git clone https://github.com/Luxibol/serveur-api.git
 cd serveur-api/api
```

### **2️⃣ Installer les dépendances**
```sh
 npm install
```

### **3️⃣ Configurer l'environnement**
Créer un fichier `.env` à la racine avec :
```sh
 MONGO_URI= "mongodb+srv://<user>:<password>@cluster.mongodb.net/port"
 SECRET_KEY="votre_clé_secrète"
 PORT=3000
```

### **4️⃣ Démarrer le serveur**
```sh
 npm start
```
Le serveur sera accessible sur : [http://localhost:3000](http://localhost:3000)

### **5️⃣ Accéder à l'API**
- **Accueil** : [http://localhost:3000](http://localhost:3000)
- **Documentation** : [http://localhost:3000/docs](http://localhost:3000/docs)
- **Dashboard** : [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 📌 Endpoints API

### **Utilisateur** (`/users`)
| Méthode | Route | Description |
|---------|----------------|---------------------------|
| **POST** | `/users` | Créer un utilisateur |
| **POST** | `/users/authenticate` | Authentifier un utilisateur |
| **GET** | `/users` | Lister tous les utilisateurs |
| **GET** | `/users/:email` | Détails d'un utilisateur |
| **PATCH** | `/users/:email` | Modifier un utilisateur |
| **DELETE** | `/users/:email` | Supprimer un utilisateur |

### **Catways** (`/catways`)
| Méthode | Route | Description |
|---------|-----------------|---------------------------|
| **POST** | `/catways` | Ajouter un catway |
| **GET** | `/catways` | Lister tous les catways |
| **GET** | `/catways/:id` | Détails d'un catway |
| **PUT** | `/catways/:id` | Modifier un catway |
| **DELETE** | `/catways/:id` | Supprimer un catway |

### **Réservations** (`/reservations`)
| Méthode | Route | Description |
|---------|---------------------------------|---------------------------|
| **POST** | `/catways/:id/reservations` | Ajouter une réservation |
| **GET** | `/catways/:id/reservations` | Lister les réservations d’un catway |
| **GET** | `/catways/:id/reservations/:idReservation` | Détails d'une réservation |
| **PUT** | `/catways/:id/reservations/:idReservation` | Modifier une réservation |
| **DELETE** | `/catways/:id/reservations/:idReservation` | Supprimer une réservation |

---

## 📖 Documentation API
Une documentation détaillée de l'API est disponible sur **[http://localhost:3000/docs](http://localhost:3000/docs)**.

---

## 💾 Base de données
L'application utilise **MongoDB**. Avant de démarrer, assurez-vous d'avoir une base de données en ligne ou en local.

Importation des collections :
```sh
 mongoimport --jsonArray --db port --collection catways --file catways.json
 mongoimport --jsonArray --db port --collection reservations --file reservations.json
```

---

## 📌 Déploiement

L'API peut être déployée sur **Railway, Render ou Vercel**. Il suffit de pousser le code sur **GitHub** et de connecter un service de déploiement.

```sh
 git push origin main
```

---

## ✨ Auteur
Projet développé par **Mathieu** pour le port de plaisance Russell.


