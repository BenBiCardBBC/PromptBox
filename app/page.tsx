
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTemplates } from "../lib/templates";
import type { PromptTemplate } from "../lib/db";
import {
  extractVariables,
  fillPromptVariables,
} from "../lib/prompt-variables";



export default function Home() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    getTemplates()
      .then((data) => {
        if (active) {
          setTemplates(data);
          setLoadError(false);
        }
      })
      .catch((error: unknown) => {
        console.error("读取模板失败：", error);
        if (active) {
          setLoadError(true);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredTemplates = templates.filter((template) =>
    `${template.title} ${template.category} ${template.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function copyPrompt(prompt: string) {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      window.alert("复制失败，请检查浏览器剪贴板权限。");
    }
  }

  const openVariableEditor = (template: PromptTemplate) => {
    const variables = extractVariables(template.prompt);

    if (variables.length === 0) {
      window.alert("这个模板没有需要填写的变量。");
      return;
    }

    setActiveTemplateId(template.id);

    setVariableValues(
      Object.fromEntries(variables.map((variable) => [variable, ""]))
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight text-indigo-600">
            PromptBox<span className="text-slate-400">.</span>
          </Link>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
            本地提示词工作台
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Your AI Prompt Workspace
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            让好提示词，
            <br />
            <span className="text-indigo-600">可以重复使用。</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-500">
            统一管理常用提示词，通过模板和变量减少重复输入，为学习、写作与设计任务提供更高效的工作流。
          </p>
        </div>

        <div className="mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-lg text-slate-400">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="搜索模板名称、分类或用途..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <a
            href="#templates"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            浏览模板
          </a>
          <Link
            href="/templates/new"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            + 新建模板
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "模板示例", value: "03", detail: "覆盖常见使用场景" },
            { label: "生成方式", value: "本地", detail: "根据模板和变量组合文本" },
            { label: "使用流程", value: "简单", detail: "填写参数后复制结果" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-bold">{item.value}</p>
              <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
            </div>
          ))}
        </div>

        <section id="templates" className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-600">TEMPLATE LIBRARY</p>
              <h2 className="mt-2 text-2xl font-bold">精选模板</h2>
              <p className="mt-2 text-sm text-slate-500">
                从一个模板开始，把重复工作变简单。
              </p>
            </div>
            <span className="text-sm text-slate-400">
              {filteredTemplates.length} 个结果
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <article
                key={template.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                    {template.category}
                  </span>
                  <span className="text-xl text-indigo-400">✳</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{template.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {template.description}
                </p>
                <div className="mt-5 rounded-xl bg-slate-50 p-3">
                  <p className="line-clamp-3 whitespace-pre-wrap text-xs leading-6 text-slate-600">
                    {template.prompt}
                  </p>
                </div>
                <button
                  onClick={() => copyPrompt(template.prompt)}
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  复制模板提示词
                </button>
                <button
                  type="button"
                  onClick={() => openVariableEditor(template)}
                  className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  填写变量
                </button>
                <div className="mt-3 flex gap-3">
                  <Link
                    href={`/templates/${template.id}/edit`}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50"
                  >
                    编辑
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      const confirmed = window.confirm(
                        `确定要删除模板「${template.title}」吗？此操作无法撤销。`
                      );

                      if (!confirmed) {
                        return;
                      }

                      try {
                        const { deleteTemplate } = await import("../lib/templates");
                        await deleteTemplate(template.id);

                        setTemplates((current) =>
                          current.filter((item) => item.id !== template.id)
                        );
                      } catch (error) {
                        console.error("删除模板失败：", error);
                        window.alert("删除失败，请刷新页面后重试。");
                      }
                    }}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
              <p className="font-medium">没有找到匹配的模板</p>
              <p className="mt-2 text-sm text-slate-500">
                试试其他关键词。
              </p>
            </div>
          )}

          <p className="mt-5 text-sm text-slate-500" aria-live="polite">
            {copied ? "已复制提示词，可以粘贴到其他 AI 工具中使用。" : ""}
          </p>
        </section>

        
        <footer className="mt-16 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          PromptBox · 本地优先的提示词管理与批量生成工具
        </footer>
      </section>

      {activeTemplateId !== null && (() => {
        const activeTemplate = templates.find(
          (template) => template.id === activeTemplateId
        );

        if (!activeTemplate) {
          return null;
        }

        const variables = extractVariables(activeTemplate.prompt);
        const generatedPrompt = fillPromptVariables(
          activeTemplate.prompt,
          variableValues
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="variable-editor-title"
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4">
                <h2
                  id="variable-editor-title"
                  className="text-xl font-bold"
                >
                  填写模板变量
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTemplateId(null)}
                  className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
                >
                  关闭
                </button>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                当前模板：{activeTemplate.title}
              </p>

              <div className="mt-6 space-y-4">
                {variables.map((variable) => (
                  <label
                    key={variable}
                    className="block text-sm font-medium text-slate-700"
                  >
                    {variable}
                    <input
                      value={variableValues[variable] ?? ""}
                      onChange={(event) =>
                        setVariableValues((current) => ({
                          ...current,
                          [variable]: event.target.value,
                        }))
                      }
                      placeholder={`请输入${variable}`}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700">
                  生成结果预览
                </h3>
                <textarea
                  readOnly
                  value={generatedPrompt}
                  rows={6}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none"
                />
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVariableValues({})}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                >
                  清空变量
                </button>
                <button
                  type="button"
                  onClick={() => copyPrompt(generatedPrompt)}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  复制生成结果
                </button>
              </div>
            </section>
          </div>
        );
      })()}

    </main>

  );
}
