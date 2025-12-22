// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware({
//   publicRoutes: [
//     '/',
//     '/login',
//     '/register',
//     '/api/(.*)',
//   ],
// });

// export const config = {
//   matcher: ['/((?!_next|favicon.ico).*)'],
// };


import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/login',
    '/register',
  ],
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
  ],
};