import type { EquipmentItem } from "../types/training-story";

export function parseEquipmentText(text: string): EquipmentItem[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.includes(":") ? ":" : ",";
      const [namePart, quantityPart] = line.split(separator);

      const parsedQuantity = Number(quantityPart?.trim() || 1);
      const quantity =
        Number.isFinite(parsedQuantity) && parsedQuantity > 0
          ? parsedQuantity
          : 1;

      return {
        id: crypto.randomUUID(),
        name: namePart.trim(),
        quantity,
      };
    })
    .filter((item) => item.name.length > 0);
}

export function formatEquipmentForTextarea(items: EquipmentItem[]) {
  return items
    .map((item) => `${item.name}: ${item.quantity}`)
    .join("\n");
}