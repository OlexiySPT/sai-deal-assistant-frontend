import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "./config";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
  "http://localhost:5173",
];

export async function proxyRequest(request: NextRequest, path: string) {
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;
  console.log(`Backend URL: ${backendUrl}`);

  const origin = request.headers.get("origin") || "";

  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/json");

  const forwardHeaders = ["accept", "accept-language", "user-agent"];
  forwardHeaders.forEach((header) => {
    const value = request.headers.get(header);
    if (value) requestHeaders.set(header, value);
  });

  try {
    const body = ["GET", "HEAD", "DELETE"].includes(request.method)
      ? undefined
      : await request.text();

    const fetchOptions: RequestInit = {
      method: request.method,
      headers: requestHeaders,
      body,
    };

    if (process.env.NODE_ENV === "development") {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    const response = await fetch(backendUrl, fetchOptions);
    const responseData = await response.text();

    // Only allow specific origins
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0];

    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (error) {
    console.error(`Proxy error for ${backendUrl}:`, error);
    return NextResponse.json(
      { error: "Backend service unavailable" },
      { status: 503 },
    );
  }
}
