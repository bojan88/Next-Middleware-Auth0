import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server'
import { importX509, jwtVerify } from 'jose'

const domain = process.env.DOMAIN;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const x509Cert = process.env.CERTIFICATE;
const callbackRoute = '/callback';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host')
  const redirectProtocol = hostname.startsWith('localhost') ? 'http://' : 'https://';
  const redirectUrl = `${redirectProtocol}${hostname}${callbackRoute}`
  const code = url.searchParams.get('code');
  // TODO: check if state is the same as what we sent
  const state = url.searchParams.get('state');
  // TODO: state should probably be randomly generated
  const authUrl = `https://${domain}/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=openid&state=my-state-todo-update`;

  if (url.pathname === callbackRoute && code) {
    const accessTokenRes = await fetch(`https://${domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUrl,
      })
    });

    const accessTokenData = await accessTokenRes.json();
    const { id_token } = accessTokenData;

    if (id_token) {
      // TODO: get previous URL from the cookie and remove it
      const res = NextResponse.redirect('/');
      // TODO: add expire
      res.cookie('token', id_token, { httpOnly: true, secure: true });
      return res;
    }

    return new Response('Error logging in', { status: 500 });
  }

  try {
    const token = req.cookies['token']

    if (!token) {
      // TODO: set current page route in a cookie to redirect back to it
      return NextResponse.redirect(authUrl);
    }

    const algorithm = 'RS256';
    const ecPublicKey = await importX509(x509Cert, algorithm)
    await jwtVerify(token, ecPublicKey);

    return NextResponse.next();
  } catch (err) {
    if (err.code === 'ERR_JWT_EXPIRED') {
      return NextResponse.redirect(authUrl);
    }

    console.log(err)
    return new Response('Error logging in', { status: 500 });
  }
}
