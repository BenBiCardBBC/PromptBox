
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getTemplateById, updateTemplate } from "../../../../lib/templates";
import type { PromptTemplate } from "../../../../lib/db";

export default function EditTemplatePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [template, setTemplate] = useState<PromptTemplate | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("其他");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTemplateById(id)
      .then((data) => {
        if (!active) return;

        if (!data) {
          setError("没有找到这个模板。");
          return;
        }

        setTemplate(data);
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPrompt(data.prompt);
      })
      .catch((err: unknown) => {
        console.error("读取模板失败：", err);
        if (active) setError("读取模板失败，请刷新页面重试。");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!template) return;

    if (!title.trim() || !prompt.trim()) {
      setError("模板名称和提示词正文不能为空。");
      return;
    }

    try {
      await updateTemplate(id, {
        title: title.trim(),
        category: category.trim() || "其他",
        description: description.trim(),
        prompt: prompt.trim(),
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("更新模板失败：", err);
      setError("保存失败，请稍后重试。");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <p className="text-sm text-slate-500">正在读取模板…</p>
      </main>
    );
  }

  if (error && !template) {
    return (
      <main className="min-h-screen bg-[#f7f8fc] px-6 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-6">
          <p className="text-red-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600">
            返回首页
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-indigo-600">
          ← 返回首页
        </Link>

        <h1 className="mt-6 text-3xl font-bold">编辑提示词模板</h1>
        <p className="mt-3 text-sm text-slate-500">
          修改后保存，将更新本地数据库中的模板。
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold">模板名称 *</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={80}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">分类</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400"
            >
              <option>设计创作</option>
              <option>学习效率</option>
              <option>文字写作</option>
              <option>编程开发</option>
              <option>其他</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">模板简介</label>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={200}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">提示词正文 *</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              required
              rows={8}
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-indigo-400"
            />
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold hover:bg-slate-50"
            >
              取消
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              保存修改
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
