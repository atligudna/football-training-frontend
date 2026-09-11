export function parseTagsText(text: string): string[] {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function formatTagsForInput(tags: string[] | undefined): string {
  return tags?.join(", ") ?? "";
}