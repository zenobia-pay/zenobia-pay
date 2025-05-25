import { Env } from "../../types"
import { EventContext } from "@cloudflare/workers-types"

interface CheckoutSession {
  shop: string
  returnUrl: string
  email?: string
  amount?: string
  currency?: string
  createdAt: number
}

export async function onRequestGet(
  context: EventContext<Env, string, unknown>
) {
  const { request, env, params } = context
  const shop = params?.shop as string
  const id = new URL(request.url).searchParams.get("id")

  if (!id) {
    return new Response("Missing session ID", { status: 400 })
  }

  // Get session data from KV
  const sessionData = await env.SHOPIFY_CHECKOUT_SESSION_KV.get(id)
  if (!sessionData) {
    return new Response("Session not found", { status: 404 })
  }

  const session = JSON.parse(sessionData) as CheckoutSession

  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Checkout - ${shop}</title>
        <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          function CheckoutForm() {
            const [loading, setLoading] = useState(false)
            const [error, setError] = useState("")
            const session = ${JSON.stringify(session)}

            const handleSubmit = async (e) => {
              e.preventDefault()
              setLoading(true)
              setError("")

              try {
                const formData = new FormData(e.target)
                const response = await fetch("/api/shopify/process-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sessionId: "${id}",
                    cardNumber: formData.get("cardNumber"),
                    expiryMonth: formData.get("expiryMonth"),
                    expiryYear: formData.get("expiryYear"),
                    cvv: formData.get("cvv"),
                  }),
                })

                if (!response.ok) {
                  throw new Error("Payment failed")
                }

                const data = await response.json()
                window.location.href = data.redirectUrl
              } catch (err) {
                setError(err.message)
              } finally {
                setLoading(false)
              }
            }

            return (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                  <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                      Complete Your Payment
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                      {session.amount} {session.currency}
                    </p>
                  </div>
                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                      <div>
                        <label htmlFor="cardNumber" className="sr-only">
                          Card Number
                        </label>
                        <input
                          id="cardNumber"
                          name="cardNumber"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Card Number"
                        />
                      </div>
                      <div className="flex">
                        <div className="w-1/2">
                          <label htmlFor="expiryMonth" className="sr-only">
                            Month
                          </label>
                          <input
                            id="expiryMonth"
                            name="expiryMonth"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="MM"
                          />
                        </div>
                        <div className="w-1/2">
                          <label htmlFor="expiryYear" className="sr-only">
                            Year
                          </label>
                          <input
                            id="expiryYear"
                            name="expiryYear"
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="YY"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="cvv" className="sr-only">
                          CVV
                        </label>
                        <input
                          id="cvv"
                          name="cvv"
                          type="text"
                          required
                          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="CVV"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-center">
                        {error}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Pay Now"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )
          }

          const root = ReactDOM.createRoot(document.getElementById("root"))
          root.render(<CheckoutForm />)
        </script>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  )
}
