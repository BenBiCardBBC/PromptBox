
import Dexie, { type EntityTable } from "dexie";

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

class PromptBoxDatabase extends Dexie {
  templates!: EntityTable<PromptTemplate, "id">;

  constructor() {
    super("PromptBoxDB");

    this.version(1).stores({
      templates: "id, title, category, favorite, updatedAt",
    });
  }
}

export const db = new PromptBoxDatabase();
