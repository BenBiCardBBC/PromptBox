
import { db, type PromptTemplate } from "./db";

export type NewPromptTemplate = Omit<
  PromptTemplate,
  "createdAt" | "updatedAt"
>;

export async function getTemplates(): Promise<PromptTemplate[]> {
  return db.templates.orderBy("updatedAt").reverse().toArray();
}

export async function getTemplateById(
  id: string
): Promise<PromptTemplate | undefined> {
  return db.templates.get(id);
}

export async function createTemplate(
  input: NewPromptTemplate
): Promise<PromptTemplate> {
  const now = Date.now();

  const template: PromptTemplate = {
    ...input,
    title: input.title.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    createdAt: now,
    updatedAt: now,
  };

  await db.templates.add(template);
  return template;
}

export async function updateTemplate(
  id: string,
  changes: Partial<
    Pick<
      PromptTemplate,
      "title" | "category" | "description" | "prompt" | "favorite"
    >
  >
): Promise<PromptTemplate> {
  const existing = await db.templates.get(id);

  if (!existing) {
    throw new Error("找不到要修改的模板。");
  }

  const updated: PromptTemplate = {
    ...existing,
    ...changes,
    title: changes.title?.trim() ?? existing.title,
    category: changes.category?.trim() ?? existing.category,
    description: changes.description?.trim() ?? existing.description,
    updatedAt: Date.now(),
  };

  await db.templates.put(updated);
  return updated;
}

export async function deleteTemplate(id: string): Promise<void> {
  await db.templates.delete(id);
}

export async function toggleTemplateFavorite(
  id: string
): Promise<PromptTemplate> {
  const existing = await db.templates.get(id);

  if (!existing) {
    throw new Error("找不到要收藏的模板。");
  }

  const updated: PromptTemplate = {
    ...existing,
    favorite: !existing.favorite,
    updatedAt: Date.now(),
  };

  await db.templates.put(updated);
  return updated;
}
