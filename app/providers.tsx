
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { seedTemplates } from "../lib/seed";

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    seedTemplates()
      .then(() => {
        if (active) {
          setReady(true);
        }
      })
      .catch((err: unknown) => {
        console.error("PromptBox 数据库初始化失败：", err);

        if (active) {
          setError("本地数据库初始化失败，请刷新页面重试。");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            暂时无法打开 PromptBox
          </h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            重新加载
          </button>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">正在准备本地模板库…</p>
      </main>
    );
  }

  return <>{children}</>;
}
