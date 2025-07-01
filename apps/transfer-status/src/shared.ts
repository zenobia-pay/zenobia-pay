export type TransferStatus = {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  details?: string;
  customerName?: string;
  updatedAt: number; // timestamp
};

export type StatusMessage =
  | {
      type: "update";
      id: string;
      status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
      details?: string;
      updatedAt: number;
    }
  | {
      type: "status";
      transfer: TransferStatus;
    }
  | {
      type: "error";
      message: string;
    };

// For testing purposes only
export const sampleTransferIds = [
  "TRF12345",
  "TRF67890",
  "TRF24680",
  "TRF13579",
  "TRF54321",
];

export const names = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Kevin",
  "Linda",
  "Mallory",
  "Nancy",
  "Oscar",
  "Peggy",
  "Quentin",
  "Randy",
  "Steve",
  "Trent",
  "Ursula",
  "Victor",
  "Walter",
  "Xavier",
  "Yvonne",
  "Zoe",
];
