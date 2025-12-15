## Procédure d'installation de l'application sur un poste local

- télécharger le projet
- Démarrer le projet en exécutant la commande "npm run dev" dans la racine du projet.

## Description sommaire de l'application publiée

Le site en ligne de capture de poisson qui garde les poissons capture des utilisateur.
L’accès au site nécessite une authentification préalable.
La page d’accueil montre les deux boutons pour voir la liste où pour ajouter une capture.
La page «Liste» affiche la liste de tous les captures disponibles dans la base de données.
Cette page comporte également des boutons permettant de le supprimer, de le modifier ou d'aller ajouter.
Une menu déroulant permet de sélectionner le type de filtres soit l'espèces ou la date.
Le bouton « Ajouter un capture» ouvre un formulaire pour ajouter une nouvelle captures.

## Informations d'authentification

Courriel : test@gmail.com
Mot de passe : 123

## Procédure d'installation de l'API sur un poste local

- Copier le fichier .env.example et créer un fichier .env à la racine du projet.

- Modifier la variable MONGODB afin qu’elle contienne la chaîne de connexion MongoDB, qu’elle soit locale ou en ligne.

- Définir le host et le port.

PS : Dans le fichier .env.example, l’URL mongodb://localhost:27017/personnage_historique se termine par personnage_historique, ce qui permet de préciser la base de données à utiliser.

## Procédure de création de la base de données

- Créer une BD sur MongoDB utilisant le même nom de BD que l'URL de connection.

- Importer histoire.json se trouvant dans le dossier /dev/histoire.json qui comporte des données déjà existant.

## URL de l'api publiée

- https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net

- Pour la documentation de l'api : https://histoireapi-e8czf4c8ehcvdgcw.canadacentral-01.azurewebsites.net/api/docs
