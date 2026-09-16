import { CartItem, FoodItem } from "./types.js";

// Global cart state for the session
export const cart: CartItem[] = [];

// Calculate total for a single cart item
export function calculateItemTotal(item: CartItem): number {
  return item.price * item.quantity;
}

// Calculate subtotal for all items in the cart using reduce
export function calculateSubtotal(items: CartItem[] = cart): number {
  return items.reduce((total, item) => {
    return total + calculateItemTotal(item);
  }, 0);
}

// Add an item to cart or increase quantity if it already exists
export function addToCart(
  foodItem: FoodItem,
  quantity: number,
  specialInstruction?: string
): boolean {
  if (!foodItem.isAvailable) {
    console.log(`❌ "${foodItem.name}" is currently out of stock.`);
    return false;
  }

  if (quantity <= 0) {
    console.log("❌ Quantity must be at least 1.");
    return false;
  }

  const existingItem = cart.find((item) => item.id === foodItem.id);

  if (existingItem) {
    existingItem.quantity += quantity;
    if (specialInstruction) {
      existingItem.specialInstruction = specialInstruction;
    }
  } else {
    // Intersection type FoodItem & OrderInformation
    const newItem: CartItem = {
      ...foodItem,
      quantity,
      specialInstruction,
    };
    cart.push(newItem);
  }

  console.log(`✅ Added ${quantity}x "${foodItem.name}" to cart.`);
  return true;
}

// Update quantity of an item in the cart
export function updateQuantity(foodItemId: number, newQuantity: number): boolean {
  const item = cart.find((i) => i.id === foodItemId);

  if (!item) {
    console.log(`❌ Item with ID ${foodItemId} is not in the cart.`);
    return false;
  }

  if (newQuantity <= 0) {
    console.log("❌ Quantity must be greater than 0. Use remove option to delete.");
    return false;
  }

  item.quantity = newQuantity;
  console.log(`✅ Updated "${item.name}" quantity to ${newQuantity}.`);
  return true;
}

// Remove an item from the cart
export function removeFromCart(foodItemId: number): boolean {
  const itemIndex = cart.findIndex((i) => i.id === foodItemId);

  if (itemIndex === -1) {
    console.log(`❌ Item with ID ${foodItemId} not found in cart.`);
    return false;
  }

  const removed = cart.splice(itemIndex, 1)[0];
  console.log(`✅ Removed "${removed.name}" from cart.`);
  return true;
}

// Clear all items from cart (e.g. after successful order)
export function clearCart(): void {
  cart.length = 0;
}
