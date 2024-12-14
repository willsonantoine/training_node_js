# Training Node JS

Ce repository contient le code source de l'application de training node JS.

## Installation

Pour installer l'application, vous devez d'abord cloner le repository puis installer les dépendances en exécutant la commande `npm install` dans le dossier racine du projet.

## Démarrage

Pour démarrer l'application, vous pouvez exécuter la commande `npm run dev` dans le dossier racine du projet. L'application sera accessible sur le port 4000.

## Routes

Voici les routes disponibles dans l'application :

* `POST /auth/create` : Crée un utilisateur avec les champs `name`, `email` et `password`. Retourne un objet avec les champs `id`, `name` et `email`.

## Technos

L'application utilise les technologies suivantes :

* Node JS
* Express
* Sequelize
* MySQL
* Typescript
* Bcrypt
* Express-validator

## Lancement des tests

Pour lancer les tests, vous pouvez exécuter la commande `npm run test` dans le dossier racine du projet.

## Auteurs

Willson Antoine
