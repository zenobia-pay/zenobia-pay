# CI / CD

Cloudflare workers will autodeploy based on the master branch.

To deploy to beta, run `wrangler deploy --env beta`

# Secrets

Since i always forget, the secrets command is `wrangler secret put MY_SECRET --env your-env-name`
