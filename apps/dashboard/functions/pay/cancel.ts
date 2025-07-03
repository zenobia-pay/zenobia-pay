export async function onRequest() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Cancelled</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f9fafb;
            color: #1f2937;
            line-height: 1.6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            text-align: center;
            padding: 2rem;
        }

        .message {
            font-size: 1.1rem;
            color: #6b7280;
            margin-bottom: 1rem;
        }

        .close-button {
            background-color: #1f2937;
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .close-button:hover {
            background-color: #111827;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="message">Payment was cancelled</div>
        <button class="close-button" onclick="window.close()">
            Close
        </button>
    </div>

    <script>
        // Auto-close after 3 seconds
        setTimeout(() => {
            window.close();
        }, 3000);
    </script>
</body>
</html>`

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      Vary: "*",
    },
  })
}
