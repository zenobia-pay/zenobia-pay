import { createRoot } from "react-dom/client";
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router";
import { nanoid } from "nanoid";

import {
  sampleTransferIds,
  type TransferStatus,
  type StatusMessage,
} from "../shared";

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

    const connectWebSocket = () => {
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

      // Create new WebSocket connection
      const socket = new WebSocket(wsUrl);
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

    try {
      const response = await fetch(`/status?id=${transferId}`);
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
        setError(data.error || "Failed to check status");
      }
    } catch (err) {
      setError("Network error occurred");
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

    try {
      console.log(`Creating transfer: ${transferId}`);
      const response = await fetch("/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transferId,
          status: "PENDING",
          details: `New transfer created at ${new Date().toISOString()}`,
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
        setError(data.error || "Failed to create transfer");
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
    try {
      console.log(`Sending status update: ${transferId} -> ${newStatus}`);
      const response = await fetch("/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: transferId,
          status: newStatus,
          details: `Updated to ${newStatus} on ${new Date().toISOString()}`,
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
        setError(data.error || "Failed to update status");
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
      const response = await fetch("/transfers");
      if (response.ok) {
        const data = (await response.json()) as TransferStatus[];
        setAllTransfers(data);
      } else {
        console.error("Failed to fetch transfers");
      }
    } catch (err) {
      console.error("Error fetching transfers:", err);
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
