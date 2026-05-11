import { NextResponse } from "next/server";
import { kidFromCode } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }
  const kid = kidFromCode(code);
  if (!kid) {
    return NextResponse.json({ error: "Onbekende code" }, { status: 404 });
  }
  return NextResponse.json({ kid });
};
