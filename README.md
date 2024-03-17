# CovoitExpress

CovoitExpress est un projet personnel qui va au-delà d'une simple application de covoiturage. C'est une plateforme intelligente qui connecte efficacement les conducteurs et les passagers pour des trajets partagés, offrant une solution rapide et pratique pour optimiser les déplacements quotidiens.

## Stack

- **Frontend** : React Js
- **Backend** : Express Js, Node Js
- **Base de données** : Mongo Db
- **Authentification** : JWT

## Structure du projet

Le projet est divisé en deux dossiers principaux :
- **frontend** : Contient le code source de l'interface utilisateur
- **backend** : Contient le code source du serveur et de l'API

## Prérequis

Avant d'installer et de tester l'application, assurez-vous d'avoir les éléments suivants sur votre système :

- **MongoDB Compass** : Pour visualiser et gérer facilement vos bases de données MongoDB.
- **Compte MongoDB Atlas (optionnel)** : Si vous souhaitez utiliser une base de données MongoDB hébergée en ligne.
- **Compte sur OpenRouteService** : Pour obtenir un jeton d'API et accéder aux fonctionnalités de calcul d'itinéraire.
- **Node.js et npm** : Assurez-vous d'avoir Node.js et npm installés sur votre machine. Vous pouvez les télécharger et les installer à partir du site officiel de Node.js.

## Installation et test

1. Cloner le dépôt depuis GitHub :

```bash
git clone https://github.com/Aboubakr67/CovoitExpress.git
```

2. Installer les dépendances du frontend

```bash
cd CovoitExpress/frontend
npm install
```

3. Installer les dépendances du backend

```bash
cd ../backend
npm install
```

4. Créer un fichier .env dans le dossier backend et définir les variables d'environnement suivantes :

```bash
MONGO_URI=mongodb://localhost:27017/covoiturage
PORT=5000
JWT_SECRET=j7nG78gbd565sd4f65s4dfF94nLsd54qsduy
TOKEN_OPEN_ROUTE_SERVICE=token_ici
```

- **MONGO_URI**: URL de connexion à la base de données MongoDB.
- **PORT**: Port sur lequel le serveur backend sera en cours d'exécution.
- **JWT_SECRET**: Clé secrète pour la génération de jetons JWT.
- **TOKEN_OPEN_ROUTE_SERVICE**: Jeton d'API pour OpenRouteService.

5. Lancer le backend :
```bash
cd backend
npm start
```

6. Lancer le frontend :
```bash
cd frontend
npm start
```

7. Accéder à l'application dans votre navigateur à l'adresse http://localhost:3000.

## Pages

### Accueil

![Accueil](https://github.com/Aboubakr67/CovoitExpress/blob/main/frontend/public/img/accueil.png?raw=true)

Page d'accueil de l'application.

### Inscription

![Inscription](https://github.com/Aboubakr67/CovoitExpress/blob/main/frontend/public/img/inscription.png?raw=true)

Page d'inscription permettant aux utilisateurs de créer un compte sur la plateforme.

### Connexion

![Connexion](https://github.com/Aboubakr67/CovoitExpress/blob/main/frontend/public/img/connexion.png?raw=true)

Page de connexion pour les utilisateurs existants.

### Dashboard

![Dashboard](https://github.com/Aboubakr67/CovoitExpress/blob/main/frontend/public/img/dashboard.png?raw=true)

Page permettant à l'utilisateur de gérer ses trajets et véhicules.

### Trajet

![Trajet](https://github.com/Aboubakr67/CovoitExpress/blob/main/frontend/public/img/trajet.png?raw=true)

Page permettant à l'utilisateur de créer des trajets.

### Véhicule

![Vehicule](https://github.com/Aboubakr67/CovoitExpress/blob/main/frontend/public/img/vehicule.png?raw=true)

Page permettant à l'utilisateur de créer ses véhicules.

### Profil

Page de profil utilisateur affichant les informations personnelles et les paramètres du compte.


## Structure de la base de données

### Utilisateurs (Users)

- **nom**: Nom de l'utilisateur
- **prenom**: Prénom de l'utilisateur
- **email**: Adresse email de l'utilisateur
- **password**: Mot de passe de l'utilisateur
- **dateNaissance**: Date de naissance de l'utilisateur
- **adresse**: Adresse de l'utilisateur
- **tel**: Numéro de téléphone de l'utilisateur
- **photoProfil**: Chemin de l'image de profil de l'utilisateur
- **vehicule**: Liste des véhicules possédés par l'utilisateur

### Trajets (Trajets)

- **conducteur**: Conducteur du trajet (référence à un utilisateur)
- **depart**: Lieu de départ du trajet
- **destination**: Lieu de destination du trajet
- **heure_depart**: Heure de départ du trajet
- **heure_arrivee**: Heure d'arrivée estimée du trajet
- **distance**: Distance du trajet
- **duree**: Durée estimée du trajet
- **placesDisponibles**: Nombre de places disponibles dans le véhicule
- **passagers**: Liste des passagers du trajet (référence à des utilisateurs)
- **vehicule_utilisee**: Véhicule utilisé pour le trajet (référence à un véhicule)

### Véhicules (Vehicules)

- **marque**: Marque du véhicule
- **modele**: Modèle du véhicule
- **annee**: Année de fabrication du véhicule
- **couleur**: Couleur du véhicule
- **immatriculation**: Numéro d'immatriculation du véhicule
