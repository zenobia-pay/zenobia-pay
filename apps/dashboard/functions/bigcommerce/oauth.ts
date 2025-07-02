import { Env } from "../types"

export async function onRequest(request: Request, env: Env) {
  const url = new URL(request.url)

  // Get the parameters from the callback
  const code = url.searchParams.get("code")
  const accountUuid = url.searchParams.get("account_uuid")
  const storeContext = url.searchParams.get("context")?.replace("stores/", "") // Remove 'stores/' prefix
  const scope = url.searchParams.get("scope")

  if (!code || !accountUuid || !storeContext || !scope) {
    return new Response("Missing required parameters", { status: 400 })
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch(
      "https://login.bigcommerce.com/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: env.BIGCOMMERCE_CLIENT_ID,
          client_secret: env.BIGCOMMERCE_CLIENT_SECRET,
          code,
          scope,
          grant_type: "authorization_code",
          redirect_uri: `${url.origin}/bigcommerce/oauth`,
          context: `stores/${storeContext}`,
        }),
      }
    )

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error("Token exchange failed:", error)
      throw new Error("Failed to exchange code for token")
    }

    const tokenData = await tokenResponse.json()

    // Store the store data in D1
    const now = Date.now()
    await env.MERCHANTS_OAUTH.prepare(
      `
      INSERT INTO bigcommerce_stores (
        store_hash,
        access_token,
        scope,
        user_id,
        user_email,
        account_uuid,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(store_hash) DO UPDATE SET
        access_token = excluded.access_token,
        scope = excluded.scope,
        user_id = excluded.user_id,
        user_email = excluded.user_email,
        account_uuid = excluded.account_uuid,
        updated_at = excluded.updated_at
    `
    )
      .bind(
        storeContext,
        tokenData.access_token,
        scope,
        tokenData.user.id,
        tokenData.user.email,
        accountUuid,
        now,
        now
      )
      .run()

    // Redirect to the app load endpoint
    return Response.redirect(
      `${url.origin}/bigcommerce/load?context=${storeContext}`,
      302
    )
  } catch (error) {
    console.error("OAuth error:", error)
    return new Response("Authentication failed", { status: 500 })
  }
}
