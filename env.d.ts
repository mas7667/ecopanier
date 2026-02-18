/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    SPOONACULAR_API_KEY: string;
    GEMINI_API_KEY: string;
    API_KEY: string;
  }
}
