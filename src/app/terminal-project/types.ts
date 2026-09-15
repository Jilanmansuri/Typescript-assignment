// types for Food

export type FoodCategory = "pizza" | "burger" | "drink" | "dessert";

export interface FoodItem {
    id: number;
    name: string;
    category: FoodCategory;
    price: number;
    isAvailable: boolean;
    quantity: number;
}

// types for customer

export type CustomerCategory = "Guest" | "member";
export type MembershipLevel = "silver" | "gold" | "platinum";


export interface Customer {
    id: number,
    name: string,
    phone?: string,
    address: string,
    category: CustomerCategory,
    isMember: boolean;
    membershipId?: string;
    discountPercentage?: number;
    membershipLevel?: MembershipLevel;
}

// types for order and cart

export type OrderStatus = "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";

export interface OrderInformation {
    quantity: number;
    specialInstruction?: string;
}

export type CartItem = FoodItem & OrderInformation;

// types for payments

export type Payment =
    | {
        method: "cash";
        receivedAmount: number;
    }
    | {
        method: "card";
        last4Digits: string;
    }
    | {
        method: "upi";
        transactionId: string;
    };
    
export type BillResult =
    | {
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
    | {
        status: "error";
        message: string;
    };