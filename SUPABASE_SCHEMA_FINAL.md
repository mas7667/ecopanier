# Analyse du Schéma Proposé

Oui, ce schéma est **excellent** et parfaitement adapté pour votre application EcoPanier avec Supabase.

Il est propre, normalisé juste ce qu'il faut (ni trop, ni trop peu), et tire parti des forces de PostgreSQL (JSONB, Arrays, UUIDs).

## ✅ Points Forts

1.  **Utilisation des UUIDs** : C'est la bonne pratique avec Supabase pour la sécurité et la scalabilité.
2.  **Types ENUM** (`category_type`, `unit_type`, etc.) : Cela garantit que vous n'aurez pas de données "sales" (ex: "kg", "Kg", "kilogrammes") dans votre base.
3.  **JSONB pour les Ingrédients/Étapes** :
    - Dans la table `recipes`, stocker `ingredients` et `steps` en `jsonb` est très malin pour une app mobile.
    - Cela évite de faire 3 jointures SQL juste pour afficher une recette.
    - C'est performant et flexible (le schéma d'une recette externe peut changer sans casser votre base).
4.  **Séparation `recipes` vs `recipe_interactions`** :
    - C'est une structure très professionnelle.
    - Cela permet à un utilisateur de noter ou mettre en favori une recette _sans_ copier toute la recette dans sa propre table.
    - Cela gère aussi bien les recettes internes (via `recipe_id`) que externes (via `external_recipe_id`).

## ⚠️ Petites Vigilances (Suggestions)

Le schéma est valide tel quel, mais voici quelques détails techniques pour l'implémentation SQL réelle :

1.  **Espaces dans les ENUMs** :
    - Vous avez `Enum unit_type { "c. à soupe" }`.
    - En SQL, gérer des espaces dans des valeurs d'enum peut être pénible dans certaines requêtes.
    - _Alternative_ : Utiliser des codes sans espaces (`c_soupe`, `c_cafe`) dans la base, et les traduire côté front-end (React). C'est souvent plus robuste.

2.  **Clés Étrangères (Foreign Keys)** :
    - Assurez-vous d'ajouter `ON DELETE CASCADE` sur les liens vers `auth.users`. Si un utilisateur supprime son compte, on veut que son inventaire disparaisse avec lui (pour le RGPD et la propreté).

3.  **Index manquants** :
    - Pensez à ajouter un index sur `inventory_items(expiry_date)` pour que les requêtes "Qu'est-ce qui périme bientôt ?" soient instantanées.

## 📝 Traduction en SQL Exécutable

Voici le code SQL exact correspondant à votre schéma pour le copier-coller dans Supabase :

```sql
-- 1. ENUMS (NOTE: J'ai gardé vos valeurs exactes avec guillemets)
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

-- 2. TABLES

-- Profils (Liaison auto avec Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gestion du trigger de création de profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Inventaire
CREATE TABLE public.inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  barcode TEXT,
  category category_type DEFAULT 'Autres',
  image_url TEXT,
  quantity NUMERIC DEFAULT 1,
  unit unit_type DEFAULT 'unité',
  location storage_location DEFAULT 'Placard',
  expiry_date DATE,
  added_date TIMESTAMPTZ DEFAULT NOW(),
  nutritional_info JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_inventory_expiry ON inventory_items(expiry_date); -- Optimisation

-- Liste de courses
CREATE TABLE public.shopping_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit unit_type DEFAULT 'unité',
  category category_type DEFAULT 'Autres',
  is_purchased BOOLEAN DEFAULT FALSE,
  added_from_recipe_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recettes
CREATE TABLE public.recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Nullable si l'user part mais la recette reste publique
  external_id TEXT,
  source TEXT CHECK (source IN ('spoonacular', 'user', 'ai')),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER,
  servings INTEGER,
  difficulty TEXT,
  ingredients JSONB DEFAULT '[]'::JSONB,
  steps JSONB DEFAULT '[]'::JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interactions Recettes (Favoris, Notes)
CREATE TABLE public.recipe_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  external_recipe_id TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  rating INTEGER,
  last_cooked_at TIMESTAMPTZ,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contrainte d'unicité (un user ne note qu'une fois la même recette)
  UNIQUE(user_id, recipe_id),
  UNIQUE(user_id, external_recipe_id)
);

-- Préférences
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'fr',
  dietary_restrictions TEXT[],
  allergies TEXT[],
  disliked_ingredients TEXT[],
  notifications_enabled BOOLEAN DEFAULT TRUE,
  days_before_expiry_warning INTEGER DEFAULT 3,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SÉCURITÉ (RLS)
-- Activez RLS sur toutes les tables
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Exemple de politique simple (Donne accès total à ses propres données)
CREATE POLICY "Users can manage own inventory" ON inventory_items USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own shopping list" ON shopping_list_items USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON user_preferences USING (auth.uid() = user_id);
-- Pour les recettes, voir les siennes OU les publiques
CREATE POLICY "View public or own recipes" ON recipes FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Manage own recipes" ON recipes FOR ALL USING (auth.uid() = user_id);

```

C'est validé ! Vous pouvez foncer avec ce modèle.
