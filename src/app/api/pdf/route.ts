import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { html, title } = body;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${title}.pdf"`,
    },
  });
}
