import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // 'unsafe-eval' is needed for Next.js development HMR
  const isDev = process.env.NODE_ENV === 'development';
  
  // In Next.js App Router, statically generated pages (SSG) do not receive the middleware nonce at build time.
  // Using 'strict-dynamic' forces the browser to reject all scripts without a nonce, breaking production.
  // We fall back to 'self' and 'unsafe-inline' for production to allow Next.js bundles and hydration.
  const scriptSrc = isDev 
    ? `'self' 'unsafe-eval' 'unsafe-inline'` 
    : `'self' 'unsafe-inline'`;
    
  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob:;
    font-src 'self' data:;
    connect-src 'self' https://openrouter.ai https://generativelanguage.googleapis.com;
    object-src 'none';
    base-uri 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - sw.js, workbox-* (PWA files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw\\.js|workbox-.*).*)',
  ],
};
