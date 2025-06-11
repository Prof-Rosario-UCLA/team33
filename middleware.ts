export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!api/auth|auth|_next/static|_next/image|public|favicon.ico|sw.js|workbox-.*.js|manifest.json).*)"],
};
