import type { TransferStatus, StatusMessage } from "../shared";

// Define environment interface
interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  TRANSFER_STATUS: KVNamespace; // KV namespace for transfer statuses
}

// In-memory cache for active transfers only
export class TransferStatusServer {
  kv: KVNamespace;
  // Only store active transfers in memory (those being watched or recently updated)
  activeTransfers = new Map<string, TransferStatus>();
  // WebSocket connections by transfer ID
  serverSockets = new Map<string, Set<WebSocket>>();
  // Flag to determine if we're running in local development
  isLocalDev = false;
  // Local storage for development environment
  localStorageMap = new Map<string, TransferStatus>();
  // Store metadata for listing transfers
  recentTransfersKey = "recent_transfers"; // Key for storing list of recent transfers

  constructor(env: Env) {
    this.kv = env.TRANSFER_STATUS;
    // Check if we're in development mode (KV not available)
    this.isLocalDev = !this.kv;
    console.log(
      `Running in ${this.isLocalDev ? "development" : "production"} mode`
    );
  }

  // Load a transfer from KV or local memory
  async getTransferStatus(
    transferId: string
  ): Promise<TransferStatus | undefined> {
    // First check active cache
    if (this.activeTransfers.has(transferId)) {
      return this.activeTransfers.get(transferId);
    }

    // If not in active cache, try to load from KV or local storage
    try {
      let transfer: TransferStatus | undefined;

      if (this.isLocalDev) {
        // In development mode, use local map
        transfer = this.localStorageMap.get(transferId);
      } else {
        // In production, get from KV
        const value = await this.kv.get(`transfer:${transferId}`, "json");
        if (value) {
          transfer = value as TransferStatus;
          // Add to active cache for subsequent requests
          this.activeTransfers.set(transferId, transfer);
        }
      }

      return transfer;
    } catch (error) {
      console.error(`Error loading transfer ${transferId}:`, error);
      return undefined;
    }
  }

  // Update the list of recent transfers
  private async updateRecentTransfersList(
    transferId: string,
    updatedAt: number
  ): Promise<void> {
    if (this.isLocalDev) {
      return; // Skip in local dev mode for simplicity
    }

    try {
      // Get existing recent transfers list
      const recentTransfers =
        ((await this.kv.get(this.recentTransfersKey, "json")) as {
          id: string;
          updatedAt: number;
        }[]) || [];

      // Remove this transfer if it already exists in the list
      const filteredTransfers = recentTransfers.filter(
        (t) => t.id !== transferId
      );

      // Add the transfer to the beginning of the list
      filteredTransfers.unshift({ id: transferId, updatedAt });

      // Keep only the most recent 1000 transfers
      const trimmedList = filteredTransfers.slice(0, 1000);

      // Save back to KV
      await this.kv.put(this.recentTransfersKey, JSON.stringify(trimmedList));
    } catch (error) {
      console.error("Error updating recent transfers list:", error);
    }
  }

