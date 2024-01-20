# TAD Sharecount

## Table des matières

1. [Technologies Utilisées](#technologies-utilisées)
2. [Justification des Choix Technologiques](#justification-des-choix-technologiques)
3. [Explication de l'Architecture](#explication-de-larchitecture)
4. [Détails Clés de l'Architecture](#détails-clés-de-larchitecture)
5. [Défis et Points Clés](#défis-et-points-clés)
6. [Post-Mortem](#post-mortem)
   - [Aspect Humain](#aspect-humain)
   - [Aspect Technologique](#aspect-technologique)
7. [Conclusion](#conclusion)

## Technologies Utilisées

### Front-end :
- HTML
- JavaScript
- CSS
- Bootstrap

### Back-end :
- NodeJS
- Express
- bcrypt
- uuid

### Base de données :
- PostgreSQL

J'utilise également Docker pour containeriser la base de données et le serveur Node avec les pages HTML.

## Justification des Choix Technologiques

### Front-end :

Pour le front-end, je cherchais la simplicité et une base bien connue. Cela a conduit au choix de HTML, JavaScript, et CSS ainsi que Bootstrap. Commencer avec une pile connue a facilité la courbe d'apprentissage pour le reste de l'application.

### Back-end :
J'ai choisi NodeJS pour le backend en raison de sa scalabilité et de sa convivialité. Express est une option stable pour la construction du serveur. En raison de son historique en matière de sécurité, j'utilise bcrypt pour le chiffrement des mots de passe. Les jetons sont générés à l'aide d'uuid, qui fournit de manière sécurisée des identifiants uniques pour les groupes.

### Base de données :
En raison de mon expérience et de nos cours, j'ai choisi PostgreSQL plutôt que MySQL. La base de données a été containerisée à l'aide de Docker, ce qui a amélioré le déploiement et la scalabilité.

## Explication de l'Architecture

### Front-end :
L'architecture du front-end se compose de plusieurs pages HTML avec du CSS et du JavaScript en ligne. Les images d'utilisateur et de groupe ne sont pas utilisées dans l'application, mais elles sont implémentées dans la base de données.

### Back-end :
Les tâches côté serveur sont gérées par le serveur NodeJS à l'aide d'Express. Le stockage sécurisé des mots de passe est assuré par bcrypt, et la génération de jetons est facilitée par uuid. Pour le déploiement containerisé, Docker est utilisé.

### Base de données :
L'application utilise PostgreSQL comme base de données, déployée dans une image Docker. Le serveur, responsable des chemins de fichiers, inclut les pages HTML et CSS dans son image.

## Détails Clés de l'Architecture

- **Gestion de Session :** Implémentée pour l'authentification des utilisateurs selon la méthode apprise en classe.
- **Choix de Chiffrement :** Utilisation de bcrypt pour le stockage sécurisé des mots de passe en raison de ses avantages en matière de sécurité par rapport à sha256, la méthode que j'envisageais au départ.
- **Stratégie de Déploiement :** Utilisation de Docker pour à la fois la base de données et le serveur NodeJS pour un déploiement et une scalabilité faciles.

## Défis et Points Clés

- **Stockage des Images :** Difficulté à gérer le stockage des images d'utilisateur et de groupe dans la base de données. C'est une zone pour une implémentation future.
- **Courbe d'Apprentissage :** Acquérir une compétence dans la construction d'images Docker et NodeJS a été difficile mais essentiel pour le succès du projet.

## Post-Mortem

### Aspect Humain :

#### Réflexion Personnelle :

- **Apprentissage Individuel :** J'ai acquis des connaissances sur diverses technologies mais j'ai fait face à des limitations en raison de l'absence de contributions collaboratives, surtout lors du choix de la pile technologique au début du projet.
- **Problèmes de Déploiement :** Des difficultés de déploiement dues à des choix technologiques non optimaux ont entravé l'accessibilité du projet.

### Aspect Technologique :

#### Réalisations :
- **Courbe d'Apprentissage Réussie :** Acquisition de nouvelles compétences en Docker et NodeJS pendant le projet.
- **Authentification Sécurisée :** Mise en œuvre d'un chiffrement robuste des mots de passe en utilisant bcrypt.

#### Axes d'Amélioration :
- **Optimisation du Stockage des Images :** Explorer de meilleures méthodes pour gérer le stockage des images.
- **Choix Technologiques :** Réévaluer les choix technologiques pour une optimisation potentielle. Express et les sessions ne sont pas compatibles avec un déploiement dans Kubernetes car c'est une faille de sécurité. JWT semble être une excellente alternative à cela à l'avenir.
Les images Docker sont également déployées dans Docker Hub, mais en raison de cette faille de sécurité, il est impossible de les utiliser dans leur état actuel.

## Conclusion

J'ai réussi à implémenter toutes les fonctionnalités que je voulais dans cette application, commençant à envisager le déploiement vers la fin. Pour ces raisons, je suis très satisfait de ce projet, car il m'a poussé à repousser mes limites, n'ayant jamais entrepris un projet de cette envergure auparavant.