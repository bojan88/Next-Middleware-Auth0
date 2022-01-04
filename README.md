## Next middleware Auth0 JWT auth

A sample project for Auth0 JWT validation using Next.js middleware and Vercel edge functions.
The token is stored in a HttpOnly cookie.

## Motivation

Performance - being able to serve statically generated pages, and eliminating multiple steps for JWT validation on the client side.
Validating JWT on the server gives us an option to serve statically generated pages instead of displaying a loading indicator while we wait for another round trip for JWT validation.

### Running the project

Please move the sample `mv .env.sample .env`, and update the variables.
Note that this implementation is only for `RS256` algorithm. This won't work in case your Auth0 app is using `HS256`.
Certificate variable in `.env` file should look like `CERTIFICATE="-----BEGIN CERTIFICATE-----\nrow1\nrow2\netc.\n-----END CERTIFICATE-----"`.
The values should be copied to Vercel app Environment Variables. Certificate can be copied as a normal multi-line value (not inlined as in `.env`).

### Some notes

Currently, redirection from the middleware seems to have some bugs - it's keeping the get query parameters (`code`, and `state`). That's probably Vercel edge function bug since it's still in beta, and it's working fine locally.

You should probably implement CSRF protection if you plan to use this approach of storing the token in a cookie.
