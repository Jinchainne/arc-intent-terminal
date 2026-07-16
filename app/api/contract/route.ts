import { NextRequest, NextResponse } from "next/server";

import { getArcTxStatus } from "@/lib/arc/serverExecutor";

export async function GET(request: NextRequest) {
  const txHash = request.nextUrl.searchParams.get("txHash");

  if (txHash) {
    const status = await getArcTxStatus(txHash as `0x${string}`);
    return NextResponse.json(status);
  }

  return NextResponse.json({ ok: true });
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "Server-side deployment is disabled. Use a browser wallet on Arc Testnet."
    },
    { status: 405 }
  );
}
