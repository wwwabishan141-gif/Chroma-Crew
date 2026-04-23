import { promises as fs } from "fs"
import { NextResponse } from "next/server"

const ASSET_MAP: Record<string, string> = {
  logo: "public/website-logo-what-01.png",
  wordmark: "public/website-logo-what-01.png", // Using the same logo as a fallback
}

import { join } from "path"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ asset: string }> },
) {
  const { asset } = await params
  const filePath = ASSET_MAP[asset]
  if (!filePath) return new NextResponse("Asset not found", { status: 404 })

  try {
    const fullPath = join(process.cwd(), filePath)
    const file = await fs.readFile(fullPath)
    return new NextResponse(file, {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch {
    return new NextResponse("Unable to read asset", { status: 500 })
  }
}
