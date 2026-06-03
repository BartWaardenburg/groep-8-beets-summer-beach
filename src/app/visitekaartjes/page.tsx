import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { KIDS } from "@/lib/kids";
import { allCodes } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "VIP Visitekaartjes | Groep 8 Eindfeest",
  robots: { index: false, follow: false },
};

const PROD_BASE = "https://beets-eindfeest.vercel.app";

// Card geometry: 85mm × 54mm physical. Print sizes are in mm; on-screen the
// browser still rasterises with @media print at exact mm scale. Side gutter
// inside the card is 4.5mm. Perforation column sits 51.5mm from the left edge,
// leaving 33.5mm for the QR side (large enough for a ~28mm QR + caption).
const CARD_STYLES = `
.cards-page {
  background: radial-gradient(ellipse at top, #2a1a08, #0a0807);
  min-height: 100vh;
  padding: 40px 16px 72px;
  font-family: var(--font-ui), system-ui, sans-serif;
}
.toolbar {
  max-width: 900px;
  margin: 0 auto 36px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.toolbar h1 {
  margin: 0;
  font-family: var(--font-display), Impact, sans-serif;
  font-weight: 400;
  font-size: 28px;
  letter-spacing: 0.08em;
  color: #f7e6b1;
}
.toolbar p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #c9a85f;
  word-break: break-all;
}
.print-hint {
  font-size: 13px;
  font-weight: 600;
  color: #f7e6b1;
  background: rgba(247, 230, 177, 0.1);
  border: 1px solid rgba(247, 230, 177, 0.25);
  border-radius: 10px;
  padding: 10px 16px;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 85mm);
  gap: 0;
  justify-content: center;
}

.card {
  position: relative;
  box-sizing: border-box;
  width: 85mm;
  height: 54mm;
  overflow: hidden;
  background: #0a0807;
  color: #f7e6b1;
  break-inside: avoid;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  border: 0.12mm solid #2a1a08;
}

/* top diagonal gold stripe band */
.card-stripe {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    135deg,
    #d8a93e 0,
    #d8a93e 2.8mm,
    #b58324 2.8mm,
    #b58324 5.6mm
  );
  clip-path: polygon(0 0, 100% 0, 100% 7.2mm, 0 7.2mm);
  pointer-events: none;
}

/* top "ALL ACCESS · 2026" strip */
.card-strip {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 7.2mm;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0807;
  font-size: 6.5pt;
  font-weight: 900;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  white-space: nowrap;
}

/* perforation column */
.card-perf {
  position: absolute;
  top: 7.2mm;
  bottom: 0;
  left: 51.6mm;
  width: 0;
  border-left: 0.25mm dashed rgba(216, 169, 62, 0.55);
}
.card-perf-notch {
  position: absolute;
  left: 51.6mm;
  width: 2.8mm;
  height: 2.8mm;
  background: #0a0807;
  border: 0.3mm solid rgba(216, 169, 62, 0.55);
  border-radius: 50%;
}
.card-perf-notch.top    { top: 7.2mm; transform: translate(-50%, -50%); }
.card-perf-notch.bottom { bottom: 0;  transform: translate(-50%, 50%); }

/* left info column */
.card-info {
  position: absolute;
  left: 0;
  top: 7.2mm;
  bottom: 0;
  width: 51.6mm;
  padding: 3.6mm 4.4mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.vip {
  font-family: var(--font-display), Impact, sans-serif;
  font-weight: 400;
  font-size: 56pt;
  line-height: 0.82;
  letter-spacing: 0.04em;
  background: linear-gradient(180deg, #fbe49a, #d8a93e 45%, #b58324);
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0.2mm 0 rgba(0, 0, 0, 0.4));
}
.event {
  margin-top: 0.8mm;
  font-size: 6pt;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #d8a93e;
  white-space: nowrap;
}
.holder-label {
  font-size: 5.5pt;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #8a7340;
  font-weight: 700;
  margin-bottom: 0.8mm;
}
.name {
  font-family: var(--font-display), Impact, sans-serif;
  font-weight: 400;
  font-size: 26pt;
  line-height: 1;
  letter-spacing: 0.04em;
  color: #f7e6b1;
  white-space: nowrap;
}
.barcode {
  margin-top: 1.6mm;
  display: flex;
  align-items: flex-end;
  gap: 0.3mm;
  height: 3.2mm;
}
.barcode > span {
  height: 100%;
  background: #d8a93e;
}

/* right QR column */
.card-qr {
  position: absolute;
  right: 0;
  top: 7.2mm;
  bottom: 0;
  left: 51.6mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.4mm;
}
.qr-tile {
  background: #f7e6b1;
  padding: 1.6mm;
  box-shadow: 0 0 0 0.2mm #b58324;
  box-sizing: content-box;
}
.qr,
.qr svg {
  display: block;
  width: 28mm;
  height: 28mm;
}
.qr-cap {
  font-size: 5.5pt;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #d8a93e;
  white-space: nowrap;
}

@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  html, body {
    background: #fff !important;
  }
  .cards-page {
    background: #fff !important;
    padding: 0 !important;
    min-height: 0 !important;
  }
  .no-print {
    display: none !important;
  }
  .cards-grid { gap: 0; }
}
`;

