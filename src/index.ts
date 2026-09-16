import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { Customer, FoodItem, Payment, BillResult, BillSuccess, Coupon, OrderStatus } from "./types.js";
import { foodItems, customers, coupons } from "./data.js";
import { createGuest, createMember, getCustomerDetails } from "./customer.js";
import {
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateSubtotal,
  calculateItemTotal,
  clearCart,
} from "./cart.js";
import { calculateDiscount, calculateTax, calculateFinalAmount, generateBill } from "./billing.js";
import { updateOrderStatus, orderHistory, saveOrderToHistory } from "./order.js";
import { formatPrice } from "./utils.js";

// Session state
let currentCustomer: Customer = customers[0]; // Default customer
let currentCoupon: Coupon | undefined = undefined;
let latestBill: BillSuccess | null = null;

// Display the food menu
function displayMenu(): void {
  console.log("\n==================== 🍽️ FOOD MENU ====================");
  console.log("ID   | Name                     | Category | Price");
  console.log("------------------------------------------------------");
  foodItems.forEach((item) => {
    const status = item.isAvailable ? "" : " (Out of Stock)";
    console.log(
      `${item.id.toString().padEnd(4)} | ${item.name.padEnd(24)} | ${item.category.padEnd(8)} | ${formatPrice(item.price)}${status}`
    );
  });
  console.log("======================================================\n");
}

// Display the cart contents
function displayCart(): void {
  console.log("\n==================== 🛒 YOUR CART ====================");
  if (cart.length === 0) {
    console.log("Your cart is currently empty.");
    console.log("======================================================\n");
    return;
  }

  console.log("ID   | Name                     | Price    | Qty | Total");
  console.log("------------------------------------------------------");
  cart.forEach((item) => {
    const itemTotal = calculateItemTotal(item);
    const note = item.specialInstruction ? ` [Note: ${item.specialInstruction}]` : "";
    console.log(
      `${item.id.toString().padEnd(4)} | ${item.name.padEnd(24)} | ${formatPrice(item.price).padEnd(8)} | x${item.quantity.toString().padEnd(2)} | ${formatPrice(itemTotal)}${note}`
    );
  });
  console.log("------------------------------------------------------");
  console.log(`Subtotal: ${formatPrice(calculateSubtotal())}`);
  console.log("======================================================\n");
}

// Display the generated bill using type narrowing on discriminated union BillResult
function displayBill(result: BillResult): void {
  if (result.status === "error") {
    console.log("\n==================== ❌ BILL ERROR ====================");
    console.log(`Error: ${result.message}`);
    console.log("======================================================\n");
    return;
  }

  // Type narrowed to BillSuccess
  const bill = result;
  console.log("\n========================================");
  console.log("             ORDER SUMMARY              ");
  console.log("========================================");
  console.log(`Order ID    : #${bill.orderId}`);
  console.log(`Customer    : ${bill.customer.name}`);

  // Narrowing customer
  if ("membershipLevel" in bill.customer) {
    console.log(`Membership  : ${bill.customer.membershipLevel.toUpperCase()} (${bill.customer.discountPercentage}% discount)`);
  } else {
    console.log("Membership  : Guest (No discount)");
  }

  console.log("\nItems:");
  console.log("----------------------------------------");
  bill.cartItems.forEach((item) => {
    const total = calculateItemTotal(item);
    console.log(
      `${item.name.padEnd(22)} x${item.quantity.toString().padEnd(3)} ${formatPrice(total)}`
    );
  });
  console.log("----------------------------------------");
  console.log(`Subtotal:             ${formatPrice(bill.subtotal)}`);
  console.log(`Discount:             -${formatPrice(bill.discount)}`);
  console.log(`Amount After Discount:${formatPrice(bill.subtotal - bill.discount)}`);
  console.log(`GST (5%):             +${formatPrice(bill.tax)}`);
  console.log("----------------------------------------");
  console.log(`Final Amount:         ${formatPrice(bill.finalAmount)}`);
  console.log("----------------------------------------");

  // Narrowing payment with 'in' operator
  if ("receivedAmount" in bill.payment) {
    console.log("Payment Method: Cash");
    console.log(`Amount Tendered: ${formatPrice(bill.payment.receivedAmount)}`);
    const change = bill.payment.receivedAmount - bill.finalAmount;
    console.log(`Change Returned: ${formatPrice(Math.max(0, change))}`);
  } else if ("last4Digits" in bill.payment) {
    console.log("Payment Method: Card");
    console.log(`Card Number   : ****-****-****-${bill.payment.last4Digits}`);
  } else if ("transactionId" in bill.payment) {
    console.log("Payment Method: UPI");
    console.log(`Transaction ID: ${bill.payment.transactionId}`);
  }

  console.log("========================================");
  console.log("        Thank you for ordering!         ");
  console.log("========================================\n");
}

