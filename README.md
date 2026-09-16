# 🍔 Food Ordering & Billing System — Terminal Application

A clean, terminal-based Food Ordering & Billing System built with **pure TypeScript** (Node.js console application, no Next.js/React frontend).

---

## 🚀 How to Run

### 1. Interactive Terminal Mode
```bash
npm start
# or
npm run terminal
```

### 2. Automated Demonstration Mode
```bash
npm run demo
```

### 3. Type Check (Strict TypeScript, zero errors)
```bash
npx tsc --noEmit
```

---

## 📁 Project Structure

```text
src/
├── types.ts          # Core types, interfaces, union types, discriminated unions
├── data.ts           # Menu items (10 items), sample customers, promo coupons
├── customer.ts       # Guest vs Member creation and type narrowing with 'in'
├── cart.ts           # Cart operations (add, remove, update, line total, subtotal)
├── payment.ts        # Payment processing (Cash, Card, UPI) with type narrowing & assertNever
├── billing.ts        # Discount rules, 5% GST, and generateBill returning BillResult
├── order.ts          # Order status transitions with exhaustive checks and order history
├── utils.ts          # assertNever helper and formatPrice helper
└── index.ts          # Interactive terminal readline menu & demo runner
```

---

## 📋 Features Implemented

1. **Food Items**: At least 8 food items across `pizza`, `burger`, `drink`, `dessert` with `id`, `name`, `price`, `isAvailable`.
2. **Customer Model**: `Customer = Guest | Member` union type with runtime narrowing using `'in'`.
3. **Cart**: `CartItem = FoodItem & OrderInformation` intersection type.
4. **Order Status**: Status transitions with exhaustive checking via `assertNever`.
5. **Payment**: `Payment = CashPayment | CardPayment | UpiPayment` narrowed via `in`.
6. **Required Functions**:
   - `addToCart`
   - `removeFromCart`
   - `updateQuantity`
   - `calculateItemTotal`
   - `calculateSubtotal`
   - `calculateDiscount`
   - `calculateTax`
   - `calculateFinalAmount`
   - `processPayment`
   - `updateOrderStatus`
   - `generateBill`
7. **Discounts**:
   - Guest: 0%, Silver: 5%, Gold: 10%, Platinum: 15%
   - Subtotal > ₹2000 gives an additional 5% discount before GST
8. **Tax**: 5% GST on amount after discount.
9. **Bill Result**: Discriminated union `type BillResult = BillSuccess | BillError`.
10. **Exhaustive Check**: `assertNever(value: never): never`.
11. **Bonus Features**: Coupon codes (`WELCOME10`, `SUPER20`) and Order History tracking.