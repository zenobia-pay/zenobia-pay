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
  const socketRef = useRef<WebSocket | null>(null);

  // WebSocket connection
  useEffect(() => {
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

    // Create new WebSocket connection
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setError(null);
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      setConnected(false);
      socketRef.current = null;
      console.log("WebSocket disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket error occurred");
      setConnected(false);
    };

    socket.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);

        // Check the message type and handle accordingly
        if (data.type === "status" && data.transfer) {
          // Status message with transfer data
          setStatus(data.transfer);
          setError(null);
        } else if (data.type === "error" && data.message) {
          // Error message
          setError(data.message);
        } else if (data.type === "ping") {
          // Respond to ping with pong to keep connection alive
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "pong" }));
          }
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
        setError("Failed to parse message");
      }
    };

    // Cleanup function to close socket when component unmounts
    // or when transferId/wsUrl changes
    return () => {
      if (socketRef.current && socketRef.current.readyState < 2) {
        socketRef.current.close();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [transferId, wsUrl]);

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
        if (data.status === "COMPLETED" || data.status === "FAILED") {
          // For completed/failed statuses, just display status
          if (data.id && data.status && data.updatedAt) {
            setStatus({
              id: data.id,
              status: data.status,
              details: data.details,
              updatedAt: data.updatedAt,
            });
          }
        } else if (data.status) {
          // For pending/processing statuses, connect to WebSocket
          setStatus({
            id: transferId,
            status: data.status,
            details: data.details,
            updatedAt: Date.now(),
          });

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
      };

      if (response.ok) {
        setStatus({
          id: data.id,
          status: data.status,
          details: data.details,
          updatedAt: data.updatedAt,
        });
        setError(null);
        // Reload the transfers list
        fetchAllTransfers();
      } else {
        setError(data.error || "Failed to create transfer");
      }
    } catch (err) {
      setError("Network error occurred");
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
      };

      if (response.ok) {
        if (data.id && data.status && data.updatedAt) {
          setStatus({
            id: data.id,
            status: data.status,
            details: data.details,
            updatedAt: data.updatedAt,
          });
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
    } finally {
      setLoading(false);
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
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(status.updatedAt).toLocaleString()}
              </p>
              {connected && (
                <p className="websocket-status">
                  <span className="websocket-connected">●</span> WebSocket
                  Connected (Real-time updates)
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
