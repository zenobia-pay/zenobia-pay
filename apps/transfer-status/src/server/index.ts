import type { TransferStatus, StatusMessage } from "../shared";

// Import Cloudflare Workers types
import type {
  DurableObjectNamespace,
  DurableObjectState,
  ExportedHandler,
  ExecutionContext,
  WebSocket,
  KVNamespace,
  CfProperties,
} from "@cloudflare/workers-types";

// Define environment interface

declare class WebSocketPair {
  0: WebSocket;
  1: WebSocket;
}

enum HmacType {
  SUBSCRIBE = "subscribe",
  UPDATE = "update",
}

// In-memory cache for active transfers only
export class TransferStatusServer {
  kv: KVNamespace;
  // Store the environment for use in methods
  private env: Env;
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
  // The Durable Object state
  state: DurableObjectState;
  // Shared key for HMAC authentication - this would be better stored securely

  // Static storage for local development to share state across instances
  private static devLocalTransfers = new Map<string, TransferStatus>();
  private static devLocalSockets = new Map<string, Set<WebSocket>>();

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.kv = env.TRANSFER_STATUS;
    // Store the env for use in other methods
    this.env = env;

    // Better detection of local development mode
    // Check if we're in development mode - either KV is not available or we're running in local dev
    const isLocalhost =
      typeof location !== "undefined" && location.hostname === "localhost";
    // Check for Node.js environment without directly referencing process
    this.isLocalDev = !this.kv || isLocalhost;
    console.log(
      `Running in ${
        this.isLocalDev ? "development" : "production"
      } mode (KV available: ${!!this.kv}),
       and location typeof: ${typeof location}
       and typeof window: ${typeof window},
       so isLocalhost: ${isLocalhost}`
    );