// Faux barcode pattern under the holder name. Fixed (not random) so the cards
// are deterministic across renders.
const BARCODE = [
  3, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 2, 1, 2, 3, 1, 2, 1,
  3, 1, 2,
];

type Props = {
  searchParams: Promise<{ base?: string; token?: string; only?: string }>;
};

const VisitekaartjesPage = async ({ searchParams }: Props) => {
  const { base, token, only } = await searchParams;

  // This page lists every kid's personal RSVP code, so it must not be public.
  const cardsToken = process.env.CARDS_TOKEN;
  if (process.env.NODE_ENV === "production" && (!cardsToken || token !== cardsToken)) {
    notFound();
  }

  const baseUrl = (base ?? process.env.BASE_URL ?? PROD_BASE).replace(/\/$/, "");
  const codes = allCodes();

  // `?only=Juf Anne,Juf Anouk` prints just those cards (case-insensitive),
  // handy for reprinting late additions without redoing the whole sheet.
  const wanted = only
    ?.split(",")
    .map((n) => n.trim().toLowerCase())
    .filter(Boolean);
  const selected =
    wanted && wanted.length > 0
      ? KIDS.filter((kid) => wanted.includes(kid.toLowerCase()))
      : KIDS;

  const cards = await Promise.all(
    selected.map(async (kid) => {
      const url = `${baseUrl}/?code=${codes[kid]}`;
      const svg = await QRCode.toString(url, {
        type: "svg",
        errorCorrectionLevel: "Q",
        margin: 0,
        color: { dark: "#0a0807", light: "#00000000" },
      });
      return { kid, svg };
    }),
  );

  return (
    <div className="cards-page">
      <style dangerouslySetInnerHTML={{ __html: CARD_STYLES }} />

      <div className="toolbar no-print">
        <div>
          <h1>VIP Visitekaartjes</h1>
          <p>
            {cards.length} kaartjes · QR linkt naar {baseUrl}
          </p>
        </div>
        <p className="print-hint">Druk op ⌘P / Ctrl+P om te printen</p>
      </div>

      <div className="cards-grid">
        {cards.map(({ kid, svg }) => (
          <article key={kid} className="card">
            <div className="card-stripe" aria-hidden="true" />
            <div className="card-strip">★ &nbsp;All Access&nbsp; · &nbsp;2026&nbsp; ★</div>

            <div className="card-perf" aria-hidden="true" />
            <div className="card-perf-notch top" aria-hidden="true" />
            <div className="card-perf-notch bottom" aria-hidden="true" />

            <div className="card-info">
              <div>
                <div className="vip">VIP</div>
                <div className="event">Eindfeest · Groep 8</div>
              </div>
              <div>
                <div className="holder-label">Holder</div>
                <div className="name">{kid}</div>
                <div className="barcode" aria-hidden="true">
                  {BARCODE.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        flex: `0 0 ${w * 0.3}mm`,
                        opacity: i % 5 === 0 ? 1 : 0.7,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="card-qr">
              <div className="qr-tile">
                <div className="qr" dangerouslySetInnerHTML={{ __html: svg }} />
              </div>
              <div className="qr-cap">↗ &nbsp;Scan&nbsp; ↗</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default VisitekaartjesPage;
