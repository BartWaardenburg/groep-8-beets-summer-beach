import { ImageResponse } from "next/og";

export const alt = "Summer Beach Party | Groep 8 Eindfeest, 15 juli 2026, De Conckelaer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const chocolate = "#3D2817";
const coral = "#E5806A";
const brown = "#7A5C3E";
const cream = "#FFF8EC";

/** Social-share card shown when the invite link is pasted in WhatsApp/iMessage. */
const OpengraphImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8FD6EF 0%, #FFE3B0 58%, #F2C078 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* sun */}
        <div
          style={{
            position: "absolute",
            top: 76,
            right: 110,
            width: 168,
            height: 168,
            borderRadius: 9999,
            background: "#FFC04D",
            boxShadow: "0 0 80px 30px rgba(255,192,77,0.45)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 1000,
            padding: "64px 84px",
            background: cream,
            borderRadius: 40,
            border: "3px solid rgba(61,40,23,0.08)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
          }}
        >
          <div
            style={{
              display: "flex",
              color: coral,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 10,
              textTransform: "uppercase",
            }}
          >
            Save the date
          </div>
          <div
            style={{
              display: "flex",
              color: chocolate,
              fontSize: 96,
              fontWeight: 800,
              marginTop: 16,
              textAlign: "center",
              lineHeight: 1.02,
            }}
          >
            Summer Beach Party
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: chocolate,
              fontSize: 76,
              fontWeight: 800,
              marginTop: 28,
            }}
          >
            <span>15</span>
            <span style={{ color: coral, margin: "0 18px" }}>·</span>
            <span>07</span>
            <span style={{ color: coral, margin: "0 18px" }}>·</span>
            <span>26</span>
          </div>
          <div style={{ display: "flex", color: brown, fontSize: 34, marginTop: 26 }}>
            De Conckelaer · vanaf 19:00
          </div>
          <div
            style={{
              display: "flex",
              color: brown,
              fontSize: 24,
              marginTop: 10,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Groep 8 Eindfeest
          </div>
        </div>
      </div>
    ),
    { ...size },
  );

export default OpengraphImage;
