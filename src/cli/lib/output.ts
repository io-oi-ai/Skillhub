import Table from "cli-table3";

export function printJson(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

export function printTable(headers: string[], rows: (string | number)[][]) {
  const table = new Table({
    head: headers,
    wordWrap: true,
  });
  rows.forEach((row) => table.push(row));
  console.log(table.toString());
}

export function printKeyValue(data: Record<string, unknown>) {
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;
    const formatted =
      typeof value === "string"
        ? value
        : Array.isArray(value)
        ? value.join(", ")
        : JSON.stringify(value);
    console.log(`${key}: ${formatted}`);
  });
}