// Automated demo for non-interactive test runs
export function runAutomatedDemo(): void {
  console.log("--- Running Food Ordering Demonstration ---\n");

  // 1. View Menu
  displayMenu();

  // 2. Select a Member Customer (Rahul Mehta, Gold 10%)
  currentCustomer = customers[2];
  console.log(`Selected Customer: ${getCustomerDetails(currentCustomer)}\n`);

  // 3. Add Items to Cart
  addToCart(foodItems[0], 2, "Extra cheese"); // 2 x 299 = 598
  addToCart(foodItems[1], 4);                 // 4 x 399 = 1596
  addToCart(foodItems[5], 2);                 // 2 x 120 = 240
  // Subtotal = 598 + 1596 + 240 = 2434 (> ₹2000 => triggers additional 5% bulk discount)

  // 4. View Cart
  displayCart();

  // 5. Checkout with Cash payment
  console.log("Checking out with Cash Payment of ₹2500...");
  const cashPayment: Payment = {
    method: "cash",
    receivedAmount: 2500,
  };

  const bill = generateBill(currentCustomer, cart, cashPayment);
  displayBill(bill);

  if (bill.status === "success") {
    latestBill = bill;
    saveOrderToHistory(bill);
    clearCart();

    // 6. Change Order Status
    console.log("Order Status Progression:");
    let status: OrderStatus = "pending";
    status = updateOrderStatus(status, "confirmed");
    status = updateOrderStatus(status, "preparing");
    status = updateOrderStatus(status, "delivered");
  }

  console.log("\nDemo completed successfully!");
}

