// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Skip auth for /api/health
    if (req.nextUrl.pathname === "/api/health") {
      return; // let the request through
    }
    
    // Protect API routes
    if (req.nextUrl.pathname.startsWith('/api')) {

      // Check if user is authenticated for API routes
      if (!req.nextauth.token) {
        return Response.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        )
      }
    }

  // Set Content Security Policy headers
  const isDev = process.env.NODE_ENV === 'development'
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
  default-src 'self';
  script-src 'self'  'nonce-${nonce}'  ${isDev ? `'unsafe-eval'` : ``};
  style-src 'self' ${ isDev ? `'unsafe-inline'` : ``};
  img-src 'self' https://lh3.googleusercontent.com https: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()
 
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 
  return response


  },
  {
    callbacks: {
       authorized: () => true,
    },
  }
)

export const config = {
  matcher: [
    // Match all request paths except static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    
  ],
}
