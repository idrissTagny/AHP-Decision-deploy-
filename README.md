# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



#  AHP Decision Pro

AHP Decision  est une application web qui aide à prendre des décisions de manière structurée et logique.

Elle utilise la méthode **AHP (Analytic Hierarchy Process)** pour transformer un choix difficile en un résultat clair basé sur des calculs.

Exemple : choisir un ordinateur, un fournisseur, un projet ou même une voiture.

---

# Installation

### Prérequis

* Node.js installé

### Lancer le projet en local

```bash
npm install
npm run dev
```

Ensuite ouvre :

```
http://localhost:5173
```

---

#  Fonctionnement de l'application

L'application est organisée en **4 étapes simples**.

---

## Étape 1 : Structure

Tu définis :

* **Les critères** → ce qui influence ta décision
  (ex : Prix, Qualité, Performance)

* **Les alternatives** → ce que tu compares
  (ex : Option A, Option B)

 Minimum :

* 3 critères
* 2 alternatives

---

##  Étape 2 : Priorités

Tu compares les critères entre eux (2 à 2).

Exemples :

* 1 → même importance
* 3 → un peu plus important
* 5 → beaucoup plus important
* 9 → très dominant

 L’application calcule un **ratio de cohérence**

* # (bon) < 10% → logique
* # (pas bon) > 10% → à revoir

---

## Étape 3 : Évaluation

Tu notes chaque alternative selon chaque critère (de 1 à 10).

 Exemple :

* Prix :

  * Option A → 9
  * Option B → 4

---

## Étape 4 : Résultats

L’application calcule :

* le poids de chaque critère
* le score global de chaque alternative
* un classement final

 L’option avec le score le plus élevé est la meilleure selon tes choix.

---

#  Exemple rapide

### Objectif : choisir une voiture

**Critères :**

* Prix
* Consommation
* Confort

**Alternatives :**

* Électrique
* Essence

**Résultat :**
L’application te montre laquelle est la meilleure selon tes priorités.

---

# Technologies utilisées

* React + Vite
* TypeScript
* Tailwind CSS + DaisyUI
* Recharts (graphiques)
* Framer Motion (animations)
* Lucide React (icônes)

---

# Structure du projet

```bash
src/
 ├── components/
 ├── hooks/
 │    └── useAHP.ts      # logique métier (état + calcul)
 ├── lib/
 │    └── ahp.ts         # algorithme AHP
 ├── App.tsx             # interface principale
```

Séparation claire :

* calculs → `/lib`
* logique → `/hooks`
* interface → `App`

---

# Déploiement

Le projet peut être déployé facilement avec :

* Vercel
* Netlify

 Il suffit de connecter le repo GitHub.

---

# Objectif du projet

Ce projet a été réalisé pour :

* comprendre l’algorithme AHP
* construire une application React complète
* manipuler des données + visualisation
* créer un outil utile en pratique

---

# Auteur

**Tagny Idriss**
Projet académique – Génie Logiciel

---

# En résumé

AHP Decision Pro permet de :

✔ structurer une décision
✔ comparer objectivement
✔ éviter les choix au hasard
✔ obtenir un résultat clair

---
