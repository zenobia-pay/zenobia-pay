import { createRoot } from "react-dom/client";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router";
import { nanoid } from "nanoid";

import {
  sampleTransferIds,
  type TransferStatus,
  type StatusMessage,
} from "../shared";

// Function to generate HMAC signature
async function generateHmacSignature(transferId: string): Promise<{
  transferRequestId: string;
  merchantId: string;
  expiry: number;
  signature: string;
}> {
  // Use the provided transferId as the transferRequestId
  const transferRequestId = transferId;

  // Set fixed merchantId for demo purposes
  const merchantId = "auth0|67f0a8703cc36ca458f5cf7b";

  // Set expiry to 30 minutes from now
  const expiry = Math.floor(Date.now() / 1000) + 30 * 60;

  // Create payload object to be signed
  const payload = {
    transferRequestId,
    merchantId,
    expiry,
  };

  // Convert to string for signing
  const payloadString = JSON.stringify(payload);

  try {
    // Use the same dummy secret as the server (12345)
    const dummySecret = "12345";

    // Create encoder
    const encoder = new TextEncoder();
    const keyData = encoder.encode(dummySecret);
    const messageData = encoder.encode(payloadString);

    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Sign the message
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);

    // Convert signature to base64 string
    const signatureArray = new Uint8Array(signatureBuffer);
    const base64Signature = btoa(String.fromCharCode(...signatureArray));

    // Create a complete signature with payload.signature format
    // Base64 encode the payload and append the signature part
    const encodedPayload = btoa(payloadString);
    const signature = `${encodedPayload}.${base64Signature}`;

    return {
      transferRequestId,
      merchantId,
      expiry,
      signature,
    };
  } catch (error) {
    console.error("Error generating signature:", error);
    throw error;
  }
}

