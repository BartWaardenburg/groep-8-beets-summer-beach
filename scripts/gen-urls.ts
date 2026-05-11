import { KIDS } from "../src/lib/kids";
import { allCodes } from "../src/lib/tokens";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";

const codes = allCodes();
const rows: Array<{ Naam: string; URL: string }> = [];
for (const kid of KIDS) {
  rows.push({ Naam: kid, URL: `${BASE_URL}/?code=${codes[kid]}` });
}

console.table(rows);
console.log(
  `\n${rows.length} URLs generated using salt ${process.env.RSVP_SALT ? "from env" : "(dev fallback, set RSVP_SALT for production!)"}.\n`,
);
