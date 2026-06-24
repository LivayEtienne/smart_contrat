# Frontend - Smart Contrat

## ⚠️ Configuration requise avant le lancement

Avant de lancer l'application frontend, vous devez obligatoirement configurer vos variables d'environnement :

1. À la racine du dossier `frontend`, dupliquez le fichier `.env.example` et renommez la copie en `.env`.
   - **Sous Linux/Mac** : `cp .env.example .env`
   - **Sous Windows** : `copy .env.example .env`
2. Vérifiez que le fichier `.env` contient bien la variable `VITE_BCX_CONTRACT_ADDRESS` avec l'adresse du contrat déployé.

## 🚀 Lancement de l'application

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

---

# React + Vite (Documentation originale Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