function TransferStatusViewer() {
  const [transferId, setTransferId] = useState("");
  const [status, setStatus] = useState<TransferStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [allTransfers, setAllTransfers] = useState<TransferStatus[]>([]);
  const [showTransfersList, setShowTransfersList] = useState(false);
  const [lastUpdateSource, setLastUpdateSource] = useState<
    "http" | "websocket" | null
  >(null);
  const [authInfo, setAuthInfo] = useState<{
    signature?: string;
    transferRequestId?: string;
    merchantId?: string;
    expiry?: number;
    generated?: number;
  } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Track WebSocket message timestamps and counts
  const [wsStats, setWsStats] = useState({
    messageCount: 0,
    lastMessageTime: null as number | null,
  });

  // WebSocket connection with automatic reconnection
  useEffect(() => {
    let reconnectTimeout: number | null = null;
    const maxReconnectAttempts = 5;
    let reconnectAttempts = 0;

    const connectWebSocket = async () => {
      // Close any existing socket connection
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setConnected(false);
      }

      // Only create a new WebSocket if we have a transferId and wsUrl
      if (!transferId || !wsUrl) {
        return;
      }

      console.log(`Attempting to connect to WebSocket: ${wsUrl}`);

      try {
        // Generate authentication object
        const authObj = await generateHmacSignature(transferId);

        // Append auth parameters to the WebSocket URL
        const wsUrlObj = new URL(wsUrl);
        wsUrlObj.searchParams.append(
          "transferRequestId",
          authObj.transferRequestId
        );
        wsUrlObj.searchParams.append("merchantId", authObj.merchantId);
        wsUrlObj.searchParams.append("expiry", authObj.expiry.toString());
        wsUrlObj.searchParams.append("signature", authObj.signature);

        // Create new WebSocket connection with auth parameters
        const socket = new WebSocket(wsUrlObj.toString());
        socketRef.current = socket;

        socket.onopen = () => {
          setConnected(true);
          setError(null);
          reconnectAttempts = 0; // Reset reconnect attempts on successful connection
          console.log(`WebSocket connected for transfer: ${transferId}`);
        };

        socket.onclose = (event) => {
          setConnected(false);
          socketRef.current = null;
          console.log(
            `WebSocket disconnected for transfer: ${transferId}`,
            event.code,
            event.reason
          );

          // Try to reconnect if not manually closed
          if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            const reconnectDelay = Math.min(1000 * reconnectAttempts, 5000);
            console.log(
              `Attempting to reconnect in ${reconnectDelay}ms (attempt ${reconnectAttempts})`
            );

            if (reconnectTimeout) {
              window.clearTimeout(reconnectTimeout);
            }

            reconnectTimeout = window.setTimeout(() => {
              console.log(
                `Reconnecting to WebSocket (attempt ${reconnectAttempts})...`
              );
              connectWebSocket();
            }, reconnectDelay);
          }
        };

        socket.onerror = (error) => {
          console.error(`WebSocket error for transfer: ${transferId}`, error);
          setError("WebSocket error occurred");
        };

        socket.onmessage = (evt) => {
          console.log(
            `WebSocket message received for transfer: ${transferId}`,
            evt.data
          );

          // Update WebSocket stats
          setWsStats((prev) => ({
            messageCount: prev.messageCount + 1,
            lastMessageTime: Date.now(),
          }));

          try {
            const data = JSON.parse(evt.data);

            // Check the message type and handle accordingly
            if (data.type === "status" && data.transfer) {
              // Status message with transfer data
              const oldStatus = status?.status;
              const newStatus = data.transfer.status;

              console.log(
                `Status update received via WebSocket: ${
                  oldStatus || "none"
                } -> ${newStatus}`,
                data.transfer
              );

              setStatus(data.transfer);
              setLastUpdateSource("websocket");
              setError(null);

              if (oldStatus !== newStatus) {
                console.log(
                  `Status changed: ${oldStatus || "none"} -> ${newStatus}`
                );
              }
            } else if (data.type === "error" && data.message) {
              // Error message
              console.error(`Error message from server: ${data.message}`);
              setError(data.message);
            } else if (data.type === "ping") {
              // Respond to ping with pong to keep connection alive
              console.log("Ping received, sending pong");
              if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "pong" }));
              }
            }
          } catch (err) {
            console.error("Failed to parse message:", err, evt.data);
            setError("Failed to parse message");
          }
        };
      } catch (error) {
        console.error(`Error setting up WebSocket connection:`, error);
        setError("Failed to authenticate WebSocket connection");
      }
    };

    // Initial connection
    connectWebSocket();

    // Cleanup function to close socket and cancel reconnection when component unmounts
    // or when transferId/wsUrl changes
    return () => {
      if (reconnectTimeout) {
        window.clearTimeout(reconnectTimeout);
      }

      if (socketRef.current && socketRef.current.readyState < 2) {
        console.log(`Closing WebSocket for transfer: ${transferId}`);
        socketRef.current.close();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [transferId, wsUrl]); // Keep the dependency array minimal to prevent unnecessary reconnections

  const checkStatus = async () => {
    if (!transferId) {
      setError("Please enter a transfer ID");
      return;
    }

    setLoading(true);
    setError(null);
    setWsUrl(null);
    setConnected(false);
    setAuthInfo(null);

    try {
      // Generate authentication object
      const authObj = await generateHmacSignature(transferId);

      // Store auth info for display
      setAuthInfo({
        signature: authObj.signature,
        transferRequestId: authObj.transferRequestId,
        merchantId: authObj.merchantId,
        expiry: authObj.expiry,
        generated: Date.now(),
      });

      // Build URL with auth parameters
      const statusUrl = new URL(`/status`, window.location.origin);
      statusUrl.searchParams.append("id", transferId);
      statusUrl.searchParams.append(
        "transferRequestId",
        authObj.transferRequestId
      );
      statusUrl.searchParams.append("merchantId", authObj.merchantId);
      statusUrl.searchParams.append("expiry", authObj.expiry.toString());
      statusUrl.searchParams.append("signature", authObj.signature);

      const response = await fetch(statusUrl.toString());
      const data = (await response.json()) as {
        status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
        id?: string;
        details?: string;
        updatedAt?: number;
        error?: string;
        message?: string;
        websocket_url?: string;
      };

      if (response.ok) {
        // For completed/failed statuses, we'll still need to display status
        // as these won't establish a persistent WebSocket connection
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          if (data.id && data.status && data.updatedAt) {
            setStatus({
              id: data.id,
              status: data.status,
              details: data.details,
              updatedAt: data.updatedAt,
            });
            setLastUpdateSource("http");
          }
        } else if (data.status) {
          // For pending/processing statuses, ONLY connect to WebSocket
          // and don't update status directly - let the WebSocket do it
          console.log(
            `Connecting to WebSocket for status updates on ${transferId}`
          );

          // Use the provided WebSocket URL if available
          if (data.websocket_url) {
            setWsUrl(data.websocket_url);
          } else {
            // Generate WebSocket URL using proper protocol (ws or wss)
            const protocol =
              window.location.protocol === "https:" ? "wss:" : "ws:";
            setWsUrl(
              `${protocol}//${window.location.host}/transfers/${transferId}/ws`
            );
          }
        }
      } else {
        if (response.status === 401) {
          // Special handling for authentication errors
          setError(
            `Authentication error: ${
              data.error || "Invalid or expired credentials"
            }`
          );
        } else {
          setError(data.error || "Failed to check status");
        }
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error checking status:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTransfer = async () => {
    if (!transferId) {
      setError("Please enter a transfer ID");
      return;
    }

    setLoading(true);
    setError(null);
    setAuthInfo(null);

    try {
      console.log(`Creating transfer: ${transferId}`);

      // Generate authentication object
      const authObj = await generateHmacSignature(transferId);

      // Store auth info for display
      setAuthInfo({
        signature: authObj.signature,
        transferRequestId: authObj.transferRequestId,
        merchantId: authObj.merchantId,
        expiry: authObj.expiry,
        generated: Date.now(),
      });

      const response = await fetch("/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transferId,
          status: "PENDING",
          details: `New transfer created at ${new Date().toISOString()}`,
          transferRequestId: authObj.transferRequestId,
          merchantId: authObj.merchantId,
          expiry: authObj.expiry,
          signature: authObj.signature,
        }),
      });

      const data = (await response.json()) as TransferStatus & {
        error?: string;
        websocket_url?: string;
      };

      if (response.ok) {
        console.log(`Transfer created successfully: ${transferId}`);

        // Set up WebSocket connection to get real-time updates
        if (data.websocket_url) {
          console.log(
            `Connecting to WebSocket for new transfer: ${transferId}`
          );
          setWsUrl(data.websocket_url);
        } else {
          // Generate WebSocket URL and connect
          const protocol =
            window.location.protocol === "https:" ? "wss:" : "ws:";
          setWsUrl(
            `${protocol}//${window.location.host}/transfers/${transferId}/ws`
          );
        }

        // Only if we can't establish a WebSocket, update status directly
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          setStatus({
            id: data.id,
            status: data.status,
            details: data.details,
            updatedAt: data.updatedAt,
          });
          setLastUpdateSource("http");
        }

        setError(null);
        // Reload the transfers list
        fetchAllTransfers();
      } else {
        if (response.status === 401) {
          // Special handling for authentication errors
          setError(
            `Authentication error: ${
              data.error || "Invalid or expired credentials"
            }`
          );
        } else {
          setError(data.error || "Failed to create transfer");
        }
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error creating transfer:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    newStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
  ) => {
    if (!transferId) {
      setError("Please enter a transfer ID");
      return;
    }

    setLoading(true);
    setAuthInfo(null);

    try {
      console.log(`Sending status update: ${transferId} -> ${newStatus}`);

      // Generate authentication object
      const authObj = await generateHmacSignature(transferId);

      // Store auth info for display
      setAuthInfo({
        signature: authObj.signature,
        transferRequestId: authObj.transferRequestId,
        merchantId: authObj.merchantId,
        expiry: authObj.expiry,
        generated: Date.now(),
      });

      const response = await fetch("/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transferId,
          status: newStatus,
          details: `Updated to ${newStatus} on ${new Date().toISOString()}`,
          transferRequestId: authObj.transferRequestId,
          merchantId: authObj.merchantId,
          expiry: authObj.expiry,
          signature: authObj.signature,
        }),
      });

      const data = (await response.json()) as {
        id?: string;
        status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
        details?: string;
        updatedAt?: number;
        error?: string;
        websocket_url?: string;
      };

      if (response.ok) {
        console.log(`Status update request successful: ${newStatus}`);
        // Don't update status directly - wait for WebSocket update
        // If there's no WebSocket connection (e.g., for terminal states),
        // create one or update status directly
        if (
          !connected &&
          (newStatus === "COMPLETED" || newStatus === "FAILED")
        ) {
          if (data.id && data.status && data.updatedAt) {
            setStatus({
              id: data.id,
              status: data.status,
              details: data.details,
              updatedAt: data.updatedAt,
            });
            setLastUpdateSource("http");
          }
        } else if (data.websocket_url && !connected) {
          // Try to establish WebSocket connection for real-time updates
          console.log(
            `Connecting to WebSocket after status update: ${transferId}`
          );
          setWsUrl(data.websocket_url);
        }

        setError(null);
        // Reload the transfers list if we're showing it
        if (showTransfersList) {
          fetchAllTransfers();
        }
      } else {
        if (response.status === 401) {
          // Special handling for authentication errors
          setError(
            `Authentication error: ${
              data.error || "Invalid or expired credentials"
            }`
          );
        } else {
          setError(data.error || "Failed to update status");
        }
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debug WebSocket connection
  const debugWebSocket = () => {
    if (!socketRef.current) {
      console.log("No active WebSocket connection");
      return;
    }

    const readyStateMap: Record<number, string> = {
      0: "CONNECTING",
      1: "OPEN",
      2: "CLOSING",
      3: "CLOSED",
    };

    console.log("WebSocket Connection Info:");
    console.log(`- URL: ${socketRef.current.url}`);
    console.log(
      `- Ready State: ${socketRef.current.readyState} (${
        readyStateMap[socketRef.current.readyState]
      })`
    );
    console.log(`- Protocol: ${socketRef.current.protocol || "none"}`);
    console.log(`- Buffer Amount: ${socketRef.current.bufferedAmount}`);
    console.log(`- Extensions: ${socketRef.current.extensions || "none"}`);

    // Try sending a test message
    if (socketRef.current.readyState === WebSocket.OPEN) {
      console.log("Sending test ping message...");
      socketRef.current.send(JSON.stringify({ type: "ping", test: true }));
    } else {
      console.log("WebSocket not open, cannot send test message");
    }
  };

  const createNewTransfer = () => {
    const newId = `TRF-${nanoid(8)}`;
    setTransferId(newId);
  };

  const fetchAllTransfers = async () => {
    setLoading(true);
    try {
      // For listing all transfers, we'll create a dummy auth object
      const dummyId = "ALL_TRANSFERS";
      const authObj = await generateHmacSignature(dummyId);

      // Build URL with auth parameters
      const listUrl = new URL("/transfers", window.location.origin);
      listUrl.searchParams.append(
        "transferRequestId",
        authObj.transferRequestId
      );
      listUrl.searchParams.append("merchantId", authObj.merchantId);
      listUrl.searchParams.append("expiry", authObj.expiry.toString());
      listUrl.searchParams.append("signature", authObj.signature);

      const response = await fetch(listUrl.toString());
      if (response.ok) {
        const data = (await response.json()) as TransferStatus[];
        setAllTransfers(data);
      } else {
        const errorData = (await response.json()) as { error?: string };
        if (response.status === 401) {
          console.error(
            "Authentication failed when fetching transfers:",
            errorData.error
          );
          setError(
            `Authentication error: ${
              errorData.error || "Could not authenticate listing request"
            }`
          );
        } else {
          console.error("Failed to fetch transfers:", errorData.error);
          setError(errorData.error || "Failed to fetch transfers");
        }
      }
    } catch (err) {
      console.error("Error fetching transfers:", err);
      setError("Network error occurred while fetching transfers");
    } finally {
      setLoading(false);
    }
  };

  // Toggle the transfers list and fetch data if showing
  const toggleTransfersList = () => {
    const newValue = !showTransfersList;
    setShowTransfersList(newValue);
    if (newValue) {
      fetchAllTransfers();
    }
  };

  // Select a transfer from the list
  const selectTransfer = (transfer: TransferStatus) => {
    setTransferId(transfer.id);
    setStatus(transfer);
  };

  return (
    <div className="container">
      <h1>Transfer Status Service</h1>

      <div className="row">
        <div className="six columns">
          <label htmlFor="transferId">Transfer ID</label>
          <div className="row">
            <div className="eight columns">
              <input
                className="u-full-width"
                type="text"
                id="transferId"
                value={transferId}
                onChange={(e) => setTransferId(e.target.value)}
                placeholder="Enter transfer ID"
              />
            </div>
            <div className="four columns">
              <button className="button-primary" onClick={createNewTransfer}>
                Generate ID
              </button>
            </div>
          </div>
        </div>
        <div className="six columns">
          <label>&nbsp;</label>
          <div className="row">
            <div className="six columns">
              <button
                className="button-primary u-full-width"
                onClick={checkStatus}
                disabled={loading || !transferId}
              >
                Check Status
              </button>
            </div>
            <div className="six columns">
              <button
                className="button u-full-width"
                onClick={createTransfer}
                disabled={loading || !transferId}
              >
                Create Transfer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="twelve columns">
          <h5>Sample IDs for testing:</h5>
          <div className="sample-ids">
            {sampleTransferIds.map((id) => (
              <button
                key={id}
                className="button"
                onClick={() => setTransferId(id)}
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="twelve columns">
          <button className="button" onClick={toggleTransfersList}>
            {showTransfersList ? "Hide All Transfers" : "Show All Transfers"}
          </button>
        </div>
      </div>

      {showTransfersList && (
        <div className="row">
          <div className="twelve columns">
            <div className="transfers-list">
              <h4>All Transfers</h4>
              {allTransfers.length === 0 ? (
                <p>No transfers found.</p>
              ) : (
                <table className="u-full-width">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransfers.map((transfer) => (
                      <tr key={transfer.id}>
                        <td>{transfer.id}</td>
                        <td>
                          <span
                            className={`status-badge status-${transfer.status.toLowerCase()}`}
                          >
                            {transfer.status}
                          </span>
                        </td>
                        <td>{new Date(transfer.updatedAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="button-small"
                            onClick={() => selectTransfer(transfer)}
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                className="button"
                onClick={fetchAllTransfers}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="row">
          <div className="twelve columns">
            <div className="error-message">Error: {error}</div>
          </div>
        </div>
      )}

      {status && (
        <div className="row">
          <div className="twelve columns">
            <div className="status-panel">
              <h4>Transfer Status</h4>
              <p>
                <strong>ID:</strong> {status.id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-${status.status.toLowerCase()}`}>
                  {status.status}
                </span>
              </p>
              {status.details && (
                <p>
                  <strong>Details:</strong> {status.details}
                </p>
              )}
              {connected && (
                <p className="websocket-status">
                  <span className="websocket-connected">●</span> WebSocket
                  Connected (Real-time updates)
                  <button
                    className="button-small debug-button"
                    onClick={debugWebSocket}
                    title="Debug WebSocket connection"
                  >
                    Debug
                  </button>
                </p>
              )}
              {authInfo && (
                <div className="auth-info">
                  <p>
                    <strong>Authentication:</strong>
                  </p>
                  <p className="auth-detail">
                    <strong>Transfer Request ID:</strong>{" "}
                    <span className="auth-value">
                      {authInfo.transferRequestId}
                    </span>
                  </p>
                  <p className="auth-detail">
                    <strong>Merchant ID:</strong>{" "}
                    <span className="auth-value">{authInfo.merchantId}</span>
                  </p>
                  <p className="auth-detail">
                    <strong>Expiry:</strong>{" "}
                    <span className="auth-value">
                      {authInfo.expiry
                        ? new Date(authInfo.expiry * 1000).toLocaleString()
                        : "N/A"}
                    </span>
                  </p>
                  <p className="auth-detail">
                    <strong>HMAC Signature:</strong>{" "}
                    <span className="signature">{authInfo.signature}</span>
                  </p>
                  <p className="auth-detail">
                    <strong>Generated:</strong>{" "}
                    {new Date(authInfo.generated || 0).toLocaleString()}
                  </p>
                </div>
              )}
              {status && status.updatedAt && (
                <p className="update-info">
                  <strong>Last Update:</strong>{" "}
                  {new Date(status.updatedAt).toLocaleString()}
                  {connected && (
                    <span className={`source-badge source-${lastUpdateSource}`}>
                      Via{" "}
                      {lastUpdateSource === "websocket" ? "WebSocket" : "HTTP"}
                    </span>
                  )}
                </p>
              )}
              {connected && wsStats.messageCount > 0 && (
                <p className="ws-stats">
                  <strong>WebSocket Stats:</strong> {wsStats.messageCount}{" "}
                  messages received
                  {wsStats.lastMessageTime && (
                    <span>
                      {" "}
                      (Last:{" "}
                      {new Date(wsStats.lastMessageTime).toLocaleTimeString()})
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {status && (
        <div className="row">
          <div className="twelve columns">
            <h4>Update Status</h4>
            <div className="status-buttons">
              <button
                className="button status-pending"
                onClick={() => updateStatus("PENDING")}
                disabled={loading}
              >
                Set PENDING
              </button>
              <button
                className="button status-processing"
                onClick={() => updateStatus("PROCESSING")}
                disabled={loading}
              >
                Set PROCESSING
              </button>
              <button
                className="button status-completed"
                onClick={() => updateStatus("COMPLETED")}
                disabled={loading}
              >
                Set COMPLETED
              </button>
              <button
                className="button status-failed"
                onClick={() => updateStatus("FAILED")}
                disabled={loading}
              >
                Set FAILED
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .error-message {
          color: #721c24;
          background-color: #f8d7da;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
        .status-panel {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 10px 0;
        }
        .auth-info {
          margin-top: 15px;
          padding: 10px;
          background-color: #f0f8ff;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .auth-detail {
          margin: 5px 0;
          word-break: break-all;
        }
        .auth-value {
          font-family: monospace;
          font-size: 0.85em;
          background-color: #f6f6f6;
          padding: 2px 4px;
          border-radius: 2px;
        }
        .signature {
          font-family: monospace;
          font-size: 0.85em;
          background-color: #e6e6e6;
          padding: 2px 4px;
          border-radius: 2px;
        }
        .status-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .status-pending {
          background-color: #e2e3e5;
          color: #383d41;
        }
        .status-processing {
          background-color: #cce5ff;
          color: #004085;
        }
        .status-completed {
          background-color: #d4edda;
          color: #155724;
        }
        .status-failed {
          background-color: #f8d7da;
          color: #721c24;
        }
        .status-badge {
          padding: 3px 6px;
          border-radius: 3px;
          font-size: 12px;
        }
        .sample-ids {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .websocket-status {
          font-size: 0.9em;
          color: #0c5460;
          background-color: #d1ecf1;
          padding: 5px 10px;
          border-radius: 4px;
          display: inline-block;
        }
        .websocket-connected {
          color: #28a745;
          font-size: 1.2em;
        }
        .transfers-list {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
        }
        .button-small {
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
          font-size: 11px;
        }
        .debug-button {
          margin-left: 10px;
          background-color: #6c757d;
          color: white;
          border: none;
        }
        .debug-button:hover {
          background-color: #5a6268;
        }
        .update-info {
          font-size: 0.9em;
          color: #383d41;
          margin-top: 10px;
        }
        .source-badge {
          background-color: #d1ecf1;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 0.8em;
          margin-left: 5px;
        }
        .ws-stats {
          font-size: 0.9em;
          color: #383d41;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<TransferStatusViewer />} />
    </Routes>
  </BrowserRouter>
);
