import type { PaymentType } from "@/types";

export function resolveBudget(companyDailyBudget: number, employeeOverride: number | null) {
  return employeeOverride ?? companyDailyBudget;
}

/**
 * Splits an order subtotal between company and employee based on the
 * company's payment model.
 *
 * - company_pays: company covers the whole order, capped at `budget` (the
 *   employee simply cannot exceed it).
 * - employee_pays: the employee always covers 100% themselves.
 * - mixed: company covers up to `mixedCap` per order, employee pays the rest.
 */
export function computeOrderSplit(
  paymentType: PaymentType,
  subtotal: number,
  budget: number,
  mixedCap: number | null
) {
  if (paymentType === "employee_pays") {
    return { companyCovered: 0, employeePaid: subtotal, exceedsBudget: false };
  }

  if (paymentType === "mixed") {
    const cap = mixedCap ?? budget;
    const companyCovered = Math.min(subtotal, cap);
    const employeePaid = Math.max(subtotal - cap, 0);
    return { companyCovered, employeePaid, exceedsBudget: false };
  }

  // company_pays
  const exceedsBudget = subtotal > budget;
  return { companyCovered: subtotal, employeePaid: 0, exceedsBudget };
}

export function canEditOrder(status: string, locked: boolean) {
  return !locked && status !== "delivered";
}
