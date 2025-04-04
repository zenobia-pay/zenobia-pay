export const auth0Config = {
  // domain: "accounts.zenobiapay.com",
  // clientId: "5UHbVoaoZlx8uvDqQjUiYPtiE3AJv5yc",
  domain: "dev-iols5y7cp32hlyr1.us.auth0.com",
  clientId: "BqmnZwd83LDvexDry1uqOWfX8oQIIg2o",
  redirectUri: window.location.origin + "/login",
  audience: `https://dashboard.zenobiapay.com`,
  scope: "openid profile email",
}
