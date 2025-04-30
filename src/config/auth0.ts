export const auth0Config = {
  // domain: "accounts.zenobiapay.com",
  // clientId: "5UHbVoaoZlx8uvDqQjUiYPtiE3AJv5yc",
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: window.location.origin + "/login",
  audience: `https://dashboard.zenobiapay.com`,
  scope: "openid profile email",
}
