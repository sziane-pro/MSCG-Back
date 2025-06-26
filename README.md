# MSCG-Back (Version Simplifiée selon MPD)

## 🎯 Architecture simplifiée et conforme au MPD

Ce backend a été **entièrement refondu** pour correspondre exactement au **Modèle Physique de Données (MPD)** fourni. L'architecture est maintenant ultra-simplifiée avec seulement **3 tables**.

## 📊 Modèle de données (conforme au MPD)

### **Users**
```sql
id          INT (PK, AUTO_INCREMENT)
email       VARCHAR(255) NOT NULL UNIQUE
password    VARCHAR(255) NOT NULL  
firstname   VARCHAR(100) NOT NULL
lastname    VARCHAR(100) NOT NULL
createdAt   TIMESTAMP NOT NULL
updatedAt   TIMESTAMP NOT NULL
```

### **Simulations**
```sql
id          INT (PK, AUTO_INCREMENT)
name        VARCHAR(255) NOT NULL
userId      INT NOT NULL (FK → Users.id)
createdAt   TIMESTAMP NOT NULL
updatedAt   TIMESTAMP NOT NULL
```

### **SimulationResults** 
```sql
id                            INT (PK, AUTO_INCREMENT)
simulationId                  INT NOT NULL UNIQUE (FK → Simulations.id)
totalMonthlyVital             DECIMAL(10,2) NOT NULL DEFAULT 0.00
totalMonthlyComfortCharges    DECIMAL(10,2) NOT NULL DEFAULT 0.00
totalMonthlyImprovedIncome    DECIMAL(10,2) NOT NULL DEFAULT 0.00
totalOperatingCharges         DECIMAL(10,2) NOT NULL DEFAULT 0.00
breakevenThreshold            DECIMAL(10,2) NOT NULL DEFAULT 0.00
microEnterpriseRevenue        DECIMAL(10,2) NOT NULL DEFAULT 0.00
enterpriseRevenue             DECIMAL(10,2) NOT NULL DEFAULT 0.00
bestOption                    VARCHAR(15) NOT NULL DEFAULT 'micro'
calculatedAt                  TIMESTAMP NOT NULL
```

## 🔗 Relations

```
Users (1) ←→ (N) Simulations (1) ←→ (1) SimulationResults
```

Architecture **1:N:1** ultra-simplifiée :
- Un **User** peut avoir plusieurs **Simulations**
- Une **Simulation** a exactement un **SimulationResults**

## 🔌 API Endpoints

### **Authentification**
- `POST /api/auth/register` - Inscription (email, password, firstname, lastname) 
- `POST /api/auth/login` - Connexion (email, password) → retourne token JWT
- `GET /api/auth/me` - Profil utilisateur (protégé)

### **Simulations**
- `GET /api/simulations` - Liste des simulations de l'utilisateur
- `POST /api/simulations` - Créer une simulation avec résultats
- `GET /api/simulations/:id` - Détail d'une simulation complète
- `PUT /api/simulations/:id` - Modifier une simulation et ses résultats
- `DELETE /api/simulations/:id` - Supprimer une simulation (cascade sur résultats)
- `GET /api/simulations/dashboard/stats` - Statistiques pour le dashboard

### **Utilitaire**
- `GET /api/health` - État du serveur

## 📁 Structure simplifiée

```
MSCG_Back/
├── controllers/
│   ├── authController.js         # Authentification (firstname/lastname obligatoires)
│   └── simulationController.js   # CRUD simulations + résultats
├── models/
│   ├── index.js                  # Configuration Sequelize (3 modèles)
│   ├── user.js                   # User (avec firstname/lastname requis)
│   ├── simulation.js             # Simulation (simplifié)
│   └── simulationResults.js      # SimulationResults (selon MPD)
├── migrations/
│   ├── 20250219101950-create-users.js            # Migration Users
│   ├── 20250219101951-create-simulations.js      # Migration Simulations
│   └── 20250219101952-create-simulation-results.js # Migration SimulationResults
├── routes/
│   ├── authRoutes.js            # Routes d'authentification
│   └── simulationRoutes.js      # Routes des simulations
├── middleware/
│   └── authMiddleware.js        # Middleware JWT
└── app.js                       # Serveur Express
```

