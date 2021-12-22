export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function snakeCase(str: string): string {
  return str
    .replace(/\W+/g, " ")
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join("_");
}

export function titleCase(str: string): string {
  return str.replace(/^_*(.)|_+(.)/g, (str, c, d) =>
    c ? c.toUpperCase() : " " + d.toUpperCase()
  );
}
