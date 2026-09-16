import { FoodItem, Customer, Coupon } from "./types.js";

// Food menu with at least 8 items across all 4 categories
export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "pizza",
    price: 299,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    category: "pizza",
    price: 399,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Paneer Veggie Pizza",
    category: "pizza",
    price: 349,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Veg Crisp Burger",
    category: "burger",
    price: 149,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Cheese Melt Burger",
    category: "burger",
    price: 199,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Cold Coffee",
    category: "drink",
    price: 120,
    isAvailable: true,
  },
  {
    id: 7,
    name: "Fresh Lime Soda",
    category: "drink",
    price: 80,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Masala Chai",
    category: "drink",
    price: 50,
    isAvailable: false, // Out of stock example
  },
  {
    id: 9,
    name: "Chocolate Brownie",
    category: "dessert",
    price: 130,
    isAvailable: true,
  },
  {
    id: 10,
    name: "Choco Lava Cake",
    category: "dessert",
    price: 160,
    isAvailable: true,
  },
];

// Pre-defined customers for easy testing in terminal
export const customers: Customer[] = [
  {
    id: 1,
    name: "Aman Sharma",
    phone: "9876543210",
    address: "B-12, Sector 15, Noida",
    isMember: false,
  },
  {
    id: 2,
    name: "Pooja Verma",
    phone: "9811223344",
    address: "Flat 402, Sunshine Apts, Delhi",
    isMember: true,
    membershipId: "MEM-SILVER-02",
    discountPercentage: 5,
    membershipLevel: "silver",
  },
  {
    id: 3,
    name: "Rahul Mehta",
    phone: "9899001122",
    address: "74, Rose Garden, Gurgaon",
    isMember: true,
    membershipId: "MEM-GOLD-03",
    discountPercentage: 10,
    membershipLevel: "gold",
  },
  {
    id: 4,
    name: "Sneha Patel",
    phone: "9712345678",
    address: "Penthouse 9, SG Highway, Ahmedabad",
    isMember: true,
    membershipId: "MEM-PLAT-04",
    discountPercentage: 15,
    membershipLevel: "platinum",
  },
];

// Additional feature: Promo coupons
export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    discountPercent: 10,
    minAmount: 300,
  },
  {
    code: "SUPER20",
    discountPercent: 20,
    minAmount: 1500,
  },
];
