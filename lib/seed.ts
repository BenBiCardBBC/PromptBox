
import { db, type PromptTemplate } from "./db";

const initialTemplates: PromptTemplate[] = [
  {
    id: "poster-design",
    title: "AI 海报设计",
    category: "设计创作",
    description: "为不同主题快速生成海报设计提示词。",
    prompt:
      "请为 {{主题}} 设计一张面向 {{目标人群}} 的海报，整体风格为 {{设计风格}}，突出主题表达与视觉层次。",
    favorite: true,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: "study-plan",
    title: "学习计划制定",
    category: "学习效率",
    description: "根据学习目标和可用时间生成学习计划。",
    prompt:
      "请为 {{学习目标}} 制定一份为期 {{学习天数}} 天的学习计划，适合 {{学习阶段}}，并列出每天的任务和检查标准。",
    favorite: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    id: "article-writing",
    title: "文章写作助手",
    category: "文字写作",
    description: "快速生成符合要求的文章写作提示词。",
    prompt:
      "请围绕 {{文章主题}} 写一篇面向 {{目标读者}} 的文章，字数约为 {{目标字数}}，语言风格为 {{写作风格}}。",
    favorite: false,
    createdAt: 0,
    updatedAt: 0,
  },
];

export async function seedTemplates(): Promise<void> {
  const count = await db.templates.count();

  if (count > 0) {
    return;
  }

  const now = Date.now();

  await db.templates.bulkAdd(
    initialTemplates.map((template) => ({
      ...template,
      createdAt: now,
      updatedAt: now,
    }))
  );
}
