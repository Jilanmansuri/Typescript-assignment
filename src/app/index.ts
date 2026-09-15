import { foodItems, customers, payments } from "./terminal-project/data";

import {
  cart,
  addToCart,
  calculateSubtotal,
  generateBill
} from "./terminal-project/functions";

import { Payment } from "./terminal-project/types";


// ================= FOOD MENU =================

console.log("\n========== FOOD MENU ==========");

foodItems.forEach((item) => {
  console.log(
    `${item.id}. ${item.name.padEnd(20)} ₹${item.price
      .toString()
      .padStart(5)}   ${item.isAvailable ? "Available" : "Not Available"}`
  );
});

console.log("===============================\n");


// ================= ADD TO CART =================

addToCart(foodItems[0], 2);
addToCart(foodItems[1], 1);


// ================= YOUR CART =================

console.log("\n========== YOUR CART ==========");

cart.forEach((item) => {
  const itemTotal = item.price * item.quantity;

  console.log(
    `${item.name.padEnd(20)} x ${item.quantity}  ₹${itemTotal}`
  );
});

console.log("===============================");

const originalBill = calculateSubtotal();

console.log(`Subtotal: ₹${originalBill}`);


// ================= CUSTOMER =================

const customer = customers[0];

console.log("\n========== CUSTOMER ==========");
console.log(`Name: ${customer.name}`);
console.log(`Type: ${customer.category}`);

if (customer.isMember) {
  console.log(`Membership: ${customer.membershipLevel}`);
  console.log(`Discount: ${customer.discountPercentage}%`);
}

console.log("==============================");


// ================= PAYMENT =================

const payment: Payment = payments[0];


// ================= GENERATE BILL =================

const bill = generateBill(
  customer,
  payment
);


// ================= FINAL BILL =================

if (bill.status === "success") {

  console.log("\n========== FINAL BILL ==========");

  console.log(`Order ID: ${bill.orderId}`);
  console.log(`Customer: ${bill.customer.name}`);

  console.log("--------------------------------");

  bill.cartItems.forEach((item) => {

    const itemTotal = item.price * item.quantity;

    console.log(
      `${item.name.padEnd(20)} x ${item.quantity}  ₹${itemTotal}`
    );

  });

  console.log("--------------------------------");

  console.log(`Subtotal:      ₹${bill.subtotal}`);
  console.log(`Discount:      ₹${bill.discount}`);

  console.log(`GST:           ₹${bill.tax}`);

  console.log(`Final Amount:  ₹${bill.finalAmount}`);

  console.log("--------------------------------");

  if (bill.payment.method === "cash") {

    console.log("Payment Method: Cash");

  }
  else if (bill.payment.method === "card") {

    console.log("Payment Method: Card");
    console.log(`Card: ****${bill.payment.last4Digits}`);

  }
  else if (bill.payment.method === "upi") {

    console.log("Payment Method: UPI");
    console.log(`Transaction ID: ${bill.payment.transactionId}`);

  }

  console.log("================================\n");

}
else {

  console.log("\n========== BILL ERROR ==========");
  console.log(bill.message);
  console.log("================================\n");

}