import crypto from "crypto";

// Types
export interface InitiatePaymentParams {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  paymentDescription: string;
}

export interface InitiatePaymentResponse {
  checkoutUrl: string;
  transactionReference: string;
  paymentReference: string;
  rawResponse: any;
}

export interface VerifyPaymentResponse {
  status: "PAID" | "PENDING" | "FAILED" | string;
  amountPaid: number;
  paymentReference: string;
  transactionReference: string;
  paymentMethod: string;
  rawResponse: any;
}

const BASE_URL =
  process.env.MONNIFY_BASE_URL || "https://sandbox.monnify.com";

/**
 * Helper to generate a Bearer Token using Monnify API Key and Secret Key.
 */
async function getAccessToken(): Promise<string> {
  const apiKey = process.env.MONNIFY_API_KEY;
  const secretKey = process.env.MONNIFY_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("Missing MONNIFY_API_KEY or MONNIFY_SECRET_KEY in environment variables.");
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64");

  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.requestSuccessful) {
    throw new Error(`Monnify Auth Error: ${data.responseMessage || "Failed to authenticate"}`);
  }

  return data.responseBody.accessToken;
}

/**
 * 1. Initiates a payment transaction with Monnify.
 */
export async function initiatePayment({
  amount,
  customerName,
  customerEmail,
  paymentReference,
  paymentDescription,
}: InitiatePaymentParams): Promise<InitiatePaymentResponse> {
  const contractCode = process.env.MONNIFY_CONTRACT_CODE;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!contractCode) {
    throw new Error("Missing MONNIFY_CONTRACT_CODE in environment variables.");
  }

  const token = await getAccessToken();

  const payload = {
    amount,
    customerName,
    customerEmail,
    paymentReference,
    paymentDescription,
    currencyCode: "NGN",
    contractCode,
    redirectUrl: `${appUrl}/verify`,
    paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
  };

  const response = await fetch(`${BASE_URL}/api/v1/merchant/transactions/init-transaction`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.requestSuccessful) {
    throw new Error(`Monnify Initiate Payment Error: ${data.responseMessage || "Failed to initialize payment"}`);
  }

  return {
    checkoutUrl: data.responseBody.checkoutUrl,
    transactionReference: data.responseBody.transactionReference,
    paymentReference: data.responseBody.paymentReference,
    rawResponse: data.responseBody,
  };
}

/**
 * 2. Verifies a transaction status by payment reference.
 */
export async function verifyPayment(paymentReference: string): Promise<VerifyPaymentResponse> {
  const token = await getAccessToken();
  const encodedRef = encodeURIComponent(paymentReference);

  const response = await fetch(
    `${BASE_URL}/api/v1/merchant/transactions/query?paymentReference=${encodedRef}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.requestSuccessful) {
    throw new Error(`Monnify Verify Payment Error: ${data.responseMessage || "Failed to verify transaction"}`);
  }

  const result = data.responseBody;

  return {
    status: result.paymentStatus, // 'PAID', 'PENDING', or 'FAILED'
    amountPaid: result.amountPaid,
    paymentReference: result.paymentReference,
    transactionReference: result.transactionReference,
    paymentMethod: result.paymentMethod,
    rawResponse: result,
  };
}

/**
 * 3. Validates the signature header of incoming Monnify webhook events.
 */
export async function validateWebhookSignature(
  rawBodyText: string,
  signatureHeader: string
): Promise<boolean> {
  const secretKey = process.env.MONNIFY_SECRET_KEY;

  if (!secretKey || !signatureHeader) {
    return false;
  }

  const calculatedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBodyText)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature, "utf8"),
    Buffer.from(signatureHeader, "utf8")
  );
}