import type { PaymentType } from "@/types";
import { PLATFORM_FEE_PER_MEAL } from "@/lib/constants";

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

/** Employees can only edit/cancel an order while the restaurant hasn't acted on it yet. */
export function canEditOrder(status: string, locked: boolean) {
  return !locked && status === "pending";
}

/**
 * What Prime Bite actually earns on an order: a cut of the restaurant's side
 * (commission_percent of the food subtotal) plus a flat platform fee per
 * meal, billed to the company. The order subtotal itself is food cost, not
 * platform revenue.
 */
export function computeOrderProfit(subtotal: number, restaurantCommissionPercent: number) {
  const restaurantCommission = Math.round((subtotal * restaurantCommissionPercent) / 100);
  const platformFee = PLATFORM_FEE_PER_MEAL;
  return {
    restaurantCommission,
    platformFee,
    totalProfit: restaurantCommission + platformFee,
  };
}
