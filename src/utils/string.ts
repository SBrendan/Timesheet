export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function snakeCase(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

export function convertMsToHMstring(ms: number): string {
  const hour = Math.floor(ms / 1000 / 60 / 60);
  let minutes = Math.floor((ms / 1000 / 60 / 60 - hour) * 60);
  minutes = ((((minutes + 7.5) / 15) | 0) * 15) % 60;
  return hour + "h" + (minutes === 0 ? "00" : minutes);
}
