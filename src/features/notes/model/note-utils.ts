export function getTitleFromContent(content: string): string {
  return (
    new DOMParser()
      .parseFromString(content, "text/html")
      .body.firstElementChild?.textContent?.trim() || "Untitled Note"
  );
}

export function getPreviewContent(content: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const firstElement = doc.body.firstElementChild;
  if (!firstElement) return "";

  // Remove the first element (title) and get the rest as preview
  firstElement.remove();
  return doc.body.textContent?.trim().slice(0, 100) + "..." || "";
}
