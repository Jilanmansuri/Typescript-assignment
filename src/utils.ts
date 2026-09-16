// Exhaustiveness checking function for TypeScript unions
export function assertNever(value: never): never {
  throw new Error(`Unhandled union value: ${JSON.stringify(value)}`);
}

// Currency formatting helper
export function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}
