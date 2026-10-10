
export function extractVariables(prompt: string): string[] {
  const matches = prompt.match(/\{\{\s*([^{}]+?)\s*\}\}/g) ?? [];

  return Array.from(
    new Set(
      matches.map((match) =>
        match.replace(/^\{\{\s*/, "").replace(/\s*\}\}$/, "").trim()
      )
    )
  );
}

export function fillPromptVariables(
  prompt: string,
  values: Record<string, string>
): string {
  return prompt.replace(
    /\{\{\s*([^{}]+?)\s*\}\}/g,
    (match, variable: string) => {
      const key = variable.trim();
      return values[key]?.trim() || match;
    }
  );
}
