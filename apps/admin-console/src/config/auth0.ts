// Get the current origin for the redirect URI
const getRedirectUri = () => {
  if (typeof window !== "undefined") {
    return window.location.origin + "/login";
  }
  // Fallback for server-side rendering
  return "http://localhost:3001/login";
};

export const auth0Config = {
  domain: "accounts.zenobiapay.com",
  clientId: "AAW7JSFJDiyrDOPQErOvxySNp4p3Vriw",
  redirectUri: getRedirectUri(),
  audience: `https://admin.zenobiapay.com`,
  scope: "openid profile email",
};

// Log the configuration for debugging
if (typeof window !== "undefined") {
  console.log("Auth0 Config:", auth0Config);
}
