import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iOS when a kid adds the invite to their home screen. */
const AppleIcon = () =>
  new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "linear-gradient(160deg, #8FD6EF 0%, #CFefff 100%)",
        }}
      >
        {/* sun */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 42,
            width: 96,
            height: 96,
            borderRadius: 9999,
            background: "#FFB23E",
          }}
        />
        {/* sea */}
        <div
          style={{
            position: "absolute",
            bottom: 34,
            width: "100%",
            height: 70,
            display: "flex",
            background: "#3FA9D6",
          }}
        />
        {/* sand */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 42,
            display: "flex",
            background: "#E5806A",
          }}
        />
      </div>
    ),
    { ...size },
  );

export default AppleIcon;
