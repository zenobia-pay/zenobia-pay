export const auth0Config = {
  // domain: "accounts.zenobiapay.com",
  // clientId: "5UHbVoaoZlx8uvDqQjUiYPtiE3AJv5yc",
  domain: "zenobia-beta.us.auth0.com",
  clientId: "gRg4qNX32qmtoLOUH8wmojid0So9MkqB",
  redirectUri: window.location.origin + "/login",
  audience: `https://dashboard.zenobiapay.com`,
  scope: "openid profile email",
}