## 🗂️ Migrations organisées (1 par table)

Les migrations sont maintenant **parfaitement organisées** :

1. **`20250219101950-create-users.js`** - Création table Users + index email
2. **`20250219101951-create-simulations.js`** - Création table Simulations + FK Users + index userId  
3. **`20250219101952-create-simulation-results.js`** - Création table SimulationResults + FK Simulations + index simulationId

### **Avantages de cette organisation :**
- ✅ **1 migration = 1 table** (plus lisible)
- ✅ **Ordre logique** (Users → Simulations → SimulationResults)
- ✅ **Rollback précis** (possibilité de revenir en arrière par table)
- ✅ **Maintenance facilitée** (modifications futures par table)

## 🚀 Installation et démarrage

```bash
# Installation des dépendances
npm install

# Exécution des migrations (dans l'ordre)
npx sequelize-cli db:migrate

# Rollback possible par migration
npx sequelize-cli db:migrate:undo        # Annule la dernière
npx sequelize-cli db:migrate:undo:all    # Annule toutes

# Démarrage en développement
npm run dev

# Démarrage en production
npm start
```

## 🔄 Format de données API

### **Création d'une simulation**
```json
POST /api/simulations
{
  "name": "Ma simulation",
  "totalMonthlyVital": 2500.00,
  "totalMonthlyComfortCharges": 800.00,
  "totalMonthlyImprovedIncome": 4200.00,
  "totalOperatingCharges": 450.00,
  "breakevenThreshold": 3750.00,
  "microEnterpriseRevenue": 5100.00,
  "enterpriseRevenue": 4800.00,
  "bestOption": "micro"
}
```

### **Réponse simulation complète**
```json
{
  "id": 1,
  "name": "Ma simulation",
  "userId": 1,
  "createdAt": "2024-02-19T10:30:00.000Z",
  "updatedAt": "2024-02-19T10:30:00.000Z",
  "results": {
    "id": 1,
    "simulationId": 1,
    "totalMonthlyVital": 2500.00,
    "totalMonthlyComfortCharges": 800.00,
    "totalMonthlyImprovedIncome": 4200.00,
    "totalOperatingCharges": 450.00,
    "breakevenThreshold": 3750.00,
    "microEnterpriseRevenue": 5100.00,
    "enterpriseRevenue": 4800.00,
    "bestOption": "micro",
    "calculatedAt": "2024-02-19T10:30:00.000Z"
  }
}
```

## ✅ Conformité MPD

### **Changements majeurs appliqués**

✅ **Modèles supprimés** (non présents dans le MPD) :
- ❌ `CategoriBudget` 
- ❌ `OperatingCharges`
- ❌ `SimulationParameters`

✅ **Modèles conformes** au MPD :
- ✅ `User` (avec firstname/lastname obligatoires)
- ✅ `Simulation` (simplifié)
- ✅ `SimulationResults` (tous les champs du MPD)

✅ **Types de données** respectés :
- `VARCHAR(255)` pour email, name
- `VARCHAR(100)` pour firstname, lastname
- `VARCHAR(15)` pour bestOption  
- `DECIMAL(10,2)` pour tous les montants
- `TIMESTAMP` pour les dates

✅ **Contraintes** appliquées :
- Clés étrangères avec CASCADE
- Index sur les FK
- Validations de taille
- Valeurs par défaut

✅ **Organisation** optimisée :
- ❌ Seeders supprimés (données en dur évitées)
- ✅ Migrations séparées par table
- ✅ Ordre logique des dépendances

## 🎯 Avantages de la nouvelle architecture

1. **Simplicité maximale** : 3 tables seulement
2. **Conformité totale** au MPD fourni
3. **Performance optimisée** : moins de jointures
4. **Maintenance facilitée** : code plus lisible
5. **Frontend aligné** : structure simple côté client
6. **Migrations organisées** : 1 migration = 1 table

## 📈 Extensions possibles

Le modèle simplifié permet facilement d'ajouter :
- Tables de configuration métier
- Historique des calculs 
- Templates de simulations
- Rapports d'export

---

**Architecture finale** : `User (1) → (N) Simulation (1) → (1) SimulationResults`
