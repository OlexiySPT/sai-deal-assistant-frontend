import { NextRequest, NextResponse } from "next/server";
import { proxyRequest } from "@/lib/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  return proxyRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  return proxyRequest(request, path);
}

// Ensure OPTIONS (CORS preflight) is routed to the proxy as well
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  return proxyRequest(request, path);
}