  // Get recently updated transfers (for dashboard listing)
  async getRecentTransfers(limit = 100): Promise<TransferStatus[]> {
    try {
      if (this.isLocalDev) {
        // In development mode, return from local map
        const transfers = Array.from(this.localStorageMap.values());
        // Sort by updatedAt and limit
        return transfers
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, limit);
      } else {
        // Get the list of recent transfer IDs
        const recentList =
          ((await this.kv.get(this.recentTransfersKey, "json")) as {
            id: string;
            updatedAt: number;
          }[]) || [];

        // Limit the list
        const limitedList = recentList.slice(0, limit);

        // Fetch the transfers in parallel
        const transferPromises = limitedList.map((item) =>
          this.getTransferStatus(item.id)
        );

        // Wait for all transfers to be fetched
        const transfers = await Promise.all(transferPromises);

        // Filter out undefined results and ensure TransferStatus type
        return transfers.filter((t) => t !== undefined) as TransferStatus[];
      }
    } catch (error) {
      console.error("Error getting recent transfers:", error);

      // Return at least the active transfers we have in memory
      if (this.isLocalDev) {
        return Array.from(this.localStorageMap.values())
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, limit);
      } else {
        return Array.from(this.activeTransfers.values())
          .sort((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, limit);
      }
    }
  }

  broadcastStatus(transferId: string) {
    const transfer = this.activeTransfers.get(transferId);
    if (!transfer) return;

    const sockets = this.serverSockets.get(transferId);
    if (!sockets || sockets.size === 0) return;

    const message: StatusMessage = {
      type: "status",
      transfer,
    };

    // Send update to all WebSockets subscribed to this transfer
    const messageStr = JSON.stringify(message);
    const deadSockets: WebSocket[] = [];

    for (const socket of sockets) {
      try {
        if (socket.readyState === 1) {
          // OPEN
          socket.send(messageStr);
        } else {
          // Socket is no longer open, mark for removal
          deadSockets.push(socket);
        }
      } catch (error) {
        console.error("Error broadcasting status:", error);
        deadSockets.push(socket);
      }
    }

    // Clean up any dead sockets
    if (deadSockets.length > 0) {
      for (const socket of deadSockets) {
        sockets.delete(socket);
        try {
          socket.close();
        } catch (e) {
          // Ignore close errors
        }
      }

      // Remove the transfer from tracking if no sockets are left
      if (sockets.size === 0) {
        this.serverSockets.delete(transferId);

        // Optionally, remove from active cache if no one is watching
        // and status is terminal (to save memory)
        if (transfer.status === "COMPLETED" || transfer.status === "FAILED") {
          // Wait a bit before purging from memory to handle quick reconnects
          setTimeout(() => {
            // Check again if any new listeners have connected
            if (!this.serverSockets.has(transferId)) {
              this.activeTransfers.delete(transferId);
            }
          }, 60000); // 1 minute delay
        }
      }
    }
  }

  async createTransferRequest(
    transferId: string,
    initialStatus: "PENDING" | "PROCESSING" = "PENDING",
    details?: string
  ): Promise<TransferStatus> {
    // Check if transfer already exists
    const existingTransfer = await this.getTransferStatus(transferId);
    if (existingTransfer) {
      return existingTransfer;
    }

    // Create a new transfer with initial status
    return this.updateTransferStatus(
      transferId,
      initialStatus,
      details || `Transfer created with status: ${initialStatus}`
    );
  }

  async updateTransferStatus(
    transferId: string,
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED",
    details?: string
  ): Promise<TransferStatus> {
    const now = Date.now();
    const transfer: TransferStatus = {
      id: transferId,
      status,
      details,
      updatedAt: now,
    };

    // Update in-memory active cache
    this.activeTransfers.set(transferId, transfer);

    // Save to KV or local storage
    try {
      if (this.isLocalDev) {
        // In dev mode, just save to local map
        this.localStorageMap.set(transferId, transfer);
      } else {
        // In production, save to KV
        await this.kv.put(`transfer:${transferId}`, JSON.stringify(transfer));

        // Update recent transfers list
        await this.updateRecentTransfersList(transferId, now);
      }
    } catch (error) {
      console.error("Error saving transfer:", error);
      // Still keep the update in memory even if storage fails
    }

    // Broadcast the status update to all connections for this transfer
    this.broadcastStatus(transferId);

    // Close connections if status is terminal
    if (status === "COMPLETED" || status === "FAILED") {
      this.closeWebSockets(transferId);
    }

    return transfer;
  }

  // List all transfers in the system
  getAllTransfers(): TransferStatus[] {
    return Array.from(this.activeTransfers.values());
  }

  // Close all WebSockets for a transfer ID
  closeWebSockets(transferId: string) {
    const sockets = this.serverSockets.get(transferId);
    if (!sockets) return;

    for (const socket of sockets) {
      try {
        socket.close();
      } catch (error) {
        console.error("Error closing WebSocket:", error);
      }
    }

    // Remove from the map
    this.serverSockets.delete(transferId);
  }

  // Handle WebSocket connection for a transfer
  async handleWebSocket(
    request: Request,
    transferId: string
  ): Promise<Response> {
    // Check if the transfer exists in memory or load it from storage
    let transfer = this.activeTransfers.get(transferId);
    if (!transfer) {
      transfer = await this.getTransferStatus(transferId);
      if (!transfer) {
        return new Response(JSON.stringify({ error: "Transfer not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // For completed/failed transfers, send one-time response
    if (transfer.status === "COMPLETED" || transfer.status === "FAILED") {
      console.log(`WebSocket request for completed transfer: ${transferId}`);
    }

    // Create a new WebSocket pair (Cloudflare Workers specific)
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    // Accept the connection on the server side
    server.accept();

    // Store the server socket for broadcasts
    if (!this.serverSockets.has(transferId)) {
      this.serverSockets.set(transferId, new Set());
    }
    this.serverSockets.get(transferId)?.add(server);

    // Track if this connection is alive with a ping/pong mechanism
    let isAlive = true;
    const pingInterval = setInterval(() => {
      if (!isAlive) {
        // No pong received, connection is dead
        clearInterval(pingInterval);
        try {
          server.close();
        } catch (e) {
          // Already closed, ignore
        }
        return;
      }

      // Mark as not alive until we get a pong
      isAlive = false;

      try {
        // Send ping
        if (server.readyState === 1) {
          // OPEN
          server.send(JSON.stringify({ type: "ping" }));
        } else {
          clearInterval(pingInterval);
        }
      } catch (e) {
        clearInterval(pingInterval);
      }
    }, 30000); // 30-second ping interval

    // Handle pong messages from client
    server.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data as string);
        if (data.type === "pong") {
          isAlive = true;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    });

    // Send the current status immediately
    server.send(
      JSON.stringify({
        type: "status",
        transfer,
      } as StatusMessage)
    );

    // Handle WebSocket closure (client disconnect)
    server.addEventListener("close", () => {
      console.log(`WebSocket closed for transfer ${transferId}`);
      clearInterval(pingInterval);

      const sockets = this.serverSockets.get(transferId);
      if (sockets) {
        sockets.delete(server);
        if (sockets.size === 0) {
          // No more clients listening to this transfer
          this.serverSockets.delete(transferId);

          // Maybe remove from active cache if terminal state
          if (
            transfer &&
            (transfer.status === "COMPLETED" || transfer.status === "FAILED")
          ) {
            setTimeout(() => {
              if (!this.serverSockets.has(transferId)) {
                this.activeTransfers.delete(transferId);
              }
            }, 60000); // 1 minute delay
          }
        }
      }
    });

    // Handle errors gracefully
    server.addEventListener("error", (error) => {
      console.error(`WebSocket error for transfer ${transferId}:`, error);
      clearInterval(pingInterval);

      // Clean up
      const sockets = this.serverSockets.get(transferId);
      if (sockets) {
        sockets.delete(server);
        if (sockets.size === 0) {
          this.serverSockets.delete(transferId);
        }
      }
    });

    // Set timeout to close connection after 2 minutes if not closed already
    // This ensures connections don't stay open indefinitely
    const SOCKET_TIMEOUT = 2 * 60 * 1000; // 2 minutes
    setTimeout(() => {
      // Check if transfer is complete
      const currentTransfer = this.activeTransfers.get(transferId);

      // Send a final status update if the socket is still open
      if (server.readyState === 1) {
        // OPEN
        if (currentTransfer) {
          server.send(
            JSON.stringify({
              type: "status",
              transfer: currentTransfer,
            } as StatusMessage)
          );
        }

        // Add a timeout message if not terminal state
        if (
          currentTransfer &&
          currentTransfer.status !== "COMPLETED" &&
          currentTransfer.status !== "FAILED"
        ) {
          server.send(
            JSON.stringify({
              type: "status",
              transfer: {
                ...currentTransfer,
                details: `${
                  currentTransfer.details || ""
                } (Connection timeout reached)`,
              },
            } as StatusMessage)
          );
        }

        // Close the connection
        server.close();
      }

      clearInterval(pingInterval);
    }, SOCKET_TIMEOUT);

    // Return the client end of the WebSocket
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleHttpRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Add CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Upgrade, Connection",
    };

    // Handle OPTIONS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Add CORS headers to all responses
    const responseHeaders = {
      "Content-Type": "application/json",
      ...corsHeaders,
    };

    // Check for WebSocket upgrade request
    const upgrade = request.headers.get("Upgrade");
    const connection = request.headers.get("Connection");
    const isWebSocketRequest =
      upgrade?.toLowerCase() === "websocket" ||
      connection?.toLowerCase().includes("upgrade");

    // Handle WebSocket upgrade for live updates
    // Format: /transfers/:id/ws
    if (path.startsWith("/transfers/") && path.endsWith("/ws")) {
      // Extract transfer ID from the path
      const pathParts = path.split("/");
      if (pathParts.length >= 3) {
        const transferId = pathParts[2];

        // Only proceed if this is a WebSocket request
        if (isWebSocketRequest) {
          console.log(`WebSocket upgrade request for transfer: ${transferId}`);
          return this.handleWebSocket(request, transferId);
        } else {
          // Regular HTTP request to a WebSocket endpoint
          return new Response(
            JSON.stringify({
              error: "WebSocket connection required for this endpoint",
              websocket_url: `${url.protocol === "https:" ? "wss" : "ws"}://${
                url.host
              }${path}`,
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }
      }
    }

    // List all transfers (modified to get only recent transfers)
    if (path === "/transfers" && request.method === "GET") {
      // Get limit from query parameter, default to 100
      const limitParam = url.searchParams.get("limit");
      const limit = limitParam ? parseInt(limitParam, 10) : 100;

      const transfers = await this.getRecentTransfers(limit);
      return new Response(JSON.stringify(transfers), {
        status: 200,
        headers: responseHeaders,
      });
    }

    // Handle status check endpoint
    if (path === "/status" && request.method === "GET") {
      const transferId = url.searchParams.get("id");

      if (!transferId) {
        return new Response(JSON.stringify({ error: "Missing transfer ID" }), {
          status: 400,
          headers: responseHeaders,
        });
      }

      const transfer = await this.getTransferStatus(transferId);

      if (!transfer) {
        return new Response(JSON.stringify({ error: "Transfer not found" }), {
          status: 404,
          headers: responseHeaders,
        });
      }

      // If transfer is completed or failed, return status immediately
      if (transfer.status === "COMPLETED" || transfer.status === "FAILED") {
        return new Response(JSON.stringify(transfer), {
          status: 200,
          headers: responseHeaders,
        });
      }

      // Otherwise, suggest connecting via WebSocket for updates
      const protocol =
        request.headers.get("x-forwarded-proto") === "https" ? "wss" : "ws";
      const host = request.headers.get("host") || url.host;

      return new Response(
        JSON.stringify({
          ...transfer,
          message:
            "Transfer in progress. Connect to WebSocket for real-time updates.",
          websocket_url: `${protocol}://${host}/transfers/${transferId}/ws`,
        }),
        {
          status: 200,
          headers: responseHeaders,
        }
      );
    }

    // Handle create transfer endpoint (modified to use async/await)
    if (path === "/create" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          id?: string;
          status?: "PENDING" | "PROCESSING";
          details?: string;
        };
        const { id, status = "PENDING", details } = body;

        if (!id) {
          return new Response(
            JSON.stringify({ error: "Missing required field: id" }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        const result = await this.createTransferRequest(id, status, details);

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: responseHeaders,
        });
      } catch (error) {
        console.error("Error creating transfer:", error);
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: responseHeaders,
        });
      }
    }

    // Handle status update endpoint (modified to use async/await)
    if (path === "/update" && request.method === "POST") {
      try {
        const body = (await request.json()) as {
          id?: string;
          status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
          details?: string;
        };
        const { id, status, details } = body;

        if (!id || !status) {
          return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        const result = await this.updateTransferStatus(id, status, details);

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: responseHeaders,
        });
      } catch (error) {
        console.error("Error updating transfer:", error);
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: responseHeaders,
        });
      }
    }

    // Default root endpoint to show available endpoints
    if (path === "/" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          endpoints: {
            "/create":
              "POST - Create a new transfer (requires JSON body with id field)",
            "/status?id=<transferId>": "GET - Check status of a transfer",
            "/update":
              "POST - Update a transfer status (requires JSON body with id, status fields)",
            "/transfers":
              "GET - List all transfers in the system (most recent 100 by default)",
            "/transfers?limit=<number>":
              "GET - Limit number of transfers returned",
            "/transfers/:id/ws": "WebSocket - Connect for real-time updates",
          },
        }),
        {
          status: 200,
          headers: responseHeaders,
        }
      );
    }

    // Not found
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: responseHeaders,
    });
  }
}

export default {
  async fetch(request: Request, env: Env) {
    // Log the request for debugging
    console.log(`Request: ${request.method} ${new URL(request.url).pathname}`);

    try {
      // Initialize the server with KV namespace
      const server = new TransferStatusServer(env);

      // Performance timer to monitor API response times
      const startTime = performance.now();

      // Handle the request
      const response = await server.handleHttpRequest(request);

      // Log performance for API monitoring
      const duration = performance.now() - startTime;
      console.log(
        `Request processed in ${duration.toFixed(2)}ms: ${request.method} ${
          new URL(request.url).pathname
        }`
      );

      return response;
    } catch (error) {
      // Detailed error logging to help with debugging
      const url = new URL(request.url);
      console.error(`Error handling ${request.method} ${url.pathname}:`, error);

      // Send a friendly error response
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          requestId: crypto.randomUUID(), // Add request ID for error tracking
          message:
            "The server encountered an error processing your request. Please try again later.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
} satisfies ExportedHandler<Env>;
