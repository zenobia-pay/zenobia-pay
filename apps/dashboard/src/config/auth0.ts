export const auth0Config = {
  domain: "accounts.zenobiapay.com",
  clientId: "l9yWBIfzSVWjMMHP02BS6if4VeZVFViH",
  redirectUri: window.location.origin + "/login",
  audience: `https://dashboard.zenobiapay.com`,
  scope: "openid profile email",
}
