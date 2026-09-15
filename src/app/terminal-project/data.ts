import {FoodItem, Customer, Payment} from "./types";

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "pizza",
    price: 299,
    quantity: 0,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Veg Burger",
    category: "burger",
    price: 199,
    quantity: 0,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Cold Coffee",
    category: "drink",
    price: 150,
    quantity: 0,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    category: "dessert",
    price: 120,
    quantity: 0,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Farmhouse Pizza",
    category: "pizza",
    price: 349,
    quantity: 0,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Cheese Burger",
    category: "burger",
    price: 249,
    quantity: 0,
    isAvailable: true,
  },
  {
    id: 7,
    name: "Lemon Soda",
    category: "drink",
    price: 80,
    quantity: 0,
    isAvailable: false,
  },
  {
    id: 8,
    name: "Ice Cream",
    category: "dessert",
    price: 100,
    quantity: 0,
    isAvailable: true,
  },
];

export const customers: Customer[] = [
  {
    id: 1,
    name: "Ritesh",
    phone: "9876543210",
    address: "Ahmedabad",
    category: "member",
    isMember: true,
    membershipId: "MEM001",
    discountPercentage: 10,
    membershipLevel: "gold"
  },
  {
    id: 2,
    name: "Guest Customer",
    address: "Ahmedabad",
    category: "Guest",
    isMember: false
  }
];

export const payments: Payment[] = [
  {
    method: "cash",
    receivedAmount: 1000
  },
  {
    method: "cash",
    receivedAmount: 500
  },
  {
    method: "card",
    last4Digits: "4821"
  },
  {
    method: "upi",
    transactionId: "UPI123456789"
  }
];