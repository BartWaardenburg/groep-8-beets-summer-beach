import { NextResponse } from "next/server";
import { store } from "@/lib/db";
import { EMOJIS } from "@/lib/kids";
import { kidFromCode } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const rsvps = await store.getAll();
  return NextResponse.json({ rsvps });
};

type PostBody = {
  code?: string;
  emoji?: string;
};

export const POST = async (req: Request) => {
  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Ongeldige aanvraag" }, { status: 400 });
  }

  const { code, emoji } = body;
  if (!code || !emoji) {
    return NextResponse.json({ error: "code en emoji zijn verplicht" }, { status: 400 });
  }

  if (!(EMOJIS as readonly string[]).includes(emoji)) {
    return NextResponse.json({ error: "Onbekende emoji" }, { status: 400 });
  }

  const kid = kidFromCode(code);
  if (!kid) {
    return NextResponse.json({ error: "Ongeldige of verlopen code" }, { status: 403 });
  }

  await store.set(kid, { emoji, at: Date.now() });
  const rsvps = await store.getAll();
  return NextResponse.json({ ok: true, rsvps });
};