// Interactive terminal menu loop
export async function main(): Promise<void> {
  // If run in non-interactive environment or with --demo flag, run automated flow
  if (process.argv.includes("--demo") || !process.stdin.isTTY) {
    runAutomatedDemo();
    return;
  }

  const rl = readline.createInterface({ input, output });

  try {
    let keepRunning = true;

    while (keepRunning) {
      console.log("================================");
      console.log("      FOOD ORDERING SYSTEM      ");
      console.log("================================");
      console.log(`Current Customer: ${getCustomerDetails(currentCustomer)}`);
      console.log(`Cart Items: ${cart.length} | Subtotal: ${formatPrice(calculateSubtotal())}`);
      if (currentCoupon) {
        console.log(`Active Coupon: [${currentCoupon.code}] (${currentCoupon.discountPercent}% off)`);
      }
      console.log("--------------------------------");
      console.log("1. View Food Menu");
      console.log("2. Select / Create Customer");
      console.log("3. Add Item to Cart");
      console.log("4. View Cart");
      console.log("5. Update Item Quantity");
      console.log("6. Remove Item from Cart");
      console.log("7. Apply Coupon Code (Bonus)");
      console.log("8. Checkout & Generate Bill");
      console.log("9. Change Order Status");
      console.log("10. View Order History");
      console.log("11. Run Auto Demo");
      console.log("0. Exit");
      console.log("================================");

      const choice = (await rl.question("Select an option: ")).trim();

      switch (choice) {
        case "1": {
          displayMenu();
          break;
        }

        case "2": {
          console.log("\nChoose Customer:");
          customers.forEach((c, index) => {
            console.log(`${index + 1}. ${getCustomerDetails(c)}`);
          });
          console.log("5. Create New Guest");
          console.log("6. Create New Member (Silver/Gold/Platinum)");

          const opt = (await rl.question("Choice: ")).trim();
          const num = parseInt(opt, 10);

          if (num >= 1 && num <= customers.length) {
            currentCustomer = customers[num - 1];
            console.log(`✅ Selected: ${currentCustomer.name}`);
          } else if (opt === "5") {
            const name = await rl.question("Name: ");
            const address = await rl.question("Address: ");
            const phone = await rl.question("Phone (optional): ");
            currentCustomer = createGuest(Date.now() % 1000, name, address, phone || undefined);
            console.log(`✅ Created Guest: ${currentCustomer.name}`);
          } else if (opt === "6") {
            const name = await rl.question("Name: ");
            const address = await rl.question("Address: ");
            const phone = await rl.question("Phone (optional): ");
            const levelInput = (await rl.question("Level (silver / gold / platinum): ")).toLowerCase();
            const level = levelInput === "platinum" ? "platinum" : levelInput === "gold" ? "gold" : "silver";
            currentCustomer = createMember(Date.now() % 1000, name, address, level, phone || undefined);
            console.log(`✅ Created Member: ${currentCustomer.name} (${level.toUpperCase()})`);
          } else {
            console.log("Invalid customer choice.");
          }
          break;
        }

        case "3": {
          displayMenu();
          const idInput = await rl.question("Enter Food Item ID: ");
          const itemId = parseInt(idInput.trim(), 10);
          const item = foodItems.find((f) => f.id === itemId);

          if (!item) {
            console.log("❌ Item ID not found.");
            break;
          }

          const qtyInput = await rl.question(`Enter quantity for "${item.name}": `);
          const qty = parseInt(qtyInput.trim(), 10);
          const instruction = await rl.question("Special instruction (optional): ");

          addToCart(item, qty, instruction.trim() || undefined);
          break;
        }

        case "4": {
          displayCart();
          break;
        }

        case "5": {
          displayCart();
          if (cart.length === 0) break;
          const idInput = await rl.question("Enter Food Item ID to update: ");
          const qtyInput = await rl.question("Enter new quantity: ");
          updateQuantity(parseInt(idInput.trim(), 10), parseInt(qtyInput.trim(), 10));
          break;
        }

        case "6": {
          displayCart();
          if (cart.length === 0) break;
          const idInput = await rl.question("Enter Food Item ID to remove: ");
          removeFromCart(parseInt(idInput.trim(), 10));
          break;
        }

        case "7": {
          console.log("\nAvailable Coupons:");
          coupons.forEach((cp) => {
            console.log(`• ${cp.code}: ${cp.discountPercent}% off on min ₹${cp.minAmount}`);
          });
          const codeInput = (await rl.question("Enter Coupon Code (or press enter to clear): ")).trim().toUpperCase();
          if (!codeInput) {
            currentCoupon = undefined;
            console.log("Coupon cleared.");
          } else {
            const found = coupons.find((c) => c.code === codeInput);
            if (found) {
              currentCoupon = found;
              console.log(`✅ Coupon "${found.code}" applied!`);
            } else {
              console.log("❌ Invalid coupon code.");
            }
          }
          break;
        }

        case "8": {
          if (cart.length === 0) {
            console.log("❌ Cart is empty! Add items first.");
            break;
          }

          displayCart();
          const subtotal = calculateSubtotal();
          const discounts = calculateDiscount(currentCustomer, subtotal, currentCoupon);
          const afterDiscount = Math.max(0, subtotal - discounts.totalDiscount);
          const tax = calculateTax(afterDiscount);
          const finalAmount = calculateFinalAmount(afterDiscount, tax);

          console.log(`Final Payable: ${formatPrice(finalAmount)}`);
          console.log("\nSelect Payment Method:");
          console.log("1. Cash");
          console.log("2. Card");
          console.log("3. UPI");

          const payChoice = (await rl.question("Payment choice [1-3]: ")).trim();
          let payment: Payment;

          if (payChoice === "1") {
            const cashStr = await rl.question(`Enter received cash amount (Min ${formatPrice(finalAmount)}): ₹`);
            payment = {
              method: "cash",
              receivedAmount: parseFloat(cashStr.trim()),
            };
          } else if (payChoice === "2") {
            const last4 = await rl.question("Enter card last 4 digits: ");
            payment = {
              method: "card",
              last4Digits: last4.trim(),
            };
          } else if (payChoice === "3") {
            const txn = await rl.question("Enter UPI Transaction ID: ");
            payment = {
              method: "upi",
              transactionId: txn.trim(),
            };
          } else {
            console.log("❌ Invalid payment method.");
            break;
          }

          const billResult = generateBill(currentCustomer, cart, payment, currentCoupon);
          displayBill(billResult);

          if (billResult.status === "success") {
            latestBill = billResult;
            saveOrderToHistory(billResult);
            clearCart();
            currentCoupon = undefined;
          }
          break;
        }

        case "9": {
          if (!latestBill) {
            console.log("❌ No recent order found. Please place an order first.");
            break;
          }

          console.log(`\nOrder #${latestBill.orderId}`);
          console.log("1. pending");
          console.log("2. confirmed");
          console.log("3. preparing");
          console.log("4. delivered");
          console.log("5. cancelled");

          const statusOpt = (await rl.question("Select new status [1-5]: ")).trim();
          const map: Record<string, "pending" | "confirmed" | "preparing" | "delivered" | "cancelled"> = {
            "1": "pending",
            "2": "confirmed",
            "3": "preparing",
            "4": "delivered",
            "5": "cancelled",
          };

          const target = map[statusOpt];
          if (target) {
            updateOrderStatus("confirmed", target);
          } else {
            console.log("Invalid status option.");
          }
          break;
        }

        case "10": {
          console.log("\n==================== 📜 ORDER HISTORY ====================");
          if (orderHistory.length === 0) {
            console.log("No orders placed yet.");
          } else {
            orderHistory.forEach((ord, i) => {
              console.log(
                `${i + 1}. Order #${ord.orderId} - Customer: ${ord.customer.name} | Total: ${formatPrice(ord.finalAmount)} | Payment: ${ord.payment.method.toUpperCase()}`
              );
            });
          }
          console.log("==========================================================\n");
          break;
        }

        case "11": {
          runAutomatedDemo();
          break;
        }

        case "0": {
          console.log("\nThank you! Exiting application... 👋\n");
          keepRunning = false;
          break;
        }

        default: {
          console.log("Invalid option, please choose between 0 and 11.");
          break;
        }
      }
    }
  } finally {
    rl.close();
  }
}

// Start application
main();
