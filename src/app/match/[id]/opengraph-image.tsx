import { BASE_URL } from "@/api/config";
import { getMatchDetailsAPI } from "@/api/methods/auth";
import Img from "@/ui/components/Img/Img";
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({ params }: { params: { id: string } }) {
  const matchDetails = await getMatchDetailsAPI(params.id);


  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 50,
          background: "#419743",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", gap: 30 }}>
          <div style={{ display: "flex", justifyContent: "center", placeItems: "center", gap: 20 }}>
            <img
              width="60"
              height="60"
              src={`${BASE_URL}/mongo/team-flag/${matchDetails.data.matchInfo.team1.id}?p=det&d=high`}
              style={{
                borderRadius: 128,
              }}
            />
            <span style={{ color: "white" }}>{matchDetails.data?.matchInfo?.team1?.name}</span>
          </div>
          <span>
            <img
              width="60"
              height="60"
              src={"https://cdn4.iconfinder.com/data/icons/electronics-and-devices-36/24/bolt-512.png"}
              style={{
                borderRadius: 128,
              }}
            />
          </span>
          <div style={{ display: "flex", justifyContent: "center", placeItems: "center", gap: 20 }}>
            <img
              width="60"
              height="60"
              src={`${BASE_URL}/mongo/team-flag/${matchDetails.data.matchInfo.team2.id}?p=det&d=high`}
              style={{
                borderRadius: 128,
              }}
            />
            <span style={{ color: "white" }}>{matchDetails.data?.matchInfo?.team2?.name}</span>
          </div>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}