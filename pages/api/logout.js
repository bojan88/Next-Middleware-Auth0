// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const domain = 'dev-9wuscf07.us.auth0.com';
const clientId = 'C4J1f0XteYvU0hH9nMY3rnpQ9LZNWB96';

export default function handler(req, res) {
  const hostname = req.headers['host'];
  const redirectProtocol = hostname.startsWith('localhost') ? 'http://' : 'https://';
  const redirectUrl = `${redirectProtocol}${hostname}/`
  res.setHeader('Set-Cookie', 'token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');
  return res.redirect(`https://${domain}/v2/logout?client_id=${clientId}&returnTo=${redirectUrl}`)
}
