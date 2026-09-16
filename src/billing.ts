import { Customer, CartItem, Payment, BillResult, Coupon } from "./types.js";
import { getCustomerDiscount } from "./customer.js";
import { calculateSubtotal } from "./cart.js";
import { processPayment } from "./payment.js";

export interface DiscountBreakdown {
  membershipDiscount: number;
  bulkDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
}

// Calculate all applicable discounts
export function calculateDiscount(
  customer: Customer,
  subtotal: number,
  coupon?: Coupon
): DiscountBreakdown {
  if (subtotal <= 0) {
    return {
      membershipDiscount: 0,
      bulkDiscount: 0,
      couponDiscount: 0,
      totalDiscount: 0,
    };
  }

  // 1. Membership discount (Guest = 0%, Silver = 5%, Gold = 10%, Platinum = 15%)
  const memberPercent = getCustomerDiscount(customer);
  const membershipDiscount = (subtotal * memberPercent) / 100;

  // 2. Extra 5% discount if subtotal is greater than ₹2000
  const bulkDiscount = subtotal > 2000 ? (subtotal * 5) / 100 : 0;

  // 3. Optional coupon discount
  let couponDiscount = 0;
  if (coupon && subtotal >= coupon.minAmount) {
    couponDiscount = (subtotal * coupon.discountPercent) / 100;
  }

  const rawTotal = membershipDiscount + bulkDiscount + couponDiscount;
  const totalDiscount = Math.min(rawTotal, subtotal);

  return {
    membershipDiscount: Number(membershipDiscount.toFixed(2)),
    bulkDiscount: Number(bulkDiscount.toFixed(2)),
    couponDiscount: Number(couponDiscount.toFixed(2)),
    totalDiscount: Number(totalDiscount.toFixed(2)),
  };
}

// Calculate 5% GST on amount after discount
export function calculateTax(amountAfterDiscount: number): number {
  if (amountAfterDiscount <= 0) return 0;
  const gst = (amountAfterDiscount * 5) / 100;
  return Number(gst.toFixed(2));
}

// Calculate final payable amount: after discount + tax
export function calculateFinalAmount(
  amountAfterDiscount: number,
  tax: number
): number {
  const finalAmount = amountAfterDiscount + tax;
  return Number(finalAmount.toFixed(2));
}

// Generate bill returning discriminated union BillResult
export function generateBill(
  customer: Customer,
  cartItems: CartItem[],
  payment: Payment,
  coupon?: Coupon
): BillResult {
  // Return error result if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return {
      status: "error",
      message: "Cannot generate bill: Cart is empty.",
    };
  }

  const subtotal = calculateSubtotal(cartItems);
  const discounts = calculateDiscount(customer, subtotal, coupon);
  const amountAfterDiscount = Math.max(0, subtotal - discounts.totalDiscount);
  const tax = calculateTax(amountAfterDiscount);
  const finalAmount = calculateFinalAmount(amountAfterDiscount, tax);

  // Process payment
  const paymentResult = processPayment(payment, finalAmount);
  if (!paymentResult.success) {
    return {
      status: "error",
      message: paymentResult.message,
    };
  }

  // Return success result
  return {
    status: "success",
    orderId: Date.now(),
    customer,
    cartItems: [...cartItems],
    subtotal,
    discount: discounts.totalDiscount,
    tax,
    finalAmount,
    payment,
  };
}
