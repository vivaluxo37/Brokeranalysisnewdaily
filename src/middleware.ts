import { NextRequest, NextResponse } from 'next/server';

// Temporarily disable middleware entirely
export default function middleware(_request: NextRequest) {
  // Just pass through all requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}