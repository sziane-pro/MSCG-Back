# MSCG-Back (Version Simplifiée)

## 🎯 Architecture adaptée au Frontend

Ce backend a été simplifié pour correspondre **exactement** aux besoins du frontend MSCG_Front. Toutes les entités non utilisées ont été supprimées.

## 📊 Modèles de données

### **User**
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hasché)
- `createdAt`, `updatedAt`

### **Simulation**
- `id` (Primary Key)
- `nom` (Nom de la simulation)
- `statut` ('En cours', 'Terminée', 'Brouillon')
- `ca` (Chiffre d'affaires formaté, ex: "12 000 €")
- `revenuNet` (Revenu net formaté, ex: "8 400 €")
- `userId` (Foreign Key vers User)
- `createdAt` (utilisé comme "date" côté frontend), `updatedAt`

## 🔌 API Endpoints

### **Authentification**
- `POST /api/auth/register` - Inscription (email, password)
- `POST /api/auth/login` - Connexion (email, password) → retourne token JWT
- `GET /api/auth/me` - Profil utilisateur (protégé)

### **Simulations**
- `GET /api/simulations` - Liste des simulations de l'utilisateur
- `POST /api/simulations` - Créer une simulation
- `GET /api/simulations/:id` - Détail d'une simulation
- `PUT /api/simulations/:id` - Modifier une simulation
- `DELETE /api/simulations/:id` - Supprimer une simulation
- `GET /api/simulations/dashboard/stats` - Statistiques pour le dashboard

### **Utilitaire**
- `GET /api/health` - État du serveur

## 🗂️ Structure du projet

```
MSCG_Back/
├── controllers/
│   ├── authController.js      # Authentification
│   └── simulationController.js # Gestion des simulations
├── models/
│   ├── index.js              # Configuration Sequelize
│   ├── user.js               # Modèle User
│   └── simulation.js         # Modèle Simulation
├── routes/
│   ├── authRoutes.js         # Routes d'authentification
│   └── simulationRoutes.js   # Routes des simulations
├── middleware/
│   └── authMiddleware.js     # Middleware JWT
├── migrations/
│   └── 20250219101949-create-simplified-schema.js
├── seeders/
│   └── 20250219-simplified-data.js
└── app.js                    # Serveur Express
```

## 🚀 Installation et démarrage

```bash
# Installation des dépendances
npm install

# Exécution des migrations
npx sequelize-cli db:migrate

# Insertion des données de test
npx sequelize-cli db:seed:all

# Démarrage en développement
npm run dev

# Démarrage en production
npm start
```

## 🧪 Données de test

### **Utilisateur de test**
- Email: `test@mscg.com`
- Mot de passe: `password123`

### **Simulations de test**
- Simulation A (Terminée)
- Simulation B (En cours)
- Analyse Micro-Entreprise 2024 (Terminée)
- Projection Q2 2024 (Brouillon)

## 🔄 Correspondance Frontend ↔ Backend

Le backend est maintenant **100% aligné** avec le frontend :

### **LoginView.vue** ↔ **authController.js**
- Champs : `email`, `password`
- Retour : `token` JWT

### **SimulationTable.vue** ↔ **simulationController.js**
- Champs : `nom`, `statut`, `date`, `ca`, `revenuNet`
- Format identique entre frontend et backend

### **DashboardView.vue** ↔ **getDashboardStats()**
- Statistiques calculées depuis les simulations réelles
- Format correspondant aux composants StatCard

## ✅ Éléments supprimés

Les éléments suivants ont été supprimés car **non utilisés par le frontend** :

- ❌ Modèle **Society** et ses contrôleurs/routes
- ❌ Modèle **Exercice** et ses contrôleurs/routes  
- ❌ Modèle **JuryStatus** et ses contrôleurs/routes
- ❌ Modèle **SupplData** et ses contrôleurs/routes
- ❌ Relations complexes many-to-many
- ❌ Champs utilisateur inutilisés (login, name, surname, etc.)
- ❌ Migrations obsolètes

## 🎯 Architecture finale

```
User (1) ←→ (n) Simulation
```

Architecture ultra-simplifiée avec seulement :
- **Authentification** : email/password + JWT
- **Simulations** : CRUD complet avec statistiques
- **Relations** : 1 User → N Simulations