    console.log("this.kv, isLcoalhost, and isNodeEnv", this.kv, isLocalhost);
    // Set up the Durable Object's fetch handler
    this.state.blockConcurrencyWhile(async () => {
      // Initialize any state that needs loading
      await this.loadExistingTransfers();
    });
  }

  // Load existing transfers from storage into memory when initializing
  async loadExistingTransfers() {
    if (this.isLocalDev) {
      // In dev mode, load from static storage
      for (const [
        id,
        transfer,
      ] of TransferStatusServer.devLocalTransfers.entries()) {
        this.activeTransfers.set(id, transfer);
        this.localStorageMap.set(id, transfer);
      }
      console.log(
        `[DEV] Loaded ${this.activeTransfers.size} transfers from dev storage`
      );
    } else {
      // In production, we'll load transfers from KV as needed
      // We won't preload all transfers as there could be thousands
      console.log("Durable Object initialized, will load transfers as needed");
    }
  }

  // Handle HTTP requests to this Durable Object
  async fetch(request: Request): Promise<Response> {
    return await this.handleHttpRequest(request);
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
    if (!transfer) {
      console.log(
        `No active transfer found for ${transferId} - cannot broadcast`
      );
      return;
    }

    // Check if there are any sockets for this transfer
    const sockets = this.serverSockets.get(transferId);
    if (!sockets || sockets.size === 0) {
      console.log(
        `No WebSocket connections for transfer ${transferId} - cannot broadcast. Server has ${this.serverSockets.size} total connection mappings.`
      );

      // Log all active transfers with socket connections for debugging
      if (this.serverSockets.size > 0) {
        console.log("Current WebSocket mappings:");
        for (const [tid, socketSet] of this.serverSockets.entries()) {
          console.log(`- Transfer ${tid}: ${socketSet.size} active sockets`);
        }
      }
      return;
    }

    console.log(
      `Broadcasting to ${sockets.size} connections for transfer ${transferId}`
    );

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
          console.log(`Message sent to socket for ${transferId}`);
        } else {
          // Socket is no longer open, mark for removal
          console.log(
            `Dead socket found for ${transferId}, readyState: ${socket.readyState}`
          );
          deadSockets.push(socket);
        }
      } catch (error) {
        console.error("Error broadcasting status:", error);
        deadSockets.push(socket);
      }
    }

    // Clean up any dead sockets
    if (deadSockets.length > 0) {
      console.log(
        `Cleaning up ${deadSockets.length} dead sockets for ${transferId}`
      );
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
        console.log(
          `No more active sockets for ${transferId}, removing from server tracking`
        );
        this.serverSockets.delete(transferId);

        // Optionally, remove from active cache if no one is watching
        // and status is terminal (to save memory)
        if (transfer.status === "COMPLETED" || transfer.status === "FAILED") {
          // Wait a bit before purging from memory to handle quick reconnects
          setTimeout(() => {
            // Check again if any new listeners have connected
            if (!this.serverSockets.has(transferId)) {
              console.log(`Removing ${transferId} from active transfers cache`);
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
    details?: string,
    customerName?: string
  ): Promise<TransferStatus> {
    const now = Date.now();
    const transfer: TransferStatus = {
      id: transferId,
      status,
      details,
      updatedAt: now,
      customerName,
    };

    console.log(`Updating transfer ${transferId} to status: ${status}`);

    // Update in-memory active cache
    this.activeTransfers.set(transferId, transfer);

    // Save to KV or local storage
    try {
      if (this.isLocalDev) {
        // In dev mode, just save to local map AND static map for cross-instance sharing
        this.localStorageMap.set(transferId, transfer);
        TransferStatusServer.devLocalTransfers.set(transferId, transfer);
        console.log(`[DEV] Saved transfer to local storage: ${transferId}`);
        console.log(
          `Dev transfers count: ${TransferStatusServer.devLocalTransfers.size}`
        );
      } else {
        // In production, save to KV
        await this.kv.put(`transfer:${transferId}`, JSON.stringify(transfer));
        console.log(`Saved transfer to KV: ${transferId}`);

        // Update recent transfers list
        await this.updateRecentTransfersList(transferId, now);
      }
    } catch (error) {
      console.error("Error saving transfer:", error);
      // Still keep the update in memory even if storage fails
    }

    // List all active connections tracked across the server
    console.log("Current server socket maps:");
    console.log(`- Active transfers tracked: ${this.activeTransfers.size}`);
    console.log(
      `- WebSocket mappings: ${this.serverSockets.size} transfer IDs`
    );

    // Check if this specific transfer has sockets
    if (this.serverSockets.has(transferId)) {
      const socketCount = this.serverSockets.get(transferId)?.size || 0;
      console.log(`- Transfer ${transferId} has ${socketCount} active sockets`);
    } else {
      console.log(`- Transfer ${transferId} has NO active sockets map`);
    }

    // Broadcast the status update to all connections for this transfer
    console.log(
      `Broadcasting status update for ${transferId}. Active sockets: ${
        this.serverSockets.has(transferId)
          ? this.serverSockets.get(transferId)?.size
          : 0
      }`
    );

    if (this.isLocalDev) {
      // In dev mode, broadcast using static socket map
      this.broadcastToDevSockets(transferId, transfer);
    } else {
      // In production mode, use instance-specific socket map
      this.broadcastStatus(transferId);
    }

    // Close connections if status is terminal
    if (status === "COMPLETED" || status === "FAILED") {
      console.log(
        `Status is terminal (${status}), closing WebSockets for ${transferId}`
      );
      this.closeWebSockets(transferId);
    }

    return transfer;
  }

  // New method for development broadcasting
  private broadcastToDevSockets(transferId: string, transfer: TransferStatus) {
    const message: StatusMessage = {
      type: "status",
      transfer,
    };

    const messageStr = JSON.stringify(message);
    console.log(
      `[DEV] Broadcasting to all dev sockets for transfer: ${transferId}`
    );

    // Get sockets from static map
    const sockets = TransferStatusServer.devLocalSockets.get(transferId);
    if (!sockets || sockets.size === 0) {
      console.log(`[DEV] No sockets found for transfer: ${transferId}`);
      return;
    }

    console.log(
      `[DEV] Found ${sockets.size} sockets for transfer: ${transferId}`
    );

    const deadSockets: WebSocket[] = [];

    for (const socket of sockets) {
      try {
        if (socket.readyState === 1) {
          // OPEN
          socket.send(messageStr);
          console.log(`[DEV] Message sent to socket for ${transferId}`);
        } else {
          console.log(
            `[DEV] Dead socket found for ${transferId}, readyState: ${socket.readyState}`
          );
          deadSockets.push(socket);
        }
      } catch (error) {
        console.error(`[DEV] Error broadcasting status:`, error);
        deadSockets.push(socket);
      }
    }

    // Clean up dead sockets
    if (deadSockets.length > 0) {
      console.log(`[DEV] Cleaning up ${deadSockets.length} dead sockets`);
      for (const socket of deadSockets) {
        sockets.delete(socket);
        try {
          socket.close();
        } catch (e) {
          // Ignore close errors
        }
      }
    }
  }

  // Broadcast scan/unscan messages to all WebSocket listeners
  private broadcastScanMessage(
    transferId: string,
    scanType: "scanned" | "unscanned"
  ) {
    console.log(`Broadcasting ${scanType} message for transfer: ${transferId}`);

    const message = {
      type: "scan",
      transferId,
      scanType,
      timestamp: Date.now(),
    };

    const messageStr = JSON.stringify(message);

    if (this.isLocalDev) {
      // In dev mode, broadcast using static socket map
      this.broadcastScanToDevSockets(transferId, messageStr);
    } else {
      // In production mode, use instance-specific socket map
      this.broadcastScanToSockets(transferId, messageStr);
    }
  }

  // Broadcast scan message to production sockets
  private broadcastScanToSockets(transferId: string, messageStr: string) {
    const sockets = this.serverSockets.get(transferId);
    if (!sockets || sockets.size === 0) {
      console.log(
        `No WebSocket connections for transfer ${transferId} - cannot broadcast scan message`
      );
      return;
    }

    console.log(
      `Broadcasting scan message to ${sockets.size} connections for transfer ${transferId}`
    );

    const deadSockets: WebSocket[] = [];

    for (const socket of sockets) {
      try {
        if (socket.readyState === 1) {
          // OPEN
          socket.send(messageStr);
          console.log(`Scan message sent to socket for ${transferId}`);
        } else {
          console.log(
            `Dead socket found for ${transferId}, readyState: ${socket.readyState}`
          );
          deadSockets.push(socket);
        }
      } catch (error) {
        console.error("Error broadcasting scan message:", error);
        deadSockets.push(socket);
      }
    }

    // Clean up any dead sockets
    if (deadSockets.length > 0) {
      console.log(
        `Cleaning up ${deadSockets.length} dead sockets for ${transferId}`
      );
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
        console.log(
          `No more active sockets for ${transferId}, removing from server tracking`
        );
        this.serverSockets.delete(transferId);
      }
    }
  }

  // Broadcast scan message to development sockets
  private broadcastScanToDevSockets(transferId: string, messageStr: string) {
    console.log(
      `[DEV] Broadcasting scan message to all dev sockets for transfer: ${transferId}`
    );

    // Get sockets from static map
    const sockets = TransferStatusServer.devLocalSockets.get(transferId);
    if (!sockets || sockets.size === 0) {
      console.log(`[DEV] No sockets found for transfer: ${transferId}`);
      return;
    }

    console.log(
      `[DEV] Found ${sockets.size} sockets for transfer: ${transferId}`
    );

    const deadSockets: WebSocket[] = [];

    for (const socket of sockets) {
      try {
        if (socket.readyState === 1) {
          // OPEN
          socket.send(messageStr);
          console.log(`[DEV] Scan message sent to socket for ${transferId}`);
        } else {
          console.log(
            `[DEV] Dead socket found for ${transferId}, readyState: ${socket.readyState}`
          );
          deadSockets.push(socket);
        }
      } catch (error) {
        console.error(`[DEV] Error broadcasting scan message:`, error);
        deadSockets.push(socket);
      }
    }

    // Clean up dead sockets
    if (deadSockets.length > 0) {
      console.log(`[DEV] Cleaning up ${deadSockets.length} dead sockets`);
      for (const socket of deadSockets) {
        sockets.delete(socket);
        try {
          socket.close();
        } catch (e) {
          // Ignore close errors
        }
      }
    }
  }

  // List all transfers in the system
  getAllTransfers(): TransferStatus[] {
    return Array.from(this.activeTransfers.values());
  }

  // Close all WebSockets for a transfer ID
  closeWebSockets(transferId: string) {
    const sockets = this.serverSockets.get(transferId);
    if (sockets) {
      console.log(
        `Closing ${sockets.size} WebSockets for transfer ${transferId}`
      );
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

    // In dev mode, also close sockets in the static map
    if (this.isLocalDev) {
      const devSockets = TransferStatusServer.devLocalSockets.get(transferId);
      if (devSockets) {
        console.log(
          `[DEV] Closing ${devSockets.size} static WebSockets for transfer ${transferId}`
        );
        for (const socket of devSockets) {
          try {
            socket.close();
          } catch (error) {
            console.error("[DEV] Error closing static WebSocket:", error);
          }
        }

        // Remove from the static map
        TransferStatusServer.devLocalSockets.delete(transferId);
      }
    }
  }

  // Handle WebSocket connection for a transfer
  async handleWebSocket(
    request: Request,
    transferId: string
  ): Promise<Response> {
    console.log(`WebSocket connection requested for transfer: ${transferId}`);

    // Check if the transfer exists in memory or load it from storage
    let transfer = this.activeTransfers.get(transferId);
    if (!transfer) {
      // In dev mode, also check the static map
      if (this.isLocalDev) {
        transfer = TransferStatusServer.devLocalTransfers.get(transferId);
        if (transfer) {
          console.log(
            `Transfer found in dev static cache for WebSocket: ${transferId}`
          );
          // Add to local instance cache too
          this.activeTransfers.set(transferId, transfer);
        }
      }

      if (!transfer) {
        transfer = await this.getTransferStatus(transferId);
        if (!transfer) {
          console.log(
            `Transfer not found for WebSocket connection: ${transferId}, but allowing connection anyway`
          );
          // Create a placeholder transfer status instead of returning 404
          transfer = {
            id: transferId,
            status: "PENDING",
            details: "Waiting for transfer to be created...",
            updatedAt: Date.now(),
          };

          // Don't add it to activeTransfers yet since it doesn't really exist
          // It will be added when the transfer is actually created
        } else {
          console.log(
            `Transfer loaded from storage for WebSocket: ${transferId}`
          );

          // In dev mode, add to static map for cross-instance access
          if (this.isLocalDev) {
            TransferStatusServer.devLocalTransfers.set(transferId, transfer);
          }

          // Make sure it's in the active transfers cache
          this.activeTransfers.set(transferId, transfer);
        }
      }
    } else {
      console.log(
        `Transfer found in active cache for WebSocket: ${transferId}`
      );
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
    console.log(`WebSocket connection accepted for transfer: ${transferId}`);

    // Store the server socket for broadcasts
    if (!this.serverSockets.has(transferId)) {
      this.serverSockets.set(transferId, new Set());
      console.log(`Created new socket set for transfer: ${transferId}`);
    }

    // Add socket to the set
    const sockets = this.serverSockets.get(transferId);
    if (sockets) {
      sockets.add(server);
      console.log(
        `Added socket to set for transfer: ${transferId}, total: ${sockets.size}`
      );
    } else {
      console.log(
        `ERROR: Failed to get socket set that was just created for ${transferId}`
      );
      // Create the set again
      this.serverSockets.set(transferId, new Set([server]));
    }

    // In dev mode, also store in static socket map for cross-instance access
    if (this.isLocalDev) {
      if (!TransferStatusServer.devLocalSockets.has(transferId)) {
        TransferStatusServer.devLocalSockets.set(transferId, new Set());
        console.log(
          `[DEV] Created new static socket set for transfer: ${transferId}`
        );
      }
      TransferStatusServer.devLocalSockets.get(transferId)?.add(server);
      console.log(
        `[DEV] Added socket to static set for transfer: ${transferId}, total: ${
          TransferStatusServer.devLocalSockets.get(transferId)?.size
        }`
      );
    }

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
    server.addEventListener("message", (event: MessageEvent) => {
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
        console.log(
          `Removed closed socket for ${transferId}, remaining: ${sockets.size}`
        );

        if (sockets.size === 0) {
          // No more clients listening to this transfer
          console.log(
            `No more active sockets for ${transferId}, removing socket mapping`
          );
          this.serverSockets.delete(transferId);

          // Maybe remove from active cache if terminal state
          if (
            transfer &&
            (transfer.status === "COMPLETED" || transfer.status === "FAILED")
          ) {
            setTimeout(() => {
              if (!this.serverSockets.has(transferId)) {
                console.log(
                  `Removing ${transferId} from active transfers cache`
                );
                this.activeTransfers.delete(transferId);
              }
            }, 60000); // 1 minute delay
          }
        }
      }
    });

    // Handle errors gracefully
    server.addEventListener("error", (error: Event) => {
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

    // Send a ping immediately to confirm the connection is active
    try {
      if (server.readyState === 1) {
        server.send(JSON.stringify({ type: "ping", initial: true }));
      }
    } catch (e) {
      console.error("Error sending initial ping:", e);
    }

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
    } as ResponseInit & { webSocket: WebSocket });
  }

  private getHmacSecret(signatureType: HmacType): string {
    return signatureType === HmacType.SUBSCRIBE
      ? this.env.SUBSCRIBE_HMAC
      : this.env.UPDATE_HMAC;
  }

  // Method to verify a payload and its signature
  // Token format follows JWT-like standard: "payload.signature" where:
  // - payload is a base64-encoded JSON string containing:
  //   * transferRequestId: the ID of the transfer
  //   * merchantId: the ID of the merchant making the request
  //   * expiry: Unix timestamp when this token expires
  //   * (and other optional fields like status, details, etc.)
  // - signature is a base64-encoded HMAC-SHA256 signature of the decoded payload
  private async verifyPayloadSignature(
    token: string,
    signatureType: HmacType
  ): Promise<boolean> {
    try {
      // Split the token into parts
      const [encodedPayload, receivedSignature] = token.split(".");

      if (!encodedPayload || !receivedSignature) {
        console.log("Invalid token format. Expected payload.signature format");
        return false;
      }

      const encoder = new TextEncoder();

      const secret = this.getHmacSecret(signatureType);
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(encodedPayload);

      // Import the key
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      // Generate the signature
      const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        messageData
      );
      const signatureArray = new Uint8Array(signatureBuffer);

      // Convert to URL-safe Base64 without padding to match Java's Base64.getUrlEncoder().withoutPadding()
      let expectedSignature = btoa(String.fromCharCode(...signatureArray))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Compare the expected signature with the received one
      const signaturesMatch = receivedSignature === expectedSignature;

      if (signaturesMatch) {
        console.log("Signature verified successfully");
      } else {
        console.log("Signature verification failed");
        console.log(`Expected signature: ${expectedSignature}`);
        console.log(`Received signature: ${receivedSignature}`);

        // Log the lengths too for quick reference
        console.log(
          `Expected length: ${expectedSignature.length}, Received length: ${receivedSignature.length}`
        );
      }

      return signaturesMatch;
    } catch (error) {
      console.error("Error verifying payload signature:", error);
      return false;
    }
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

    // Helper to generate WebSocket URL
    const generateWebSocketUrl = (transferId: string): string => {
      const protocol =
        request.headers.get("x-forwarded-proto") === "https" ? "wss" : "ws";
      const host = request.headers.get("host") || url.host;
      return `${protocol}://${host}/transfers/${transferId}/ws`;
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

        // Check for authentication in WebSocket request
        const token = url.searchParams.get("token");

        // Require authentication for WebSocket connections
        if (!token) {
          return new Response(
            JSON.stringify({
              error: "Authentication required. Missing token.",
            }),
            {
              status: 401,
              headers: responseHeaders,
            }
          );
        }

        // Verify the signature
        const isValidSignature = await this.verifyPayloadSignature(
          token,
          HmacType.SUBSCRIBE
        );

        if (!isValidSignature) {
          return new Response(
            JSON.stringify({
              error: "Invalid signature or expired credentials",
            }),
            {
              status: 401,
              headers: responseHeaders,
            }
          );
        }

        // Decode and validate the payload
        try {
          const [encodedPayload] = token.split(".");
          const payloadStr = atob(encodedPayload);
          const payloadData = JSON.parse(payloadStr);

          // Check if payload contains all required fields
          if (
            !payloadData.transferRequestId ||
            !payloadData.merchantId ||
            !payloadData.expiry
          ) {
            return new Response(
              JSON.stringify({
                error: "Invalid payload format. Missing required fields.",
              }),
              {
                status: 400,
                headers: responseHeaders,
              }
            );
          }

          // Check if the request has expired
          const now = Math.floor(Date.now() / 1000);
          if (now > payloadData.expiry) {
            return new Response(
              JSON.stringify({
                error: "Request has expired",
              }),
              {
                status: 401,
                headers: responseHeaders,
              }
            );
          }

          // Ensure transfer ID in the URL matches the one in the payload
          if (transferId !== payloadData.transferRequestId) {
            return new Response(
              JSON.stringify({
                error: "Transfer ID mismatch between URL and payload",
              }),
              {
                status: 400,
                headers: responseHeaders,
              }
            );
          }
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: "Invalid payload format",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        // Only proceed if this is a WebSocket request
        if (isWebSocketRequest) {
          console.log(`WebSocket upgrade request for transfer: ${transferId}`);
          return this.handleWebSocket(request, transferId);
        } else {
          // Regular HTTP request to a WebSocket endpoint
          return new Response(
            JSON.stringify({
              error: "WebSocket connection required for this endpoint",
              websocket_url: generateWebSocketUrl(transferId),
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

      // Get authentication parameters
      const token = url.searchParams.get("token");

      // Require authentication
      if (!token) {
        return new Response(
          JSON.stringify({
            error: "Authentication required. Missing token.",
          }),
          {
            status: 401,
            headers: responseHeaders,
          }
        );
      }

      // Verify the signature
      const isValidSignature = await this.verifyPayloadSignature(
        token,
        HmacType.SUBSCRIBE
      );

      if (!isValidSignature) {
        return new Response(
          JSON.stringify({
            error: "Invalid signature or expired credentials",
          }),
          {
            status: 401,
            headers: responseHeaders,
          }
        );
      }

      // Decode and validate the payload
      try {
        const [encodedPayload] = token.split(".");
        const payloadStr = atob(encodedPayload);
        const payloadData = JSON.parse(payloadStr);

        // Check if payload contains all required fields
        if (
          !payloadData.transferRequestId ||
          !payloadData.merchantId ||
          !payloadData.expiry
        ) {
          return new Response(
            JSON.stringify({
              error: "Invalid payload format. Missing required fields.",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        // Check if the request has expired
        const now = Math.floor(Date.now() / 1000);
        if (now > payloadData.expiry) {
          return new Response(
            JSON.stringify({
              error: "Request has expired",
            }),
            {
              status: 401,
              headers: responseHeaders,
            }
          );
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "Invalid payload format",
          }),
          {
            status: 400,
            headers: responseHeaders,
          }
        );
      }

      const transfers = await this.getRecentTransfers(limit);
      return new Response(JSON.stringify(transfers), {
        status: 200,
        headers: responseHeaders,
      });
    }

    // Handle status check endpoint
    if (path === "/status" && request.method === "GET") {
      const transferId = url.searchParams.get("id");
      const token = url.searchParams.get("token");

      if (!transferId) {
        return new Response(JSON.stringify({ error: "Missing transfer ID" }), {
          status: 400,
          headers: responseHeaders,
        });
      }

      // Require authentication parameter
      if (!token) {
        return new Response(
          JSON.stringify({
            error: "Authentication required. Missing token.",
          }),
          {
            status: 401,
            headers: responseHeaders,
          }
        );
      }

      // Verify signature
      const isValidSignature = await this.verifyPayloadSignature(
        token,
        HmacType.SUBSCRIBE
      );

      if (!isValidSignature) {
        return new Response(
          JSON.stringify({
            error: "Invalid signature or expired credentials",
          }),
          {
            status: 401,
            headers: responseHeaders,
          }
        );
      }

      // Split token and decode payload
      try {
        const [encodedPayload] = token.split(".");
        const payloadStr = atob(encodedPayload);
        const payloadData = JSON.parse(payloadStr);

        // Check if payload contains all required fields
        if (
          !payloadData.transferRequestId ||
          !payloadData.merchantId ||
          !payloadData.expiry
        ) {
          return new Response(
            JSON.stringify({
              error: "Invalid payload format. Missing required fields.",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        // Check if the request has expired
        const now = Math.floor(Date.now() / 1000);
        if (now > payloadData.expiry) {
          return new Response(
            JSON.stringify({
              error: "Request has expired",
            }),
            {
              status: 401,
              headers: responseHeaders,
            }
          );
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: "Invalid payload format",
          }),
          {
            status: 400,
            headers: responseHeaders,
          }
        );
      }

      // If authentication is successful, get the transfer status
      const transfer = await this.getTransferStatus(transferId);

      if (!transfer) {
        return new Response(JSON.stringify({ error: "Transfer not found" }), {
          status: 404,
          headers: responseHeaders,
        });
      }

      // Always include websocket_url for any status
      const websocket_url = generateWebSocketUrl(transferId);

      // If transfer is completed or failed, return status immediately
      if (transfer.status === "COMPLETED" || transfer.status === "FAILED") {
        return new Response(
          JSON.stringify({
            ...transfer,
            websocket_url, // include websocket URL even for terminal states
          }),
          {
            status: 200,
            headers: responseHeaders,
          }
        );
      }

      // For in-progress transfers, suggest connecting via WebSocket
      return new Response(
        JSON.stringify({
          ...transfer,
          message:
            "Transfer in progress. Connect to WebSocket for real-time updates.",
          websocket_url,
        }),
        {
          status: 200,
          headers: responseHeaders,
        }
      );
    }

    // Handle status update endpoint
    if (path === "/update" && request.method === "POST") {
      try {
        console.log("Processing update request");

        // Extract the token from the request body
        const body = (await request.json()) as {
          token?: string; // payload.signature format
          customerName?: string;
        };

        const { token } = body;

        // Require token
        if (!token) {
          return new Response(
            JSON.stringify({
              error: "Missing required field. Request must include 'token'.",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        // Decode the payload
        let decodedPayload;
        try {
          const [encodedPayload] = token.split(".");
          const payloadStr = atob(encodedPayload);
          console.log("Decoded payload string:", payloadStr);
          decodedPayload = JSON.parse(payloadStr);
        } catch (e) {
          console.error("Error decoding or parsing payload:", e);
          return new Response(
            JSON.stringify({ error: "Invalid payload format" }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        // Extract required fields from the payload
        const { transferRequestId, merchantId, status, details, customerName } =
          decodedPayload;

        // Validate required fields
        if (!transferRequestId || !merchantId || !status) {
          return new Response(
            JSON.stringify({
              error: "Incomplete payload. Missing required fields.",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        // Verify the signature
        const isValidSignature = await this.verifyPayloadSignature(
          token,
          HmacType.UPDATE
        );

        if (!isValidSignature) {
          return new Response(
            JSON.stringify({
              error: "Invalid signature or expired credentials",
            }),
            {
              status: 401,
              headers: responseHeaders,
            }
          );
        }

        // At this point the request is authenticated and valid
        // Process the status update
        const result = await this.updateTransferStatus(
          transferRequestId,
          status,
          details || `Updated to ${status}`,
          customerName
        );

        const websocket_url = generateWebSocketUrl(transferRequestId);

        return new Response(
          JSON.stringify({
            ...result,
            websocket_url,
          }),
          {
            status: 200,
            headers: responseHeaders,
          }
        );
      } catch (error) {
        console.error("Error updating transfer:", error);
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: responseHeaders,
        });
      }
    }

    // Handle scan endpoint (unauthenticated)
    if (path === "/scan" && request.method === "POST") {
      try {
        const body = (await request.json()) as { id?: string };
        const { id } = body;

        if (!id) {
          return new Response(
            JSON.stringify({
              error: "Missing required field. Request must include 'id'.",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        console.log(`Broadcasting scan event for transfer: ${id}`);

        // Broadcast scan message to all WebSocket listeners
        this.broadcastScanMessage(id, "scanned");

        return new Response(
          JSON.stringify({
            success: true,
            message: `Scan event broadcasted for transfer: ${id}`,
          }),
          {
            status: 200,
            headers: responseHeaders,
          }
        );
      } catch (error) {
        console.error("Error broadcasting scan event:", error);
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: responseHeaders,
        });
      }
    }

    // Handle unscan endpoint (unauthenticated)
    if (path === "/unscan" && request.method === "POST") {
      try {
        const body = (await request.json()) as { id?: string };
        const { id } = body;

        if (!id) {
          return new Response(
            JSON.stringify({
              error: "Missing required field. Request must include 'id'.",
            }),
            {
              status: 400,
              headers: responseHeaders,
            }
          );
        }

        console.log(`Broadcasting unscan event for transfer: ${id}`);

        // Broadcast unscan message to all WebSocket listeners
        this.broadcastScanMessage(id, "unscanned");

        return new Response(
          JSON.stringify({
            success: true,
            message: `Unscan event broadcasted for transfer: ${id}`,
          }),
          {
            status: 200,
            headers: responseHeaders,
          }
        );
      } catch (error) {
        console.error("Error broadcasting unscan event:", error);
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
              "POST - Create a new transfer (requires JSON body with token field in payload.signature format)",
            "/status?id=<transferId>&token=<payload.signature>":
              "GET - Check status of a transfer (requires JWT-like token authentication)",
            "/update":
              "POST - Update a transfer status (requires JSON body with token field in payload.signature format)",
            "/transfers":
              "GET - List all transfers in the system (most recent 100 by default)",
            "/transfers?limit=<number>&token=<payload.signature>":
              "GET - Limit number of transfers returned",
            "/transfers/:id/ws?token=<payload.signature>":
              "WebSocket - Connect for real-time updates (requires JWT-like token authentication)",
            "/scan":
              "POST - Broadcast scan event to all WebSocket listeners for a transfer",
            "/unscan":
              "POST - Broadcast unscan event to all WebSocket listeners for a transfer",
          },
          authentication: {
            description:
              "JWT-like token authentication required for most endpoints",
            method:
              "Format: payload.signature where payload is base64-encoded JSON and signature is HMAC-SHA256",
            validity:
              "Tokens include an expiry field and are typically valid for 30 minutes",
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
  // @ts-ignore
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Log the request for debugging
    console.log(`Request: ${request.method} ${new URL(request.url).pathname}`);

    try {
      // Create a unique ID for the TransferStatusServer Durable Object
      // We only need one instance to manage all transfers
      const id = env.TransferStatusServer.idFromName("global");

      // Get the stub for the Durable Object
      const stub = env.TransferStatusServer.get(id);

      // Forward the request to the Durable Object
      // Use a string URL to avoid type issues
      // @ts-ignore
      return await stub.fetch(request);
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
