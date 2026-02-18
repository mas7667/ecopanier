# Schéma de Base de Données Supabase (PostgreSQL) - EcoPanier

Ce document décrit le schéma de base de données complet pour EcoPanier hébergé sur Supabase. Il inclut les tables, les relations, les types personnalisés (Enums) et les politiques de sécurité (Row Level Security - RLS) pour protéger les données des utilisateurs.

## 🗄️ Structure Globale

Le schéma est conçu pour supporter :

1.  **Authentification** : Via `auth.users` de Supabase.
2.  **Données Privées** : Inventaire, listes de courses, préférences (liés à `user_id`).
3.  **Données Partagées** : Recettes publiques (optionnel), bases de données d'ingrédients.

---

## 🛠️ Script de Création (SQL)

Vous pouvez exécuter ce script directement dans l'éditeur **SQL Editor** de votre tableau de bord Supabase.

### 1. Types & Enums

Pour garantir la consistance des données (inspiré de `ARCHITECTURE_DONNEES.md`).

```sql
-- Nettoyage (si besoin de repartir à zéro)
-- DROP TABLE IF EXISTS shopping_list_items, recipe_history, user_preferences, recipe_ingredients, recipe_steps, recipes, inventory_items, profiles CASCADE;

-- Types énumérés pour restreindre les valeurs
CREATE TYPE category_type AS ENUM (
  'Fruits', 'Légumes', 'Viandes', 'Poissons', 'Produits laitiers',
  'Boulangerie', 'Céréales', 'Condiments', 'Boissons', 'Surgelés',
  'Conserves', 'Autres'
);

CREATE TYPE unit_type AS ENUM (
  'kg', 'g', 'L', 'ml', 'unité', 'unités', 'tasse',
  'c. à soupe', 'c. à café', 'pincée', 'tranche'
);

CREATE TYPE storage_location AS ENUM (
  'Réfrigérateur', 'Congélateur', 'Placard', 'Cave', 'Comptoir'
);

CREATE TYPE expiry_status AS ENUM ('urgent', 'soon', 'safe');
```

### 2. Tables Principales

#### 👤 Profils Utilisateurs

Extension de la table `auth.users` interne de Supabase.

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### 📦 Inventaire

```sql
CREATE TABLE public.inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Infos Produit
  name TEXT NOT NULL,
  barcode TEXT,
  category category_type DEFAULT 'Autres',
  image_url TEXT,

  -- Quantité
  quantity NUMERIC DEFAULT 1,
  unit unit_type DEFAULT 'unité',

  -- Stockage & Dates
  location storage_location DEFAULT 'Placard',
  expiry_date DATE,
  added_date TIMESTAMPTZ DEFAULT NOW(),

  -- Méta
  nutritional_info JSONB, -- Stockage flexible des calories, etc.
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches rapides
CREATE INDEX idx_inventory_user ON inventory_items(user_id);
CREATE INDEX idx_inventory_expiry ON inventory_items(expiry_date);
```

#### 🛒 Liste de Courses

```sql
CREATE TABLE public.shopping_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit unit_type DEFAULT 'unité',
  category category_type DEFAULT 'Autres',

  is_purchased BOOLEAN DEFAULT FALSE,

  -- Origine de l'ajout
  added_from_recipe_id TEXT, -- Peut être un UUID ou un ID externe (Spoonacular)
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 🍲 Recettes (Hybride)

Peut stocker des recettes créées par l'utilisateur, ou servir de cache/favoris pour les recettes externes.

```sql
CREATE TABLE public.recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Null si recette publique système
  external_id TEXT, -- ID Spoonacular si applicable

  source TEXT CHECK (source IN ('spoonacular', 'user', 'ai')),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,

  prep_time INTEGER, -- minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')),

  -- Stockage structuré (pour simplifier, on utilise JSONB pour les listes complexes)
  ingredients JSONB DEFAULT '[]'::JSONB, -- Liste des ingrédients
  steps JSONB DEFAULT '[]'::JSONB,       -- Liste des étapes

  is_public BOOLEAN DEFAULT FALSE,       -- Pour le partage communautaire futur
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### ⭐ Favoris et Historique

```sql
CREATE TABLE public.recipe_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  external_recipe_id TEXT, -- Si la recette n'est pas dans notre DB (juste un ID Spoonacular)

  is_favorite BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  last_cooked_at TIMESTAMPTZ,
  notes TEXT,

  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id),
  UNIQUE(user_id, external_recipe_id)
);
```

#### ⚙️ Préférences Utilisateur

```sql
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,

  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'fr',

  dietary_restrictions TEXT[] DEFAULT '{}', -- ex: ['végétarien', 'sans-gluten']
  allergies TEXT[] DEFAULT '{}',
  disliked_ingredients TEXT[] DEFAULT '{}',

  notifications_enabled BOOLEAN DEFAULT TRUE,
  days_before_expiry_warning INTEGER DEFAULT 3,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 Sécurité (Row Level Security)

Ces règles sont cruciales : elles empêchent un utilisateur de voir l'inventaire d'un autre.

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- 1. Profils : Lecture publique (avatar), Modification par le propriétaire seulement
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Inventaire : Privé complet
CREATE POLICY "Users can see own inventory" ON inventory_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON inventory_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own inventory" ON inventory_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own inventory" ON inventory_items FOR DELETE USING (auth.uid() = user_id);

-- 3. Liste de courses : Privé complet
CREATE POLICY "Users can all shopping list" ON shopping_list_items FOR ALL USING (auth.uid() = user_id);

-- 4. Recettes : Voir les siennes + les publiques
CREATE POLICY "Users can see own recipes and public ones" ON recipes
FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own recipes" ON recipes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON recipes
FOR UPDATE USING (auth.uid() = user_id);

-- 5. Préférences : Privé complet
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
```

---

## 🚀 Prochaines Étapes pour votre App

1.  **Créer le projet** : Allez sur [database.new](https://database.new)
2.  **SQL Editor** : Copiez-collez le script SQL ci-dessus.
3.  **Types TypeScript** : Générez automatiquement les types pour votre frontend avec la CLI Supabase :
    ```bash
    npx supabase gen types typescript --project-id votre-projet-id > types/supabase.ts
    ```
