import { Customer, Guest, Member, MembershipLevel } from "./types.js";

// Helper to create a guest customer
export function createGuest(
  id: number,
  name: string,
  address: string,
  phone?: string
): Guest {
  return {
    id,
    name,
    phone,
    address,
    isMember: false,
  };
}

// Helper to create a member customer
export function createMember(
  id: number,
  name: string,
  address: string,
  level: MembershipLevel,
  phone?: string
): Member {
  const discountMap: Record<MembershipLevel, number> = {
    silver: 5,
    gold: 10,
    platinum: 15,
  };

  return {
    id,
    name,
    phone,
    address,
    isMember: true,
    membershipId: `MEM-${level.toUpperCase()}-${id}`,
    discountPercentage: discountMap[level],
    membershipLevel: level,
  };
}

// Type narrowing using 'in' operator to get customer's membership discount
export function getCustomerDiscount(customer: Customer): number {
  // Check if membershipLevel property exists on customer
  if ("membershipLevel" in customer && "discountPercentage" in customer) {
    return customer.discountPercentage;
  }
  return 0;
}

// Display customer details in readable string
export function getCustomerDetails(customer: Customer): string {
  const phoneText = customer.phone ? ` | Phone: ${customer.phone}` : "";
  if ("membershipLevel" in customer) {
    return `${customer.name} [${customer.membershipLevel.toUpperCase()} Member - ${customer.discountPercentage}% off]${phoneText}`;
  }
  return `${customer.name} [Guest - 0% off]${phoneText}`;
}
