// lib/vtpass.ts

export interface VtpassCard {
  serialNumber: string;
  pinCode: string;
}

interface VtpassPayResponse {
  code: string;
  response_description?: string;
  requestId?: string;
  amount?: number;
  cards?: Array<{
    Serial?: string;
    serial?: string;
    Pin?: string;
    pin?: string;
  }>;
  purchased_code?: string;
  content?: {
    transactions?: {
      status?: string;
      channel?: string;
      transactionId?: string;
    };
  };
}

/**
 * Helper to parse PIN cards out of VTPass response payloads
 */
function extractCardsFromResponse(data: VtpassPayResponse): VtpassCard[] {
  const cards: VtpassCard[] = [];

  if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
    for (const card of data.cards) {
      const serial = card.Serial || card.serial || "";
      const pin = card.Pin || card.pin || "";

      if (serial && pin) {
        cards.push({ serialNumber: serial, pinCode: pin });
      }
    }
  }

  // Fallback check for purchased_code field string
  if (cards.length === 0 && data.purchased_code) {
    const lines = data.purchased_code.split("\n");
    for (const line of lines) {
      const match = line.match(/Serial:\s*([^\s,]+).*?Pin:\s*([^\s,]+)/i);
      if (match) {
        cards.push({ serialNumber: match[1], pinCode: match[2] });
      }
    }
  }

  return cards;
}

/**
 * Generates a VTPass-compliant requestId (YYYYMMDDHHMM + random string)
 */
export function generateVtpassRequestId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const timestamp = `${year}${month}${day}${hours}${minutes}`;
  const randomStr = Math.random().toString(36).substring(2, 10);

  return `${timestamp}${randomStr}`;
}

/**
 * Re-queries transaction status in case of network drops or pre-checks
 */
export async function requeryVtpassTransaction(requestId: string): Promise<VtpassPayResponse> {
  const apiKey = process.env.VTPASS_API_KEY;
  const secretKey = process.env.VTPASS_SECRET_KEY;
  const baseUrl = process.env.VTPASS_BASE_URL || "https://sandbox.vtpass.com";

  if (!apiKey || !secretKey) {
    throw new Error("Missing VTPass API credentials in environment variables.");
  }

  const response = await fetch(`${baseUrl}/api/requery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      "secret-key": secretKey,
    },
    body: JSON.stringify({ request_id: requestId }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`VTPass Requery HTTP failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Vends WAEC Result Checker PINs directly via VTPass with Requery-First safety
 */
export async function vendWaecPins({
  quantity,
  customerEmail,
  requestId,
}: {
  quantity: number;
  customerEmail: string;
  requestId: string;
}): Promise<VtpassCard[]> {
  const apiKey = process.env.VTPASS_API_KEY;
  const secretKey = process.env.VTPASS_SECRET_KEY;
  const baseUrl = process.env.VTPASS_BASE_URL || "https://sandbox.vtpass.com";

  if (!apiKey || !secretKey) {
    throw new Error("Missing VTPass API credentials in environment variables.");
  }

  // 1. REQUERY FIRST: Check if this transaction was already processed by VTPass
  try {
    const existingTx = await requeryVtpassTransaction(requestId);

    if (existingTx.code === "000") {
      const existingCards = extractCardsFromResponse(existingTx);
      if (existingCards.length > 0) {
        return existingCards;
      }
    }
  } catch (requeryError) {
    // Requery failed or transaction does not exist on VTPass yet; proceed to /api/pay
    console.log(`Requery pre-check passed for request_id ${requestId}. Proceeding to purchase.`);
  }

  // 2. PURCHASE: Transaction does not exist yet on VTPass, execute /api/pay
  const payload = {
    request_id: requestId,
    serviceID: "waec",
    variation_code: "waecdirect",
    quantity: quantity,
    billersCode: "1234567890",
    phone: "08011111111",
    email: customerEmail,
  };

  const response = await fetch(`${baseUrl}/api/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      "secret-key": secretKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`VTPass HTTP request failed with status: ${response.status}`);
  }

  let data: VtpassPayResponse = await response.json();

  // If response code is "099" (Processing/Pending), execute a requery fallback
  if (data.code === "099") {
    data = await requeryVtpassTransaction(requestId);
  }

  // If code is "014" (Request ID already exists, but requery didn't return cards above), force a secondary requery
  if (data.code === "014") {
    data = await requeryVtpassTransaction(requestId);
  }

  // Code "000" indicates transaction successful
  if (data.code !== "000") {
    throw new Error(
      `VTPass Vending Failed [Code ${data.code}]: ${data.response_description || "Unknown vendor error"}`
    );
  }

  // 3. EXTRACT AND RETURN CARDS
  const cards = extractCardsFromResponse(data);

  if (cards.length === 0) {
    throw new Error("VTPass reported success, but no PIN cards were returned in payload.");
  }

  return cards;
}