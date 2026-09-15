import { foodItems } from "./data";
import { CartItem, FoodItem, Customer, Payment, OrderStatus, BillResult } from "./types";

export const cart: CartItem[] = [];

export function addToCart(foodItem: FoodItem, quantity: number) {
  if (!foodItem.isAvailable) {
    console.log("Item not present");
    return;
  }

  const existingItem = cart.find((item) => item.id === foodItem.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  }
  else {
    const cartItem: CartItem = {
      ...foodItem,
      quantity: quantity,
    };

    cart.push(cartItem);
  }

  console.log(`${foodItem.name} added to cart.`);

}

export function removeFromCart(foodItem: FoodItem): void {

  const targetFood = cart.findIndex((item) => item.id == foodItem["id"])

  if (targetFood === -1) {
    console.log("Item not found");
  }
  else {
    cart.splice(targetFood, 1);
    console.log("Item removed Successfully");
  }


}

export function updateQuantity(foodItem: FoodItem, newQuantity: number): void {

  const targetFood = cart.find((item) => item.id === foodItem["id"]);

  if (!targetFood) {
    console.log("Item not found");
    return;
  }

  if (newQuantity <= 0) {
    console.log("Quantity must be greater than 0");
    return;
  }

  targetFood.quantity = newQuantity;
  console.log("Quantity updated successfully");
}

export function calculateItemTotal(foodItem: FoodItem): number {

  const targetFood = cart.find((item) => item.id === foodItem["id"]);

  if (!targetFood) {
    console.log("Item not found");
    return 0;
  }

  const itemTotal = targetFood.price * targetFood.quantity;
  console.log(itemTotal);
  return itemTotal;

}

export function calculateSubtotal(): number {

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  console.log(subtotal);
  return subtotal;
}

export function calculateDiscount(customer: Customer, originalBill: number): number {

  if (customer.discountPercentage && originalBill < 2000) {

    const discountGained =
      originalBill * customer.discountPercentage / 100;

    return discountGained;
  }

  else if (customer.discountPercentage && originalBill >= 2000) {

    const discountGained =
      originalBill * ((customer.discountPercentage / 100) + (5 / 100));

    return discountGained;
  }

  else if (!customer.discountPercentage && originalBill < 2000) {

    return 0;
  }

  else if (!customer.discountPercentage && originalBill >= 2000) {

    const discountGained =
      originalBill * (5 / 100);

    return discountGained;
  }

  return 0;
}

export function calculateFinalAmount(discountGained: number, originalBill: number): number {

  const finalBill = originalBill - discountGained;

  const billAfterGST = finalBill * 5 / 100 + finalBill;
  return billAfterGST;
}

export function processPayments(
  Paymentmethod: Payment,
  billAfterGST: number
): boolean {

  if (Paymentmethod.method === "cash") {

    if (Paymentmethod.receivedAmount >= billAfterGST) {

      const change =
        Paymentmethod.receivedAmount - billAfterGST;

      console.log("\nPayment Method: Cash");
      console.log(`Amount Received: ₹${Paymentmethod.receivedAmount}`);
      console.log(`Bill Amount: ₹${billAfterGST}`);
      console.log(`Change: ₹${change}`);
      console.log("Payment Successful");

      return true;
    }

    else {

      const amountPending =
        billAfterGST - Paymentmethod.receivedAmount;

      console.log("\nPayment Method: Cash");
      console.log(`Amount Received: ₹${Paymentmethod.receivedAmount}`);
      console.log(`Bill Amount: ₹${billAfterGST}`);
      console.log(`Amount Pending: ₹${amountPending}`);
      console.log("Payment Failed");

      return false;
    }
  }

  else if (Paymentmethod.method === "card") {

    console.log("\nPayment Method: Card");
    console.log(
      `Card ending in: ${Paymentmethod.last4Digits}`
    );
    console.log(`Amount Paid: ₹${billAfterGST}`);
    console.log("Payment Successful");

    return true;
  }

  else if (Paymentmethod.method === "upi") {

    console.log("\nPayment Method: UPI");
    console.log(
      `Transaction ID: ${Paymentmethod.transactionId}`
    );
    console.log(`Amount Paid: ₹${billAfterGST}`);
    console.log("Payment Successful");

    return true;
  }

  return false;
}

export function updateOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): OrderStatus {

  if (currentStatus === "pending" && newStatus === "confirmed") {
    return newStatus;
  }

  else if (currentStatus === "confirmed" && newStatus === "preparing") {
    return newStatus;
  }

  else if (currentStatus === "preparing" && newStatus === "delivered") {
    return newStatus;
  }

  else if (newStatus === "cancelled") {
    return newStatus;
  }

  else {
    console.log("Invalid order status change");
    return currentStatus;
  }
}

export function generateBill(
  customer: Customer,
  Paymentmethod: Payment
): BillResult {

  const originalBill = calculateSubtotal();

  if (originalBill <= 0) {
    return {
      status: "error",
      message: "Cart is empty"
    };
  }

  const discountGained = calculateDiscount(
    customer,
    originalBill
  );

  const billAfterGST = calculateFinalAmount(
    discountGained,
    originalBill
  );

  processPayments(
    Paymentmethod,
    billAfterGST
  );

  return {
    status: "success",
    orderId: Date.now(),
    customer: customer,
    cartItems: [...cart],
    subtotal: originalBill,
    discount: discountGained,
    tax: billAfterGST - (originalBill - discountGained),
    finalAmount: billAfterGST,
    payment: Paymentmethod
  };
}