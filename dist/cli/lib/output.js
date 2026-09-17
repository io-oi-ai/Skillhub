"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printJson = printJson;
exports.printTable = printTable;
exports.printKeyValue = printKeyValue;
const cli_table3_1 = __importDefault(require("cli-table3"));
function printJson(data) {
    console.log(JSON.stringify(data, null, 2));
}
function printTable(headers, rows) {
    const table = new cli_table3_1.default({
        head: headers,
        wordWrap: true,
    });
    rows.forEach((row) => table.push(row));
    console.log(table.toString());
}
function printKeyValue(data) {
    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined)
            return;
        const formatted = typeof value === "string"
            ? value
            : Array.isArray(value)
                ? value.join(", ")
                : JSON.stringify(value);
        console.log(`${key}: ${formatted}`);
    });
}
