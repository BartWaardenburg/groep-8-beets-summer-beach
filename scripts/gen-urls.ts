import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import QRCode from "qrcode";
import { KIDS } from "../src/lib/kids";
import { allCodes } from "../src/lib/tokens";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3001";
const OUT_DIR = resolve(process.cwd(), "out");
const QR_DIR = resolve(OUT_DIR, "qr");

const main = async () => {
  await mkdir(QR_DIR, { recursive: true });
  const codes = allCodes();

  const rows = KIDS.map((kid) => ({
    naam: kid,
    code: codes[kid],
    url: `${BASE_URL}/?code=${codes[kid]}`,
  }));

  // Console preview
  console.table(rows.map(({ naam, url }) => ({ Naam: naam, URL: url })));

  // CSV (for spreadsheet / mail merge)
  const csv = ["Naam,URL", ...rows.map(({ naam, url }) => `${naam},${url}`)].join("\n");
  await writeFile(resolve(OUT_DIR, "urls.csv"), `${csv}\n`, "utf8");

  // Markdown table
  const md = [
    "| Naam | URL |",
    "| --- | --- |",
    ...rows.map(({ naam, url }) => `| ${naam} | ${url} |`),
  ].join("\n");
  await writeFile(resolve(OUT_DIR, "urls.md"), `${md}\n`, "utf8");

  // QR PNGs per kid
  for (const { naam, url } of rows) {
    const safe = naam.normalize("NFD").replace(/[^a-zA-Z0-9-]/g, "");
    await QRCode.toFile(resolve(QR_DIR, `${safe}.png`), url, {
      width: 800,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#3D2817", light: "#FFF8EC" },
    });
  }

  console.log(
    `\n${rows.length} URLs + QR PNGs gegenereerd in ./out/ (salt ${
      process.env.RSVP_SALT ? "from env" : "(dev fallback)"
    }, base ${BASE_URL}).`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
