export interface Recipe {
    id: string;
    title: string;
    ingredients: string[];
    tags: string[];
    image: string;
    created_at: string;
    updated_at?: string;
  }
  export type RecipePayload = {
    title: string;
    ingredients: string[];
    tags?: string[];
    image?: string;
  };
  