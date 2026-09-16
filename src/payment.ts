import { Payment } from "./types.js";
import { assertNever } from "./utils.js";

// Result of payment processing
export interface PaymentStatus {
  success: boolean;
  message: string;
  change?: number;
}

// Process payment using type narrowing on Payment union
export function processPayment(payment: Payment, amountToPay: number): PaymentStatus {
  // Narrowing using 'in' operator to check properties unique to each payment type

  // 1. Cash Payment
  if ("receivedAmount" in payment) {
    if (payment.receivedAmount >= amountToPay) {
      const change = payment.receivedAmount - amountToPay;
      return {
        success: true,
        message: `Cash accepted: Received ₹${payment.receivedAmount}, Change: ₹${change.toFixed(2)}`,
        change: Number(change.toFixed(2)),
      };
    } else {
      const remaining = amountToPay - payment.receivedAmount;
      return {
        success: false,
        message: `Insufficient cash! Received: ₹${payment.receivedAmount}, Still needed: ₹${remaining.toFixed(2)}`,
      };
    }
  }

  // 2. Card Payment
  if ("last4Digits" in payment) {
    if (/^\d{4}$/.test(payment.last4Digits)) {
      return {
        success: true,
        message: `Card payment verified for card ending in ****${payment.last4Digits}. Paid: ₹${amountToPay.toFixed(2)}`,
      };
    } else {
      return {
        success: false,
        message: "Invalid card details. Last 4 digits must be 4 numbers.",
      };
    }
  }

  // 3. UPI Payment
  if ("transactionId" in payment) {
    if (payment.transactionId.trim().length > 0) {
      return {
        success: true,
        message: `UPI payment confirmed with Txn ID: ${payment.transactionId}. Paid: ₹${amountToPay.toFixed(2)}`,
      };
    } else {
      return {
        success: false,
        message: "Invalid UPI Transaction ID.",
      };
    }
  }

  // Exhaustive check with never
  return assertNever(payment);
}
