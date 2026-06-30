import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Check env vars present
  results.hasServiceAccountJson = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  results.hasLeadsSheetId = !!process.env.LEADS_SHEET_ID;
  results.sheetId = process.env.LEADS_SHEET_ID ?? "(missing)";

  // 2. Parse the service account JSON
  let credentials: Record<string, unknown> | null = null;
  try {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON!;
    credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    results.serviceAccountEmail = credentials?.client_email ?? "(not found in JSON)";
    results.credentialsParsed = true;
  } catch (e) {
    results.credentialsParsed = false;
    results.credentialsError = String(e);
    return NextResponse.json(results, { status: 200 });
  }

  // 3. Try to authenticate
  let auth;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auth = new google.auth.GoogleAuth({ credentials: credentials as any, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
    results.authCreated = true;
  } catch (e) {
    results.authCreated = false;
    results.authError = String(e);
    return NextResponse.json(results, { status: 200 });
  }

  // 4. Try to read the sheet
  try {
    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.LEADS_SHEET_ID,
      range: "A1:B2",
    });
    results.sheetReadOk = true;
    results.sheetCurrentData = res.data.values ?? "(empty)";
  } catch (e: unknown) {
    results.sheetReadOk = false;
    const err = e as { message?: string; code?: number; errors?: unknown };
    results.sheetError = err?.message ?? String(e);
    results.sheetErrorCode = err?.code;
    results.sheetErrorDetail = err?.errors;
  }

  // 5. Test the Apps Script webhook
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  results.hasWebhookUrl = !!webhookUrl;
  if (webhookUrl) {
    try {
      const payload = JSON.stringify({
        type: "application",
        timestamp: new Date().toLocaleString("en-US", { timeZone: "America/New_York" }),
        practiceName: "TEST PRACTICE — delete this row",
        website: "https://test.com", companyPhone: "(555) 000-0000",
        cities: "Houston, TX", featuredCities: "Houston, TX",
        specialties: "Pulmonary Rehabilitation", keyStaff: "None",
        contactName: "Test User", email: "test@test.com",
        contactPhone: "(555) 000-0000", title: "Owner",
        awardShipping: "123 Test St, Houston, TX 77001",
        cardLast4: "****1234", cardExpiry: "12/26", nameOnCard: "Test User",
        billingAddress: "123 Test St, Houston, TX 77001",
        quoteTotal: "$289.00", trafficSource: "direct",
        landingPage: "/apply", notes: "", assetPermission: "Granted",
      });
      const headers = { "Content-Type": "application/json" };
      const res = await fetch(webhookUrl, { method: "POST", headers, body: payload, redirect: "manual" });
      results.webhookStatus = res.status;
      if (res.status >= 300 && res.status < 400) {
        // Script ran. GET the echo URL to read the response.
        const loc = res.headers.get("location") ?? "";
        results.redirectedTo = loc.slice(0, 100);
        const echo = await fetch(loc, { method: "GET" });
        const responseText = await echo.text();
        results.webhookStatus = echo.status;
        results.webhookResponse = responseText.slice(0, 300);
        results.webhookOk = !responseText.includes('"ok":false');
      } else {
        const responseText = await res.text();
        results.webhookResponse = responseText.slice(0, 300);
        results.webhookOk = res.ok;
      }
    } catch (e: unknown) {
      results.webhookOk = false;
      results.webhookError = (e as { message?: string })?.message ?? String(e);
    }
  }

  return NextResponse.json(results, { status: 200 });
}
