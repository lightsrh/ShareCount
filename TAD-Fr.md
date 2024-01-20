# TAD Sharecount

## Table des matières

1. [Technologies utilisées](#technologies-used)
2. [Justification des choix technologiques](#justification-of-technology-choices)
3. [Explication de l'architecture](#architecture-explanation)
4. [Détails clés de l'architecture](#key-architecture-details)
5. [Défis et points clés](#challenges-and-key-points)
6. [Post-Mortem](#post-mortem)
   - [Aspect Humain](#human-aspect)
   - [Aspect Technologique](#technological-aspect)
7. [Conclusion](#conclusion)

## Technologies utilisées

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

J'ai également utilisé Docker pour containeriser la base de données dans une image et le serveur Node avec les pages HTML dans une autre.

## Justification des choix technologiques

### Front-end :
Le choix de HTML, JavaScript et CSS pour le front-end a été motivé par la nécessité de simplicité et d'une base familière. Étant donné que les autres technologies étaient nouvelles, commencer avec une pile connue a permis une courbe d'apprentissage plus fluide.

### Back-end :
NodeJS a été choisi pour le backend en raison de sa facilité d'utilisation et de sa scalabilité. Express a fourni un cadre robuste pour la construction du serveur. bcrypt a été sélectionné pour le chiffrement des mots de passe en raison de sa sécurité avérée. uuid a été utilisé pour la génération de jetons, fournissant des identifiants uniques de manière sécurisée.

### Base de données :
PostgreSQL a été préféré à MySQL en raison de la maîtrise du développeur et de l'exposition en classe. Docker a été choisi pour containeriser la base de données, améliorant le déploiement et la scalabilité.

## Explication de l'architecture

### Front-end :
L'architecture front-end comprend plusieurs pages HTML, intégrant du JavaScript et du CSS en ligne. Les images des utilisateurs et des groupes sont stockées à côté des pages de manière statique et ne sont pas implémentées dans l'application.

### Back-end :
Le serveur NodeJS, alimenté par Express, gère les opérations en backend. bcrypt assure un stockage sécurisé des mots de passe, et uuid facilite la génération de jetons. Docker est utilisé pour le déploiement en conteneur.

### Base de données :
PostgreSQL sert de base de données, déployée dans une image Docker. Le serveur, responsable des chemins de fichiers, inclut les pages HTML et CSS dans son image.

## Détails clés de l'architecture

- **Gestion de session :** Implémentée pour l'authentification des utilisateurs en utilisant les connaissances acquises en classe.
- **Choix de chiffrement :** Choix de bcrypt pour le stockage sécurisé des mots de passe en raison de ses avantages en sécurité par rapport à sha256.
- **Stratégie de déploiement :** Utilisation de Docker pour à la fois la base de données et le serveur NodeJS pour un déploiement et une scalabilité sans problème.

## Défis et points clés

- **Stockage des images :** Difficulté à gérer le stockage des images d'utilisateurs et de groupes dans la base de données. Un domaine pour une amélioration future et une optimisation.
- **Courbe d'apprentissage :** L'acquisition de compétences en Docker et en NodeJS a été difficile mais essentielle pour le succès du projet.

## Post-Mortem

### Aspect Humain :

#### Réflexion personnelle :
- **Développement en solo :** Être le seul développeur a entraîné un apprentissage approfondi, mais a présenté des défis dans la prise de décisions.
- **Apprentissage individuel :** Acquis des connaissances sur diverses technologies, mais a fait face à des limitations en raison de l'absence de contributions collaboratives, surtout lors du choix de la pile technologique.
- **Problèmes de déploiement :** Des difficultés de déploiement en raison de choix technologiques sous-optimaux, entravant l'accessibilité du projet.

### Aspect Technologique :

#### Réussites :
- **Courbe d'apprentissage réussie :** Acquisition de nouvelles compétences en Docker et en NodeJS pendant le projet.
- **Authentification sécurisée :** Mise en œuvre d'un chiffrement robuste des mots de passe avec bcrypt.

#### Domaines d'amélioration :
- **Optimisation du stockage des images :** Explorer de meilleures méthodes pour gérer le stockage des images.
- **Choix technologiques :** Réévaluer les choix technologiques pour une optimisation potentielle. Express et session ne sont pas compatibles avec un déploiement dans Kubernetes en raison d'une faille de sécurité. JWT semble être une excellente alternative pour le futur.
Les images sont également déployées sur Docker Hub, mais en raison de cette faille de sécurité, il est impossible de les utiliser dans leur état actuel.

## Conclusion

J'ai réussi à intégrer tous les éléments que je souhaitais dans cette application, en commençant à envisager le déploiement vers la fin. Pour ces raisons, je suis extrêmement satisfaite de ce projet, car il m'a poussée à repousser mes limites, n'ayant jamais entrepris un projet d'une telle envergure auparavant.