import { OrderStatus, BillSuccess } from "./types.js";
import { assertNever } from "./utils.js";

// Saved order history
export const orderHistory: BillSuccess[] = [];

// Track and update status of an order using exhaustive switch
export function updateOrderStatus(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): OrderStatus {
  if (currentStatus === newStatus) {
    console.log(`ℹ️ Order is already in "${currentStatus}" status.`);
    return currentStatus;
  }

  // Exhaustive status transition validation
  switch (currentStatus) {
    case "pending":
      if (newStatus === "confirmed" || newStatus === "cancelled") {
        console.log(`✅ Order status changed: ${currentStatus} ➔ ${newStatus}`);
        return newStatus;
      }
      break;

    case "confirmed":
      if (newStatus === "preparing" || newStatus === "cancelled") {
        console.log(`✅ Order status changed: ${currentStatus} ➔ ${newStatus}`);
        return newStatus;
      }
      break;

    case "preparing":
      if (newStatus === "delivered" || newStatus === "cancelled") {
        console.log(`✅ Order status changed: ${currentStatus} ➔ ${newStatus}`);
        return newStatus;
      }
      break;

    case "delivered":
      console.log(`❌ Order is already delivered. Status cannot be changed.`);
      return currentStatus;

    case "cancelled":
      console.log(`❌ Order is cancelled. Status cannot be changed.`);
      return currentStatus;

    default:
      return assertNever(currentStatus);
  }

  console.log(`❌ Invalid transition from "${currentStatus}" to "${newStatus}".`);
  return currentStatus;
}

// Save completed bill into order history
export function saveOrderToHistory(bill: BillSuccess): void {
  orderHistory.push(bill);
}
