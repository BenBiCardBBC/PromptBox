
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTemplate } from "../../../lib/templates";

export default function NewTemplatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("其他");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("请输入模板名称。");
      return;
    }

    if (!prompt.trim()) {
      setError("请输入提示词正文。");
      return;
    }

    try {
      await createTemplate({
        id: crypto.randomUUID(),
        title: title.trim(),
        category: category.trim() || "其他",
        description: description.trim(),
        prompt: prompt.trim(),
        favorite: false,
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("创建模板失败：", err);
      setError("保存失败，请稍后重试。");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← 返回首页
        </Link>

        <h1 className="mt-6 text-3xl font-bold">新建提示词模板</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          保存一次，之后就能重复使用。变量可以使用 {"{{变量名称}}"} 的格式。
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
              placeholder="例如：短视频脚本生成"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
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
              placeholder="简要描述这个模板的用途"
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
              placeholder="例如：请为 {{主题}} 设计一张 {{设计风格}} 风格的海报。"
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-2 text-xs text-slate-400">
              变量格式示例：{"{{主题}}"}、{"{{设计风格}}"}
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

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
              保存模板
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
