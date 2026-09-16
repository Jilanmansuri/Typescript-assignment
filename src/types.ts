// 1. Food Items Types
export type FoodCategory = "pizza" | "burger" | "drink" | "dessert";

export interface FoodItem {
  id: number;
  name: string;
  category: FoodCategory;
  price: number;
  isAvailable: boolean;
}

// 2. Customer Types (Union Type: Guest | Member)
export type MembershipLevel = "silver" | "gold" | "platinum";

export interface BaseCustomer {
  id: number;
  name: string;
  phone?: string;
  address: string;
}

export interface Guest extends BaseCustomer {
  isMember: false;
}

export interface Member extends BaseCustomer {
  isMember: true;
  membershipId: string;
  discountPercentage: number;
  membershipLevel: MembershipLevel;
}

export type Customer = Guest | Member;

// 3. Cart Item (Intersection Type: FoodItem & OrderInformation)
export interface OrderInformation {
  quantity: number;
  specialInstruction?: string;
}

export type CartItem = FoodItem & OrderInformation;

// 4. Order Status
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "delivered"
  | "cancelled";

// 5. Payment Types (Union Type: Cash | Card | UPI)
export interface CashPayment {
  method: "cash";
  receivedAmount: number;
}

export interface CardPayment {
  method: "card";
  last4Digits: string;
}

export interface UpiPayment {
  method: "upi";
  transactionId: string;
}

export type Payment = CashPayment | CardPayment | UpiPayment;

// 6. Additional Feature: Coupon
export interface Coupon {
  code: string;
  discountPercent: number;
  minAmount: number;
}

// 7. Bill Result (Discriminated Union: Success | Error)
export interface BillSuccess {
  status: "success";
  orderId: number;
  customer: Customer;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  finalAmount: number;
  payment: Payment;
}

export interface BillError {
  status: "error";
  message: string;
}

export type BillResult = BillSuccess | BillError;
