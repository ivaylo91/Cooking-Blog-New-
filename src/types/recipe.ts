export type Difficulty = "лесно" | "средно" | "трудно";

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Ingredient {
  id: string;
  recipe_id: string;
  group_name: string;
  position: number;
  amount: number | null;
  unit: string;
  item: string;
  note: string;
}

export interface Step {
  id: string;
  recipe_id: string;
  position: number;
  text: string;
  image_path: string | null;
}

export interface Comment {
  id: string;
  recipe_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string | null;
  cuisine: string;
  difficulty: Difficulty;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_path: string | null;
  published: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeWithRelations extends Recipe {
  category: Category | null;
  ingredients: Ingredient[];
  steps: Step[];
  tags: Tag[];
}

export interface RecipeFormInput {
  slug: string;
  title: string;
  description: string;
  category_id: string | null;
  cuisine: string;
  difficulty: Difficulty;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_path: string | null;
  published: boolean;
  ingredients: Array<Pick<Ingredient, "group_name" | "amount" | "unit" | "item" | "note">>;
  steps: Array<Pick<Step, "text" | "image_path">>;
  tagNames: string[];
}
